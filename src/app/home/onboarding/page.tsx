'use client'
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaceEnrollment } from '@/modules/user/components/FaceEnrollment';

const OnboardingPage = () => {
  const { user } = useUser();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleEnrollmentComplete = (faceId: string) => {
    console.log('Face enrollment completed with ID:', faceId);
  };

  const handleVerificationComplete = (confidence: number) => {
    console.log('Face verification completed with confidence:', confidence);
    setOnboardingComplete(true);
  };

  const handleError = (error: string) => {
    console.error('Face enrollment/verification error:', error);
  };

  const handleProceedToVerification = () => {
    console.log('Proceeding to verification...');
    // Force the component to show verification step
    // This will be handled by the FaceEnrollment component
  };

  if (onboardingComplete) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='text-center max-w-md'>
          <div className='text-green-600 text-6xl mb-4'>✓</div>
          <h1 className='text-2xl font-bold mb-4'>Onboarding Complete!</h1>
          <p className='text-gray-600 mb-6'>
            Your face has been successfully enrolled and verified. You can now use face authentication to sign in.
          </p>
          <button 
            onClick={() => window.location.href = '/home'}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

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