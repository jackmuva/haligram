import { task, tasks } from "@trigger.dev/sdk/v3";

export const redditSearch = task({
  id: "redditPostSearch",
  maxDuration: 600,
  run: async (payload: { email: string, search: string }, { ctx }) => {
    const params = new URLSearchParams();
    params.set('limit', '20');
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

    const body = await response.json();
    const batchHandle = await tasks.batchTrigger("redditPostIndex",
      body.json.data.children.map((post: any) => {
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
  },
});
