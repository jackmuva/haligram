import { getInstructionsByEmail, replyRedditContent } from "@/db/queries";
import { task, logger } from "@trigger.dev/sdk/v3";
import { geminiReply } from "./ai/utils";

export const redditReply = task({
  id: "redditReply",
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
    const geminiMessage = geminiReply({
      productContext: instructions[0].productContext,
      systemPrompt: instructions[0].systemPrompt ?? "",
      message: payload.selftext
    });
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
      logger.error('Invalid API response');
      return;
    }

    const text = responseData.candidates[0].content.parts[0].text;
    logger.log("reply: " + text);
    await replyRedditContent(payload.name, text as string);
  }
});
