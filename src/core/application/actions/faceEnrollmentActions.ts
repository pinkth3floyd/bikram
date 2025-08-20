'use server'

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { FaceIOService } from '../../infrastructure/faceio/FaceIOService';



export interface FaceEnrollmentActionResult {
  success: boolean;
  faceId?: string;
  error?: string;
  confidence?: number;
}

export interface FaceVerificationActionResult {
  success: boolean;
  verified: boolean;
  error?: string;
  confidence?: number;
}

export interface FaceStatusResult {
  faceVerified: boolean;
  faceId?: string;
  faceEnrollmentDate?: string;
  faceVerificationEnabled: boolean;
}

const faceIOService = new FaceIOService();

/**
 * Server action to update user metadata after face enrollment
 */
export async function updateUserFaceEnrollment(
  faceId: string
): Promise<FaceEnrollmentActionResult> {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Update user metadata with face ID
    await faceIOService.updateUserMetadata(userId, faceId, false);

    // Revalidate user-related pages
    revalidatePath('/home');
    revalidatePath('/profile');
    revalidatePath('/home/onboarding');

    return {
      success: true,
      faceId: faceId
    };
  } catch (error) {
    console.error('Face enrollment metadata update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user metadata'
    };
  }
}

/**
 * Server action to update user metadata after face verification
 */
export async function updateUserFaceVerification(
  faceId: string
): Promise<FaceVerificationActionResult> {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        verified: false,
        error: 'User not authenticated'
      };
    }

    // Update user metadata to mark face as verified
    await faceIOService.updateUserMetadata(userId, faceId, true);

    // Revalidate user-related pages
    revalidatePath('/home');
    revalidatePath('/profile');
    revalidatePath('/home/onboarding');

    return {
      success: true,
      verified: true
    };
  } catch (error) {
    console.error('Face verification metadata update failed:', error);
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : 'Failed to update user verification'
    };
  }
}

/**
 * Server action to get user's face verification status
 */
export async function getUserFaceStatus(): Promise<FaceStatusResult> {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return {
        faceVerified: false,
        faceVerificationEnabled: false
      };
    }

    return await faceIOService.getUserFaceStatus(userId);
  } catch (error) {
    console.error('Get face status action failed:', error);
    return {
      faceVerified: false,
      faceVerificationEnabled: false
    };
  }
}

/**
 * Server action to delete user's face enrollment
 */
export async function deleteUserFace(faceId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const result = await faceIOService.deleteUserFace(userId, faceId);

    if (result.success) {
      // Revalidate user-related pages
      revalidatePath('/home');
      revalidatePath('/profile');
      revalidatePath('/home/onboarding');
    }

    return result;
  } catch (error) {
    console.error('Delete face action failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Face deletion failed'
    };
  }
}
