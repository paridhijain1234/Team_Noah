import { CoreAIAgent, AgentMessage } from "../ai";

export class PlannerAgent {
  private coreAgent: CoreAIAgent;

  constructor(apiKey: string) {
    this.coreAgent = new CoreAIAgent(apiKey);
  }

  /**
   * Produces a detailed plan for executing a pipeline based on the user input.
   *
   * Returns a text explanation with each pipeline step and rationale.
   */
  async planDetailedExecution(userInput: string): Promise<string> {
    const prompt = `
Based on the following user input, provide a detailed plan for executing a pipeline using modular AI agents.
Your plan should list:
  - Which agents will be used (for example, summarize, translate, qa, explain)
  - The order in which they will be called
  - A detailed rationale for choosing each agent in that specific order.

Pay particular attention to the ORDER of operations:
  - Translation should typically happen early if text is not in the desired language
  - Summarization may need to happen before or after translation depending on the content
  - Explain or QA operations typically work best after content is in the right language and length

Explain WHY this specific ordering is the most effective for the given input.

User Input:
${userInput}

Plan:
`;
    const messages: AgentMessage[] = [{ role: "system", content: prompt }];
    const result = await this.coreAgent.complete({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      temperature: 0,
      messages,
    });
    return result;
  }
}
