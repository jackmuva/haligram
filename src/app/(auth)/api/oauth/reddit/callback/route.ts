import { upsertToken } from "@/db/queries";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const searchParams = new URL(req.url).searchParams;
	const email = searchParams.get("state");
	const code = searchParams.get("code");

	const data = new URLSearchParams({
		grant_type: 'authorization_code',
		code: code!,
		redirect_uri: `${process.env.APPLICATION_URL}/api/oauth/reddit/callback`
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
		await upsertToken(email!, body.access_token, body.refresh_token);
		return NextResponse.redirect(process.env.APPLICATION_URL!, { status: 307 });
	} catch (err) {
		console.error("unable to retrieve reddit token:", err);
		return NextResponse.redirect(process.env.APPLICATION_URL!, { status: 307 });
	};
}
