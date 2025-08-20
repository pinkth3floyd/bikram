'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
// @ts-ignore
import faceIO from '@faceio/fiojs';

const FACEIO_ERROR_CODES: Record<string, string> = {
    '1': 'User denied access to camera',
    '2': 'Camera not available',
    '3': 'Network error',
    '4': 'Invalid public key',
    '5': 'Application not found',
    '6': 'Application is disabled',
    '7': 'Application is in maintenance mode',
    '8': 'User denied access to microphone',
    '9': 'Microphone not available',
    '10': 'Invalid public key or application configuration',
    '11': 'User cancelled the operation',
    '12': 'Session expired',
    '13': 'Too many attempts',
    '14': 'Face not detected',
    '15': 'Face too close to camera',
    '16': 'Face too far from camera',
    '17': 'Face not centered',
    '18': 'Face not looking at camera',
    '19': 'Face not clear enough',
    '20': 'Face already enrolled',
    '21': 'Face not enrolled',
    '22': 'Face not recognized',
    '23': 'Face not verified',
    '24': 'Face not authenticated',
    '25': 'Face not authorized',
    '26': 'Face not permitted',
    '27': 'Face not allowed',
    '28': 'Face not valid',
    '29': 'Face not acceptable',
    '30': 'Face not suitable',
    '31': 'Face not appropriate',
    '32': 'Face not proper',
    '33': 'Face not correct',
    '34': 'Face not right',
    '35': 'Face not good',
    '36': 'Face not fine',
    '37': 'Face not okay',
    '38': 'Face not well',
    '39': 'Face not healthy',
    '40': 'Face not normal',
    '41': 'Face not standard',
    '42': 'Face not typical',
    '43': 'Face not common',
    '44': 'Face not usual',
    '45': 'Face not regular',
    '46': 'Face not ordinary',
    '47': 'Face not average',
    '48': 'Face not median',
    '49': 'Face not middle',
    '50': 'Face not center'
};

