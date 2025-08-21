import { LikeType, LikeReaction } from '../../domain/entities/Like';

export interface CreateLikeDto {
  targetId: string;
  targetType: LikeType;
  reaction?: LikeReaction;
}

export interface UpdateLikeDto {
  reaction: LikeReaction;
}

export interface LikeResponseDto {
  id: string;
  userId: string;
  user: {
    id: string;
    displayName: string;
    username: string;
    avatar?: string;
  };
  targetId: string;
  targetType: LikeType;
  reaction: LikeReaction;
  createdAt: string;
}

export interface LikeStatsDto {
  totalLikes: number;
  reactions: Record<LikeReaction, number>;
  topReactions: Array<{
    reaction: LikeReaction;
    count: number;
    percentage: number;
  }>;
}

export interface UserLikeDto {
  targetId: string;
  targetType: LikeType;
  reaction: LikeReaction;
  createdAt: string;
}
