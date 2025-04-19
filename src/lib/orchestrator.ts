// autoOrchestrator.ts
import { masterAgent } from "./agents/masterAgent";
import { summarizeAgent } from "./agents/summarizeAgent";
import { translateAgent } from "./agents/translateAgent";
import { qaAgent } from "./agents/qaAgent";
import { explainAgent } from "./agents/explainAgent";

type AgentFunction = (input: any, ...args: any[]) => Promise<any>;

const agentMapping: { [key: string]: AgentFunction } = {
  summarize: summarizeAgent,
  translate: translateAgent,
  qa: qaAgent,
  explain: explainAgent,
};

export async function autoOrchestratePipeline(
  initialInput: string
): Promise<any> {
  // Step 1: Decide pipeline through masterAgent
  const pipelinePlan = await masterAgent(initialInput);

  // Optionally, log the pipeline plan
  console.log("Pipeline Plan:", pipelinePlan);

  // Step 2: Execute each selected agent
  let data = initialInput;
  for (const step of pipelinePlan) {
    const agentFn = agentMapping[step.name];
    if (!agentFn) {
      console.warn(`Agent ${step.name} is not recognized. Skipping.`);
      continue;
    }
    // Pass the arguments if any, else empty array
    data = await agentFn(data, ...(step.args || []));
  }
  return data;
}
