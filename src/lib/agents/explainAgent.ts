import { askGemini } from "../gemini";
export async function explainAgent(text: string): Promise<string> {
  const prompt = `Explain the following concept in a very simple way, as if teaching someone new to the topic:\n\n${text}`;
  return await askGemini(prompt);
}
