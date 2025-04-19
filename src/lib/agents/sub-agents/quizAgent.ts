// quizAgent.ts
import { CoreAIAgent } from "../../ai";

export async function quizAgent(text: string, apiKey?: string): Promise<any> {
  const prompt = `Generate a multiple-choice quiz with 5 questions based on the following text.

Format your response as a JSON object with the following structure:
{
  "title": "A concise title related to the content",
  "questions": [
    {
      "question": "Question 1?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Explanation of why Option B is correct"
    },
    {
      "question": "Question 2?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option C",
      "explanation": "Explanation of why Option C is correct"
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
