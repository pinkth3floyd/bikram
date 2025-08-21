

export enum CommentStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  HIDDEN = 'hidden',
  MODERATED = 'moderated'
}

export interface CommentContent {
  text: string;
  mentions?: string[]; // user IDs mentioned in the comment
  hashtags?: string[];
  links?: Array<{
    url: string;
    title?: string;
    description?: string;
  }>;
}

export interface CommentStats {
  likesCount: number;
  repliesCount: number;
  reportsCount: number;
}

export interface CommentMetadata {
  isEdited: boolean;
  editHistory?: Array<{
    timestamp: Date;
    content: string;
    reason?: string;
  }>;
  isPinned: boolean;
  isHighlighted: boolean;
  language: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNotes?: string;
}

export class Comment {
  private readonly id: string;
  private readonly postId: string;
  private readonly authorId: string;
  private readonly parentId?: string; // for replies
  private readonly content: CommentContent;
  private readonly status: CommentStatus;
  private readonly stats: CommentStats;
  private readonly metadata: CommentMetadata;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(
    id: string,
    postId: string,
    authorId: string,
    content: CommentContent,
    status: CommentStatus,
    stats: CommentStats,
    metadata: CommentMetadata,
    createdAt: Date,
    updatedAt: Date,
    parentId?: string
  ) {
    this.id = id;
    this.postId = postId;
    this.authorId = authorId;
    this.content = content;
    this.status = status;
    this.stats = stats;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.parentId = parentId;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getPostId(): string {
    return this.postId;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getParentId(): string | undefined {
    return this.parentId;
  }

  getContent(): CommentContent {
    return { ...this.content };
  }

  getStatus(): CommentStatus {
    return this.status;
  }

  getStats(): CommentStats {
    return { ...this.stats };
  }

  getMetadata(): CommentMetadata {
    return { ...this.metadata };
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  // Business logic methods
  isActive(): boolean {
    return this.status === CommentStatus.ACTIVE;
  }

  isDeleted(): boolean {
    return this.status === CommentStatus.DELETED;
  }

  isHidden(): boolean {
    return this.status === CommentStatus.HIDDEN;
  }

  isModerated(): boolean {
    return this.status === CommentStatus.MODERATED;
  }

  isReply(): boolean {
    return this.parentId !== undefined;
  }

  isTopLevel(): boolean {
    return this.parentId === undefined;
  }

  isEdited(): boolean {
    return this.metadata.isEdited;
  }

  isPinned(): boolean {
    return this.metadata.isPinned;
  }

  canBeEditedBy(userId: string): boolean {
    return this.authorId === userId && this.isActive();
  }

  canBeDeletedBy(userId: string, isAdmin: boolean): boolean {
    return this.authorId === userId || isAdmin;
  }

  canBeRepliedTo(): boolean {
    return this.isActive();
  }

  // Factory methods
  static create(
    postId: string,
    authorId: string,
    content: CommentContent,
    parentId?: string
  ): Comment {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const stats: CommentStats = {
      likesCount: 0,
      repliesCount: 0,
      reportsCount: 0
    };

    const metadata: CommentMetadata = {
      isEdited: false,
      isPinned: false,
      isHighlighted: false,
      language: 'en',
      moderationStatus: 'pending'
    };

    return new Comment(
      id,
      postId,
      authorId,
      content,
      CommentStatus.ACTIVE,
      stats,
      metadata,
      now,
      now,
      parentId
    );
  }

  // Update methods
  updateContent(newContent: CommentContent, reason?: string): Comment {
    const editHistory = [
      ...(this.metadata.editHistory || []),
      {
        timestamp: new Date(),
        content: this.content.text,
        reason
      }
    ];

    const updatedMetadata: CommentMetadata = {
      ...this.metadata,
      isEdited: true,
      editHistory
    };

    return new Comment(
      this.id,
      this.postId,
      this.authorId,
      newContent,
      this.status,
      this.stats,
      updatedMetadata,
      this.createdAt,
      new Date(),
      this.parentId
    );
  }

  markAsDeleted(): Comment {
    return new Comment(
      this.id,
      this.postId,
      this.authorId,
      this.content,
      CommentStatus.DELETED,
      this.stats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.parentId
    );
  }

  markAsHidden(): Comment {
    return new Comment(
      this.id,
      this.postId,
      this.authorId,
      this.content,
      CommentStatus.HIDDEN,
      this.stats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.parentId
    );
  }

  incrementLikes(): Comment {
    const updatedStats: CommentStats = {
      ...this.stats,
      likesCount: this.stats.likesCount + 1
    };

    return new Comment(
      this.id,
      this.postId,
      this.authorId,
      this.content,
      this.status,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.parentId
    );
  }

  decrementLikes(): Comment {
    const updatedStats: CommentStats = {
      ...this.stats,
      likesCount: Math.max(0, this.stats.likesCount - 1)
    };

    return new Comment(
      this.id,
      this.postId,
      this.authorId,
      this.content,
      this.status,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.parentId
    );
  }

  incrementReplies(): Comment {
    const updatedStats: CommentStats = {
      ...this.stats,
      repliesCount: this.stats.repliesCount + 1
    };

    return new Comment(
      this.id,
      this.postId,
      this.authorId,
      this.content,
      this.status,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.parentId
    );
  }

  incrementReports(): Comment {
    const updatedStats: CommentStats = {
      ...this.stats,
      reportsCount: this.stats.reportsCount + 1
    };

    return new Comment(
      this.id,
      this.postId,
      this.authorId,
      this.content,
      this.status,
      updatedStats,
      this.metadata,
      this.createdAt,
      new Date(),
      this.parentId
    );
  }

  // Utility methods
  getMentions(): string[] {
    return this.content.mentions || [];
  }

  getHashtags(): string[] {
    return this.content.hashtags || [];
  }

  getLinks(): Array<{ url: string; title?: string; description?: string }> {
    return this.content.links || [];
  }

  getTextLength(): number {
    return this.content.text.length;
  }

  getText(): string {
    return this.content.text;
  }
}
