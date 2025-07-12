import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { RedditToken, redditToken, User, user } from './schema';
import { eq } from 'drizzle-orm';

let db = drizzle(
	createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN ?? "",
	})
)

export const createUser = async (email: string, name: string): Promise<Array<User>> => {
	try {
		const createdUser = db.insert(user).values({
			email: email,
			name: name
		}).returning();
		return createdUser;
	} catch (err) {
		console.error("unable to create user", err);
		throw err;
	}
}

export const getUser = async (email: string, name: string): Promise<Array<User>> => {
	try {
		let selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			selectedUser = await createUser(email, name);
		}
		return selectedUser;
	} catch (err) {
		console.error("Failed to get user by email", err);
		throw err;
	}
}

export const getRedditTokenByEmail = async (email: string): Promise<Array<RedditToken>> => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("no token for user");
			return [];
		} else {
			const token = await db.select().from(redditToken)
				.where(eq(redditToken.userId, selectedUser[0].id));
			return token;
		}
	} catch (err) {
		console.error("Failed to get reddit token by email", err);
		throw err;
	}

}

export const upsertToken = async (email: string, accessToken: string) => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("no token for user");
			return [];
		}
		const existingToken = await getRedditTokenByEmail(email);
		if (existingToken.length === 0) {
			db.insert(redditToken).values({
				userId: selectedUser[0].id,
				accessToken: accessToken,
			});
		} else {
			db.update(redditToken)
				.set({
					accessToken: accessToken,
					updatedAt: (new Date()).toUTCString(),
				})
				.where(eq(redditToken.userId, selectedUser[0].id));
		}

	} catch (err) {
		console.error("Failed to upsert reddit token", err);
		throw err;
	}
}
