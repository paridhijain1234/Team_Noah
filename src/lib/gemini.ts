// geminiCore.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import { summarizeAgent } from "./agents/summarizeAgent";
import { translateAgent } from "./agents/translateAgent";
import { qaAgent } from "./agents/qaAgent";
import { explainAgent } from "./agents/explainAgent";

const apiKey = "AIzaSyCHGqbXMZWMHYZc9AuSdaaJY09VJqna2Zw"; // Load securely
if (!apiKey) throw new Error("GOOGLE_API_KEY is not set");
const genAI = new GoogleGenerativeAI(apiKey);

export async function askGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });
  if (!result.response || !result.response.text)
    throw new Error("No valid response from Gemini");
  return result.response.text();
}

export type AgentType =
  | "auto"
  | "summarize"
  | "translate"
  | "qa"
  | "analyze"
  | "creative"
  | "flashcard";

export async function masterAgent(
  input: string,
  type: AgentType
): Promise<string> {
  switch (type) {
    case "summarize":
      return summarizeAgent(input);
    case "translate":
      return translateAgent(input, "Spanish");
    case "qa":
      return qaAgent(input, input);
    case "analyze":
      return explainAgent(input);
    case "creative":
      return askGemini(`Please write creatively: ${input}`);
    case "flashcard":
      return askGemini(
        `Generate flashcards for the following text:\n\n${input}`
      );
    case "auto":
    default:
      return askGemini(input);
  }
}
