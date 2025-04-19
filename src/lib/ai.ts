// CoreAIAgent.ts

import { OpenAI } from "openai";

// Type for individual messages
export type AgentMessage = {
  role: "system" | "assistant" | "user";
  content: string;
};

// Options to customize the API call
export interface AgentOptions {
  model: string;
  temperature?: number;
  messages: AgentMessage[];
}

// Core AI Agent Template class
export class CoreAIAgent {
  private client: OpenAI;

  constructor(
    apiKey: string,
    baseURL: string = "https://api.studio.nebius.com/v1/"
  ) {
    if (!apiKey) {
      throw new Error(
        "API key is not provided. Please check your configuration."
      );
    }
    this.client = new OpenAI({
      baseURL,
      apiKey,
      defaultHeaders: {
        "Content-Type": "application/json",
      },
      dangerouslyAllowBrowser: true, // Allow browser usage with caution
    });
  }

  async complete(options: AgentOptions): Promise<string> {
    try {
      console.log(
        `Sending request to ${this.client.baseURL} with model ${options.model}`
      );

      const response = await this.client.chat.completions.create({
        model: options.model,
        temperature: options.temperature ?? 0,
        messages: options.messages,
      });

      if (
        !response ||
        !response.choices ||
        !response.choices[0] ||
        !response.choices[0].message ||
        !response.choices[0].message.content
      ) {
        throw new Error("Invalid response structure received from API.");
      }
      return response.choices[0].message.content;
    } catch (error: any) {
      console.error("Core agent error:", error);

      // More detailed error handling
      if (error.code === "ECONNREFUSED" || error.message?.includes("connect")) {
        return "Error: Connection to AI service failed. Please check your internet connection and try again later.";
      } else if (
        error.status === 401 ||
        error.message?.includes("authentication")
      ) {
        return "Error: Authentication failed. Please check your API key.";
      } else if (error.status === 429) {
        return "Error: Rate limit exceeded. Please try again later.";
      } else if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        return `Error: Service returned ${error.response.status}. Please try again later.`;
      }

      // Generic fallback error message
      return "Error: Something went wrong when connecting to the AI service. Please try again later.";
    }
  }
}
