import { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
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
	const params = new URL(req.url).searchParams;
	params.set('limit', '3');
	params.set('t', 'all');
	params.set('sort', 'relevance');
	params.set('raw_json', '1');

	const response = await fetch(`https://www.reddit.com/search.json?${params}`, {
		method: "GET",
	});

	if (!response) {
		return Response.json({
			status: 400,
			message: "reddit credentials invalid"
		});
	}

	const body = await response.json();
	console.log(body.data.children);
	return Response.json({
		threads: body,
	});
}
