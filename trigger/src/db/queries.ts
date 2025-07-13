import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { redditSearch, RedditSearch, RedditToken, redditToken, User, user } from './schema';
import { eq } from 'drizzle-orm';

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
      console.error("no token for user");
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
      console.error("no token for user");
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
      console.error("no token for user");
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

export const getRedditSearchByEmail = async (email: string): Promise<Array<RedditSearch>> => {
  try {
    const selectedUser = await db.select().from(user).where(eq(user.email, email));
    if (selectedUser.length === 0) {
      console.error("no token for user");
      return [];
    }
    const search = await db.select().from(redditSearch)
      .where(eq(redditSearch.userId, selectedUser[0].id));
    return search;

  } catch (err) {
    console.error("failed to get reddit searches", err);
    throw err;
  }
}


