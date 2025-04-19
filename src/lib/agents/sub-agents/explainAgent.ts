// explainAgent.ts
import { CoreAIAgent } from "../../ai";

export async function explainAgent(
  text: string,
  apiKey?: string,
  debug: boolean = false
): Promise<any> {
  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const prompt = `
You are a helpful teacher assistant.

Explain the following content in simple terms, suitable for a student. Break down complex ideas, define key concepts clearly, and make the explanation easy to follow.

Instructions:
- Provide a short summary.
- Extract and explain the key concepts in a simplified way.
- List the most important takeaways as bullet points.
- End with a concise conclusion.
- Output only a clean JSON object in the following format:

{
  "title": "A concise title for this explanation",
  "summary": "A brief 1-2 sentence summary of the content",
  "mainConcepts": [
    { "concept": "Concept 1", "explanation": "Simple explanation of concept 1" },
    { "concept": "Concept 2", "explanation": "Simple explanation of concept 2" }
    // More concepts if needed
  ],
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "conclusion": "A concluding sentence or two"
}

Input:
"""
${text}
"""`;

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that explains complex topics to students.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.1,
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
