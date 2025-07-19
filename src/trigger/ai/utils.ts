import { getFirecrawlJobByEmail } from "@/db/queries";
import { pineconeService } from "@/lib/pinecone";
import { logger } from "@trigger.dev/sdk/v3";

export const geminiReply = async (
  { systemPrompt, productContext, message, userEmail }:
    { systemPrompt: string, productContext: string, message: string, userEmail: string }
) => {
  const geminiMessage = {
    system_instruction: {
      parts: [{
        text: `You are a assistant that comes up with replies for posts and comments to help promote the user's product.\n
              Here is some context on the user's product: \n
              ${productContext} \n
              Additional instructions: ${systemPrompt}`
      }]
    },
    contents: [
      {
        role: "user",
        parts: [{
          text: `Draft a reply to the following comment with information about the user's product. 
                Do not use markdown formatting. Include information, benefits, and examples.\n
              Comment: ${message}`
        }]
      }
    ]
  }

  const crawled = await getFirecrawlJobByEmail(userEmail);
  if (crawled) {
    const retrieved: any = await pineconeService.retrieveContext({ query: message, namespaceName: userEmail });
    console.log(retrieved.result.hits);
    let context = "";
    for (const hit of retrieved.result.hits) {
      context += (hit.fields.chunk_text + " \n\n");
    }
    logger.log("content: ", { content: context });
    console.log(context);

    geminiMessage.contents.unshift({
      role: "model",
      parts: [{
        text: `Use this context about the user's product to perform an action or answer a question:\n
                ${context}`
      }]
    })
  }
  return geminiMessage;
}

export const geminiScoreRelevancy = (
  { productContext, message }:
    { productContext: string, message: string }
) => {
  const geminiMessage = {
    system_instruction: {
      parts: [{
        text: `You are a assistant that helps the user determine if the user's product is relevant to the comment made.
              Here is some context on the user's product: \n
              ${productContext}`
      }]
    },
    contents: [{
      parts: [{
        text: `On a scale from 1-5, score how relevant the user's product is to the comment.\n
              Only respond with the score.
              Comment: ${message}`
      }]
    }]
  }
  return geminiMessage;
}
