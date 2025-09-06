'use server'

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { CreateCommentUseCase } from '../use-cases/CreateCommentUseCase';
import { GetCommentsUseCase } from '../use-cases/GetCommentsUseCase';
import { CreateCommentDto } from '../dto/CommentDto';
import { initDatabase, getDatabaseService } from '@/core/infrastructure/database/init';
import { ensureUserExists } from './userActions';

export async function createComment(data: CreateCommentDto) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    const databaseService = getDatabaseService();
    const commentRepository = databaseService.getCommentRepository();
    const postRepository = databaseService.getPostRepository();
    
    // Ensure user exists in our database
    const userResult = await ensureUserExists(userId);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error || 'Failed to ensure user exists'
      };
    }
    
    // Create comment use case
    const createCommentUseCase = new CreateCommentUseCase(commentRepository, postRepository);
    
    // Execute the use case
    const comment = await createCommentUseCase.execute(data, userId);

    // Revalidate the home page to show the new comment
    revalidatePath('/home');
    
    return {
      success: true,
      comment: {
        id: comment.getId(),
        postId: comment.getPostId(),
        authorId: comment.getAuthorId(),
        parentId: comment.getParentId(),
        content: comment.getContent(),
        status: comment.getStatus(),
        stats: comment.getStats(),
        metadata: comment.getMetadata(),
        createdAt: comment.getCreatedAt(),
        updatedAt: comment.getUpdatedAt()
      }
    };

  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create comment'
    };
  }
}

export async function getComments(postId: string, page: number = 1, limit: number = 20) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    const databaseService = getDatabaseService();
    const commentRepository = databaseService.getCommentRepository();
    const userRepository = databaseService.getUserRepository();

    // Ensure user exists in our database
    const userResult = await ensureUserExists(userId);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error || 'Failed to ensure user exists',
        comments: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
    
    // Create get comments use case
    const getCommentsUseCase = new GetCommentsUseCase(commentRepository, userRepository);
    
    // Execute the use case
    const result = await getCommentsUseCase.execute(postId, page, limit);

    return {
      success: true,
      ...result
    };

  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch comments',
      comments: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }
}

export async function getCommentThread(commentId: string) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    const databaseService = getDatabaseService();
    const commentRepository = databaseService.getCommentRepository();
    const userRepository = databaseService.getUserRepository();

    // Ensure user exists in our database
    const userResult = await ensureUserExists(userId);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error || 'Failed to ensure user exists'
      };
    }
    
    // Create get comments use case
    const getCommentsUseCase = new GetCommentsUseCase(commentRepository, userRepository);
    
    // Execute the use case
    const result = await getCommentsUseCase.getCommentThread(commentId);

    return {
      success: true,
      ...result
    };

  } catch (error) {
    console.error('Error fetching comment thread:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch comment thread'
    };
  }
}
