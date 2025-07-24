import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { RedditToken } from "@/db/schema";
import { deleteRedditTokenByEmail, getRedditTokenByEmail } from "@/db/queries";
import { callOAuthAPI } from "@/lib/utils";

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
		return await fetch(`https://www.reddit.com/api/comment`, {
			method: "POST",
			body: params,
			headers: {
				"Authorization": `bearer ${token[0].accessToken}`,
				"Content-type": "application/x-www-form-urlencoded",
				"User-Agent": "haligram-dev:v1.0 (by /u/skmoto)",
			}
		});
	}
	//const refreshToken = async () => {
	//	const data = new URLSearchParams({
	//		grant_type: 'refresh_token',
	//		refresh_token: token[0].refreshToken,
	//	});
	//
	//	return await fetch("https://www.reddit.com/api/v1/access_token", {
	//		method: "POST",
	//		headers: {
	//			'Content-Type': 'application/x-www-form-urlencoded',
	//			'Authorization': 'Basic ' + Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString("base64"),
	//		},
	//		body: data.toString(),
	//	});
	//}
	//
	////@ts-ignore
	//const purgeToken = async () => await deleteRedditTokenByEmail(session.user.email);
	//
	//const commentReq = await callOAuthAPI({ apiCall: commentApi, refresh: refreshToken, purge: purgeToken });
	const commentReq = await commentApi();
	console.log(commentReq);
	const res = await commentReq.json();
	console.log(res.json());
	return Response.json(res);
}
