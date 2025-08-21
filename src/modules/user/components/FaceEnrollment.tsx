"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
// @ts-expect-error - FaceIO types not available
import faceIO from "@faceio/fiojs";
import {
  useFaceEnrollment,
  useFaceVerification,
  useFaceVerificationStatus,
} from "../hooks/useFaceEnrollment";

interface FaceEnrollmentProps {
  onEnrollmentComplete?: (faceId: string) => void;
  onVerificationComplete?: (confidence: number) => void;
  onError?: (error: string) => void;
  onProceedToVerification?: () => void;
  showVerification?: boolean;
  verificationOnly?: boolean; // New prop to show only verification
  className?: string;
}

const FACEIO_ERROR_CODES: Record<string, string> = {
  "1": "User denied access to camera",
  "2": "Camera not available",
  "3": "Network error",
  "4": "Invalid public key",
  "5": "Application not found",
  "6": "Application is disabled",
  "7": "Application is in maintenance mode",
  "8": "User denied access to microphone",
  "9": "Microphone not available",
  "10": "Invalid public key or application configuration",
  "11": "User cancelled the operation",
  "12": "Session expired",
  "13": "Too many attempts",
  "14": "Face not detected",
  "15": "Face too close to camera",
  "16": "Face too far from camera",
  "17": "Face not centered",
  "18": "Face not looking at camera",
  "19": "Face not clear enough",
  "20": "Face already enrolled",
  "21": "Face not enrolled",
  "22": "Face not recognized",
  "23": "Face not verified",
  "24": "Face not authenticated",
  "25": "Face not authorized",
  "26": "Face not permitted",
  "27": "Face not allowed",
  "28": "Face not valid",
  "29": "Face not acceptable",
  "30": "Face not suitable",
  "31": "Face not appropriate",
  "32": "Face not proper",
  "33": "Face not correct",
  "34": "Face not right",
  "35": "Face not good",
  "36": "Face not fine",
  "37": "Face not okay",
  "38": "Face not well",
  "39": "Face not healthy",
  "40": "Face not normal",
  "41": "Face not standard",
  "42": "Face not typical",
  "43": "Face not common",
  "44": "Face not usual",
  "45": "Face not regular",
  "46": "Face not ordinary",
  "47": "Face not average",
  "48": "Face not median",
  "49": "Face not middle",
  "50": "Face not center",
};

