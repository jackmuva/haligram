import { pineconeService } from "@/lib/pinecone";
import { logger, task } from "@trigger.dev/sdk/v3";

export const indexMarkdown = task({
	id: "indexMarkdown",
	maxDuration: 180,
	run: async (payload: {
		jobId: string,
		userId: string,
		markdown: string,
		url: string,
	}, { ctx }) => {
		console.log("index payload: ", payload);
		await pineconeService.upsertText({
			text: payload.markdown,
			metadata: {
				jobId: payload.jobId,
				userId: payload.userId,
				url: payload.url,
			},
			namespaceName: payload.userId,
		});
	}
});
