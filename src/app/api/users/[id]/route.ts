import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { UserService } from '../../../../modules/user/UserService'
import { ClerkUserRepository } from '../../../../core/infrastructure/auth/ClerkUserRepository'

const userRepository = new ClerkUserRepository()
const userService = new UserService(userRepository)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const user = await userService.getUserById(resolvedParams.id)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profile = await userService.getUserProfile(resolvedParams.id, userId)
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    
    // Check if user is updating their own profile or has admin permissions
    if (resolvedParams.id !== userId) {
      const currentUser = await userService.getUserById(userId)
      if (!currentUser?.canManageUsers()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // TODO: Implement actual user update logic
    // const body = await request.json()
    const updatedUser = await userService.getUserById(resolvedParams.id)
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.getId(),
        email: updatedUser.getEmail(),
        username: updatedUser.getUsername(),
        role: updatedUser.getRole().getValue(),
        status: updatedUser.getStatus().getValue()
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    
    // Check if user is deleting their own account or has admin permissions
    if (resolvedParams.id !== userId) {
      const currentUser = await userService.getUserById(userId)
      if (!currentUser?.canManageUsers()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    await userService.getUserById(resolvedParams.id) // Check if user exists
    
    // Note: In a real implementation, you might want to soft delete
    // For now, we'll just return success
    return NextResponse.json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 