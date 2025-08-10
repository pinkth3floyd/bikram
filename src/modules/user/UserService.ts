import { User } from '../../core/domain/entities/User'
import { UserRepository } from '../../core/domain/repositories/UserRepository'
import { CreateUserUseCase } from '../../core/application/use-cases/CreateUserUseCase'
import { GetUserProfileUseCase } from '../../core/application/use-cases/GetUserProfileUseCase'
import { 
  CreateUserDto, 
  UserProfileDto, 
  UserListDto, 
  UserSearchDto,
  UserStatsDto
} from '../../core/application/dto/UserDto'
import { UserStatus } from '../../core/domain/value-objects/UserStatus'

export class UserService {
  private createUserUseCase: CreateUserUseCase
  private getUserProfileUseCase: GetUserProfileUseCase

  constructor(private userRepository: UserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository)
    this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository)
  }

  // User creation
  async createUser(dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(dto)
  }

  // User profile
  async getUserProfile(userId: string, requestingUserId?: string): Promise<UserProfileDto> {
    return this.getUserProfileUseCase.execute(userId, requestingUserId)
  }

  // User management
  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email)
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username)
  }

  async updateUser(): Promise<User | null> {
    // TODO: Implement update logic
    // This would require creating an UpdateUserUseCase
    // This is a placeholder for future implementation
    return null
  }

  async updateUserRole(): Promise<User | null> {
    // TODO: Implement role update logic with proper authorization
    // This is a placeholder for future implementation
    return null
  }

  async updateUserStatus(): Promise<User | null> {
    // TODO: Implement status update logic with proper authorization
    // This is a placeholder for future implementation
    return null
  }

  // User search and listing
  async searchUsers(dto: UserSearchDto): Promise<UserListDto> {
    const { query, page = 1, limit = 20, filters } = dto

    let users = await this.userRepository.search(query)

    // Apply filters
    if (filters?.role) {
      users = users.filter(user => user.getRole().getValue() === filters.role)
    }

    if (filters?.status) {
      users = users.filter(user => user.getStatus().getValue() === filters.status)
    }

    if (filters?.isVerified !== undefined) {
      users = users.filter(user => user.isVerified() === filters.isVerified)
    }

    // Pagination
    const total = users.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    // Convert to DTOs
    const userDtos = await Promise.all(
      paginatedUsers.map(user => this.getUserProfile(user.getId()))
    )

    return {
      users: userDtos,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }

  async getUsersWithPagination(page: number, limit: number): Promise<UserListDto> {
    const result = await this.userRepository.findWithPagination(page, limit)
    
    const userDtos = await Promise.all(
      result.users.map(user => this.getUserProfile(user.getId()))
    )

    return {
      users: userDtos,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.page < result.totalPages,
      hasPrev: result.page > 1
    }
  }

  // User statistics
  async getUserStats(): Promise<UserStatsDto> {
    const [
      totalUsers,
      usersByRole,
      usersByStatus,
      activeUsers,
      newUsersThisMonth
    ] = await Promise.all([
      this.userRepository.getTotalUsers(),
      this.userRepository.getUsersByRole(),
      this.userRepository.getUsersByStatus(),
      this.userRepository.findByStatus(UserStatus.ACTIVE),
      this.getNewUsersThisMonth()
    ])

    const verifiedUsers = await this.userRepository.findVerifiedUsers()
    const pendingVerifications = await this.userRepository.findPendingVerifications()

    return {
      totalUsers,
      activeUsers: activeUsers.length,
      newUsersThisMonth: newUsersThisMonth.length,
      usersByRole,
      usersByStatus,
      verificationStats: {
        verified: verifiedUsers.length,
        pending: pendingVerifications.length,
        rejected: 0 // TODO: Implement rejected count
      }
    }
  }

  // Permission checking
  async canUserPerformAction(userId: string, action: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      return false
    }

    return user.canPerformAction(action)
  }

  async canUserAccessModule(userId: string, module: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      return false
    }

    return user.canAccessModule(module)
  }

  // Helper methods
  private async getNewUsersThisMonth(): Promise<User[]> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return this.userRepository.getNewUsersInPeriod(startOfMonth, endOfMonth)
  }
} 