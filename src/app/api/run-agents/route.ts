import { NextResponse } from "next/server";
import { agentRegistry } from "@/lib/agents/agentRegistry";

export async function POST(request: Request) {
  try {
    const { text, apiKey, selectedAgents } = await request.json();

    // Validate the request
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Determine which agents to run
    let agentsToRun: string[];

    if (
      selectedAgents &&
      Array.isArray(selectedAgents) &&
      selectedAgents.length > 0
    ) {
      // Use only the selected agents that exist in the registry
      agentsToRun = selectedAgents.filter((agent) =>
        Object.keys(agentRegistry).includes(agent)
      );

      // If no valid agents were selected, return an error
      if (agentsToRun.length === 0) {
        return NextResponse.json(
          { error: "No valid agents were selected" },
          { status: 400 }
        );
      }
    } else {
      // If no agents were specified, run all agents (original behavior)
      agentsToRun = Object.keys(agentRegistry);
    }

    const results: Record<string, any> = {};

    // Process selected agents sequentially
    for (const agentName of agentsToRun) {
      try {
        const agent = agentRegistry[agentName];
        const result = await agent(text, apiKey);
        results[agentName] = result;
      } catch (error) {
        console.error(`Error with ${agentName} agent:`, error);
        results[agentName] = `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to process with this agent"
        }`;
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error processing agents:", error);
    return NextResponse.json(
      { error: "Failed to process with agents" },
      { status: 500 }
    );
  }
}
