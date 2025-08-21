'use server'

import { auth } from '@clerk/nextjs/server';
import { CreateUserUseCase } from '../use-cases/CreateUserUseCase';
import { getDatabaseService } from '@/core/infrastructure/database/init';

/**
 * Ensures a user exists in our database
 * Creates the user if they don't exist, otherwise returns the existing user
 */
export async function ensureUserExists(userId: string | null) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const databaseService = getDatabaseService();
    const userRepository = databaseService.getUserRepository();

    // Check if user already exists
    let user = await userRepository.findById(userId);
    if (user) {
      return { success: true, user };
    }

    // Create user if they don't exist
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return { success: false, error: 'Clerk user not found' };
    }

    // Get user details from Clerk
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: 'Clerk user not found' };
    }

    const createUserUseCase = new CreateUserUseCase(userRepository);
    user = await createUserUseCase.execute({
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      username: clerkUser.username || `user_${userId.substring(0, 8)}`,
      displayName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || undefined,
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to ensure user exists' 
    };
  }
}

/**
 * Gets the current authenticated user from our database
 * Creates them if they don't exist
 */
export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await ensureUserExists(userId);
    return result;
  } catch (error) {
    console.error('Error getting current user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get current user' 
    };
  }
}
