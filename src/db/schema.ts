import { randomUUID } from "crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm";

export const user = sqliteTable("users", {
	id: text("id").primaryKey().$defaultFn(() => randomUUID()),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
});
export type User = InferSelectModel<typeof user>

export const redditToken = sqliteTable("RedditTokens", {
	id: text("id").primaryKey().$defaultFn(() => randomUUID()),
	userId: text("userId").references(() => user.id).notNull(),
	accessToken: text("accessToken").notNull(),
	refreshToken: text("refreshToken").notNull(),
	updatedAt: text("updatedAt").$defaultFn(() => (new Date()).toUTCString()),
});
export type RedditToken = InferSelectModel<typeof redditToken>

export const redditSearch = sqliteTable("RedditSearch", {
	id: text("id").primaryKey().$defaultFn(() => randomUUID()),
	userId: text("userId").references(() => user.id).notNull(),
	searches: text("searches", { mode: "json" }).$type<{ terms: Array<string> }>(),
});
export type RedditSearch = InferSelectModel<typeof redditSearch>
