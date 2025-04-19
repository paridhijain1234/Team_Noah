// flashcardAgent.ts
import { CoreAIAgent } from "../../ai";

export async function flashcardAgent(
  text: string,
  apiKey?: string,
  debug: boolean = false
): Promise<any> {
  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const prompt = `
You are an AI that generates educational flashcards to help students study.

Instructions:
- Read the following text and identify important terms, concepts, or questions.
- Create a reasonable number of flashcards (e.g., 3 to 10) depending on the richness of the content.
- Each flashcard should have a "front" with a term, concept, or question, and a "back" with a clear, concise explanation.
- Avoid including code fences or extra formatting.
- Respond strictly as a valid JSON object in this structure:

{
  "title": "A short, relevant title summarizing the content",
  "flashcards": [
    { "front": "Concept 1", "back": "Explanation 1" },
    { "front": "Concept 2", "back": "Explanation 2" },
    ...
  ]
}

Input text:
"""
${text}
"""`;

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that generates flashcards from text.",
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
