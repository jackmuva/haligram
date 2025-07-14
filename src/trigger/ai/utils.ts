export const geminiReply = (
  { systemPrompt, productContext, message }:
    { systemPrompt: string, productContext: string, message: string }
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
    contents: [{
      parts: [{
        text: `Draft a reply to the following comment with information about the user's product.
               Include information, benefits, and examples.\n
              Comment: ${message}`
      }]
    }]
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
              Return the score with the following stringified json format: {score: <score>}.
              Comment: ${message}`
      }]
    }]
  }
  return geminiMessage;
}
