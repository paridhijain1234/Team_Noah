// Improved Gemini AI agent utility for Google Generative AI

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Retrieve the API key from environment variables for security.
const apiKey =
  process.env.GOOGLE_API_KEY || "AIzaSyDU026O5Wt5cq2EBM3vtesOkH3OWHkzoeY";
if (!apiKey || apiKey === "YOUR_FALLBACK_API_KEY") {
  throw new Error("GOOGLE_API_KEY must be set in environment variables.");
}

// Initialize the Google Generative AI instance
const genAI = new GoogleGenerativeAI(apiKey);

// Define agent types for better type checking
export type AgentType =
  | "summarize"
  | "translate"
  | "qa"
  | "analyze"
  | "creative"
  | "general";

/**
 * Core function to interact with the Gemini model.
 *
 * @param prompt - The input prompt to send to the model.
 * @returns The generated text response.
 * @throws Error if content generation fails.
 */
async function askGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // Verify that a valid response has been received.
    if (!result.response || !result.response.text) {
      throw new Error("No valid response returned from the model.");
    }

    return result.response.text();
  } catch (error) {
    console.error("Error in askGemini:", error);
    throw error;
  }
}

/**
 * Summarizer agent function: Summarizes text in simple language.
 *
 * @param text - The text to summarize.
 * @returns A summarized version of the input text.
 */
export async function summarizeAgent(text: string): Promise<string> {
  const prompt = `Summarize the following text in clear, simple language for a college student:\n\n${text}`;
  return await askGemini(prompt);
}

/**
 * Translator agent function: Translates text to a specified language.
 *
 * @param text - The text to translate.
 * @param toLang - The target language for translation.
 * @returns The translated text.
 */
export async function translateAgent(
  text: string,
  toLang: string
): Promise<string> {
  const prompt = `Translate the following text into ${toLang}. Only provide the translated text.\n\n${text}`;
  return await askGemini(prompt);
}

/**
 * Q&A agent function: Answers a question based on a given context.
 *
 * @param context - The context in which to base the answer.
 * @param question - The question to answer.
 * @returns A clear and concise answer.
 */
export async function qaAgent(
  context: string,
  question: string
): Promise<string> {
  const prompt = `Given the following context:\n${context}\n\nAnswer the following question in a clear and concise way:\n${question}`;
  return await askGemini(prompt);
}

/**
 * Analysis agent function: Analyzes text to extract insights, patterns, or information.
 *
 * @param text - The text to analyze.
 * @param analysisType - The type of analysis (sentiment, entities, key points, etc.).
 * @returns Analysis results.
 */
export async function analyzeAgent(
  text: string,
  analysisType: string
): Promise<string> {
  const prompt = `Analyze the following text for ${analysisType}. Provide a detailed analysis:\n\n${text}`;
  return await askGemini(prompt);
}

/**
 * Creative agent function: Generates creative content based on a prompt.
 *
 * @param prompt - The creative prompt.
 * @param contentType - The type of content to generate (story, poem, idea, etc.).
 * @returns Generated creative content.
 */
export async function creativeAgent(
  prompt: string,
  contentType: string
): Promise<string> {
  const creativePrompt = `Generate ${contentType} based on the following prompt. Be creative and engaging:\n\n${prompt}`;
  return await askGemini(creativePrompt);
}

/**
 * Master agent that directs requests to the appropriate specialized agent.
 *
 * @param input - The user's input or query
 * @param agentType - Optional type of agent to use (defaults to auto-detection)
 * @param options - Additional options for specific agent types
 * @returns Response from the appropriate agent
 */
