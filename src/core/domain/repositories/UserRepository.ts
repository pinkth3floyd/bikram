import { User } from '../entities/User'
import { UserRole } from '../value-objects/UserRole'
import { UserStatus } from '../value-objects/UserStatus'

export interface UserRepository {
  // Basic CRUD operations
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  create(user: User): Promise<User>
  update(user: User): Promise<User>
  delete(id: string): Promise<void>
  
  // Query operations
  findAll(): Promise<User[]>
  findByRole(role: UserRole): Promise<User[]>
  findByStatus(status: UserStatus): Promise<User[]>
  findByModuleAccess(module: string): Promise<User[]>
  
  // Search operations
  search(query: string): Promise<User[]>
  findUsersWithPermission(permission: string): Promise<User[]>
  
  // Statistics
  getTotalUsers(): Promise<number>
  getUsersByRole(): Promise<Record<UserRole, number>>
  getUsersByStatus(): Promise<Record<UserStatus, number>>
  
  // Pagination
  findWithPagination(page: number, limit: number): Promise<{
    users: User[]
    total: number
    page: number
    totalPages: number
  }>
  
  // Bulk operations
  updateMany(ids: string[], updates: Partial<User>): Promise<void>
  deleteMany(ids: string[]): Promise<void>
  
  // Verification operations
  findPendingVerifications(): Promise<User[]>
  findVerifiedUsers(): Promise<User[]>
  
  // Analytics
  getActiveUsersInPeriod(startDate: Date, endDate: Date): Promise<User[]>
  getNewUsersInPeriod(startDate: Date, endDate: Date): Promise<User[]>
} 