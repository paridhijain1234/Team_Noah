import { NextResponse } from "next/server";
import { agentRegistry } from "@/lib/agents/agentRegistry";

export async function POST(request: Request) {
  try {
    const { text, apiKey } = await request.json();

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

    // Process with all agents
    const agentNames = Object.keys(agentRegistry);
    const results: Record<string, any> = {};

    // Process agents sequentially
    for (const agentName of agentNames) {
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
