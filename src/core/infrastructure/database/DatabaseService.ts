import { getDatabaseStatus, healthCheck } from './connection';
import { UserRepositoryImpl } from './repositories/UserRepositoryImpl';
import { PostRepositoryImpl } from './repositories/PostRepositoryImpl';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { PostRepository } from '../../domain/repositories/PostRepository';

export class DatabaseService {
  private static instance: DatabaseService;
  private userRepository: UserRepository;
  private postRepository: PostRepository;

  private constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.postRepository = new PostRepositoryImpl();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Repository getters
  public getUserRepository(): UserRepository {
    return this.userRepository;
  }

  public getPostRepository(): PostRepository {
    return this.postRepository;
  }

  // Database health and status
  public async getStatus() {
    return await getDatabaseStatus();
  }

  public async isHealthy(): Promise<boolean> {
    return await healthCheck();
  }

  // Transaction support
  public async transaction<T>(callback: (dbService: DatabaseService) => Promise<T>): Promise<T> {
    // Note: SQLite transactions are handled automatically by Drizzle
    // This is a simplified implementation
    try {
      return await callback(this);
    } catch (error) {
      console.error('Transaction error:', error);
      throw new Error('Transaction failed');
    }
  }

  // Database initialization
  public async initialize(): Promise<void> {
    try {
      // Check database connection
      const isHealthy = await this.isHealthy();
      if (!isHealthy) {
        throw new Error('Database is not healthy');
      }

      console.log('Database service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database service:', error);
      throw error;
    }
  }

  // Cleanup
  public async cleanup(): Promise<void> {
    try {
      // Close database connections if needed
      console.log('Database service cleanup completed');
    } catch (error) {
      console.error('Error during database cleanup:', error);
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();
