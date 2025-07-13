ALTER TABLE `RedditSearch` RENAME COLUMN "searches" TO "search";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `RedditSearch` ALTER COLUMN "search" TO "search" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `RedditSearch` ADD `status` text NOT NULL DEFAULT 'initializing';