import { AgentMessage, CoreAIAgent } from "../ai";

export class MasterAgent {
  private coreAgent: CoreAIAgent;

  constructor(apiKey: string) {
    this.coreAgent = new CoreAIAgent(apiKey);
  }

  /**
   * Generates a pipeline plan based on the user input.
   *
   * Returns an array of objects representing the pipeline.
   * Example output:
   * [
   *   { "name": "summarize", "args": [] },
   *   { "name": "translate", "args": ["Spanish"] }
   * ]
   */
  async generatePipelinePlan(
    userInput: string
  ): Promise<{ name: string; args?: any[] }[]> {
    const prompt = `
Given the user input below, determine the best pipeline of AI agents to process the input.
The available agents are:
  - summarize: Summarizes lengthy text.
  - translate: Translates text into a target language. Default to English if text is not in English, otherwise use the specified target language.
  - qa: Answers questions based on context.
  - explain: Explains complex topics in simple terms.

Return your answer as a JSON array where each element contains the agent "name" and an optional "args" array.

IMPORTANT: The order of agents in the pipeline matters significantly and must be optimized for the particular task.
- If non-English text needs to be processed, translation should typically occur early in the pipeline.
- If text is very long, summarization might need to happen before other processing.
- Consider the most logical sequence that will produce the best final output.

For translation, if no target language is specified and the text appears to be in a non-English language, use English as the default target language.

User Input:
${userInput}

Example output:
[
  { "name": "summarize", "args": [] },
  { "name": "translate", "args": ["Spanish"] }
]
`;
    const messages: AgentMessage[] = [{ role: "system", content: prompt }];
    const result = await this.coreAgent.complete({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      temperature: 0,
      messages,
    });
    try {
      const pipelinePlan = JSON.parse(result);
      return pipelinePlan;
    } catch (error) {
      console.error(
        "Error parsing master agent output. Defaulting to a simple summarize pipeline.",
        error
      );
      return [{ name: "summarize", args: [] }];
    }
  }
}
