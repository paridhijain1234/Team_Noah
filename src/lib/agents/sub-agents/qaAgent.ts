// qaAgent.ts
import { CoreAIAgent } from "../../ai";

export async function qaAgent(
  text: string,
  apiKey?: string,
  debug: boolean = false
): Promise<any> {
  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const prompt = `
You are an AI assistant that extracts key questions and answers from educational content.

Instructions:
- Generate exactly 3 meaningful and relevant questions based on the text.
- Provide clear, complete answers to each question.
- Format your response strictly as a JSON object with this structure:

{
  "title": "Short, informative title about the content",
  "questions": [
    {
      "question": "First question?",
      "answer": "Detailed and accurate answer"
    },
    {
      "question": "Second question?",
      "answer": "Detailed and accurate answer"
    },
    {
      "question": "Third question?",
      "answer": "Detailed and accurate answer"
    }
  ]
}

Here is the text:
"""
${text}
"""`;

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that generates key questions and answers from text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const cleaned = response.trim().replace(/^```(?:json)?|```$/g, "");

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.log(error);
    // Fallback: Try extracting JSON object with regex
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        if (debug) console.error("Fallback regex parse failed:", e);
      }
    }

    if (debug) console.error("Full AI response:\n", response);
    return {
      error: true,
      message: "Failed to parse AI response as valid JSON",
      rawResponse: response,
    };
  }
}
