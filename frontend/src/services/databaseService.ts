import { Post, PostInput, PostUpdate, Comment } from '../types/feed';
import { Post as ApiPost } from '../types/api';
import apiService from './apiService';

// Transform API Post to Feed Post
const transformApiPost = (apiPost: ApiPost): Partial<Post> => ({
  id: apiPost._id,
  title: apiPost.title,
  content: apiPost.content,
  author: {
    id: apiPost.createdBy,
    username: apiPost.createdBy, // Note: You might want to fetch actual username
    avatar: undefined // Note: Add avatar handling if needed
  },
  tags: apiPost.tags || [],
  likes: apiPost.likes || 0,
  comments: apiPost.comments?.map(comment => ({
    ...comment,
    likes: comment.likes || 0 // Ensure likes is always a number
  })) || [],
  createdAt: apiPost.createdAt,
  updatedAt: apiPost.updatedAt || apiPost.createdAt,
  likedBy: apiPost.likedBy || [],
  sharedTo: apiPost.sharedTo
});

const normalizePost = (apiPost: ApiPost): Post => {
  const transformedPost = transformApiPost(apiPost);
  return {
    id: transformedPost.id!,
    title: transformedPost.title!,
    content: transformedPost.content!,
    author: transformedPost.author!,
    tags: transformedPost.tags!,
    likes: transformedPost.likes!,
    comments: transformedPost.comments!,
    createdAt: transformedPost.createdAt!,
    updatedAt: transformedPost.updatedAt!,
    likedBy: transformedPost.likedBy!,
    ...(transformedPost.sharedTo && { sharedTo: transformedPost.sharedTo })
  };
};

export const DatabaseService = {
  // Generic find method
  async find<T>(query: { type: string; [key: string]: any }): Promise<T[]> {
    try {
      const response = await apiService[query.type === 'classroom' ? 'classrooms' : 'communities'].getAll();
      return response.data as unknown as T[];
    } catch (error) {
      console.error(`Error finding ${query.type}:`, error);
      throw new Error(`Failed to fetch ${query.type}s. Please try again later.`);
    }
  },

  // Generic read method
  async read<T>(id: string): Promise<T | null> {
    try {
      const response = await apiService.auth.getCurrentUser();
      return response as unknown as T;
    } catch (error) {
      console.error('Error reading data:', error);
      throw new Error('Failed to read data. Please try again later.');
    }
  },

  // Get posts with pagination
  async getPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
    try {
      const response = await apiService.posts.getAll();
      return response.data.map((post: ApiPost) => normalizePost(post));
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts. Please try again later.');
    }
  },

  // Create a new post
  async createPost(postInput: PostInput): Promise<Post> {
    try {
      const response = await apiService.posts.create(postInput);
      return normalizePost(response.data);
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post. Please try again later.');
    }
  },

  // Update a post
  async updatePost(id: string, update: PostUpdate): Promise<Post> {
    try {
      const response = await apiService.posts.update(id, update);
      return normalizePost(response.data);
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post. Please try again later.');
    }
  },

  // Delete a post
  async deletePost(id: string): Promise<boolean> {
    try {
      await apiService.posts.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post. Please try again later.');
    }
  },

  // Like a post
  async likePost(id: string): Promise<Post> {
    try {
      const response = await apiService.posts.update(id, { likes: 1 });
      return normalizePost(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
      throw new Error('Failed to like post. Please try again later.');
    }
  },

  // Unlike a post
  async unlikePost(id: string): Promise<Post> {
    try {
      const response = await apiService.posts.update(id, { likes: -1 });
      return normalizePost(response.data);
    } catch (error) {
      console.error('Error unliking post:', error);
      throw new Error('Failed to unlike post. Please try again later.');
    }
  },

  // Add a comment to a post
  async addComment(postId: string, comment: Omit<Comment, 'id' | 'likes'>): Promise<Post> {
    try {
      const newComment: Comment = {
        ...comment,
        id: `comment_${Date.now()}`,
        likes: 0
      };

      return await this.updatePost(postId, {
        comments: [newComment] // The backend will append this to existing comments
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment. Please try again later.');
    }
  },

  // Share a post
  async sharePost(postId: string, destination: NonNullable<Post['sharedTo']>): Promise<Post> {
    try {
      return await this.updatePost(postId, {
        sharedTo: destination
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      throw new Error('Failed to share post. Please try again later.');
    }
  }
};

export default DatabaseService;
