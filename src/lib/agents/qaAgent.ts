import { askGemini } from "../gemini";
export async function qaAgent(
  context: string,
  question: string
): Promise<string> {
  const prompt = `Given the following context:\n${context}\n\nAnswer the following question in a clear and concise way:\n${question}`;
  return await askGemini(prompt);
}
