'use client'

import React, { useState, useEffect } from 'react'
import { useCurrentUser } from '../../../modules/user/hooks/useUser'
import { FaceEnrollment } from '../../../modules/user/components/FaceEnrollment'
import { FaceVerification } from '../../../modules/user/components/FaceVerification'
import { FaceVerificationErrorBoundary } from '../../../modules/user/components/FaceVerificationErrorBoundary'
// import { FaceVerificationDebug } from '../../../modules/user/components/FaceVerificationDebug'
import { ClientOnly } from '../../../modules/user/components/ClientOnly'
import { FaceIOScriptLoader } from '../../../modules/user/components/FaceIOScriptLoader'
import { Card } from '../../core/ui/elements/Card'
import { Button } from '../../core/ui/elements/Button'
import { Spinner } from '../../core/ui/elements/Spinner'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type OnboardingStep = 'welcome' | 'face-enrollment' | 'face-verification' | 'complete'

const OnboardingPage = () => {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [faceId, setFaceId] = useState<string | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)

  useEffect(() => {
    checkFaceVerificationStatus()
  }, [])

  const checkFaceVerificationStatus = async () => {
    try {
      const response = await fetch('/api/face-verification')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.faceVerification.enabled) {
          setFaceId(data.faceVerification.faceId)
          setCurrentStep('complete')
        }
      }
    } catch (error) {
      console.error('Error checking face verification status:', error)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const handleFaceEnrollmentSuccess = (enrolledFaceId: string) => {
    setFaceId(enrolledFaceId)
    setCurrentStep('face-verification')
  }

  const handleFaceVerificationSuccess = (confidence: number) => {
    toast.success(`Face verification successful! Confidence: ${confidence.toFixed(2)}%`)
    setCurrentStep('complete')
  }

  const handleSkipFaceEnrollment = () => {
    setCurrentStep('complete')
  }

  const handleCompleteOnboarding = () => {
    router.push('/home')
  }

  if (isLoading || isCheckingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to complete onboarding.</p>
            <Button onClick={() => router.push('/sign-in')}>
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {/* FaceIO Script Loader */}
      <FaceIOScriptLoader 
        appId={process.env.NEXT_PUBLIC_FACE_IO_APP_ID || 'demo_app_id'}
        onLoad={() => console.log('FaceIO script loaded in onboarding')}
        onError={(error) => console.error('FaceIO script error in onboarding:', error)}
      />
      
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['welcome', 'face-enrollment', 'face-verification', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white' 
                    : index < ['welcome', 'face-enrollment', 'face-verification', 'complete'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < ['welcome', 'face-enrollment', 'face-verification', 'complete'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        {currentStep === 'welcome' && (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Socially, {user.getProfile().displayName || user.getUsername()}!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Let&apos;s set up your account for the best experience. We&apos;ll help you configure face verification for secure and quick access.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">What&apos;s included in onboarding:</h3>
                <ul className="text-left text-blue-800 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Face verification setup for secure login
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Profile customization options
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Privacy and security settings
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={() => setCurrentStep('face-enrollment')}
                  size="lg"
                  className="flex-1"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={handleSkipFaceEnrollment}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 'face-enrollment' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Face Verification Setup</h2>
                <p className="text-gray-600">
                  Set up face verification for secure and quick access to your account.
                </p>
              </div>
            </Card>

            <ClientOnly>
              <FaceVerificationErrorBoundary>
                <FaceEnrollment
                  onSuccess={handleFaceEnrollmentSuccess}
                  onError={(error) => toast.error(error)}
                />
              </FaceVerificationErrorBoundary>
            </ClientOnly>

            <Card className="p-6">
              <div className="text-center">
                <Button 
                  onClick={handleSkipFaceEnrollment}
                  variant="outline"
                  size="lg"
                >
                  Skip Face Verification
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  You can always set this up later in your account settings.
                </p>
              </div>
            </Card>

            {/* Debug component for troubleshooting */}
            {/* <ClientOnly>
              <FaceVerificationDebug />
            </ClientOnly> */}
          </div>
        )}

        {currentStep === 'face-verification' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Face</h2>
                <p className="text-gray-600">
                  Let&apos;s test your face verification to make sure everything works correctly.
                </p>
              </div>
            </Card>

            <ClientOnly>
              <FaceVerificationErrorBoundary>
                <FaceVerification
                  onSuccess={handleFaceVerificationSuccess}
                  onError={(error) => toast.error(error)}
                  onCancel={() => setCurrentStep('complete')}
                />
              </FaceVerificationErrorBoundary>
            </ClientOnly>
          </div>
        )}

        {currentStep === 'complete' && (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Onboarding Complete!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Your account is now set up and ready to use. {faceId ? 'Face verification has been configured successfully.' : 'You can set up face verification later in your account settings.'}
              </p>

              {faceId && (
                <div className="bg-green-50 p-4 rounded-lg mb-8">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 font-medium">Face verification is active</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCompleteOnboarding}
                size="lg"
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default OnboardingPage