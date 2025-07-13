import { logger, task } from "@trigger.dev/sdk/v3";

export const redditSearch = task({
  id: "redditSearch",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: any, { ctx }) => {
    const params = new URLSearchParams();
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
    return Response.json({
      threads: body,
    });

  },
});
