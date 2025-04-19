import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Get a language model
  const model = google("gemini-2.0-flash-001");

  // Call the language model with the prompt
  const result = streamText({
    model,
    messages,
    maxTokens: 8192,
    temperature: 0.7,
    topP: 0.4,
  });

  // Respond with a streaming response
  return result.toDataStreamResponse();
}
