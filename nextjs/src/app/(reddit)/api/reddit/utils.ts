import { upsertToken } from "@/db/queries";
import { RedditToken } from "@/db/schema";

export const reauthReddit = async (email: string, refreshToken: string): Promise<RedditToken | null> => {
	const data = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	});

	try {
		const response = await fetch("https://www.reddit.com/api/v1/access_token", {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString("base64"),
			},
			body: data.toString(),
		});

		const body = await response.json();
		const newToken = await upsertToken(email, body.access_token, refreshToken);
		return newToken[0];
	} catch (err) {
		console.error("unable to retrieve reddit token:", err);
		return null;
	};
}
