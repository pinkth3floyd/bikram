import { CommentStatus, CommentContent } from '../../domain/entities/Comment';

export interface CreateCommentDto {
  postId: string;
  content: CommentContent;
  parentId?: string; // for replies
}

export interface UpdateCommentDto {
  content: CommentContent;
}

export interface CommentResponseDto {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    displayName: string;
    username: string;
    avatar?: string;
  };
  parentId?: string;
  content: CommentContent;
  status: CommentStatus;
  stats: {
    likesCount: number;
    repliesCount: number;
    reportsCount: number;
  };
  metadata: {
    isEdited: boolean;
    isPinned: boolean;
    isHighlighted: boolean;
    language: string;
    moderationStatus: string;
  };
  createdAt: string;
  updatedAt: string;
  isLikedByCurrentUser?: boolean;
  currentUserReaction?: string;
  replies?: CommentResponseDto[];
}

export interface CommentThreadDto {
  comment: CommentResponseDto;
  replies: CommentResponseDto[];
  totalReplies: number;
  hasMoreReplies: boolean;
}

export interface CommentSearchDto {
  query: string;
  postId?: string;
  authorId?: string;
  status?: CommentStatus;
  parentId?: string;
  page?: number;
  limit?: number;
}
