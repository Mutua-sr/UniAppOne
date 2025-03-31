export interface GroupStats {
  memberCount?: number;
  studentCount?: number;
  activeMembers?: number;
  activeStudents?: number;
  lastActive: string;
}

export interface Group {
  _id: string;
  type: 'classroom' | 'community';
  name: string;
  description: string;
  thumbnail?: string;
  category?: string;
  tags: string[];
  stats: GroupStats;
  chatRoomId?: string;
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  category?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}