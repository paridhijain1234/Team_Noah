// flashcardAgent.ts
import { CoreAIAgent } from "../../ai";

export async function flashcardAgent(
  text: string,
  apiKey?: string
): Promise<any> {
  const prompt = `Generate 5 study flashcards based on the following text.

Format your response as a JSON object with the following structure:
{
  "title": "A concise title related to the content",
  "flashcards": [
    {
      "front": "Term or concept 1",
      "back": "Definition or explanation 1"
    },
    {
      "front": "Term or concept 2",
      "back": "Definition or explanation 2"
    },
    {
      "front": "Term or concept 3",
      "back": "Definition or explanation 3"
    },
    {
      "front": "Term or concept 4",
      "back": "Definition or explanation 4"
    },
    {
      "front": "Term or concept 5",
      "back": "Definition or explanation 5"
    }
  ]
}

Input text: ${text}`;

  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [{ role: "system", content: prompt }],
    temperature: 0.2,
  });

  try {
    // Parse the response as JSON
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    // Fallback with a structured error
    return {
      error: true,
      message: "Failed to parse AI response as JSON",
      rawResponse: response,
    };
  }
}
