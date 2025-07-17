import { NextRequest } from "next/server";
import { updateFirecrawlJobById } from "@/db/queries";
import { firecrawlService } from "@/lib/firecrawl";
import { tasks } from "@trigger.dev/sdk/v3";

export async function POST(req: NextRequest) {
	const webhook = await req.json();
	console.log(webhook);
	const jobStatus = await firecrawlService.checkCrawlStatus(webhook.jobId);
	await updateFirecrawlJobById(webhook.jobId, webhook.event);
	//FIX:dont know the webhook schema; will need to refactor
	if (webhook.event === "completed") {
		const handle = await tasks.trigger("extractMarkdown", {
			jobId: webhook.jobId,
			email: webhook.metadata.email,
			crawlResponse: jobStatus,
		});
		return Response.json(handle);
	}
	return Response.json({ status: 500, message: "firecrawl job came back with message: " + webhook.event });
}
