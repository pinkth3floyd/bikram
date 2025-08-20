import { clerkClient } from '@clerk/nextjs/server';
// @ts-expect-error - FaceIO types not available
import faceIO from '@faceio/fiojs';

export interface FaceEnrollmentResult {
  success: boolean;
  faceId?: string;
  error?: string;
  confidence?: number;
}

export interface FaceVerificationResult {
  success: boolean;
  verified: boolean;
  confidence?: number;
  error?: string;
}

export interface FaceIOError {
  code: string;
  message: string;
}

// Define proper types for Clerk user metadata
interface UserVerificationMetadata {
  faceVerified?: boolean;
  faceId?: string;
  faceEnrollmentDate?: string;
  faceVerificationEnabled?: boolean;
}

interface UserPrivateMetadata {
  verification?: UserVerificationMetadata;
  updatedAt?: string;
  [key: string]: unknown;
}

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

export class FaceIOService {
  private faceio: typeof faceIO | null = null;
  private appId: string;

  constructor(appId?: string) {
    this.appId = appId || process.env.NEXT_PUBLIC_FACE_IO_APP_ID || 'fioa3268';
  }

  private getErrorMessage(errorCode: string | number): string {
    const code = errorCode.toString();
    return FACEIO_ERROR_CODES[code] || `Unknown error (code: ${code})`;
  }

  private async initializeFaceIO(): Promise<void> {
    if (this.faceio) return;

    try {
      console.log('Initializing FaceIO with public key:', this.appId);
      this.faceio = new faceIO(this.appId);
      console.log('FaceIO initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize FaceIO:', error);
      throw new Error('Failed to initialize face recognition module');
    }
  }

  async updateUserMetadata(userId: string, faceId: string, faceVerified: boolean = false): Promise<void> {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const currentMetadata = user.privateMetadata as UserPrivateMetadata;

      const updatedMetadata: UserPrivateMetadata = {
        ...currentMetadata,
        verification: {
          ...currentMetadata?.verification,
          faceVerified,
          faceId,
          faceEnrollmentDate: new Date().toISOString(),
          faceVerificationEnabled: true
        },
        updatedAt: new Date().toISOString()
      };

      await clerk.users.updateUser(userId, {
        privateMetadata: updatedMetadata
      });

      console.log('User metadata updated successfully for face enrollment');
    } catch (error) {
      console.error('Failed to update user metadata:', error);
      throw new Error('Failed to update user metadata');
    }
  }

  async enrollUser(userId: string, userEmail: string, userName: string): Promise<FaceEnrollmentResult> {
    try {
      await this.initializeFaceIO();

      if (!this.faceio) {
        return {
          success: false,
          error: 'Face recognition module not initialized'
        };
      }

      console.log('Starting face enrollment for user:', userId);

      const userInfo = await this.faceio.enroll({
        parameters: {
          name: userName,
          email: userEmail,
          phone: '',
          address: '',
          city: '',
        }
      });

      console.log('Face enrollment successful:', userInfo);

      // Update user metadata with face ID
      await this.updateUserMetadata(userId, userInfo.facialId, false);

      return {
        success: true,
        faceId: userInfo.facialId,
        confidence: userInfo.confidence
      };

    } catch (error: unknown) {
      console.error('Face enrollment failed:', error);
      
      const errorCode = String(error);
      const errorMessage = this.getErrorMessage(errorCode);
      
      return {
        success: false,
        error: `Enrollment failed: ${errorMessage}`
      };
    }
  }

  async verifyUser(userId: string, userEmail: string, userName: string): Promise<FaceVerificationResult> {
    try {
      await this.initializeFaceIO();

      if (!this.faceio) {
        return {
          success: false,
          verified: false,
          error: 'Face recognition module not initialized'
        };
      }

      console.log('Starting face verification for user:', userId);

      const userInfo = await this.faceio.authenticate({
        parameters: {
          name: userName,
          email: userEmail,
          phone: '',
          address: '',
          city: '',
        }
      });

      console.log('Face verification successful:', userInfo);

      // Update user metadata to mark face as verified
      await this.updateUserMetadata(userId, userInfo.facialId, true);

      return {
        success: true,
        verified: true,
        confidence: userInfo.confidence
      };

    } catch (error: unknown) {
      console.error('Face verification failed:', error);
      
      const errorCode = String(error);
      const errorMessage = this.getErrorMessage(errorCode);
      
      return {
        success: false,
        verified: false,
        error: `Verification failed: ${errorMessage}`
      };
    }
  }

  async deleteUserFace(userId: string, faceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.initializeFaceIO();

      if (!this.faceio) {
        return {
          success: false,
          error: 'Face recognition module not initialized'
        };
      }

      await this.faceio.delete(faceId);

      // Update user metadata to remove face verification
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const currentMetadata = user.privateMetadata as UserPrivateMetadata;

      const updatedMetadata: UserPrivateMetadata = {
        ...currentMetadata,
        verification: {
          ...currentMetadata?.verification,
          faceVerified: false,
          faceId: undefined,
          faceEnrollmentDate: undefined,
          faceVerificationEnabled: false
        },
        updatedAt: new Date().toISOString()
      };

      await clerk.users.updateUser(userId, {
        privateMetadata: updatedMetadata
      });

      return { success: true };

    } catch (error: unknown) {
      console.error('Face deletion failed:', error);
      
      const errorCode = String(error);
      const errorMessage = this.getErrorMessage(errorCode);
      
      return {
        success: false,
        error: `Deletion failed: ${errorMessage}`
      };
    }
  }

  async getUserFaceStatus(userId: string): Promise<{
    faceVerified: boolean;
    faceId?: string;
    faceEnrollmentDate?: string;
    faceVerificationEnabled: boolean;
  }> {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const metadata = user.privateMetadata as UserPrivateMetadata;

      return {
        faceVerified: metadata?.verification?.faceVerified || false,
        faceId: metadata?.verification?.faceId,
        faceEnrollmentDate: metadata?.verification?.faceEnrollmentDate,
        faceVerificationEnabled: metadata?.verification?.faceVerificationEnabled || false
      };
    } catch (error) {
      console.error('Failed to get user face status:', error);
      return {
        faceVerified: false,
        faceVerificationEnabled: false
      };
    }
  }

  isInitialized(): boolean {
    return this.faceio !== null;
  }
}
