// quizAgent.ts
import { CoreAIAgent } from "../../ai";

export async function quizAgent(
  text: string,
  apiKey?: string,
  debug: boolean = false
): Promise<any> {
  const finalApiKey = apiKey || process.env.NEBIUS_API_KEY!;
  const client = new CoreAIAgent(finalApiKey);

  const prompt = `
You are an AI quiz creator. Based on the following input text, generate a 5-question multiple-choice quiz.

Instructions:
- Each question must have 4 options (A–D).
- Include the correct answer and a short explanation for each.
- Make sure all content is relevant and not overly difficult for a college-level student.

Return only a valid JSON object in the following format:
{
  "title": "Short, descriptive title for the quiz",
  "questions": [
    {
      "question": "Text of the question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation of why this answer is correct"
    },
    ...
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
        content: "You are a helpful assistant that creates educational quizzes from text.",
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
    // Attempt to salvage malformed JSON
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        if (debug) console.error("Fallback JSON parse failed:", e);
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
