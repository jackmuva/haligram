import { getUser } from "@/db/queries";
import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const redditSearch = task({
  id: "redditSearch",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: any, { ctx }) => {
    const user = await getUser('jackmu@umich.edu', "jack mu");
    logger.log("Hello, " + user[0].name, { payload, ctx });

    return {
      message: "Hello, " + user[0].name,
    }
  },
});
