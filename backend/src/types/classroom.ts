import { CouchDBDocument } from './index';

export interface ClassroomSettings {
  allowStudentPosts: boolean;
  allowStudentComments: boolean;
  isArchived: boolean;
  notifications: {
    materials: boolean;
    announcements: boolean;
  };
}

export interface Classroom extends CouchDBDocument {
  type: 'classroom';
  name: string;
  description: string;
  code: string;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  students: ClassroomStudent[];
  materials: Material[];
  settings: ClassroomSettings;
  chatRoomId?: string; // Reference to the associated chat room
  thumbnail?: string; // For group browsing display
  category?: string; // For group browsing categorization
  tags: string[]; // For searchability
  stats: {
    studentCount: number;
    activeStudents: number;
    lastActive: string;
  };
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'other';
  url: string;
  uploadedAt: string;
  tags: string[];
}

export interface CreateClassroom {
  type: 'classroom';
  name: string;
  description: string;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  thumbnail?: string;
  category?: string;
}

export interface UpdateClassroomInput {
  name?: string;
  description?: string;
  settings?: Partial<ClassroomSettings>;
}

export interface CreateMaterial {
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'other';
  url: string;
  tags: string[];
}

export interface ClassroomStudent {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'inactive';
}

export interface JoinClassroomRequest {
  classroomId: string;
  studentId: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}