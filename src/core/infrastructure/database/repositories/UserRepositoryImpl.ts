import { eq, like, and, desc, asc, count, or, gte, lte } from 'drizzle-orm';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';
import { UserRole } from '../../../domain/value-objects/UserRole';
import { UserStatus } from '../../../domain/value-objects/UserStatus';
import { db, dbReadonly } from '../connection';
import { users, userPermissions } from '../schema';

export class UserRepositoryImpl implements UserRepository {
  private readonly database = db;
  private readonly readonlyDatabase = dbReadonly || db;

  // Basic CRUD operations
  async findById(id: string): Promise<User | null> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (result.length === 0) return null;

      return this.mapToUser(result[0]);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user by ID');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (result.length === 0) return null;

      return this.mapToUser(result[0]);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user by email');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (result.length === 0) return null;

      return this.mapToUser(result[0]);
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new Error('Failed to find user by username');
    }
  }

  async create(user: User): Promise<User> {
    try {
      const userData = this.mapFromUser(user);
      
      await this.database.insert(users).values(userData);

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(user: User): Promise<User> {
    try {
      const userData = this.mapFromUser(user);
      
      await this.database
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.getId()));

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.database.delete(users).where(eq(users.id, id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  // Query operations
  async findAll(): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .orderBy(asc(users.createdAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error('Failed to find all users');
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.role, role))
        .orderBy(asc(users.createdAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding users by role:', error);
      throw new Error('Failed to find users by role');
    }
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.status, status))
        .orderBy(asc(users.createdAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding users by status:', error);
      throw new Error('Failed to find users by status');
    }
  }

  async findByModuleAccess(_module: string): Promise<User[]> {
    try {
      // This would need to be implemented based on your permission system
      // For now, returning all active users
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.status, 'active'))
        .orderBy(asc(users.createdAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding users by module access:', error);
      throw new Error('Failed to find users by module access');
    }
  }

  // Search operations
  async search(query: string): Promise<User[]> {
    try {
      const searchTerm = `%${query}%`;
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(
          or(
            like(users.displayName, searchTerm),
            like(users.username, searchTerm),
            like(users.email, searchTerm),
            like(users.bio, searchTerm)
          )
        )
        .orderBy(asc(users.displayName));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }

  async findUsersWithPermission(permission: string): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select({
          user: users,
        })
        .from(users)
        .innerJoin(userPermissions, eq(users.id, userPermissions.userId))
        .where(eq(userPermissions.permission, permission))
        .orderBy(asc(users.displayName));

      return result.map(row => this.mapToUser(row.user));
    } catch (error) {
      console.error('Error finding users with permission:', error);
      throw new Error('Failed to find users with permission');
    }
  }

  // Statistics
  async getTotalUsers(): Promise<number> {
    try {
      const result = await this.readonlyDatabase
        .select({ count: count() })
        .from(users);

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting total users:', error);
      throw new Error('Failed to get total users');
    }
  }

  async getUsersByRole(): Promise<Record<UserRole, number>> {
    try {
      const result = await this.readonlyDatabase
        .select({
          role: users.role,
          count: count(),
        })
        .from(users)
        .groupBy(users.role);

      const roleCounts: Record<string, number> = {};
      result.forEach(row => {
        roleCounts[row.role] = row.count;
      });

      return roleCounts as Record<UserRole, number>;
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw new Error('Failed to get users by role');
    }
  }

  async getUsersByStatus(): Promise<Record<UserStatus, number>> {
    try {
      const result = await this.readonlyDatabase
        .select({
          status: users.status,
          count: count(),
        })
        .from(users)
        .groupBy(users.status);

      const statusCounts: Record<string, number> = {};
      result.forEach(row => {
        statusCounts[row.status] = row.count;
      });

      return statusCounts as Record<UserStatus, number>;
    } catch (error) {
      console.error('Error getting users by status:', error);
      throw new Error('Failed to get users by status');
    }
  }

  // Pagination
  async findWithPagination(page: number, limit: number): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      const [usersResult, totalResult] = await Promise.all([
        this.readonlyDatabase
          .select()
          .from(users)
          .orderBy(asc(users.createdAt))
          .limit(limit)
          .offset(offset),
        this.readonlyDatabase
          .select({ count: count() })
          .from(users),
      ]);

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        users: usersResult.map(row => this.mapToUser(row)),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error('Error finding users with pagination:', error);
      throw new Error('Failed to find users with pagination');
    }
  }

  // Bulk operations
  async updateMany(ids: string[], updates: Partial<User>): Promise<void> {
    try {
      // This is a simplified implementation
      // In a real scenario, you might want to batch the updates
      for (const id of ids) {
        const user = await this.findById(id);
        if (user) {
          // Apply updates to user object
          const updatedUser = { ...user, ...updates };
          await this.update(updatedUser as User);
        }
      }
    } catch (error) {
      console.error('Error updating many users:', error);
      throw new Error('Failed to update many users');
    }
  }

  async deleteMany(ids: string[]): Promise<void> {
    try {
      for (const id of ids) {
        await this.delete(id);
      }
    } catch (error) {
      console.error('Error deleting many users:', error);
      throw new Error('Failed to delete many users');
    }
  }

  // Verification operations
  async findPendingVerifications(): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.verificationStatus, 'pending'))
        .orderBy(asc(users.createdAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding pending verifications:', error);
      throw new Error('Failed to find pending verifications');
    }
  }

  async findVerifiedUsers(): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(eq(users.verificationStatus, 'approved'))
        .orderBy(asc(users.createdAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding verified users:', error);
      throw new Error('Failed to find verified users');
    }
  }

  // Analytics
  async getActiveUsersInPeriod(startDate: Date, endDate: Date): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(
          and(
            gte(users.lastActiveAt, startDate),
            lte(users.lastActiveAt, endDate)
          )
        )
        .orderBy(desc(users.lastActiveAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding active users in period:', error);
      throw new Error('Failed to find active users in period');
    }
  }

  async getNewUsersInPeriod(startDate: Date, endDate: Date): Promise<User[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(users)
        .where(
          and(
            gte(users.createdAt, startDate),
            lte(users.createdAt, endDate)
          )
        )
        .orderBy(desc(users.createdAt));

      return result.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error finding new users in period:', error);
      throw new Error('Failed to find new users in period');
    }
  }

  // Helper methods for mapping between database and domain objects
  private mapToUser(row: Record<string, unknown>): User {
    return User.fromClerkUser({
      id: row.id as string,
      emailAddresses: [{ emailAddress: row.email as string }],
      username: row.username as string | undefined,
              privateMetadata: {
          role: row.role as string,
          status: row.status as string,
          profile: {
            displayName: (row.displayName as string) || '',
            bio: (row.bio as string) || '',
            avatar: (row.avatar as string) || '',
            coverImage: (row.coverImage as string) || '',
            location: (row.location as string) || '',
            website: (row.website as string) || '',
            socialLinks: row.socialLinks ? JSON.parse(row.socialLinks as string) : {},
            preferences: row.preferences ? JSON.parse(row.preferences as string) : {
            theme: 'system',
            language: 'en',
            timezone: 'UTC',
            emailNotifications: true,
            pushNotifications: true,
            privacyLevel: 'public'
          }
        },
        stats: {
          postsCount: (row.postsCount as number) || 0,
          followersCount: (row.followersCount as number) || 0,
          followingCount: (row.followingCount as number) || 0,
          likesReceived: (row.likesReceived as number) || 0,
          commentsCount: (row.commentsCount as number) || 0,
          productsCount: (row.productsCount as number) || 0,
          ordersCount: (row.ordersCount as number) || 0,
          totalEarnings: (row.totalEarnings as number) || 0,
          lastActiveAt: (row.lastActiveAt as Date) || new Date()
        },
        verification: {
          emailVerified: (row.emailVerified as boolean) || false,
          phoneVerified: (row.phoneVerified as boolean) || false,
          identityVerified: (row.identityVerified as boolean) || false,
          kycCompleted: (row.kycCompleted as boolean) || false,
          verificationDocuments: row.verificationDocuments ? JSON.parse(row.verificationDocuments as string) : [],
          verificationStatus: ((row.verificationStatus as string) || 'pending') as 'pending' | 'approved' | 'rejected',
          verificationDate: row.verificationDate as Date | undefined,
          faceVerified: (row.faceVerified as boolean) || false,
          faceId: row.faceId as string | undefined,
          faceEnrollmentDate: row.faceEnrollmentDate as Date | undefined,
          faceVerificationEnabled: (row.faceVerificationEnabled as boolean) || false
        },
        createdAt: (row.createdAt as Date)?.toISOString() || new Date().toISOString(),
        updatedAt: (row.updatedAt as Date)?.toISOString() || new Date().toISOString(),
        lastLoginAt: (row.lastLoginAt as Date)?.toISOString() || new Date().toISOString(),
        preferences: {
          marketingEmails: true,
          dataSharing: false,
          twoFactorEnabled: false
        },
        flags: {
          isCreator: (row.role as string) === 'creator',
          isSeller: (row.role as string) === 'seller',
          isVerified: (row.identityVerified as boolean) || false,
          isPremium: false
        }
      },
      createdAt: (row.createdAt as Date)?.getTime() || Date.now(),
      updatedAt: (row.updatedAt as Date)?.getTime() || Date.now(),
      lastSignInAt: (row.lastLoginAt as Date)?.getTime()
    });
  }

  private mapFromUser(user: User) {
    const profile = user.getProfile();
    const stats = user.getStats();
    const verification = user.getVerification();

    return {
      id: user.getId(),
      email: user.getEmail(),
      username: user.getUsername(),
      role: user.getRole().getValue(),
      status: user.getStatus().getValue(),
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      coverImage: profile.coverImage,
      location: profile.location,
      website: profile.website,
      socialLinks: JSON.stringify(profile.socialLinks),
      preferences: JSON.stringify(profile.preferences),
      postsCount: stats.postsCount,
      followersCount: stats.followersCount,
      followingCount: stats.followingCount,
      likesReceived: stats.likesReceived,
      commentsCount: stats.commentsCount,
      productsCount: stats.productsCount,
      ordersCount: stats.ordersCount,
      totalEarnings: stats.totalEarnings,
      lastActiveAt: stats.lastActiveAt,
      emailVerified: verification.emailVerified,
      phoneVerified: verification.phoneVerified,
      identityVerified: verification.identityVerified,
      kycCompleted: verification.kycCompleted,
      verificationDocuments: JSON.stringify(verification.verificationDocuments),
      verificationStatus: verification.verificationStatus,
      verificationDate: verification.verificationDate,
      faceVerified: verification.faceVerified,
      faceId: verification.faceId,
      faceEnrollmentDate: verification.faceEnrollmentDate,
      faceVerificationEnabled: verification.faceVerificationEnabled,
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      lastLoginAt: user.getLastLoginAt()
    };
  }
}
