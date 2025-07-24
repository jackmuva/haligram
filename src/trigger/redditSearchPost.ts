import { updateRedditSearchStatus } from "@/db/queries";
import { logger, task, tasks } from "@trigger.dev/sdk/v3";

export const redditSearchPost = task({
  id: "redditSearchPost",
  maxDuration: 600,
  run: async (payload: { email: string, search: string, searchId: string }, { ctx }) => {
    const params = new URLSearchParams();
    params.set('limit', '3');
    params.set('t', 'all');
    params.set('sort', 'relevance');
    params.set('raw_json', '1');
    params.set('q', payload.search);

    const response = await fetch(`https://www.reddit.com/search.json?${params}`, {
      method: "GET",
    });

    if (!response) {
      return Response.json({
        status: 400,
        message: "reddit credentials invalid"
      });
    }

    const search = await updateRedditSearchStatus(payload.searchId, "INDEXING");
    if (!search) {
      logger.error("unable to update status");
    }
    const body = await response.json();
    const batch = await tasks.batchTrigger("redditPostIndex",
      body.data.children.map((post: any) => {
        return {
          payload: {
            userEmail: payload.email,
            searchTerm: payload.search,
            title: post.data.title,
            subreddit: post.data.subreddit,
            name: post.data.name,
            selftext: post.data.selftext ?? "no text",
            url: post.data.url,
          }
        }
      }));
    if (batch) {
      await updateRedditSearchStatus(payload.searchId, "FINISHED");
    } else {
      await updateRedditSearchStatus(payload.searchId, "ERRORED");
    }
  },
});
