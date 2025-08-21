import { PostType, PostPrivacy, PostContent } from '../../domain/entities/Post';

export interface CreatePostDto {
  content: PostContent;
  privacy?: PostPrivacy;
  scheduledFor?: Date;
}

export interface UpdatePostDto {
  content?: PostContent;
  privacy?: PostPrivacy;
  scheduledFor?: Date;
}

export interface PostResponseDto {
  id: string;
  authorId: string;
  author: {
    id: string;
    displayName: string;
    username: string;
    avatar?: string;
  };
  content: PostContent;
  type: PostType;
  privacy: PostPrivacy;
  stats: {
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    viewsCount: number;
    engagementRate: number;
  };
  metadata: {
    isEdited: boolean;
    isPinned: boolean;
    isPromoted: boolean;
    isSponsored: boolean;
    language: string;
    moderationStatus: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledFor?: string;
  isLikedByCurrentUser?: boolean;
  currentUserReaction?: string;
}

export interface PostFeedDto {
  posts: PostResponseDto[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PostSearchDto {
  query: string;
  type?: PostType;
  privacy?: PostPrivacy;
  authorId?: string;
  hashtag?: string;
  mention?: string;
  page?: number;
  limit?: number;
}

export interface PostAnalyticsDto {
  totalPosts: number;
  postsByType: Record<PostType, number>;
  postsByPrivacy: Record<PostPrivacy, number>;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  averageEngagementRate: number;
  popularPosts: PostResponseDto[];
  trendingPosts: PostResponseDto[];
}
