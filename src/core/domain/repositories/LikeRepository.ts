import { Like, LikeType, LikeReaction } from '../entities/Like';

export interface LikeRepository {
  // Basic CRUD operations
  findById(id: string): Promise<Like | null>;
  create(like: Like): Promise<Like>;
  update(like: Like): Promise<Like>;
  delete(id: string): Promise<void>;
  
  // Query operations
  findByUser(userId: string): Promise<Like[]>;
  findByTarget(targetId: string, targetType: LikeType): Promise<Like[]>;
  findByReaction(reaction: LikeReaction): Promise<Like[]>;
  findByUserAndTarget(userId: string, targetId: string, targetType: LikeType): Promise<Like | null>;
  
  // Statistics
  getTotalLikes(): Promise<number>;
  getLikesByType(): Promise<Record<LikeType, number>>;
  getLikesByReaction(): Promise<Record<LikeReaction, number>>;
  getLikeCountForTarget(targetId: string, targetType: LikeType): Promise<number>;
  getReactionCountForTarget(targetId: string, targetType: LikeType): Promise<Record<LikeReaction, number>>;
  
  // User-specific
  getUserLikes(userId: string): Promise<Like[]>;
  getUserLikesByType(userId: string, targetType: LikeType): Promise<Like[]>;
  getUserLikesByReaction(userId: string, reaction: LikeReaction): Promise<Like[]>;
  
  // Bulk operations
  deleteMany(ids: string[]): Promise<void>;
  deleteByUserAndTarget(userId: string, targetId: string, targetType: LikeType): Promise<void>;
  
  // Analytics
  getMostLikedTargets(targetType: LikeType, limit: number): Promise<Array<{ targetId: string; count: number }>>;
  getMostReactiveUsers(limit: number): Promise<Array<{ userId: string; count: number }>>;
}
