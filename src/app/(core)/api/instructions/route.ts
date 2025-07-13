import { auth } from "@/auth";
import { getUser, upsertInstructions, getInstructionsByEmail } from "@/db/queries";
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
	const body: { prompt: string, context: string } = await req.json();
	const searches = await upsertInstructions(user[0].email, body.prompt, body.context);
	return Response.json({ searches: searches })
}

export async function GET() {
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
	const instructions = await getInstructionsByEmail(user[0].email);
	return Response.json({ instructions: instructions })
}
