'use client'

import React, { useState } from 'react'
import { useFaceIO } from '../hooks/useFaceIO'
import { useCurrentUser } from '../hooks/useUser'
import { Button } from '../../../app/core/ui/elements/Button'
import { Card } from '../../../app/core/ui/elements/Card'
import { Spinner } from '../../../app/core/ui/elements/Spinner'
import { toast } from 'sonner'

interface FaceEnrollmentProps {
  onSuccess?: (faceId: string) => void
  onError?: (error: string) => void
  className?: string
}

export const FaceEnrollment: React.FC<FaceEnrollmentProps> = ({
  onSuccess,
  onError,
  className = ''
}) => {
  const { user } = useCurrentUser()
  const { isInitialized, enroll, enrollMutation } = useFaceIO()
  const [isEnrolling, setIsEnrolling] = useState(false)

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll your face')
      return
    }

    if (!isInitialized) {
      toast.error('Face verification service is not available')
      return
    }

    setIsEnrolling(true)
    
    try {
      const result = await enroll()
      
      if (result.success && result.faceId) {
        toast.success('Face enrollment successful!')
        onSuccess?.(result.faceId)
      } else {
        const errorMessage = result.error || 'Face enrollment failed'
        toast.error(errorMessage)
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Face enrollment failed'
      toast.error(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsEnrolling(false)
    }
  }

  if (!isInitialized) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="text-blue-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Initializing Face Verification</h3>
          <p className="text-gray-600">
            Please wait while we set up face verification for you...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="text-center">
        <div className="text-blue-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Face Verification Setup</h3>
        <p className="text-gray-600 mb-6">
          Set up face verification for secure and quick login. Your face data is encrypted and stored securely.
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What happens during enrollment?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Camera will activate to capture your face</li>
              <li>• Multiple angles will be captured for accuracy</li>
              <li>• Your face data is encrypted and stored securely</li>
              <li>• You can use face verification for future logins</li>
            </ul>
          </div>

          <Button
            onClick={handleEnroll}
            disabled={isEnrolling || enrollMutation.isPending}
            className="w-full"
            size="lg"
          >
            {isEnrolling || enrollMutation.isPending ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Enrolling Face...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Start Face Enrollment
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500">
            By enrolling, you agree to our privacy policy and consent to face verification.
          </p>
        </div>
      </div>
    </Card>
  )
} 