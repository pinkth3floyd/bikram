'use client'
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaceEnrollment } from '@/modules/user/components/FaceEnrollment';
import { useFaceVerificationStatus } from '@/modules/user/hooks/useFaceEnrollment';

const OnboardingPage = () => {
  const { user } = useUser();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showVerificationOnly, setShowVerificationOnly] = useState(false);
  
  // Get face verification status
  const { 
    faceVerified, 
    faceId, 
    faceVerificationEnabled, 
    isLoading: statusLoading,
    isComplete 
  } = useFaceVerificationStatus();

  const handleEnrollmentComplete = (faceId: string) => {
    console.log('Face enrollment completed with ID:', faceId);
    // After enrollment, show verification step
    setShowVerificationOnly(true);
  };

  const handleVerificationComplete = (confidence: number) => {
    console.log('Face verification completed wi;th confidence:', confidence);
    setOnboardingComplete(true);
  };

  const handleError = (error: string) => {
    console.error('Face enrollment/verification error:', error);
  };

  const handleProceedToVerification = () => {
    console.log('Proceeding to verification...');
    setShowVerificationOnly(true);
  };



  const handleGoToHome = () => {
    window.location.href = '/home';
  };

  // Show loading state while checking user status
  if (statusLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <div className='text-center max-w-md'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4 mx-auto'></div>
          <p className='text-gray-600'>Checking your face authentication status...</p>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (onboardingComplete || isComplete) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='text-center max-w-md'>
          <div className='text-green-600 text-6xl mb-4'>✓</div>
          <h1 className='text-2xl font-bold mb-4 text-black'>Onboarding Complete!</h1>
          <p className='text-gray-600 mb-6'>
            Your face has been successfully enrolled and verified. You can now use face authentication to sign in.
          </p>
          <button 
            onClick={handleGoToHome}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

  // Show verification-only flow for enrolled users
  if (showVerificationOnly || (faceVerificationEnabled && !faceVerified)) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <div className='text-center max-w-2xl w-full'>
          <h1 className='text-3xl font-bold mb-6 text-black'>Face Verification</h1>
          
          {/* User Information */}
          <div className='bg-gray-50 rounded-lg p-4 mb-6'>
            <h2 className='text-lg font-semibold mb-2 text-black'>User Information</h2>
            <div className='text-sm text-gray-600 space-y-1'>
              <p><strong>Name:</strong> {user?.fullName || user?.firstName || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
              <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
              {faceId && <p><strong>Face ID:</strong> {faceId}</p>}
            </div>
          </div>

          {/* Face Verification Status */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-center mb-2'>
              <div className='text-blue-600 text-2xl mr-2'>✓</div>
              <h3 className='text-lg font-semibold text-blue-800'>Face Already Enrolled</h3>
            </div>
            <p className='text-blue-700 text-sm'>
              Your face has been enrolled. Please verify your identity to complete the setup.
            </p>
          </div>
          
          {/* Face Verification Component */}
          <FaceEnrollment
            onEnrollmentComplete={handleEnrollmentComplete}
            onVerificationComplete={handleVerificationComplete}
            onError={handleError}
            onProceedToVerification={handleProceedToVerification}
            showVerification={true}
            verificationOnly={true}
            className='max-w-md mx-auto'
          />
        </div>
      </div>
    );
  }

  // Show enrollment flow for new users
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='text-center max-w-2xl w-full'>
        <h1 className='text-3xl font-bold mb-6 text-black'>Face Authentication Setup</h1>
        
        {/* User Information */}
        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <h2 className='text-lg font-semibold mb-2 text-black'>User Information</h2>
          <div className='text-sm text-gray-600 space-y-1'>
            <p><strong>Name:</strong> {user?.fullName || user?.firstName || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          </div>
        </div>

        {/* New User Welcome */}
        <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
          <div className='flex items-center justify-center mb-2'>
            <div className='text-green-600 text-2xl mr-2'>👋</div>
            <h3 className='text-lg font-semibold text-green-800'>Welcome to Face Authentication</h3>
          </div>
          <p className='text-green-700 text-sm'>
            Set up face authentication to enable secure and convenient sign-in to your account.
          </p>
        </div>
        
        {/* Face Enrollment Component */}
        <FaceEnrollment
          onEnrollmentComplete={handleEnrollmentComplete}
          onVerificationComplete={handleVerificationComplete}
          onError={handleError}
          onProceedToVerification={handleProceedToVerification}
          showVerification={true}
          className='max-w-md mx-auto'
        />
      </div>
    </div>
  );
};

export default OnboardingPage;