DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `RedditSearch` ALTER COLUMN "status" TO "status" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);