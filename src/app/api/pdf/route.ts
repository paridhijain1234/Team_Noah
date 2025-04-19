import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { embeddingStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

interface EmbeddingChunk {
  content: string;
  embedding: number[];
  metadata: {
    chunkNumber: number;
    startIndex: number;
    endIndex: number;
    characterCount: number;
    isLastChunk: boolean;
    embeddingModel: string;
    embeddingDimension: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse the PDF
    const data = await pdfParse(buffer);
    console.log("PDF parsed successfully, pages:", data.numpages);

    // Clean the text
    const cleanedText = cleanText(data.text);
    console.log("Text cleaned, length:", cleanedText.length);

    // Extract headers
    const headers = extractSectionHeaders(cleanedText);
    console.log("Headers extracted:", headers.length);

    // Create chunks
    const chunks = {
      paragraphs: chunkByParagraphs(cleanedText),
      pages: chunkByPages(cleanedText),
      tokens: chunkByTokens(cleanedText),
      fixedSize: chunkByFixedSize(cleanedText),
      headers,
      stats: {
        totalPages: data.numpages,
        totalWords: cleanedText.split(/\s+/).length,
        totalCharacters: cleanedText.length,
        sectionCount: headers.length,
      },
    };

    console.log("Chunks created:", {
      paragraphs: chunks.paragraphs.length,
      pages: chunks.pages.length,
      tokens: chunks.tokens.length,
      fixedSize: chunks.fixedSize.length,
    });

    // Generate embeddings for fixed-size chunks
    const embeddingChunks = await generateEmbeddings(chunks.fixedSize);
    console.log("Embeddings generated:", embeddingChunks.length);

    // Generate a unique ID for this PDF
    const pdfId = uuidv4();
    console.log("Generated PDF ID:", pdfId);

    // Prepare data for storage
    const pdfData = {
      id: pdfId,
      filename: file.name,
      text: cleanedText,
      embeddings: embeddingChunks,
      stats: chunks.stats,
      timestamp: Date.now(),
    };

    // Save to store
    embeddingStore.save(pdfId, pdfData);
    console.log("Data saved to store with ID:", pdfId);

    // Verify storage
    const storedData = embeddingStore.get(pdfId);
    if (!storedData) {
      throw new Error("Failed to store PDF data");
    }
    console.log("Verified storage, embeddings:", storedData.embeddings.length);

    return NextResponse.json({
      id: pdfId,
      text: cleanedText,
      ...chunks,
      embeddings: embeddingChunks,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}

/**
 * Generates embeddings for text chunks using Google's Gemini embedding model
 * @param chunks - Array of text chunks
 * @returns Array of chunks with embeddings
 */
async function generateEmbeddings(chunks: any[]): Promise<EmbeddingChunk[]> {
  try {
    const embeddingChunks: EmbeddingChunk[] = [];

    // Process chunks in batches to avoid rate limits
    const batchSize = 5; // Reduced batch size for better reliability
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      console.log(
        `Processing batch ${i / batchSize + 1} of ${Math.ceil(
          chunks.length / batchSize
        )}`
      );

      // Process each chunk individually
      for (const chunk of batch) {
        try {
          const result = await model.embedContent(chunk.content);
          const embedding = result.embedding.values;

          if (!embedding || embedding.length === 0) {
            console.warn(
              `Empty embedding for chunk: ${chunk.content.substring(0, 50)}...`
            );
            continue;
          }

          embeddingChunks.push({
            content: chunk.content,
            embedding: embedding,
            metadata: {
              chunkNumber: i + embeddingChunks.length,
              startIndex: chunk.metadata?.startIndex || 0,
              endIndex: chunk.metadata?.endIndex || chunk.content.length,
              characterCount: chunk.content.length,
              isLastChunk: i + batchSize >= chunks.length,
              embeddingModel: "text-embedding-004",
              embeddingDimension: embedding.length,
            },
          });
        } catch (error: any) {
          console.error(`Error processing chunk: ${error.message}`);
          continue;
        }
      }
    }

    console.log(`Generated ${embeddingChunks.length} embeddings successfully`);
    return embeddingChunks;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

// Text processing utilities
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\n\d+\n/g, "\n")
    .replace(/^\s*[\r\n]/gm, "");
}

function extractSectionHeaders(
  text: string
): { header: string; position: number }[] {
  const headers: { header: string; position: number }[] = [];
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    if (
      line.length < 50 &&
      line.trim().length > 0 &&
      (line === line.toUpperCase() ||
        line.match(/^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/))
    ) {
      headers.push({
        header: line.trim(),
        position: index,
      });
    }
  });

  return headers;
}

/**
 * Splits text into fixed-size chunks using regex
 * @param text - The text to split
 * @param chunkSize - Size of each chunk in characters
 * @returns Array of text chunks with metadata
 */
function chunkByFixedSize(text: string, chunkSize: number = 500) {
  const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
  let currentIndex = 0;

  return chunks.map((chunk, index) => ({
    content: chunk,
    metadata: {
      chunkNumber: index + 1,
      startIndex: currentIndex,
      endIndex: currentIndex + chunk.length,
      characterCount: chunk.length,
      isLastChunk: index === chunks.length - 1,
    },
  }));
}

function chunkByParagraphs(text: string) {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  let currentIndex = 0;

  return paragraphs.map((paragraph) => ({
    content: paragraph.trim(),
    metadata: {
      startIndex: currentIndex,
      endIndex: currentIndex + paragraph.length,
      wordCount: paragraph.trim().split(/\s+/).length,
      characterCount: paragraph.trim().length,
    },
  }));
}

function chunkByPages(text: string) {
  const pages = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  let currentIndex = 0;

  return pages.map((pageContent, index) => {
    const cleanedContent = cleanText(pageContent);
    return {
      content: cleanedContent,
      metadata: {
        pageNumber: index + 1,
        startIndex: currentIndex,
        endIndex: currentIndex + cleanedContent.length,
        wordCount: cleanedContent.split(/\s+/).length,
        characterCount: cleanedContent.length,
      },
    };
  });
}

function chunkByTokens(text: string, maxTokens: number = 1000) {
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let currentIndex = 0;

  for (const word of words) {
    currentChunk.push(word);

    if (currentChunk.length >= maxTokens) {
      const chunkText = currentChunk.join(" ");
      chunks.push({
        content: chunkText,
        metadata: {
          startIndex: currentIndex,
          endIndex: currentIndex + chunkText.length,
          wordCount: currentChunk.length,
          characterCount: chunkText.length,
        },
      });
      currentIndex += chunkText.length + 1;
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    const chunkText = currentChunk.join(" ");
    chunks.push({
      content: chunkText,
      metadata: {
        startIndex: currentIndex,
        endIndex: currentIndex + chunkText.length,
        wordCount: currentChunk.length,
        characterCount: chunkText.length,
      },
    });
  }

  return chunks;
}
