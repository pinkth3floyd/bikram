CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`author_id` text NOT NULL,
	`parent_id` text,
	`content` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`likes_count` integer DEFAULT 0,
	`replies_count` integer DEFAULT 0,
	`reports_count` integer DEFAULT 0,
	`metadata` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`target_id` text NOT NULL,
	`target_type` text NOT NULL,
	`reaction` text DEFAULT 'like' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `post_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`share_type` text NOT NULL,
	`shared_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `post_views` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text,
	`ip_address` text,
	`user_agent` text,
	`viewed_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`privacy` text DEFAULT 'public' NOT NULL,
	`content` text NOT NULL,
	`likes_count` integer DEFAULT 0,
	`comments_count` integer DEFAULT 0,
	`shares_count` integer DEFAULT 0,
	`views_count` integer DEFAULT 0,
	`engagement_rate` real DEFAULT 0,
	`metadata` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`published_at` integer,
	`scheduled_for` integer,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
