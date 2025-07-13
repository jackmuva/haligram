CREATE TABLE `Instructions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`systemPrompt` text,
	`productContext` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `RedditSearch` ALTER COLUMN "search" TO "search" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `RedditSearch` ALTER COLUMN "status" TO "status" text NOT NULL;