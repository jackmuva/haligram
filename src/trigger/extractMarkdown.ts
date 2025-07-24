import { CrawlStatusResponse } from "@mendable/firecrawl-js";
import { tasks, task } from "@trigger.dev/sdk/v3";
import { updateFirecrawlJobById } from "@/db/queries";

export const extractMarkdown = task({
  id: "extractMarkdown",
  maxDuration: 300,
  run: async (payload: {
    jobId: string,
    userId: string,
    crawlResponse: CrawlStatusResponse
  }, { ctx }) => {
    await updateFirecrawlJobById(payload.jobId, "indexing");
    const batchRes = await tasks.batchTrigger("indexMarkdown",
      payload.crawlResponse.data.map((mdData) => {
        return ({
          payload: {
            jobId: payload.jobId,
            userId: payload.userId,
            markdown: mdData.markdown,
            url: mdData.metadata?.sourceURL,
          }
        });
      })
    );
    if (batchRes) {
      await updateFirecrawlJobById(payload.jobId, "indexed");
    }
    return Response.json(batchRes);

  }
});
