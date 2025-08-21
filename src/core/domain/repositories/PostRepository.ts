import { Post, PostType, PostPrivacy } from '../entities/Post';

export interface PostRepository {
  // Basic CRUD operations
  findById(id: string): Promise<Post | null>;
  create(post: Post): Promise<Post>;
  update(post: Post): Promise<Post>;
  delete(id: string): Promise<void>;
  
  // Query operations
  findByAuthor(authorId: string): Promise<Post[]>;
  findByType(type: PostType): Promise<Post[]>;
  findByPrivacy(privacy: PostPrivacy): Promise<Post[]>;
  findPublicPosts(): Promise<Post[]>;
  findScheduledPosts(): Promise<Post[]>;
  
  // Feed operations
  getFeedForUser(userId: string, page: number, limit: number): Promise<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  
  // Search operations
  searchPosts(query: string): Promise<Post[]>;
  searchByHashtag(hashtag: string): Promise<Post[]>;
  searchByMention(userId: string): Promise<Post[]>;
  
  // Statistics
  getTotalPosts(): Promise<number>;
  getPostsByType(): Promise<Record<PostType, number>>;
  getPostsByPrivacy(): Promise<Record<PostPrivacy, number>>;
  
  // Pagination
  findWithPagination(page: number, limit: number): Promise<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  
  // Bulk operations
  updateMany(ids: string[], updates: Partial<Post>): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
  
  // Analytics
  getPopularPosts(limit: number): Promise<Post[]>;
  getTrendingPosts(limit: number): Promise<Post[]>;
  getPostsInPeriod(startDate: Date, endDate: Date): Promise<Post[]>;
  
  // Moderation
  findPendingModeration(): Promise<Post[]>;
  findFlaggedPosts(): Promise<Post[]>;
  
  // User-specific
  getPostsForUserProfile(userId: string, viewerId: string): Promise<Post[]>;
  getPostsForUserProfilePublic(userId: string): Promise<Post[]>;
}
