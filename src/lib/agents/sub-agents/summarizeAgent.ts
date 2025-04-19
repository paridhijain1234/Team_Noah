// summarizeAgent.ts
import { CoreAIAgent } from "../../ai";

export async function summarizeAgent(
  text: string,
  apiKey?: string,
  debug: boolean = false
): Promise<any> {
  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const prompt = `
You are an AI summarizer that reads a given text and creates a structured summary.

Please summarize the following content in a way that is:
- Clear and easy to understand for a college-level student
- Free from unnecessary jargon
- Organized and concise

Return your answer as **only** a JSON object with the following fields:

{
  "title": "A short, clear title (max 10 words)",
  "summary": "A clear summary of the content in 3–5 sentences",
  "keyPoints": ["Main idea 1", "Main idea 2", "Main idea 3"],
  "difficulty": "Beginner" | "Intermediate" | "Advanced"
}

Here is the content to summarize:
""" 
${text}
"""`;

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes complex content into structured, easy-to-read summaries.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const cleaned = response.trim().replace(/^```(?:json)?|```$/g, ""); // Strip markdown code fences

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.log(error);
    // Attempt to extract JSON-like content using regex as a fallback
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        if (debug) console.error("Regex JSON fallback also failed:", e);
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
