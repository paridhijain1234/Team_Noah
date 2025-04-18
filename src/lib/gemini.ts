// Gemini AI agent utility for Google Generative AI

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// const apiKey = process.env.GOOGLE_API_KEY;
const apiKey = "AIzaSyDU026O5Wt5cq2EBM3vtesOkH3OWHkzoeY";
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

// Unified Gemini core agent utility
async function askGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
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
  return result.response.text();
}

// Summarizer Agent
export async function summarizeAgent(text: string): Promise<string> {
  const prompt = `Summarize the following text in clear, simple language for a college student:\n\n${text}`;
  return await askGemini(prompt);
}

// Translator Agent
export async function translateAgent(
  text: string,
  toLang: string
): Promise<string> {
  const prompt = `Translate the following text into ${toLang}. Only provide the translated text.\n\n${text}`;
  return await askGemini(prompt);
}

// Q&A Agent
export async function qaAgent(
  context: string,
  question: string
): Promise<string> {
  const prompt = `Given the following context:\n${context}\n\nAnswer the following question in a clear and concise way:\n${question}`;
  return await askGemini(prompt);
}

// General-purpose Gemini function (as before)
export { askGemini };
(async () => {
  try {
    // Test the summarize agent function
    const summary = await summarizeAgent(
      `Understanding DC Circuits
A DC (Direct Current) circuit is an electric circuit in which the current flows in one constant direction. Unlike AC (Alternating Current), where the flow of electrons periodically reverses direction, DC maintains a steady flow, making it ideal for devices like batteries, smartphones, and electronic circuits.

In a basic DC circuit, the current is produced by a power source such as a battery or a DC power supply, which provides a constant voltage. This voltage causes electrons to move from the negative terminal of the power source, through the circuit, and back into the positive terminal.

The main components of a DC circuit include:

Power Source: Provides the voltage (e.g., battery).

Conductors (Wires): Pathways for current to flow.

Load: A device or component that uses the electrical energy (e.g., bulb, resistor).

Switch (optional): Controls the flow of current by opening or closing the circuit.

One of the fundamental laws used in DC circuit analysis is Ohm’s Law, which states:

𝑉
=
𝐼
×
𝑅
V=I×R
Where:

𝑉
V is Voltage (volts),

𝐼
I is Current (amperes),

𝑅
R is Resistance (ohms).

DC circuits can be configured in series or parallel:

In a series circuit, all components are connected end-to-end, so there is only one path for the current to flow. The current is the same through all components, but the voltage drops across each one.

In a parallel circuit, the components are connected across the same two points, creating multiple paths for the current. The voltage across each branch is the same, but the current divides according to the resistance of each path.

Kirchhoff’s Laws also play a vital role in DC circuit analysis:

Kirchhoff’s Current Law (KCL): The total current entering a junction equals the total current leaving the junction.

Kirchhoff’s Voltage Law (KVL): The sum of all voltages around a closed loop equals zero.

DC circuits are essential for understanding how most electronic devices work. Learning to analyze them builds the foundation for deeper concepts in electrical engineering and electronics.`
    );
    console.log("Summary:", summary);
  } catch (error) {
    console.error("Error:", error);
  }
})();