export async function masterAgent(
  input: string,
  agentType?: AgentType,
  options?: {
    context?: string;
    language?: string;
    analysisType?: string;
    contentType?: string;
  }
): Promise<string> {
  // If no agent type specified, determine the most appropriate one
  if (!agentType) {
    const detectionPrompt = `Given this user input, which type of processing would be most appropriate? Respond with only one word: 'summarize', 'translate', 'qa', 'analyze', 'creative', or 'general'.\n\nUser input: ${input}`;
    agentType = (await askGemini(detectionPrompt))
      .toLowerCase()
      .trim() as AgentType;

    // Fallback to general if the response isn't a valid agent type
    if (
      !["summarize", "translate", "qa", "analyze", "creative"].includes(
        agentType
      )
    ) {
      agentType = "general";
    }
  }

  // Route to the appropriate specialized agent
  switch (agentType) {
    case "summarize":
      return await summarizeAgent(input);

    case "translate":
      if (!options?.language) {
        throw new Error("Language option is required for translation");
      }
      return await translateAgent(input, options.language);

    case "qa":
      if (!options?.context) {
        // If no context provided, use general knowledge
        return await askGemini(`Answer this question: ${input}`);
      }
      return await qaAgent(options.context, input);

    case "analyze":
      if (!options?.analysisType) {
        // Default to general analysis if no specific type provided
        return await analyzeAgent(input, "general insights");
      }
      return await analyzeAgent(input, options.analysisType);

    case "creative":
      if (!options?.contentType) {
        // Default to general creative content if no specific type provided
        return await creativeAgent(input, "creative content");
      }
      return await creativeAgent(input, options.contentType);

    case "general":
    default:
      return await askGemini(input);
  }
}

// Export the specialized agents and the master agent
export { askGemini };

//
// Example usage (Self-invoking function for testing purposes):
//
(async () => {
  if (process.env.NODE_ENV === "development") {
    try {
      console.log("Testing Master Agent System...");

      // Test using masterAgent with auto-detection
      console.log("\nTesting auto-detection:");
      const autoDetectResult = await masterAgent(
        "What is the capital of France?"
      );
      console.log("Auto-detected response:", autoDetectResult);

      // Test explicit agent usage through masterAgent
      console.log("\nTesting summarization:");
      const sampleText = `
      Understanding DC Circuits
      
      A DC (Direct Current) circuit is an electric circuit in which the current flows in one constant direction. Unlike AC (Alternating Current), where the flow of electrons periodically reverses direction, DC maintains a steady flow, making it ideal for devices like batteries, smartphones, and electronic circuits.
      
      In a basic DC circuit, the current is produced by a power source such as a battery or a DC power supply, which provides a constant voltage. This voltage causes electrons to move from the negative terminal of the power source, through the circuit, and back into the positive terminal.
      
      The main components of a DC circuit include:
      - Power Source: Provides the voltage (e.g., battery).
      - Conductors (Wires): Pathways for current to flow.
      - Load: A device or component that uses the electrical energy (e.g., bulb, resistor).
      - Switch (optional): Controls the flow of current by opening or closing the circuit.
      
      Ohm's Law states that V = I × R. DC circuits can be configured in series or parallel and are governed by Kirchhoff's Laws.
      `;
      const summary = await masterAgent(sampleText, "summarize");
      console.log("Summary:", summary);

      // Test translation
      console.log("\nTesting translation:");
      const translation = await masterAgent(
        "Hello, how are you?",
        "translate",
        {
          language: "Spanish",
        }
      );
      console.log("Translation:", translation);

      // Test Q&A
      console.log("\nTesting Q&A:");
      const qaResponse = await masterAgent("What shape is the Earth?", "qa", {
        context: "The Earth is a round planet that orbits the Sun.",
      });
      console.log("Q&A:", qaResponse);

      // Test analysis
      console.log("\nTesting analysis:");
      const analysisResponse = await masterAgent(
        "I love this product! It works perfectly and arrived on time.",
        "analyze",
        {
          analysisType: "sentiment",
        }
      );
      console.log("Analysis:", analysisResponse);

      // Test creative
      console.log("\nTesting creative:");
      const creativeResponse = await masterAgent(
        "A detective finds a mysterious object in an abandoned house",
        "creative",
        {
          contentType: "short story",
        }
      );
      console.log("Creative:", creativeResponse);
    } catch (error) {
      console.error("Agent Error:", error);
    }
  }
})();