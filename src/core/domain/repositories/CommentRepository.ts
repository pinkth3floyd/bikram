import { Comment, CommentStatus } from '../entities/Comment';

export interface CommentRepository {
  // Basic CRUD operations
  findById(id: string): Promise<Comment | null>;
  create(comment: Comment): Promise<Comment>;
  update(comment: Comment): Promise<Comment>;
  delete(id: string): Promise<void>;
  
  // Query operations
  findByPost(postId: string): Promise<Comment[]>;
  findByAuthor(authorId: string): Promise<Comment[]>;
  findByStatus(status: CommentStatus): Promise<Comment[]>;
  findTopLevelComments(postId: string): Promise<Comment[]>;
  findReplies(commentId: string): Promise<Comment[]>;
  
  // Thread operations
  getCommentThread(commentId: string): Promise<Comment[]>;
  getCommentReplies(commentId: string): Promise<Comment[]>;
  
  // Search operations
  searchComments(query: string): Promise<Comment[]>;
  searchByMention(userId: string): Promise<Comment[]>;
  
  // Statistics
  getTotalComments(): Promise<number>;
  getCommentsByStatus(): Promise<Record<CommentStatus, number>>;
  getCommentCountForPost(postId: string): Promise<number>;
  
  // Pagination
  findWithPagination(page: number, limit: number): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  
  // Bulk operations
  updateMany(ids: string[], updates: Partial<Comment>): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
  
  // Moderation
  findPendingModeration(): Promise<Comment[]>;
  findFlaggedComments(): Promise<Comment[]>;
  
  // User-specific
  getCommentsByUser(userId: string): Promise<Comment[]>;
  getCommentsForUserProfile(userId: string, viewerId: string): Promise<Comment[]>;
}
