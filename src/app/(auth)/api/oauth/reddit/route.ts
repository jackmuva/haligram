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

	const urlParams = new URLSearchParams();
	urlParams.set('client_id', process.env.REDDIT_CLIENT_ID!);
	urlParams.set('response_type', 'code');
	urlParams.set('state', session.user.id ?? "no-user-id");
	urlParams.set('redirect_uri', `${process.env.APPLICATION_URL}/api/oauth/reddit/callback`);
	urlParams.set('duration', 'permanent');
	urlParams.set('scope', 'submit vote read');
	return NextResponse.redirect(`https://www.reddit.com/api/v1/authorize?${urlParams.toString()}`,
		{ status: 307 });
}
