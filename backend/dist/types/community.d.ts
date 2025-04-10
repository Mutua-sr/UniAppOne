import { CouchDBDocument } from './index';
export interface Community extends CouchDBDocument {
    type: 'community';
    name: string;
    description: string;
    avatar?: string;
    banner?: string;
    creator: {
        id: string;
        name: string;
        avatar?: string;
    };
    members: {
        id: string;
        name: string;
        avatar?: string;
        role: 'admin' | 'moderator' | 'member';
        joinedAt: string;
    }[];
    settings: {
        isPrivate: boolean;
        requiresApproval: boolean;
        allowPosts: boolean;
        allowEvents: boolean;
        allowPolls: boolean;
    };
    stats: {
        memberCount: number;
        postCount: number;
        activeMembers: number;
    };
    tags: string[];
}
export interface CreateCommunity {
    type: 'community';
    name: string;
    description: string;
    avatar?: string;
    banner?: string;
    creator: {
        id: string;
        name: string;
        avatar?: string;
    };
    settings?: {
        isPrivate?: boolean;
        requiresApproval?: boolean;
        allowPosts?: boolean;
        allowEvents?: boolean;
        allowPolls?: boolean;
    };
    tags?: string[];
}
export interface UpdateCommunity {
    name?: string;
    description?: string;
    avatar?: string;
    banner?: string;
    settings?: {
        isPrivate?: boolean;
        requiresApproval?: boolean;
        allowPosts?: boolean;
        allowEvents?: boolean;
        allowPolls?: boolean;
    };
    tags?: string[];
}
export interface CommunityMember {
    id: string;
    name: string;
    avatar?: string;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: string;
}
export interface CommunityInvite {
    id: string;
    communityId: string;
    inviterId: string;
    inviteeId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    expiresAt: string;
}
export interface JoinRequest {
    id: string;
    communityId: string;
    userId: string;
    message?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
}
