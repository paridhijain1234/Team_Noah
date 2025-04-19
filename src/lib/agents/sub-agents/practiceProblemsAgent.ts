// practiceProblemsAgent.ts
import { CoreAIAgent } from "../../ai";

export async function practiceProblemsAgent(
  text: string,
  apiKey?: string
): Promise<any> {
  const prompt = `Generate 3 practice problems with detailed solutions based on the following text.

Format your response as a JSON object with the following structure:
{
  "title": "A concise title related to the content",
  "problems": [
    {
      "problem": "Detailed problem statement 1",
      "solution": "Step-by-step solution to problem 1"
    },
    {
      "problem": "Detailed problem statement 2",
      "solution": "Step-by-step solution to problem 2"
    },
    {
      "problem": "Detailed problem statement 3",
      "solution": "Step-by-step solution to problem 3"
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
