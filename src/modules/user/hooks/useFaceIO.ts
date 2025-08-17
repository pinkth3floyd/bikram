'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser as useClerkUser } from '@clerk/nextjs'
import { FaceIOService, FaceEnrollmentResult, FaceVerificationResult } from '../../../core/infrastructure/faceio/FaceIOService'
import { userKeys } from './useUser'

// Initialize FaceIO service only on client side
const faceIOService = typeof window !== 'undefined' 
  ? new FaceIOService('fioae5c6')
  : null

export const useFaceIO = () => {
  const { user: clerkUser } = useClerkUser()
  const queryClient = useQueryClient()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const checkInitialization = async () => {
      if (!faceIOService) return
      
      // Wait a bit for FaceIO to initialize
      await new Promise(resolve => setTimeout(resolve, 100))
      setIsInitialized(faceIOService.isInitialized())
    }
    
    if (typeof window !== 'undefined') {
      checkInitialization()
    }
  }, [])

  const enrollMutation = useMutation({
    mutationFn: async (): Promise<FaceEnrollmentResult> => {
      if (!clerkUser) {
        throw new Error('User not authenticated')
      }
      
      if (!faceIOService) {
        throw new Error('FaceIO service not available')
      }
      
      // First enroll with FaceIO
      const faceResult = await faceIOService.enrollUser(clerkUser.id, clerkUser.emailAddresses[0]?.emailAddress || '')
      
      if (faceResult.success && faceResult.faceId) {
        // Then save to Clerk metadata
        const response = await fetch('/api/face-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'enroll',
            faceId: faceResult.faceId
          })
        })

        if (!response.ok) {
          throw new Error('Failed to save face verification data')
        }

        return faceResult
      }
      
      return faceResult
    },
    onSuccess: (result) => {
      if (result.success && result.faceId) {
        // Invalidate user queries to refresh data
        queryClient.invalidateQueries({ queryKey: userKeys.detail(clerkUser?.id || '') })
      }
    }
  })

  const verifyMutation = useMutation({
    mutationFn: async (): Promise<FaceVerificationResult> => {
      if (!clerkUser) {
        throw new Error('User not authenticated')
      }
      
      if (!faceIOService) {
        throw new Error('FaceIO service not available')
      }
      
      return faceIOService.verifyUser(clerkUser.id, clerkUser.emailAddresses[0]?.emailAddress || '')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (faceId: string) => {
      if (!faceIOService) {
        throw new Error('FaceIO service not available')
      }
      
      return faceIOService.deleteUser(faceId)
    },
    onSuccess: () => {
      // Invalidate user queries to refresh data
      queryClient.invalidateQueries({ queryKey: userKeys.detail(clerkUser?.id || '') })
    }
  })

  const enroll = useCallback(async (): Promise<FaceEnrollmentResult> => {
    return enrollMutation.mutateAsync()
  }, [enrollMutation])

  const verify = useCallback(async (): Promise<FaceVerificationResult> => {
    return verifyMutation.mutateAsync()
  }, [verifyMutation])

  const deleteFace = useCallback((faceId: string) => {
    return deleteMutation.mutate(faceId)
  }, [deleteMutation])

  return {
    isInitialized: isInitialized && !!faceIOService,
    enroll,
    verify,
    deleteFace,
    enrollMutation,
    verifyMutation,
    deleteMutation
  }
} 