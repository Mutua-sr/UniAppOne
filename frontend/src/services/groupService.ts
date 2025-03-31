import { apiService } from './apiService';
import { Group, SearchOptions } from '../types/group';

class GroupService {
  async searchGroups(query: string, type: 'classroom' | 'community', options: SearchOptions = {}): Promise<Group[]> {
    const params = new URLSearchParams({
      q: query,
      ...(options.category && { category: options.category }),
      ...(options.page && { page: options.page.toString() }),
      ...(options.limit && { limit: options.limit.toString() })
    });

    return apiService.get<Group[]>(`/api/groups/${type}/search?${params}`);
  }

  async listByCategory(type: 'classroom' | 'community', category: string, options: SearchOptions = {}): Promise<Group[]> {
    const params = new URLSearchParams({
      ...(options.page && { page: options.page.toString() }),
      ...(options.limit && { limit: options.limit.toString() })
    });

    return apiService.get<Group[]>(`/api/groups/${type}/category/${category}?${params}`);
  }

  async getPopularGroups(type: 'classroom' | 'community', limit: number = 10): Promise<Group[]> {
    return apiService.get<Group[]>(`/api/groups/${type}/popular?limit=${limit}`);
  }

  async getCategories(type: 'classroom' | 'community'): Promise<string[]> {
    return apiService.get<string[]>(`/api/groups/${type}/categories`);
  }

  async joinGroup(groupId: string, type: 'classroom' | 'community'): Promise<void> {
    return apiService.post(`/api/groups/${type}/${groupId}/join`);
  }
}

export const groupService = new GroupService();
export type { Group, SearchOptions };