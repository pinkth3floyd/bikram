'use client'

import React, { useState, useEffect } from 'react'
// import { useCurrentUser } from '../hooks/useUser'
import { FaceEnrollment } from './FaceEnrollment'
import { FaceVerification } from './FaceVerification'
import { Card } from '../../../app/core/ui/elements/Card'
import { Button } from '../../../app/core/ui/elements/Button'
import { Spinner } from '../../../app/core/ui/elements/Spinner'
import { Switch } from '../../../app/core/ui/elements/Switch'
import { toast } from 'sonner'

interface FaceVerificationSettingsProps {
  className?: string
}

export const FaceVerificationSettings: React.FC<FaceVerificationSettingsProps> = ({
  className = ''
}) => {
  // const { user: currentUser } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(true)
  const [faceVerificationStatus, setFaceVerificationStatus] = useState<{
    enabled: boolean
    verified: boolean
    faceId?: string
    enrollmentDate?: string
  } | null>(null)
  const [showEnrollment, setShowEnrollment] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

  useEffect(() => {
    loadFaceVerificationStatus()
  }, [])

  const loadFaceVerificationStatus = async () => {
    try {
      const response = await fetch('/api/face-verification')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFaceVerificationStatus(data.faceVerification)
        }
      }
    } catch (error) {
      console.error('Error loading face verification status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFaceVerification = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/face-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: enabled ? 'enable' : 'disable'
        })
      })

      if (response.ok) {
        setFaceVerificationStatus(prev => prev ? { ...prev, enabled } : null)
        toast.success(enabled ? 'Face verification enabled' : 'Face verification disabled')
      } else {
        toast.error('Failed to update face verification settings')
      }
    } catch {
      toast.error('Failed to update face verification settings')
    }
  }

  const handleDeleteFaceData = async () => {
    if (!confirm('Are you sure you want to delete your face verification data? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/face-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete'
        })
      })

      if (response.ok) {
        setFaceVerificationStatus({
          enabled: false,
          verified: false
        })
        toast.success('Face verification data deleted successfully')
      } else {
        toast.error('Failed to delete face verification data')
      }
    } catch {
      toast.error('Failed to delete face verification data')
    }
  }

  const handleEnrollmentSuccess = (faceId: string) => {
    setFaceVerificationStatus({
      enabled: true,
      verified: true,
      faceId,
      enrollmentDate: new Date().toISOString()
    })
    setShowEnrollment(false)
    toast.success('Face enrollment completed successfully!')
  }

  const handleVerificationSuccess = (confidence: number) => {
    setShowVerification(false)
    toast.success(`Face verification successful! Confidence: ${confidence.toFixed(2)}%`)
  }

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <Spinner className="w-6 h-6 mx-auto mb-2" />
          <p className="text-gray-600">Loading face verification settings...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Face Verification</h3>
            <p className="text-sm text-gray-600">
              Secure your account with face verification for quick and secure access
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={faceVerificationStatus?.enabled || false}
              onCheckedChange={handleToggleFaceVerification}
              disabled={!faceVerificationStatus?.verified}
            />
            <span className="text-sm text-gray-600">
              {faceVerificationStatus?.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {faceVerificationStatus?.verified ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 font-medium">Face verification is set up</span>
              </div>
              {faceVerificationStatus.enrollmentDate && (
                <p className="text-sm text-green-700 mt-1">
                  Enrolled on {new Date(faceVerificationStatus.enrollmentDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowVerification(true)}
                variant="outline"
                size="sm"
              >
                Test Verification
              </Button>
              <Button
                onClick={handleDeleteFaceData}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Delete Face Data
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-yellow-800 font-medium">Face verification not set up</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Set up face verification to enable secure login with your face
              </p>
            </div>

            <Button
              onClick={() => setShowEnrollment(true)}
              size="sm"
            >
              Set Up Face Verification
            </Button>
          </div>
        )}
      </Card>

      {/* Face Enrollment Modal */}
      {showEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Set Up Face Verification</h3>
                <Button
                  onClick={() => setShowEnrollment(false)}
                  variant="ghost"
                  size="sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <FaceEnrollment
                onSuccess={handleEnrollmentSuccess}
                onError={(error) => toast.error(error)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Face Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Test Face Verification</h3>
                <Button
                  onClick={() => setShowVerification(false)}
                  variant="ghost"
                  size="sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <FaceVerification
                onSuccess={handleVerificationSuccess}
                onError={(error) => toast.error(error)}
                onCancel={() => setShowVerification(false)}
                title="Test Face Verification"
                description="Please look at the camera to test your face verification."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 