// orchestrator.ts

import { MasterAgent } from "./masterAgent";
import { PlannerAgent } from "./plannerAgent";
import { agentRegistry } from "./agentRegistry";

export async function orchestrateUserInput(
  userInput: string,
  apiKey: string
): Promise<{ result: any; rationale: string }> {
  // Step 1: Master agent creates pipeline plan:
  const master = new MasterAgent(apiKey);
  const pipelinePlan = await master.generatePipelinePlan(userInput);

  // Step 2: Planner agent formulates rationale for the pipeline
  const planner = new PlannerAgent(apiKey);
  const rationale = await planner.planDetailedExecution(userInput);

  // Step 3: Sequentially execute pipeline
  let current = userInput;
  for (const step of pipelinePlan) {
    const agentFn = agentRegistry[step.name];
    if (!agentFn) {
      throw new Error(`No agent found for step: ${step.name}`);
    }
    current = await agentFn(current, ...(step.args ?? []));
  }

  // Step 4: Return result and rationale to UI or user
  return { result: current, rationale };
}
