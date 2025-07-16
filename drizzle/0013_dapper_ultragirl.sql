CREATE TABLE `FirecrawlJob` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`jobId` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
