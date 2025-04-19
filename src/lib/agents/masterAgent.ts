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

Return your answer as a valid JSON array where each element contains the agent "name" and an optional "args" array.
ONLY return the JSON array and nothing else - no explanation text, no markdown formatting, no backticks.

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
      model: "deepseek-ai/DeepSeek-V3-0324",
      temperature: 0,
      messages,
    });
    try {
      console.log("Raw AI response:", result);

      // First attempt: Try to manually extract an array using regex
      const jsonMatch = result.match(/\[\s*{[\s\S]*}\s*\]/);
      let jsonString = "";

      if (jsonMatch) {
        jsonString = jsonMatch[0];
      } else {
        // If no match, remove common non-JSON text and try the full response
        jsonString = result
          .replace(/```json|```/g, "") // Remove code block markers
          .replace(/^[^[\{]*/g, "") // Remove any text before the first [ or {
          .replace(/[^}\]]*$/g, "") // Remove any text after the last } or ]
          .trim();
      }

      // Additional sanitization for common issues
      jsonString = jsonString
        .replace(/\\(?!["\\/bfnrt])/g, "\\\\") // Escape unescaped backslashes
        .replace(/\/\/.*/g, "") // Remove any potential inline comments
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove any potential block comments
        .replace(/:\s*([a-zA-Z][a-zA-Z0-9_]*)\s*(,|})/g, ':"$1"$2') // Convert unquoted string values to quoted
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'); // Ensure property names are properly quoted

      console.log("Sanitized JSON string:", jsonString);

      // Now try to parse the sanitized JSON
      const pipelinePlan = JSON.parse(jsonString);

      // Validate that we have a proper array of objects with the required properties
      if (!Array.isArray(pipelinePlan)) {
        throw new Error("Parsed result is not an array");
      }

      // Validate each item in the array
      for (const item of pipelinePlan) {
        if (typeof item !== "object" || !item.name) {
          throw new Error("Pipeline item missing required 'name' property");
        }
      }

      return pipelinePlan;
    } catch (error) {
      console.error(
        "Error parsing master agent output. Defaulting to a simple summarize pipeline.",
        error
      );
      console.error("Problematic response:", result);
      return [{ name: "summarize", args: [] }];
    }
  }
}
