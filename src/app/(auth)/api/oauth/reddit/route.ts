import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await auth();
	if (!session || !session.user) {
		return Response.json({
			status: 400,
			message: "user has not authenticated"
		});
	}

	const urlParams = new URLSearchParams({
		client_id: process.env.REDDIT_CLIENT_ID!,
		response_type: 'code',
		state: session.user.email ?? "no-user",
		redirect_uri: `${process.env.APPLICATION_URL}/api/oauth/reddit/callback`,
		duration: 'permanent',
		scope: 'submit vote read',
	});
	return NextResponse.redirect(`https://www.reddit.com/api/v1/authorize?${urlParams.toString()}`,
		{ status: 307 });
}
