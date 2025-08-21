CREATE TABLE `user_activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`activity` text NOT NULL,
	`metadata` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`permission` text NOT NULL,
	`granted_at` integer DEFAULT CURRENT_TIMESTAMP,
	`granted_by` text,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`granted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`last_activity_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessions_session_token_unique` ON `user_sessions` (`session_token`);--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`setting_key` text NOT NULL,
	`setting_value` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text,
	`role` text DEFAULT 'user' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`display_name` text,
	`bio` text,
	`avatar` text,
	`cover_image` text,
	`location` text,
	`website` text,
	`social_links` text,
	`preferences` text,
	`posts_count` integer DEFAULT 0,
	`followers_count` integer DEFAULT 0,
	`following_count` integer DEFAULT 0,
	`likes_received` integer DEFAULT 0,
	`comments_count` integer DEFAULT 0,
	`products_count` integer DEFAULT 0,
	`orders_count` integer DEFAULT 0,
	`total_earnings` real DEFAULT 0,
	`last_active_at` integer,
	`email_verified` integer DEFAULT false,
	`phone_verified` integer DEFAULT false,
	`identity_verified` integer DEFAULT false,
	`kyc_completed` integer DEFAULT false,
	`verification_documents` text,
	`verification_status` text DEFAULT 'pending',
	`verification_date` integer,
	`face_verified` integer DEFAULT false,
	`face_id` text,
	`face_enrollment_date` integer,
	`face_verification_enabled` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);