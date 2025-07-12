import { auth } from "@/auth";
import { getUser, upsertRedditSearch } from "@/db/queries";
import { NextRequest } from "next/server";

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
	const user = await getUser(session.user.email, session.user.name);
	const body: { searchTerm: string } = await req.json();
	const searches = await upsertRedditSearch(user[0].email, body.searchTerm);
	return Response.json({ searches: searches })
}
