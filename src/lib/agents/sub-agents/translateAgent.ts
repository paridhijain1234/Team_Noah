import { CoreAIAgent } from "../../ai";

export async function translateAgent(
  text: string,
  apiKey?: string
): Promise<any> {
  const prompt = `Translate the following text to English if it's not already in English. If it's already in English, translate to Hindi.

Format your response as a JSON object with the following structure:
{
  "detectedLanguage": "The language detected in the original text",
  "targetLanguage": "The language being translated to",
  "originalText": "A small excerpt of the original text (first 50-100 characters)",
  "translatedText": "The full translated text",
  "notes": "Any notes about cultural context or translation challenges (optional)"
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
