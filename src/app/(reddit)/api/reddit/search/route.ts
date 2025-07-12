import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { deleteRedditTokenByEmail, getRedditTokenByEmail, getUser } from "@/db/queries";
import { reauthReddit } from "../utils";
import { callOAuthAPI } from "@/lib/utils";

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
	params.set('limit', '5');
	params.set('t', 'all');
	params.set('sort', 'relevance');
	//params.set('show', 'all');
	//params.set('include_facets', 'true');
	//params.set('category', 'idk');
	//params.set('count', '5');
	//params.set('restrict_sr', 'false');
	//params.set('sr_detail', 'true');


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
