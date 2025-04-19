import { summarizeAgent } from "./sub-agents/summarizeAgent";
import { translateAgent } from "./sub-agents/translateAgent";
import { qaAgent } from "./sub-agents/qaAgent";
import { explainAgent } from "./sub-agents/explainAgent";

export const agentRegistry: Record<
  string,
  (input: any, ...args: any[]) => Promise<any>
> = {
  summarize: summarizeAgent,
  translate: translateAgent,
  qa: qaAgent,
  explain: explainAgent,
};
