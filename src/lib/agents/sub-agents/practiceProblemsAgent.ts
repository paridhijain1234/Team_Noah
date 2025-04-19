// practiceProblemsAgent.ts
import { CoreAIAgent } from "../../ai";

export async function practiceProblemsAgent(
  text: string,
  apiKey?: string,
  debug: boolean = false
): Promise<any> {
  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const prompt = `
You are an AI that generates educational practice problems.

Based on the following text, create 3 practice problems, each with a clear and detailed solution.

Guidelines:
- Ensure the problems are relevant and challenge understanding.
- Write concise but informative solutions that explain each step clearly.
- Use a consistent format for all problems.

Format your response strictly as a JSON object:
{
  "title": "Concise title that captures the topic",
  "problems": [
    {
      "problem": "Problem statement 1",
      "solution": "Step-by-step solution 1"
    },
    {
      "problem": "Problem statement 2",
      "solution": "Step-by-step solution 2"
    },
    {
      "problem": "Problem statement 3",
      "solution": "Step-by-step solution 3"
    }
  ]
}

Here is the input text:
"""
${text}
"""`;

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that creates practice problems from educational text.",
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
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        if (debug) console.error("Regex fallback parse failed:", e);
      }
    }

    if (debug) console.error("Full response:\n", response);
    return {
      error: true,
      message: "Failed to parse AI response as valid JSON",
      rawResponse: response,
    };
  }
}
