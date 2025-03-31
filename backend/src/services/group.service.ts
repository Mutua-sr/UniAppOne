import { DatabaseService } from './database';
import { Classroom } from '../types/classroom';
import { Community } from '../types/community';
import { CreateChatRoom } from '../types/chat';
import logger from '../config/logger';

export class GroupService {
  static async searchGroups(query: string, type: 'classroom' | 'community', options: { page?: number; limit?: number; category?: string } = {}) {
    try {
      const { page = 1, limit = 10, category } = options;
      const skip = (page - 1) * limit;

      const selector: any = {
        type,
        $or: [
          { name: { $regex: `(?i)${query}` } },
          { description: { $regex: `(?i)${query}` } },
          { tags: { $elemMatch: { $regex: `(?i)${query}` } } }
        ]
      };

      if (category) {
        selector.category = category;
      }

      const searchQuery = {
        selector,
        sort: [{ createdAt: 'desc' as const }],
        skip,
        limit
      };

      return await DatabaseService.find<Classroom | Community>(searchQuery);
    } catch (error) {
      logger.error(`Error searching ${type}s:`, error);
      throw new Error(`Failed to search ${type}s`);
    }
  }

  static async listByCategory(type: 'classroom' | 'community', category: string, options: { page?: number; limit?: number } = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const query = {
        selector: {
          type,
          category
        },
        sort: [{ createdAt: 'desc' as const }],
        skip,
        limit
      };

      return await DatabaseService.find<Classroom | Community>(query);
    } catch (error) {
      logger.error(`Error listing ${type}s by category:`, error);
      throw new Error(`Failed to list ${type}s by category`);
    }
  }

  static async getPopularGroups(type: 'classroom' | 'community', limit: number = 10) {
    try {
      const query = {
        selector: {
          type,
          ...(type === 'classroom' 
            ? { 'stats.studentCount': { $gt: 0 } }
            : { 'stats.memberCount': { $gt: 0 } })
        },
        sort: [
          ...(type === 'classroom' 
            ? [{ 'stats.studentCount': 'desc' as const }]
            : [{ 'stats.memberCount': 'desc' as const }])
        ],
        limit
      };

      return await DatabaseService.find<Classroom | Community>(query);
    } catch (error) {
      logger.error(`Error getting popular ${type}s:`, error);
      throw new Error(`Failed to get popular ${type}s`);
    }
  }

  static async createGroupChatRoom(groupId: string, groupType: 'classroom' | 'community', name: string, participants: Array<{ id: string; name: string; avatar?: string; role: 'admin' | 'member' }>) {
    try {
      const chatRoom: CreateChatRoom = {
        type: 'room',
        name,
        roomType: 'group',
        participants,
        settings: {
          isEncrypted: false,
          allowReactions: true,
          allowReplies: true,
          allowEditing: true,
          allowDeletion: true
        }
      };

      const createdRoom = await DatabaseService.create(chatRoom);

      // Update the group with the chat room reference
      if (groupType === 'classroom') {
        await DatabaseService.update<Classroom>(groupId, {
          chatRoomId: createdRoom._id,
          updatedAt: new Date().toISOString()
        });
      } else {
        await DatabaseService.update<Community>(groupId, {
          chatRoomId: createdRoom._id,
          updatedAt: new Date().toISOString()
        });
      }

      return createdRoom;
    } catch (error) {
      logger.error('Error creating group chat room:', error);
      throw new Error('Failed to create group chat room');
    }
  }

  static async getCategories(type: 'classroom' | 'community'): Promise<string[]> {
    try {
    const results = await DatabaseService.find<Classroom | Community>({
      selector: { type }
    });
    
    const categories = new Set(
      results
        .map(doc => (doc as any).category)
        .filter(Boolean)
    );
      return Array.from(categories);
    } catch (error) {
      logger.error(`Error getting ${type} categories:`, error);
      throw new Error(`Failed to get ${type} categories`);
    }
  }
}

export default GroupService;