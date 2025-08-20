'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { 
  updateUserFaceEnrollment, 
  updateUserFaceVerification, 
  getUserFaceStatus, 
  deleteUserFace,
  type FaceEnrollmentActionResult,
  type FaceVerificationActionResult,
  type FaceStatusResult
} from '../../../core/application/actions/faceEnrollmentActions';
import { userKeys } from './useUser';

// Query keys for face enrollment
export const faceEnrollmentKeys = {
  all: ['faceEnrollment'] as const,
  status: () => [...faceEnrollmentKeys.all, 'status'] as const,
  user: (userId: string) => [...faceEnrollmentKeys.all, 'user', userId] as const,
};

/**
 * Hook to get user's face verification status
 */
export const useFaceStatus = () => {
  const { user } = useUser();
  
  return useQuery<FaceStatusResult>({
    queryKey: faceEnrollmentKeys.status(),
    queryFn: getUserFaceStatus,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for face enrollment mutation
 */
export const useFaceEnrollment = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation<FaceEnrollmentActionResult, Error, string>({
    mutationFn: updateUserFaceEnrollment,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate face status and user data
        queryClient.invalidateQueries({ queryKey: faceEnrollmentKeys.status() });
        queryClient.invalidateQueries({ queryKey: userKeys.detail(user?.id || '') });
        queryClient.invalidateQueries({ queryKey: userKeys.profile(user?.id || '') });
        
        // Update face status cache optimistically
        queryClient.setQueryData<FaceStatusResult>(faceEnrollmentKeys.status(), (old) => ({
          ...old,
          faceVerified: false,
          faceId: result.faceId,
          faceEnrollmentDate: new Date().toISOString(),
          faceVerificationEnabled: true,
        }));
      }
    },
    onError: (error) => {
      console.error('Face enrollment mutation failed:', error);
    },
  });
};

/**
 * Hook for face verification mutation
 */
export const useFaceVerification = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation<FaceVerificationActionResult, Error, string>({
    mutationFn: updateUserFaceVerification,
    onSuccess: (result) => {
      if (result.success && result.verified) {
        // Invalidate face status and user data
        queryClient.invalidateQueries({ queryKey: faceEnrollmentKeys.status() });
        queryClient.invalidateQueries({ queryKey: userKeys.detail(user?.id || '') });
        queryClient.invalidateQueries({ queryKey: userKeys.profile(user?.id || '') });
        
        // Update face status cache optimistically
        queryClient.setQueryData<FaceStatusResult>(faceEnrollmentKeys.status(), (old) => ({
          ...old,
          faceVerified: true,
          faceVerificationEnabled: true,
        }));
      }
    },
    onError: (error) => {
      console.error('Face verification mutation failed:', error);
    },
  });
};

/**
 * Hook for deleting face enrollment
 */
export const useDeleteFace = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; error?: string }, Error, string>({
    mutationFn: deleteUserFace,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate face status and user data
        queryClient.invalidateQueries({ queryKey: faceEnrollmentKeys.status() });
        queryClient.invalidateQueries({ queryKey: userKeys.detail(user?.id || '') });
        queryClient.invalidateQueries({ queryKey: userKeys.profile(user?.id || '') });
        
        // Update face status cache optimistically
        queryClient.setQueryData<FaceStatusResult>(faceEnrollmentKeys.status(), (old) => ({
          ...old,
          faceVerified: false,
          faceId: undefined,
          faceEnrollmentDate: undefined,
          faceVerificationEnabled: false,
        }));
      }
    },
    onError: (error) => {
      console.error('Delete face mutation failed:', error);
    },
  });
};

/**
 * Hook to check if user has face verification enabled
 */
export const useHasFaceVerification = () => {
  const { data: faceStatus } = useFaceStatus();
  
  return {
    hasFaceVerification: faceStatus?.faceVerificationEnabled || false,
    isFaceVerified: faceStatus?.faceVerified || false,
    faceId: faceStatus?.faceId,
    faceEnrollmentDate: faceStatus?.faceEnrollmentDate,
    isLoading: !faceStatus,
  };
};

/**
 * Hook to get face verification status with loading states
 */
export const useFaceVerificationStatus = () => {
  const { data: faceStatus, isLoading, error } = useFaceStatus();
  
  return {
    faceVerified: faceStatus?.faceVerified || false,
    faceId: faceStatus?.faceId,
    faceEnrollmentDate: faceStatus?.faceEnrollmentDate,
    faceVerificationEnabled: faceStatus?.faceVerificationEnabled || false,
    isLoading,
    error,
    // Helper methods
    needsEnrollment: !faceStatus?.faceVerificationEnabled,
    needsVerification: faceStatus?.faceVerificationEnabled && !faceStatus?.faceVerified,
    isComplete: faceStatus?.faceVerified || false,
  };
};
