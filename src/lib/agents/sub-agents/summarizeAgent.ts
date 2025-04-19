// summarizeAgent.ts
import { CoreAIAgent } from "../../ai";

export async function summarizeAgent(
  text: string,
  apiKey?: string
): Promise<any> {
  const prompt = `Summarize the following text in simple, clear language suitable for a college student.

Format your response as a JSON object with the following structure:
{
  "title": "A concise title for this summary",
  "summary": "A comprehensive summary of the main text in 3-5 sentences",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "difficulty": "A rating of the content complexity (Beginner/Intermediate/Advanced)"
}

Input text: ${text}`;

  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [{ role: "system", content: prompt }],
    temperature: 0,
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