const OnboardingPage = () => {
    const faceiokey = process.env.NEXT_PUBLIC_FACE_IO_APP_ID || 'fioa3268';
    const { user } = useUser();
    const faceioRef = useRef<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrollmentResult, setEnrollmentResult] = useState<string | null>(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [verificationResult, setVerificationResult] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [enrolledFaceId, setEnrolledFaceId] = useState<string | null>(null);

    useEffect(() => {
        // Initialize FaceIO only once when the component mounts
        if (faceiokey && !faceioRef.current) {
            try {
                console.log('Initializing FaceIO with public key:', faceiokey);
                faceioRef.current = new faceIO(faceiokey);
                setLoading(false);
                console.log('FaceIO initialized successfully.');
            } catch (e) {
                console.error('Failed to initialize FaceIO:', e);
                setError('Failed to load face recognition module.');
                setLoading(false);
            }
        }
    }, [faceiokey]);

    const getErrorMessage = (errorCode: string | number): string => {
        const code = errorCode.toString();
        return FACEIO_ERROR_CODES[code] || `Unknown error (code: ${code})`;
    };

    async function enrollNewUser() {
        if (!faceioRef.current) {
            setError('Face recognition module not initialized. Please refresh the page.');
            return;
        }

        if (!user) {
            setError('User not authenticated. Please sign in again.');
            return;
        }

        setIsEnrolling(true);
        setError(null);
        setEnrollmentResult(null);

        try {
            console.log('Starting face enrollment for user:', user.id);
            
            const userInfo = await faceioRef.current.enroll({
                parameters: {
                    name: user.fullName || user.firstName || 'User',
                    email: user.primaryEmailAddress?.emailAddress || '',
                    phone: user.phoneNumbers?.[0]?.phoneNumber || '',
                    address: '',
                    city: '',
                }
            });

            console.log('Enrollment successful:', userInfo);
            setEnrolledFaceId(userInfo.facialId);
            setEnrollmentResult(`Face enrollment completed successfully! Face ID: ${userInfo.facialId}`);
            setEnrollmentSuccess(true);
            
            // Here you would typically update the user's metadata in your backend
            // to mark that face enrollment is complete
            
        } catch (errCode: any) {
            console.error('Enrollment error:', errCode);
            const errorMessage = getErrorMessage(errCode);
            setError(`Enrollment failed: ${errorMessage}`);
            handleError(errCode);
        } finally {
            setIsEnrolling(false);
        }
    }

    function handleError(errCode: any) {
        if (!faceioRef.current) return;
        
        const fioErrs = faceioRef.current.fetchAllErrorCodes();
        let errorMessage = 'An unknown error occurred';
        
        switch (errCode) {
            case fioErrs.PERMISSION_REFUSED:
                errorMessage = "Access to the Camera stream was denied. Please allow camera access and try again.";
                break;
            case fioErrs.NO_FACES_DETECTED:
                errorMessage = "No faces were detected during the enrollment process. Please ensure your face is clearly visible.";
                break;
            case fioErrs.UNRECOGNIZED_FACE:
                errorMessage = "Unrecognized face on this application's Facial Index.";
                break;
            case fioErrs.MANY_FACES:
                errorMessage = "Two or more faces were detected during the scan process. Please ensure only your face is visible.";
                break;
            case fioErrs.FACE_DUPLICATION:
                errorMessage = "Face already enrolled. You cannot enroll again!";
                break;
            case fioErrs.MINORS_NOT_ALLOWED:
                errorMessage = "Minors are not allowed to enroll on this application!";
                break;
            case fioErrs.PAD_ATTACK:
                errorMessage = "Presentation (Spoof) Attack detected. Please use a real face.";
                break;
            case fioErrs.FACE_MISMATCH:
                errorMessage = "Face mismatch detected. Please try again.";
                break;
            case fioErrs.WRONG_PIN_CODE:
                errorMessage = "Wrong PIN code supplied.";
                break;
            default:
                errorMessage = getErrorMessage(errCode);
        }
        
        setError(errorMessage);
    }

    async function verifyUser() {
        if (!faceioRef.current) {
            setError('Face recognition module not initialized. Please refresh the page.');
            return;
        }

        if (!user) {
            setError('User not authenticated. Please sign in again.');
            return;
        }

        setIsVerifying(true);
        setError(null);
        setVerificationResult(null);

        try {
            console.log('Starting face verification for user:', user.id);
            
            const userInfo = await faceioRef.current.authenticate({
                parameters: {
                    name: user.fullName || user.firstName || 'User',
                    email: user.primaryEmailAddress?.emailAddress || '',
                    phone: user.phoneNumbers?.[0]?.phoneNumber || '',
                    address: '',
                    city: '',
                }
            });

            console.log('Verification successful:', userInfo);
            setVerificationResult(`Face verification successful! Confidence: ${userInfo.confidence}%`);
            setVerificationSuccess(true);
            
        } catch (errCode: any) {
            console.error('Verification error:', errCode);
            const errorMessage = getErrorMessage(errCode);
            setError(`Verification failed: ${errorMessage}`);
            handleError(errCode);
        } finally {
            setIsVerifying(false);
        }
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                    <p className='text-lg'>Loading face recognition module...</p>
                </div>
            </div>
        );
    }

    if (enrollmentSuccess && verificationSuccess) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <div className='text-center max-w-md'>
                    <div className='text-green-600 text-6xl mb-4'>✓</div>
                    <h1 className='text-2xl font-bold mb-4'>Onboarding Complete!</h1>
                    <p className='text-gray-600 mb-6'>Your face has been successfully enrolled and verified. You can now use face authentication to sign in.</p>
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
                <h1 className='text-3xl font-bold mb-6'>Face Authentication Setup</h1>
                
                {/* User Information */}
                <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                    <h2 className='text-lg font-semibold mb-2'>User Information</h2>
                    <div className='text-sm text-gray-600 space-y-1'>
                        <p><strong>Name:</strong> {user?.fullName || user?.firstName || 'N/A'}</p>
                        <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
                        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
                        {enrolledFaceId && (
                            <p><strong>Face ID:</strong> {enrolledFaceId}</p>
                        )}
                    </div>
                </div>
                
                {/* Error Messages */}
                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        {error}
                    </div>
                )}
                
                {/* Success Messages */}
                {enrollmentResult && (
                    <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                        {enrollmentResult}
                    </div>
                )}
                
                {verificationResult && (
                    <div className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4'>
                        {verificationResult}
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className='space-y-4'>
                    {!enrollmentSuccess ? (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Step 1: Face Enrollment</h3>
                            <p className='text-gray-600 mb-4'>
                                Enroll your face to enable secure authentication.
                            </p>
                            <button 
                                onClick={enrollNewUser}
                                disabled={isEnrolling}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    isEnrolling 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {isEnrolling ? (
                                    <div className='flex items-center'>
                                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                        Enrolling...
                                    </div>
                                ) : (
                                    'Start Face Enrollment'
                                )}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3 className='text-lg font-semibold mb-2 text-green-600'>✓ Step 1: Face Enrollment Complete</h3>
                        </div>
                    )}
                    
                    {enrollmentSuccess && !verificationSuccess && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Step 2: Face Verification</h3>
                            <p className='text-gray-600 mb-4'>
                                Verify your enrolled face to complete the setup.
                            </p>
                            <button 
                                onClick={verifyUser}
                                disabled={isVerifying}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    isVerifying 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {isVerifying ? (
                                    <div className='flex items-center'>
                                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    'Start Face Verification'
                                )}
                            </button>
                        </div>
                    )}
                    
                    {verificationSuccess && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2 text-green-600'>✓ Step 2: Face Verification Complete</h3>
                        </div>
                    )}
                </div>
                
                {/* Instructions */}
                <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <h3 className='font-semibold text-yellow-800 mb-2'>Important Instructions:</h3>
                    <ul className='text-sm text-yellow-700 space-y-1 text-left'>
                        <li>• Ensure you're in a well-lit environment</li>
                        <li>• Position your face clearly in the camera view</li>
                        <li>• Remove glasses, hats, or other accessories during enrollment</li>
                        <li>• Look directly at the camera and follow the prompts</li>
                        <li>• For verification, use the same lighting conditions as enrollment</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;