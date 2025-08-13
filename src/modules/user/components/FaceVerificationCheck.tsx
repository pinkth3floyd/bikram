'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useUser as useClerkUser } from '@clerk/nextjs'
import { FaceVerification } from './FaceVerification'
import { Card } from '../../../app/core/ui/elements/Card'
import { Button } from '../../../app/core/ui/elements/Button'
import { Spinner } from '../../../app/core/ui/elements/Spinner'
import { toast } from 'sonner'

interface FaceVerificationCheckProps {
  onSuccess?: () => void
  onSkip?: () => void
  onError?: (error: string) => void
  className?: string
}

export const FaceVerificationCheck: React.FC<FaceVerificationCheckProps> = ({
  onSuccess,
  onSkip,
  onError,
  className = ''
}) => {
  const { user } = useClerkUser()
  const [isChecking, setIsChecking] = useState(true)
  const [requiresFaceVerification, setRequiresFaceVerification] = useState(false)
  const [, setIsVerifying] = useState(false)

  const checkFaceVerificationStatus = useCallback(async () => {
    if (!user) {
      setIsChecking(false)
      return
    }

    try {
      const response = await fetch('/api/face-verification')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.faceVerification.enabled) {
          setRequiresFaceVerification(true)
        }
      }
    } catch (error) {
      console.error('Error checking face verification status:', error)
    } finally {
      setIsChecking(false)
    }
  }, [user])

  useEffect(() => {
    checkFaceVerificationStatus()
  }, [checkFaceVerificationStatus])

  const handleVerificationSuccess = (confidence: number) => {
    setIsVerifying(false)
    toast.success(`Face verification successful! Confidence: ${confidence.toFixed(2)}%`)
    onSuccess?.()
  }

  const handleVerificationError = (error: string) => {
    setIsVerifying(false)
    toast.error(error)
    onError?.(error)
  }

  const handleSkipVerification = () => {
    onSkip?.()
  }

  if (isChecking) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Checking security settings...</p>
        </div>
      </Card>
    )
  }

  if (!requiresFaceVerification) {
    // No face verification required, call success immediately
    onSuccess?.()
    return null
  }

  return (
    <div className={className}>
      <Card className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Security Check</h2>
          <p className="text-gray-600">
            Please verify your face to complete the login process.
          </p>
        </div>

        <FaceVerification
          onSuccess={handleVerificationSuccess}
          onError={handleVerificationError}
          onCancel={handleSkipVerification}
          title="Face Verification Required"
          description="Please look at the camera to verify your identity and complete login."
        />

        <div className="mt-6 text-center">
          <Button
            onClick={handleSkipVerification}
            variant="outline"
            size="sm"
          >
            Skip Face Verification
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            You can skip this step, but face verification provides enhanced security.
          </p>
        </div>
      </Card>
    </div>
  )
} 