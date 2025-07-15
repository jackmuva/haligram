CREATE TABLE `RedditContent` (
	`id` text PRIMARY KEY NOT NULL,
	`searchId` text NOT NULL,
	`postId` text NOT NULL,
	`score` integer,
	`reply` text,
	FOREIGN KEY (`searchId`) REFERENCES `RedditSearch`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `RedditSearch` DROP COLUMN `score`;