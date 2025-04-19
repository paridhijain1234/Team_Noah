// translateAgent.ts
import { CoreAIAgent } from "../../ai";

export async function translateAgent(
  text: string,
  apiKey?: string,
  debug: boolean = false
): Promise<any> {
  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const prompt = `
You are a translation assistant.

Task:
- Detect the language of the input text.
- If it's not English, translate it to English.
- If it is English, translate it to Hindi.
- Provide cultural or contextual translation notes if relevant.

Return your output strictly in the following JSON format:

{
  "detectedLanguage": "The language identified in the input",
  "targetLanguage": "The language translated into",
  "originalText": "A 50-100 character excerpt of the input",
  "translatedText": "The full translated text",
  "notes": "Optional: cultural notes, translation nuances, or ambiguity"
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
        content: "You are a multilingual assistant that translates between English and Hindi.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
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