export const FaceEnrollment: React.FC<FaceEnrollmentProps> = ({
  onEnrollmentComplete,
  onVerificationComplete,
  onError,
  onProceedToVerification,
  showVerification = false,
  verificationOnly = false,
  className = "",
}) => {
  const { user } = useUser();
  const faceioRef = useRef<typeof faceIO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Hooks for face enrollment and verification
  const {
    faceVerified,
    faceId,
    faceVerificationEnabled,
    isLoading: statusLoading,
  } = useFaceVerificationStatus();
  const enrollmentMutation = useFaceEnrollment();
  const verificationMutation = useFaceVerification();

  // Check if user might already be enrolled
  const isAlreadyEnrolled = faceVerificationEnabled || false;

  const faceiokey = process.env.NEXT_PUBLIC_FACE_IO_APP_ID || "fioa3268";

  useEffect(() => {
    // Initialize FaceIO only once when the component mounts
    if (faceiokey && !faceioRef.current) {
      try {
        console.log("Initializing FaceIO with public key:", faceiokey);
        faceioRef.current = new faceIO(faceiokey);
        setLoading(false);
        console.log("FaceIO initialized successfully.");
      } catch (e) {
        console.error("Failed to initialize FaceIO:", e);
        setError("Failed to load face recognition module.");
        setLoading(false);
      }
    }
  }, [faceiokey]);

  const getErrorMessage = (errorCode: string | number): string => {
    const code = errorCode.toString();
    return FACEIO_ERROR_CODES[code] || `Unknown error (code: ${code})`;
  };

  const handleFaceAlreadyEnrolled = () => {
    const errorMsg =
      "Face already enrolled. You can proceed to verification or contact support if you need to re-enroll.";
    setError(errorMsg);
    onError?.(errorMsg);
  };

  async function enrollNewUser() {
    if (!faceioRef.current) {
      const errorMsg =
        "Face recognition module not initialized. Please refresh the page.";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!user) {
      const errorMsg = "User not authenticated. Please sign in again.";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setError(null);

    try {
      console.log("Starting face enrollment for user:", user.id);
      console.log("Enrollment parameters:", {
        name: user.fullName || user.firstName || "User",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "",
      });

      const userInfo = await faceioRef.current.enroll({
        parameters: {
          name: user.fullName || user.firstName || "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: user.phoneNumbers?.[0]?.phoneNumber || "",
          address: "",
          city: "",
        },
      });

      console.log("Enrollment successful:", userInfo);

      // Call server action to update user metadata
      const result = await enrollmentMutation.mutateAsync(userInfo.facialId);

      if (result.success) {
        onEnrollmentComplete?.(userInfo.facialId);
      } else {
        throw new Error(result.error || "Failed to update user metadata");
      }
    } catch (errCode: unknown) {
      console.error("Enrollment error:", errCode);
      console.error("Error type:", typeof errCode);
      console.error("Error details:", errCode);

      // Check if it's a FaceIO error with specific error codes
      if (faceioRef.current && typeof errCode === "string") {
        const fioErrs = faceioRef.current.fetchAllErrorCodes();
        console.error("FaceIO error codes:", fioErrs);

        // Handle specific FaceIO errors
        if (errCode === fioErrs.FACE_DUPLICATION || errCode === "21") {
          handleFaceAlreadyEnrolled();
          return;
        }
      }

      const errorMessage = getErrorMessage(String(errCode));
      const fullError = `Enrollment failed: ${errorMessage}`;
      setError(fullError);
      onError?.(fullError);
    }
  }

  async function verifyUser() {
    if (!faceioRef.current) {
      const errorMsg =
        "Face recognition module not initialized. Please refresh the page.";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!user) {
      const errorMsg = "User not authenticated. Please sign in again.";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setError(null);
    setDebugInfo("Starting face verification process...");

    try {
      console.log("Starting face verification for user:", user.id);

      const userInfo = await faceioRef.current.authenticate({
        parameters: {
          name: user.fullName || user.firstName || "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: user.phoneNumbers?.[0]?.phoneNumber || "",
          address: "",
          city: "",
        },
      });

      console.log("Verification successful:", userInfo);
      setDebugInfo(
        `Verification successful! Confidence: ${userInfo.confidence}%, Face ID: ${userInfo.facialId}`,
      );

      // Call server action to update user verification
      const result = await verificationMutation.mutateAsync(userInfo.facialId);

      if (result.success && result.verified) {
        setDebugInfo(
          `Server verification successful! Confidence: ${userInfo.confidence}%`,
        );
        onVerificationComplete?.(userInfo.confidence);
      } else {
        throw new Error(result.error || "Failed to update user verification");
      }
    } catch (errCode: unknown) {
      console.error("Verification error:", errCode);
      const errorMessage = getErrorMessage(String(errCode));
      const fullError = `Verification failed: ${errorMessage}`;
      setError(fullError);
      setDebugInfo(`Debug: Error code ${errCode} - ${errorMessage}`);
      onError?.(fullError);
    }
  }

  if (loading || statusLoading) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 ${className}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm text-black">Loading face recognition...</p>
      </div>
    );
  }

  if (error) {
    const isAlreadyEnrolled =
      error.includes("already enrolled") || error.includes("Face not enrolled");

    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="space-y-2">
          {isAlreadyEnrolled ? (
            <>
              <button
                onClick={() => {
                  setError(null);
                  setDebugInfo(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mr-2"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setDebugInfo(null);
                  onProceedToVerification?.();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Proceed to Verification
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setError(null);
                setDebugInfo(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Display for Debugging */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">
          Current Status:
        </h4>
        <div className="text-xs text-gray-700 space-y-1">
          <p>
            • Enrollment Status:{" "}
            {faceVerificationEnabled ? "✅ Enabled" : "❌ Not Enabled"}
          </p>
          <p>
            • Verification Status:{" "}
            {faceVerified ? "✅ Verified" : "❌ Not Verified"}
          </p>
          <p>• Face ID: {faceId || "Not available"}</p>
          <p>• User ID: {user?.id || "Not available"}</p>
        </div>
      </div>
      {/* Verification Only Mode */}
      {verificationOnly ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Face Verification</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Verify your enrolled face to complete the setup.
          </p>
          <button
            onClick={verifyUser}
            disabled={verificationMutation.isPending}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              verificationMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {verificationMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Start Face Verification"
            )}
          </button>
        </div>
      ) : (
        <>
          {/* Enrollment Section */}
          {!faceVerificationEnabled ? (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-black">
                Face Enrollment
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Enroll your face to enable secure authentication.
              </p>
              {isAlreadyEnrolled && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">
                    <strong>Note:</strong> It appears you may already be
                    enrolled. If enrollment fails, you can proceed to
                    verification.
                  </p>
                </div>
              )}
              <button
                onClick={enrollNewUser}
                disabled={enrollmentMutation.isPending}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  enrollmentMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {enrollmentMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enrolling...
                  </div>
                ) : (
                  "Start Face Enrollment"
                )}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Face Enrollment Complete
              </h3>
              {faceId && (
                <p className="text-sm text-gray-600">Face ID: {faceId}</p>
              )}
            </div>
          )}

          {/* Debug Verification Button - Always visible for debugging */}
          <div className="text-center mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">
              Debug Verification
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Use this button to test face verification regardless of enrollment
              status.
            </p>
            <button
              onClick={verifyUser}
              disabled={verificationMutation.isPending}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                verificationMutation.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {verificationMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Debug: Verify Face Now"
              )}
            </button>
          </div>

          {/* Verification Section */}
          {showVerification && faceVerificationEnabled && !faceVerified && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-black">
                Face Verification
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Verify your enrolled face to complete the setup.
              </p>
              <button
                onClick={verifyUser}
                disabled={verificationMutation.isPending}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  verificationMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {verificationMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Start Face Verification"
                )}
              </button>
            </div>
          )}
        </>
      )}

      {faceVerified && (
        <div className="text-center">
          <div className="text-green-600 text-2xl mb-2">✓</div>
          <h3 className="text-lg font-semibold text-green-600">
            Face Verification Complete
          </h3>
        </div>
      )}

      {/* Debug Information */}
      {debugInfo && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2 text-sm">
            Debug Info:
          </h4>
          <p className="text-xs text-blue-700">{debugInfo}</p>
          <button
            onClick={() => setDebugInfo(null)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Clear Debug Info
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
          Instructions:
        </h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Ensure you&apos;re in a well-lit environment</li>
          <li>• Position your face clearly in the camera view</li>
          <li>• Remove glasses, hats, or other accessories</li>
          <li>• Look directly at the camera and follow the prompts</li>
        </ul>
      </div>
    </div>
  );
};
