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
	search: text("search").notNull(),
	status: text("status").$defaultFn(() => "initializing").notNull(),
});
export type RedditSearch = InferSelectModel<typeof redditSearch>

export const instructions = sqliteTable("Instructions", {
	id: text("id").primaryKey().$defaultFn(() => randomUUID()),
	userId: text("userId").references(() => user.id).notNull(),
	systemPrompt: text("systemPrompt").$defaultFn(() => "you help comment on reddit threads about the product"),
	productContext: text("productContext").notNull(),
});
export type Instructions = InferSelectModel<typeof instructions>
