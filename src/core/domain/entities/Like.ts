export enum LikeType {
  POST = 'post',
  COMMENT = 'comment'
}

export enum LikeReaction {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
  CARE = 'care'
}

export class Like {
  private readonly id: string;
  private readonly userId: string;
  private readonly targetId: string; // post ID or comment ID
  private readonly targetType: LikeType;
  private readonly reaction: LikeReaction;
  private readonly createdAt: Date;

  constructor(
    id: string,
    userId: string,
    targetId: string,
    targetType: LikeType,
    reaction: LikeReaction,
    createdAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.targetId = targetId;
    this.targetType = targetType;
    this.reaction = reaction;
    this.createdAt = createdAt;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getTargetId(): string {
    return this.targetId;
  }

  getTargetType(): LikeType {
    return this.targetType;
  }

  getReaction(): LikeReaction {
    return this.reaction;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  // Business logic methods
  isPostLike(): boolean {
    return this.targetType === LikeType.POST;
  }

  isCommentLike(): boolean {
    return this.targetType === LikeType.COMMENT;
  }

  isSimpleLike(): boolean {
    return this.reaction === LikeReaction.LIKE;
  }

  isReaction(): boolean {
    return this.reaction !== LikeReaction.LIKE;
  }

  // Factory methods
  static create(
    userId: string,
    targetId: string,
    targetType: LikeType,
    reaction: LikeReaction = LikeReaction.LIKE
  ): Like {
    const id = crypto.randomUUID();
    const now = new Date();

    return new Like(
      id,
      userId,
      targetId,
      targetType,
      reaction,
      now
    );
  }

  // Update methods
  updateReaction(newReaction: LikeReaction): Like {
    return new Like(
      this.id,
      this.userId,
      this.targetId,
      this.targetType,
      newReaction,
      this.createdAt
    );
  }

  // Utility methods
  getReactionEmoji(): string {
    const emojiMap: Record<LikeReaction, string> = {
      [LikeReaction.LIKE]: '👍',
      [LikeReaction.LOVE]: '❤️',
      [LikeReaction.HAHA]: '😂',
      [LikeReaction.WOW]: '😮',
      [LikeReaction.SAD]: '😢',
      [LikeReaction.ANGRY]: '😠',
      [LikeReaction.CARE]: '🤗'
    };

    return emojiMap[this.reaction];
  }

  getReactionName(): string {
    return this.reaction.charAt(0).toUpperCase() + this.reaction.slice(1);
  }
}
