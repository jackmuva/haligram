import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { RedditToken } from "@/db/schema";
import { deleteRedditTokenByEmail, getRedditTokenByEmail } from "@/db/queries";
import { callOAuthAPI } from "@/lib/utils";
import { reauthReddit } from "../utils";

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session || !session.user) {
		return Response.json({
			status: 400,
			message: "user has not authenticated"
		});
	} else if (!session.user.name || !session.user.email) {
		return Response.json({
			status: 500,
			message: "problem getting session"
		});

	}
	const token: Array<RedditToken> = await getRedditTokenByEmail(session.user.email);
	if (!token || token.length === 0) {
		return Response.json({
			status: 500,
			message: "No token found"
		});

	}

	const body: { parent: string, text: string } = await req.json();
	const params = new URLSearchParams();
	params.set('thing_id', body.parent);
	params.set('text', body.text);

	const commentApi = async () => {
		return await fetch(`https://oauth.reddit.com/api/comment`, {
			method: "POST",
			body: params,
			headers: {
				"Authorization": `bearer ${token[0].accessToken}`,
				"Content-type": "application/x-www-form-urlencoded",
				"User-Agent": "haligram-dev/v1.0 (by /u/skmoto)",
			}
		});
	}
	//@ts-ignore
	const refreshToken = async () => await reauthReddit(session.user.email, token[0].refreshToken);
	//@ts-ignore
	const purgeToken = async () => await deleteRedditTokenByEmail(session.user.email);

	const commentReq = await callOAuthAPI({ apiCall: commentApi, refresh: refreshToken, purge: purgeToken });
	if (commentReq && commentReq.ok) {
		return Response.json({ status: 200, message: "comment successful" });
	}
	return Response.json({ status: 500, message: "unable to comment" });
}
