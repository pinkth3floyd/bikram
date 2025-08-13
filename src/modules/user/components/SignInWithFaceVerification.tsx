'use client'

import React, { useState } from 'react'
import { SignIn } from '@clerk/nextjs'
import { FaceVerificationCheck } from './FaceVerificationCheck'
import { Card } from '../../../app/core/ui/elements/Card'
import { Button } from '../../../app/core/ui/elements/Button'
import { useRouter } from 'next/navigation'

interface SignInWithFaceVerificationProps {
  redirectUrl?: string
  className?: string
}

export const SignInWithFaceVerification: React.FC<SignInWithFaceVerificationProps> = ({
  redirectUrl = '/home',
  className = ''
}) => {
  const router = useRouter()
  const [showFaceVerification] = useState(false)

  // const handleSignInSuccess = () => {
  //   setIsSignedIn(true)
  //   setShowFaceVerification(true)
  // }

  const handleFaceVerificationSuccess = () => {
    router.push(redirectUrl)
  }

  const handleFaceVerificationSkip = () => {
    router.push(redirectUrl)
  }

  if (showFaceVerification) {
    return (
      <div className={className}>
        <FaceVerificationCheck
          onSuccess={handleFaceVerificationSuccess}
          onSkip={handleFaceVerificationSkip}
          onError={(error) => {
            console.error('Face verification error:', error)
            // Continue to dashboard even if face verification fails
            router.push(redirectUrl)
          }}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            Sign in to your account. If you have face verification enabled, you&apos;ll be prompted to verify your face after signing in.
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              card: 'shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden'
            }
          }}
          afterSignInUrl={redirectUrl}
          signUpUrl="/sign-up"
          redirectUrl={redirectUrl}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              onClick={() => router.push('/sign-up')}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              Sign up here
            </Button>
          </p>
        </div>
      </Card>
    </div>
  )
} 