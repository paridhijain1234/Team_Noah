import { askGemini } from "../gemini";
export async function summarizeAgent(text: string): Promise<string> {
  const prompt = `Summarize the following text in clear, simple language for a college student:\n\n${text}`;
  return await askGemini(prompt);
}
