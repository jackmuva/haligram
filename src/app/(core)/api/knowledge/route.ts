import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getFirecrawlJobByEmail, getUser, upsertFirecrawlJob } from "@/db/queries";
import { firecrawlService } from "@/lib/firecrawl";

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
	const body: { url: string, limit: number } = await req.json();
	const firecrawlReq = await firecrawlService.crawl({ url: body.url, limit: body.limit, userId: user[0].id });
	const job = await upsertFirecrawlJob(user[0].email, firecrawlReq.id ?? "error", body.url, firecrawlReq.error);
	return Response.json({ job: job })
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
	const jobs = await getFirecrawlJobByEmail(session.user.email);
	return Response.json({ jobs: jobs });
}
