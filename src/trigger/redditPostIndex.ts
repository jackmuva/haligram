import { getInstructionsByEmail, updateRedditSearchScore } from "@/db/queries";
import { logger, task, tasks } from "@trigger.dev/sdk/v3";
import { geminiScoreRelevancy } from "./ai/utils";

export const redditPostIndex = task({
  id: "redditPostIndex",
  maxDuration: 60,
  run: async (payload: {
    userEmail: string,
    searchTerm: string,
    title: string,
    subreddit: string,
    name: string,
    selftext: string,
    url: string
  }, { ctx }) => {
    const instructions = await getInstructionsByEmail(payload.userEmail);
    const geminiMessage = geminiScoreRelevancy({ productContext: instructions[0].productContext, message: payload.selftext });
    const request = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      body: JSON.stringify(geminiMessage),
      headers: { "Content-Type": "application/json" },
    });

    if (!request.ok) {
      logger.error(`API request failed with status ${request.status}: ${request.statusText}`);
      return;
    }

    const responseData = await request.json();
    if (!responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
      logger.error('Invalid API response structure');
      return;
    }

    const text = responseData.candidates[0].content.parts[0].text.replaceAll("`", "").replace("json", "");
    let aiResponse;
    try {
      aiResponse = JSON.parse(text);
      const scoredSearch = await updateRedditSearchScore(payload.userEmail, payload.searchTerm, aiResponse.score as number);
      if (scoredSearch[0].score && scoredSearch[0].score >= 4) {
        await tasks.trigger("redditComment", payload);
      }
    } catch (parseError) {
      logger.error(parseError as string);
    }
  }
});
