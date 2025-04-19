import { askGemini } from "../gemini";

/**
 * Master agent function that decides a pipeline based on the task description.
 * It returns a JSON-formatted string that indicates the steps.
 */
export async function masterAgent(
  input: string
): Promise<{ name: string; args?: any[] }[]> {
  const prompt = `You are a pipeline orchestrator. Analyze the input and respond ONLY with a JSON array describing the pipeline steps.

Rules:
1. Your response must be valid JSON
2. Start with '[' and end with ']'
3. Each step must have a "name" field
4. Use only these agent names: "summarize", "translate", "qa", "explain"
5. DO NOT include any text before or after the JSON
6. DO NOT include markdown formatting

Available agents:
- summarize: Summarizes lengthy text
- translate: Translates text to a specified language
- qa: Provides concise answers based on context and a question
- explain: Explains complex concepts simply

Example valid responses:
[{"name":"summarize","args":[]}]
[{"name":"translate","args":["Spanish"]}]
[{"name":"qa","args":["What is the main idea?"]}]

Input to analyze:
${input}`;

  const result = await askGemini(prompt);
  try {
    // Clean the response to ensure it only contains JSON
    const cleanResult = result.trim().replace(/^```json\s*|\s*```$/g, "");
    const pipelinePlan = JSON.parse(cleanResult);

    // Validate the structure
    if (!Array.isArray(pipelinePlan)) {
      throw new Error("Pipeline plan must be an array");
    }

    if (
      !pipelinePlan.every(
        (step) =>
          typeof step === "object" &&
          step !== null &&
          typeof step.name === "string" &&
          ["summarize", "translate", "qa", "explain"].includes(step.name)
      )
    ) {
      throw new Error("Invalid pipeline step format");
    }

    return pipelinePlan;
  } catch (error) {
    console.error(
      "Failed to parse pipeline plan. Defaulting to summarization.",
      error
    );
    // Fallback: default to a simple summarization pipeline
    return [{ name: "summarize", args: [] }];
  }
}
