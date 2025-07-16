import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { Instructions, instructions, redditContent, RedditContent, redditSearch, RedditSearch, RedditToken, redditToken, User, user } from './schema';
import { and, eq, desc } from 'drizzle-orm';

const db = drizzle(
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
			console.error("user not found");
			return [];
		}
		const token = await db.select().from(redditToken)
			.where(eq(redditToken.userId, selectedUser[0].id));
		return token;
	} catch (err) {
		console.error("Failed to get reddit token by email", err);
		throw err;
	}

}

export const deleteRedditTokenByEmail = async (email: string) => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("user not found");
			return;
		}
		await db.delete(redditToken).where(eq(redditToken.userId, selectedUser[0].id));
	} catch (err) {
		console.error('unable to delete reddit token: ', err);
		throw err;
	}

}

export const upsertToken = async (email: string, accessToken: string, refreshToken: string): Promise<Array<RedditToken>> => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("user not found");
			return [];
		}
		const existingToken = await getRedditTokenByEmail(email);
		if (existingToken.length === 0) {
			const token = await db.insert(redditToken).values({
				userId: selectedUser[0].id,
				accessToken: accessToken,
				refreshToken: refreshToken,
			}).returning();
			return token;
		} else {
			const token = await db.update(redditToken)
				.set({
					accessToken: accessToken,
					refreshToken: refreshToken,
					updatedAt: (new Date()).toUTCString(),
				})
				.where(eq(redditToken.userId, selectedUser[0].id))
				.returning();
			return token;
		}

	} catch (err) {
		console.error("Failed to upsert reddit token", err);
		throw err;
	}
}

export const getRedditSearchesByEmail = async (email: string): Promise<Array<RedditSearch>> => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("user not found");
			return [];
		}
		const search = await db.select().from(redditSearch)
			.where(eq(redditSearch.userId, selectedUser[0].id))
			.orderBy(desc(redditSearch.updatedAt));
		return search;
	} catch (err) {
		console.error("failed to get reddit searches", err);
		throw err;
	}
}

export const getRedditSearchesByEmailAndSearch = async (email: string, searchTerm: string): Promise<Array<RedditSearch>> => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("user not found");
			return [];
		}
		const search = await db.select().from(redditSearch)
			.where(and(eq(redditSearch.userId, selectedUser[0].id),
				eq(redditSearch.search, searchTerm)));
		return search;
	} catch (err) {
		console.error("failed to get reddit searches", err);
		throw err;
	}
}

export const upsertRedditSearch = async (email: string, searchTerm: string): Promise<Array<RedditSearch>> => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("user not found");
			return [];
		}
		const pastSearch = await db.select().from(redditSearch)
			.where(and(eq(redditSearch.userId, selectedUser[0].id), eq(redditSearch.search, searchTerm)));
		if (pastSearch.length === 0) {
			const search = await db.insert(redditSearch).values({
				userId: selectedUser[0].id,
				search: searchTerm,
			}).returning();
			return search;
		}
		return [];
	} catch (err) {
		console.error("Failed to upsert reddit search", err);
		throw err;
	}
}

export const updateRedditSearchStatus = async (searchId: string, status: string): Promise<Array<RedditSearch>> => {
	try {
		let search = await db.select().from(redditSearch).where(eq(redditSearch.id, searchId));
		if (search.length === 0) {
			console.error("search not found");
			return []
		}
		search = await db.update(redditSearch).set({
			status: status
		}).returning();
		return search;
	} catch (err) {
		console.error("Failed to update search status", err);
		throw err;
	}
}

export const getInstructionsByEmail = async (email: string): Promise<Array<Instructions>> => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("user not found");
			return [];
		}
		const instruction = await db.select().from(instructions)
			.where(eq(instructions.userId, selectedUser[0].id));
		return instruction;
	} catch (err) {
		console.error("failed to get reddit searches", err);
		throw err;
	}
}


export const upsertInstructions = async (email: string, prompt: string, context: string): Promise<Array<Instructions>> => {
	try {
		const selectedUser = await db.select().from(user).where(eq(user.email, email));
		if (selectedUser.length === 0) {
			console.error("user not found");
			return [];
		}
		const lastInstr = await db.select().from(instructions)
			.where(eq(instructions.userId, selectedUser[0].id));
		if (lastInstr.length === 0) {
			const instr = await db.insert(instructions).values({
				userId: selectedUser[0].id,
				systemPrompt: prompt,
				productContext: context,
			}).returning();
			return instr;
		} else {
			const instr = await db.update(instructions).set({
				systemPrompt: prompt,
				productContext: context,
			}).where(eq(instructions.userId, selectedUser[0].id))
				.returning();
			return instr;
		}
	} catch (err) {
		console.error("Failed to upsert reddit search", err);
		throw err;
	}
}

export const createRedditContent = async (email: string, searchTerm: string, postId: string,
	url: string, contentText: string, title: string, score: number):
	Promise<Array<RedditContent>> => {
	try {
		const search = await getRedditSearchesByEmailAndSearch(email, searchTerm);
		if (search.length === 0) {
			console.error("search not found");
			return [];
		}
		const content = await db.insert(redditContent).values({
			searchId: search[0].id,
			postId: postId,
			score: score,
			url: url,
			contentText: contentText,
			title: title,
		}).returning();
		return content;
	} catch (err) {
		console.error("Failed to create reddit content", err);
		throw err;
	}
}
export const replyRedditContent = async (postId: string, reply: string):
	Promise<Array<RedditContent>> => {
	try {
		let content = await db.select().from(redditContent).where(eq(redditContent.postId, postId));
		if (content.length === 0) {
			console.error("reddit content not found");
			return [];
		}
		content = await db.update(redditContent).set({
			reply: reply
		}).where(eq(redditContent.postId, postId)).returning();
		return content;
	} catch (err) {
		console.error("Failed to reply to reddit content", err);
		throw err;
	}
}

export const getRedditContentBySearchId = async (searchId: string): Promise<Array<RedditContent>> => {
	try {
		return await db.select().from(redditContent).where(eq(redditContent.searchId, searchId));
	} catch (err) {
		console.error("Failed to get Reddit content", err);
		throw err;
	}
}
