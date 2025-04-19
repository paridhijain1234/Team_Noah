import { NextResponse } from "next/server";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import pdfParse from "pdf-parse";

/**
 * API endpoint to process PDF files
 * This handles file upload, text extraction, and processing with AI agents
 */
export async function POST(request: Request) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const apiKey = formData.get("apiKey") as string | null;

    // Validate input
    if (!file) {
      return NextResponse.json(
        { error: "PDF file is required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // File size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const pdfText = await extractTextFromPDF(file);

    if (!pdfText || !pdfText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    // Process with all agents
    const agentNames = Object.keys(agentRegistry);
    const results: Record<string, unknown> = {};

    // Process agents sequentially
    for (const agentName of agentNames) {
      try {
        const agent = agentRegistry[agentName];
        const result = await agent(pdfText, apiKey);
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
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF file" },
      { status: 500 }
    );
  }
}

/**
 * Extract text from a PDF file using pdf-parse
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Convert file to array buffer for processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use pdf-parse to extract text from the PDF
    const data = await pdfParse(buffer);

    // Return extracted text
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
