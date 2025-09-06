import { Like, LikeType, LikeReaction } from '../../domain/entities/Like';
import { LikeRepository } from '../../domain/repositories/LikeRepository';
import { PostRepository } from '../../domain/repositories/PostRepository';

export class LikePostUseCase {
  constructor(
    private likeRepository: LikeRepository,
    private postRepository: PostRepository
  ) {}

  async execute(userId: string, postId: string, reaction: LikeReaction = LikeReaction.LIKE): Promise<{
    success: boolean;
    isLiked: boolean;
    reaction?: LikeReaction;
  }> {
    // Check if post exists
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user already liked this post
    const existingLike = await this.likeRepository.findByUserAndTarget(
      userId,
      postId,
      LikeType.POST
    );

    if (existingLike) {
      // If same reaction, unlike the post
      if (existingLike.getReaction() === reaction) {
        await this.likeRepository.delete(existingLike.getId());
        
        // Update post like count
        const updatedPost = post.decrementLikes();
        await this.postRepository.update(updatedPost);

        return {
          success: true,
          isLiked: false
        };
      } else {
        // Update reaction
        const updatedLike = existingLike.updateReaction(reaction);
        await this.likeRepository.update(updatedLike);

        return {
          success: true,
          isLiked: true,
          reaction: reaction
        };
      }
    } else {
      // Create new like
      const like = Like.create(userId, postId, LikeType.POST, reaction);
      await this.likeRepository.create(like);

      // Update post like count
      const updatedPost = post.incrementLikes();
      await this.postRepository.update(updatedPost);

      return {
        success: true,
        isLiked: true,
        reaction: reaction
      };
    }
  }
}
