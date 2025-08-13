import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

interface VerificationMetadata {
  emailVerified?: boolean
  phoneVerified?: boolean
  identityVerified?: boolean
  kycCompleted?: boolean
  verificationDocuments?: unknown[]
  verificationStatus?: string
  faceVerified?: boolean
  faceVerificationEnabled?: boolean
  faceId?: string
  faceEnrollmentDate?: string
}

interface UserMetadata {
  verification?: VerificationMetadata
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, faceId } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Get current user metadata
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const currentMetadata = user.privateMetadata as UserMetadata || {}
    
    // Ensure verification object exists
    if (!currentMetadata.verification) {
      currentMetadata.verification = {
        emailVerified: false,
        phoneVerified: false,
        identityVerified: false,
        kycCompleted: false,
        verificationDocuments: [],
        verificationStatus: 'pending',
        faceVerified: false,
        faceVerificationEnabled: false
      }
    }

    switch (action) {
      case 'enroll':
        if (!faceId) {
          return NextResponse.json(
            { error: 'Face ID is required for enrollment' },
            { status: 400 }
          )
        }

        // Update user metadata with face verification data
        const updatedMetadata = {
          ...currentMetadata,
          verification: {
            ...currentMetadata.verification,
            faceVerified: true,
            faceId: faceId,
            faceEnrollmentDate: new Date().toISOString(),
            faceVerificationEnabled: true
          }
        }

        await clerk.users.updateUser(userId, {
          privateMetadata: updatedMetadata
        })

        return NextResponse.json({
          success: true,
          message: 'Face enrollment completed successfully',
          faceId: faceId
        })

      case 'verify':
        // Check if user has face verification enabled
        if (!currentMetadata.verification?.faceVerificationEnabled) {
          return NextResponse.json(
            { error: 'Face verification not enabled for this user' },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Face verification check completed',
          faceVerified: currentMetadata.verification?.faceVerified || false
        })

      case 'enable':
        // Enable face verification
        const enabledMetadata = {
          ...currentMetadata,
          verification: {
            ...currentMetadata.verification,
            faceVerificationEnabled: true
          }
        }

        await clerk.users.updateUser(userId, {
          privateMetadata: enabledMetadata
        })

        return NextResponse.json({
          success: true,
          message: 'Face verification enabled successfully'
        })

      case 'disable':
        // Disable face verification
        const disabledMetadata = {
          ...currentMetadata,
          verification: {
            ...currentMetadata.verification,
            faceVerificationEnabled: false
          }
        }

        await clerk.users.updateUser(userId, {
          privateMetadata: disabledMetadata
        })

        return NextResponse.json({
          success: true,
          message: 'Face verification disabled successfully'
        })

      case 'delete':
        // Delete face verification data
        const cleanedMetadata = {
          ...currentMetadata,
          verification: {
            ...currentMetadata.verification,
            faceVerified: false,
            faceId: undefined,
            faceEnrollmentDate: undefined,
            faceVerificationEnabled: false
          }
        }

        await clerk.users.updateUser(userId, {
          privateMetadata: cleanedMetadata
        })

        return NextResponse.json({
          success: true,
          message: 'Face verification data deleted successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Face verification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's face verification status
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const metadata = user.privateMetadata as UserMetadata || {}

    return NextResponse.json({
      success: true,
      faceVerification: {
        enabled: metadata.verification?.faceVerificationEnabled || false,
        verified: metadata.verification?.faceVerified || false,
        faceId: metadata.verification?.faceId,
        enrollmentDate: metadata.verification?.faceEnrollmentDate
      }
    })
  } catch (error) {
    console.error('Face verification status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 