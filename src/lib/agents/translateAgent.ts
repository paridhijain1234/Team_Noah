import { askGemini } from "../gemini";
export async function translateAgent(
  text: string,
  toLang: string
): Promise<string> {
  const prompt = `Translate the following text into ${toLang}. Only provide the translated text.\n\n${text}`;
  return await askGemini(prompt);
}
