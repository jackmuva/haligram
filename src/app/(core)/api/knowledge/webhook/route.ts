import { NextRequest } from "next/server";
import { updateFirecrawlJobById } from "@/db/queries";
import { firecrawlService } from "@/lib/firecrawl";
import { tasks } from "@trigger.dev/sdk/v3";

interface WebhookPayload {
	id: string,
	type: string,
	metadata: any,
	data: Array<any>,
}

export async function POST(req: NextRequest) {
	const webhook: WebhookPayload = await req.json();
	const jobStatus = await firecrawlService.checkCrawlStatus(webhook.id);
	await updateFirecrawlJobById(webhook.id, webhook.type);
	if (webhook.type === "crawl.completed") {
		const handle = await tasks.trigger("extractMarkdown", {
			jobId: webhook.id,
			userId: webhook.metadata.user,
			crawlResponse: jobStatus,
		});
		return Response.json(handle);
	}
	return Response.json({ status: 500, message: "firecrawl job came back with message: " + webhook.type });
}
