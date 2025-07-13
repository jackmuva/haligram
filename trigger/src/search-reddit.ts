import { logger, task } from "@trigger.dev/sdk/v3";
import { getUser } from "./db/queries";

export const searchReddit = task({
  id: "searchReddit",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: any, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });
    const user = await getUser("jackmu@umich.edu", "jack mu");

    return {
      message: "Hello " + user[0].name,
    }
  },
});
