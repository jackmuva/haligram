import { pineconeService } from "@/lib/pinecone";
import { task } from "@trigger.dev/sdk/v3";


export const indexMarkdown = task({
  id: "indexMarkdown",
  maxDuration: 180,
  run: async (payload: {
    jobId: string,
    email: string,
    markdown: string,
  }, { ctx }) => {
    const pcRes = await pineconeService.upsertText({
      text: payload.markdown,
      metadata: {
        jobId: payload.jobId,
        userId: payload.userId,
      },
      namespaceName: payload.email,
    });
    return Response.json(pcRes);
  }
});
