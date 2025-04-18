// Agent interface and registry for all AI agents
import { askGemini } from "./gemini";

export interface Agent {
  id: string;
  name: string;
  send: (prompt: string) => Promise<string>;
}

export const agents: Agent[] = [
  {
    id: "gemini",
    name: "Gemini AI",
    send: askGemini,
  },
  // Add more agents here as needed
];

export function getAgentById(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id);
}
