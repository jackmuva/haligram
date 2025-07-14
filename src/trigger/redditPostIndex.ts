import { task } from "@trigger.dev/sdk/v3";

export const redditPostSearch = task({
  id: "redditPostSearch",
  maxDuration: 60,
  run: async (payload: {
    title: string,
    subreddit: string,
    name: string,
    selftext: string,
    url: string
  }, { ctx }) => {
    const prompt = "";
    const request = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      body: JSON.stringify(geminiMessage),
      headers: { "Content-Type": "application/json" },
    });
    const response = await request.json();
  }
});
