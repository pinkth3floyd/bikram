

export enum PostType {
  TEXT = 'text',
  VIDEO = 'video',
  MIXED = 'mixed'
}

export enum PostPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends'
}

export interface PostContent {
  text?: string;
  videoUrl?: string;
  imageUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number; // in seconds
  mentions?: string[]; // user IDs mentioned in the post
  hashtags?: string[];
  links?: Array<{
    url: string;
    title?: string;
    description?: string;
    thumbnail?: string;
  }>;
}

export interface PostStats {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  engagementRate: number; // calculated engagement rate
}

export interface PostMetadata {
  isEdited: boolean;
  editHistory?: Array<{
    timestamp: Date;
    content: PostContent;
    reason?: string;
  }>;
  isPinned: boolean;
  isPromoted: boolean;
  isSponsored: boolean;
  language: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNotes?: string;
}

export class Post {
  private readonly id: string;
  private readonly authorId: string;
  private readonly content: PostContent;
  private readonly type: PostType;
  private readonly privacy: PostPrivacy;
  private readonly stats: PostStats;
  private readonly metadata: PostMetadata;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;
  private readonly publishedAt?: Date;
  private readonly scheduledFor?: Date;

  constructor(
    id: string,
    authorId: string,
    content: PostContent,
    type: PostType,
    privacy: PostPrivacy,
    stats: PostStats,
    metadata: PostMetadata,
    createdAt: Date,
    updatedAt: Date,
    publishedAt?: Date,
    scheduledFor?: Date
  ) {
    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.type = type;
    this.privacy = privacy;
    this.stats = stats;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publishedAt = publishedAt;
    this.scheduledFor = scheduledFor;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getContent(): PostContent {
    return { ...this.content };
  }

  getType(): PostType {
    return this.type;
  }

  getPrivacy(): PostPrivacy {
    return this.privacy;
  }

  getStats(): PostStats {
    return { ...this.stats };
  }

  getMetadata(): PostMetadata {
    return { ...this.metadata };
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  getPublishedAt(): Date | undefined {
    return this.publishedAt ? new Date(this.publishedAt) : undefined;
  }

  getScheduledFor(): Date | undefined {
    return this.scheduledFor ? new Date(this.scheduledFor) : undefined;
  }

  // Business logic methods
  isPublic(): boolean {
    return this.privacy === PostPrivacy.PUBLIC;
  }

  isPrivate(): boolean {
    return this.privacy === PostPrivacy.PRIVATE;
  }

  isFriendsOnly(): boolean {
    return this.privacy === PostPrivacy.FRIENDS;
  }

  isTextOnly(): boolean {
    return this.type === PostType.TEXT && !this.content.videoUrl;
  }

  isVideoOnly(): boolean {
    return this.type === PostType.VIDEO && !this.content.text;
  }

  isMixed(): boolean {
    return this.type === PostType.MIXED || !!(this.content.text && this.content.videoUrl);
  }

  isPublished(): boolean {
    return this.publishedAt !== undefined;
  }

  isScheduled(): boolean {
    return this.scheduledFor !== undefined;
  }

  isEdited(): boolean {
    return this.metadata.isEdited;
  }

  canBeViewedBy(viewerId: string, isAuthor: boolean, isFriend: boolean): boolean {
    if (isAuthor) return true;
    if (this.isPublic()) return true;
    if (this.isFriendsOnly() && isFriend) return true;
    return false;
  }

  canBeEditedBy(userId: string): boolean {
    return this.authorId === userId && !this.metadata.isPromoted;
  }

  canBeDeletedBy(userId: string, isAdmin: boolean): boolean {
    return this.authorId === userId || isAdmin;
  }

  // Factory methods
  static create(
    authorId: string,
    content: PostContent,
    privacy: PostPrivacy = PostPrivacy.PUBLIC,
    scheduledFor?: Date
  ): Post {
    const id = crypto.randomUUID();
    const now = new Date();
    const type = this.determineType(content);
    
    const stats: PostStats = {
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      engagementRate: 0
    };

    const metadata: PostMetadata = {
      isEdited: false,
      isPinned: false,
      isPromoted: false,
      isSponsored: false,
      language: 'en',
      moderationStatus: 'pending'
    };

    return new Post(
      id,
      authorId,
      content,
      type,
      privacy,
      stats,
      metadata,
      now,
      now,
      scheduledFor ? undefined : now,
      scheduledFor
    );
  }

  private static determineType(content: PostContent): PostType {
    const hasText = !!(content.text && content.text.trim().length > 0);
    const hasVideo = !!(content.videoUrl && content.videoUrl.trim().length > 0);

    if (hasText && hasVideo) return PostType.MIXED;
    if (hasVideo) return PostType.VIDEO;
    return PostType.TEXT;
  }

  // Update methods
  updateContent(newContent: PostContent, reason?: string): Post {
    const updatedContent = { ...this.content, ...newContent };
    const updatedType = Post.determineType(updatedContent);
    
    const editHistory = [
      ...(this.metadata.editHistory || []),
      {
        timestamp: new Date(),
        content: this.content,
        reason
      }
    ];

    const updatedMetadata: PostMetadata = {
      ...this.metadata,
      isEdited: true,
      editHistory
    };

    return new Post(
      this.id,
      this.authorId,
      updatedContent,
      updatedType,
      this.privacy,
      this.stats,
      updatedMetadata,
      this.createdAt,
      new Date(),
      this.publishedAt,
      this.scheduledFor
    );
  }

  updatePrivacy(privacy: PostPrivacy): Post {
    return new Post(
      this.id,
      this.authorId,
      this.content,
      this.type,
      privacy,
      this.stats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.publishedAt,
      this.scheduledFor
    );
  }

  incrementLikes(): Post {
    const updatedStats: PostStats = {
      ...this.stats,
      likesCount: this.stats.likesCount + 1
    };

    return new Post(
      this.id,
      this.authorId,
      this.content,
      this.type,
      this.privacy,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.publishedAt,
      this.scheduledFor
    );
  }

  decrementLikes(): Post {
    const updatedStats: PostStats = {
      ...this.stats,
      likesCount: Math.max(0, this.stats.likesCount - 1)
    };

    return new Post(
      this.id,
      this.authorId,
      this.content,
      this.type,
      this.privacy,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.publishedAt,
      this.scheduledFor
    );
  }

  incrementComments(): Post {
    const updatedStats: PostStats = {
      ...this.stats,
      commentsCount: this.stats.commentsCount + 1
    };

    return new Post(
      this.id,
      this.authorId,
      this.content,
      this.type,
      this.privacy,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.publishedAt,
      this.scheduledFor
    );
  }

  incrementViews(): Post {
    const updatedStats: PostStats = {
      ...this.stats,
      viewsCount: this.stats.viewsCount + 1
    };

    return new Post(
      this.id,
      this.authorId,
      this.content,
      this.type,
      this.privacy,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.publishedAt,
      this.scheduledFor
    );
  }

  // Utility methods
  getMentions(): string[] {
    return this.content.mentions || [];
  }

  getHashtags(): string[] {
    return this.content.hashtags || [];
  }

  getLinks(): Array<{ url: string; title?: string; description?: string; thumbnail?: string }> {
    return this.content.links || [];
  }

  getTextLength(): number {
    return this.content.text?.length || 0;
  }

  getVideoDuration(): number | undefined {
    return this.content.videoDuration;
  }

  hasVideo(): boolean {
    return !!this.content.videoUrl;
  }

  hasText(): boolean {
    return !!(this.content.text && this.content.text.trim().length > 0);
  }
}
