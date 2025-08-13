'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '../hooks/useUser'
import { Card } from '../../../app/core/ui/elements/Card'
import { Button } from '../../../app/core/ui/elements/Button'
import { Spinner } from '../../../app/core/ui/elements/Spinner'

interface FaceVerificationRedirectProps {
  onComplete?: () => void
  className?: string
}

export const FaceVerificationRedirect: React.FC<FaceVerificationRedirectProps> = ({
  onComplete,
  className = ''
}) => {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [hasFaceVerification, setHasFaceVerification] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

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
          setHasFaceVerification(true)
          onComplete?.()
        } else {
          setHasFaceVerification(false)
        }
      } else {
        setHasFaceVerification(false)
      }
    } catch (error) {
      console.error('Error checking face verification status:', error)
      setHasFaceVerification(false)
    } finally {
      setIsChecking(false)
    }
  }, [user, onComplete])

  useEffect(() => {
    checkFaceVerificationStatus()
  }, [checkFaceVerificationStatus])

  const handleRedirectToOnboarding = () => {
    setIsRedirecting(true)
    router.push('/home/onboarding')
  }

  const handleSkipFaceVerification = () => {
    onComplete?.()
  }

  if (isLoading || isChecking) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Checking your account setup...</p>
        </div>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  if (hasFaceVerification) {
    return null // User has face verification, no need to show anything
  }

  return (
    <Card className={`p-8 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Complete Your Account Setup
        </h2>
        
        <p className="text-lg text-gray-600 mb-6">
          Welcome back, {user.getProfile().displayName || user.getUsername()}! 
          To enhance your account security, we recommend setting up face verification.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Why set up face verification?</h3>
          <ul className="text-left text-blue-800 space-y-2">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Quick and secure login
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enhanced account protection
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No need to remember passwords
            </li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <Button 
            onClick={handleRedirectToOnboarding}
            disabled={isRedirecting}
            size="lg"
            className="flex-1"
          >
            {isRedirecting ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Redirecting...
              </>
            ) : (
              'Set Up Face Verification'
            )}
          </Button>
          
          <Button 
            onClick={handleSkipFaceVerification}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Skip for Now
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You can always set this up later in your account settings.
        </p>
      </div>
    </Card>
  )
} 