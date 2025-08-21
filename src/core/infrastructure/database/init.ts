import { databaseService } from './DatabaseService';
import { UserRepository } from '../../domain/repositories/UserRepository';

// Database initialization and setup
export class DatabaseInitializer {
  private static isInitialized = false;

  /**
   * Initialize the database service and repositories
   */
  public static async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Database already initialized');
      return;
    }

    try {
      console.log('Initializing database service...');
      await databaseService.initialize();
      this.isInitialized = true;
      console.log('Database initialization completed successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get the database service
   */
  public static getDatabaseService() {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return databaseService;
  }

  /**
   * Get the user repository
   */
  public static getUserRepository(): UserRepository {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return databaseService.getUserRepository();
  }

  /**
   * Check if database is healthy
   */
  public static async isHealthy(): Promise<boolean> {
    try {
      return await databaseService.isHealthy();
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Get database status
   */
  public static async getStatus() {
    try {
      return await databaseService.getStatus();
    } catch (error) {
      console.error('Failed to get database status:', error);
      throw error;
    }
  }

  /**
   * Cleanup database connections
   */
  public static async cleanup(): Promise<void> {
    try {
      await databaseService.cleanup();
      this.isInitialized = false;
      console.log('Database cleanup completed');
    } catch (error) {
      console.error('Database cleanup failed:', error);
    }
  }
}

// Export convenience functions
export const initDatabase = () => DatabaseInitializer.initialize();
export const getDatabaseService = () => DatabaseInitializer.getDatabaseService();
export const getUserRepository = () => DatabaseInitializer.getUserRepository();
export const isDatabaseHealthy = () => DatabaseInitializer.isHealthy();
export const getDatabaseStatus = () => DatabaseInitializer.getStatus();
export const cleanupDatabase = () => DatabaseInitializer.cleanup();
