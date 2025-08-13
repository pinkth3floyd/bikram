'use client'

import React, { useState } from 'react'
import { useFaceIO } from '../hooks/useFaceIO'
import { useCurrentUser } from '../hooks/useUser'
import { Button } from '../../../app/core/ui/elements/Button'
import { Card } from '../../../app/core/ui/elements/Card'
import { Spinner } from '../../../app/core/ui/elements/Spinner'
import { toast } from 'sonner'

interface FaceVerificationProps {
  onSuccess?: (confidence: number) => void
  onError?: (error: string) => void
  onCancel?: () => void
  className?: string
  title?: string
  description?: string
}

export const FaceVerification: React.FC<FaceVerificationProps> = ({
  onSuccess,
  onError,
  onCancel,
  className = '',
  title = 'Face Verification',
  description = 'Please look at the camera to verify your identity'
}) => {
  const { user } = useCurrentUser()
  const { isInitialized, verify, verifyMutation } = useFaceIO()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    if (!user) {
      toast.error('Please sign in to verify your face')
      return
    }

    if (!isInitialized) {
      toast.error('Face verification service is not available')
      return
    }

    setIsVerifying(true)
    
    try {
      const result = await verify()
      
      if (result.success && result.verified) {
        toast.success('Face verification successful!')
        onSuccess?.(result.confidence || 0)
      } else {
        const errorMessage = result.error || 'Face verification failed'
        toast.error(errorMessage)
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Face verification failed'
      toast.error(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsVerifying(false)
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
        <div className="text-green-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Verification Tips</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Ensure good lighting on your face</li>
              <li>• Look directly at the camera</li>
              <li>• Remove glasses or hats if possible</li>
              <li>• Stay still during verification</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || verifyMutation.isPending}
              className="flex-1"
              size="lg"
            >
              {isVerifying || verifyMutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Verify Face
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isVerifying || verifyMutation.isPending}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Your face data is encrypted and processed securely.
          </p>
        </div>
      </div>
    </Card>
  )
} 