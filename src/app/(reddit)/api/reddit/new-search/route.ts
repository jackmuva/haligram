import { auth } from "@/auth";
import { getInstructionsByEmail, getUser, upsertRedditSearch } from "@/db/queries";
import { tasks } from "@trigger.dev/sdk/v3";
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
	const instructions = await getInstructionsByEmail(user[0].email);

	if (instructions.length === 0 || !instructions[0].productContext) {
		return Response.json({ status: 500, message: "please provide context on your product" })
	}

	await tasks.trigger("redditPostSearch", { email: user[0].email, search: body.searchTerm });
	return Response.json({ searches: searches })
}
