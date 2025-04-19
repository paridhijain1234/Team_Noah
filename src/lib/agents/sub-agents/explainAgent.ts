import { CoreAIAgent } from "../../ai";

export async function explainAgent(
  text: string,
  apiKey?: string
): Promise<any> {
  const prompt = `Explain the following text as if teaching it to a student. Break down complex concepts into simpler parts and highlight key points. 
  
Format your response as a JSON object with the following structure:
{
  "title": "A concise title for this explanation",
  "summary": "A brief 1-2 sentence summary of the content",
  "mainConcepts": [
    {"concept": "Concept 1", "explanation": "Simple explanation of concept 1"},
    {"concept": "Concept 2", "explanation": "Simple explanation of concept 2"}
  ],
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "conclusion": "A concluding sentence or two"
}

Input text: ${text}`;

  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const response = await client.complete({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [{ role: "system", content: prompt }],
    temperature: 0.1,
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
