import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { UserService } from '../../../modules/user/UserService'
import { ClerkUserRepository } from '../../../core/infrastructure/auth/ClerkUserRepository'
import { CreateUserDto } from '../../../core/application/dto/UserDto'

const userRepository = new ClerkUserRepository()
const userService = new UserService(userRepository)

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const query = searchParams.get('query') || ''

    if (query) {
      const searchResult = await userService.searchUsers({
        query,
        page,
        limit
      })
      return NextResponse.json(searchResult)
    } else {
      const users = await userService.getUsersWithPagination(page, limit)
      return NextResponse.json(users)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateUserDto = await request.json()

    // Validate required fields
    if (!body.email || !body.username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      )
    }

    const user = await userService.createUser(body)
    
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.getId(),
        email: user.getEmail(),
        username: user.getUsername(),
        role: user.getRole().getValue(),
        status: user.getStatus().getValue()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    
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