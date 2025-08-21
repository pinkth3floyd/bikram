import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  role: text('role').notNull().default('user'), // UserRole enum
  status: text('status').notNull().default('active'), // UserStatus enum
  
  // Profile information
  displayName: text('display_name'),
  bio: text('bio'),
  avatar: text('avatar'),
  coverImage: text('cover_image'),
  location: text('location'),
  website: text('website'),
  
  // Social links (stored as JSON)
  socialLinks: text('social_links'), // JSON string
  
  // Preferences (stored as JSON)
  preferences: text('preferences'), // JSON string
  
  // Statistics
  postsCount: integer('posts_count').default(0),
  followersCount: integer('followers_count').default(0),
  followingCount: integer('following_count').default(0),
  likesReceived: integer('likes_received').default(0),
  commentsCount: integer('comments_count').default(0),
  productsCount: integer('products_count').default(0),
  ordersCount: integer('orders_count').default(0),
  totalEarnings: real('total_earnings').default(0),
  lastActiveAt: integer('last_active_at', { mode: 'timestamp' }),
  
  // Verification
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  phoneVerified: integer('phone_verified', { mode: 'boolean' }).default(false),
  identityVerified: integer('identity_verified', { mode: 'boolean' }).default(false),
  kycCompleted: integer('kyc_completed', { mode: 'boolean' }).default(false),
  verificationDocuments: text('verification_documents'), // JSON array
  verificationStatus: text('verification_status').default('pending'),
  verificationDate: integer('verification_date', { mode: 'timestamp' }),
  
  // Face verification
  faceVerified: integer('face_verified', { mode: 'boolean' }).default(false),
  faceId: text('face_id'),
  faceEnrollmentDate: integer('face_enrollment_date', { mode: 'timestamp' }),
  faceVerificationEnabled: integer('face_verification_enabled', { mode: 'boolean' }).default(false),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
});

// User sessions table for tracking active sessions
export const userSessions = sqliteTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  lastActivityAt: integer('last_activity_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// User activity log table
export const userActivityLog = sqliteTable('user_activity_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  activity: text('activity').notNull(), // login, logout, profile_update, etc.
  metadata: text('metadata'), // JSON string for additional data
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// User permissions table (for role-based access control)
export const userPermissions = sqliteTable('user_permissions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  permission: text('permission').notNull(),
  grantedAt: integer('granted_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  grantedBy: text('granted_by').references(() => users.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
});

// User settings table
export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  settingKey: text('setting_key').notNull(),
  settingValue: text('setting_value'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Indexes for better performance
export const usersIndexes = {
  emailIdx: 'users_email_idx',
  usernameIdx: 'users_username_idx',
  roleIdx: 'users_role_idx',
  statusIdx: 'users_status_idx',
  createdAtIdx: 'users_created_at_idx',
  lastActiveIdx: 'users_last_active_idx',
};

export const sessionsIndexes = {
  userIdIdx: 'user_sessions_user_id_idx',
  sessionTokenIdx: 'user_sessions_session_token_idx',
  expiresAtIdx: 'user_sessions_expires_at_idx',
};

export const activityIndexes = {
  userIdIdx: 'user_activity_log_user_id_idx',
  activityIdx: 'user_activity_log_activity_idx',
  createdAtIdx: 'user_activity_log_created_at_idx',
};

export const permissionsIndexes = {
  userIdIdx: 'user_permissions_user_id_idx',
  permissionIdx: 'user_permissions_permission_idx',
};

export const settingsIndexes = {
  userIdIdx: 'user_settings_user_id_idx',
  settingKeyIdx: 'user_settings_setting_key_idx',
};

// Posts table
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull().default('text'), // text, video, mixed
  privacy: text('privacy').notNull().default('public'), // public, private, friends
  
  // Content (stored as JSON)
  content: text('content').notNull(), // JSON string
  
  // Statistics
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  sharesCount: integer('shares_count').default(0),
  viewsCount: integer('views_count').default(0),
  engagementRate: real('engagement_rate').default(0),
  
  // Metadata (stored as JSON)
  metadata: text('metadata'), // JSON string
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  scheduledFor: integer('scheduled_for', { mode: 'timestamp' }),
});

// Comments table
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'), // for replies - will be handled in application logic
  
  // Content
  content: text('content').notNull(), // JSON string
  
  // Status
  status: text('status').notNull().default('active'), // active, deleted, hidden, moderated
  
  // Statistics
  likesCount: integer('likes_count').default(0),
  repliesCount: integer('replies_count').default(0),
  reportsCount: integer('reports_count').default(0),
  
  // Metadata (stored as JSON)
  metadata: text('metadata'), // JSON string
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Likes table
export const likes = sqliteTable('likes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetId: text('target_id').notNull(), // post ID or comment ID
  targetType: text('target_type').notNull(), // post or comment
  reaction: text('reaction').notNull().default('like'), // like, love, haha, wow, sad, angry, care
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Post views tracking
export const postViews = sqliteTable('post_views', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }), // null for anonymous views
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  viewedAt: integer('viewed_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Post shares tracking
export const postShares = sqliteTable('post_shares', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  shareType: text('share_type').notNull(), // copy_link, repost, external
  sharedAt: integer('shared_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Indexes for posts
export const postsIndexes = {
  authorIdx: 'posts_author_id_idx',
  typeIdx: 'posts_type_idx',
  privacyIdx: 'posts_privacy_idx',
  createdAtIdx: 'posts_created_at_idx',
  publishedAtIdx: 'posts_published_at_idx',
  scheduledForIdx: 'posts_scheduled_for_idx',
  likesCountIdx: 'posts_likes_count_idx',
  commentsCountIdx: 'posts_comments_count_idx',
  viewsCountIdx: 'posts_views_count_idx',
};

// Indexes for comments
export const commentsIndexes = {
  postIdx: 'comments_post_id_idx',
  authorIdx: 'comments_author_id_idx',
  parentIdx: 'comments_parent_id_idx',
  statusIdx: 'comments_status_idx',
  createdAtIdx: 'comments_created_at_idx',
  likesCountIdx: 'comments_likes_count_idx',
};

// Indexes for likes
export const likesIndexes = {
  userIdx: 'likes_user_id_idx',
  targetIdx: 'likes_target_id_idx',
  targetTypeIdx: 'likes_target_type_idx',
  reactionIdx: 'likes_reaction_idx',
  createdAtIdx: 'likes_created_at_idx',
};

// Indexes for post views
export const postViewsIndexes = {
  postIdx: 'post_views_post_id_idx',
  userIdx: 'post_views_user_id_idx',
  viewedAtIdx: 'post_views_viewed_at_idx',
};

// Indexes for post shares
export const postSharesIndexes = {
  postIdx: 'post_shares_post_id_idx',
  userIdx: 'post_shares_user_id_idx',
  sharedAtIdx: 'post_shares_shared_at_idx',
};
