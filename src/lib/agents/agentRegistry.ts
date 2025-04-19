import { summarizeAgent } from "./sub-agents/summarizeAgent";
import { translateAgent } from "./sub-agents/translateAgent";
import { explainAgent } from "./sub-agents/explainAgent";
import { flashcardAgent } from "./sub-agents/flashcardAgent";
import { quizAgent } from "./sub-agents/quizAgent";
import { practiceProblemsAgent } from "./sub-agents/practiceProblemsAgent";

export const agentRegistry: Record<
  string,
  (input: any, ...args: any[]) => Promise<any>
> = {
  summarize: summarizeAgent,
  translate: translateAgent,
  explain: explainAgent,
  flashcard: flashcardAgent,
  quiz: quizAgent,
  practiceProblems: practiceProblemsAgent,
};
