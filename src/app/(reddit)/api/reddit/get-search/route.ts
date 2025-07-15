import { auth } from "@/auth";
import { getUser, getRedditSearchesByEmailAndSearch, getRedditContentBySearchId } from "@/db/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	const params = new URL(req.url).searchParams;
	if (!params.get("q")) {
		return Response.json({
			status: 500,
			message: "need search query param"
		});
	}
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
	const user = await getUser(session.user.email, session.user.name);
	const search = await getRedditSearchesByEmailAndSearch(user[0].email, params.get("q")!);
	if (search && search[0].status !== "FINISHED") {
		return Response.json({ searchStatus: search[0].status });
	}
	const redditReplies = await getRedditContentBySearchId(search[0].id);
	return Response.json({ searchStatus: search[0].status, redditContent: redditReplies });
}
