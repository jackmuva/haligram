CREATE TABLE `RedditSearch` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`searches` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_RedditTokens` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_RedditTokens`("id", "userId", "accessToken", "refreshToken", "updatedAt") SELECT "id", "userId", "accessToken", "refreshToken", "updatedAt" FROM `RedditTokens`;--> statement-breakpoint
DROP TABLE `RedditTokens`;--> statement-breakpoint
ALTER TABLE `__new_RedditTokens` RENAME TO `RedditTokens`;--> statement-breakpoint
PRAGMA foreign_keys=ON;