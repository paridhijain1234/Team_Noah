import fs from "fs";
import pdfParse from "pdf-parse";

interface PDFParseResult {
  text: string;
  numpages: number;
  info: {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    [key: string]: any;
  };
  metadata: {
    [key: string]: any;
  };
}

interface ChunkMetadata {
  pageNumber?: number;
  sectionHeader?: string;
  startIndex: number;
  endIndex: number;
  wordCount?: number;
  characterCount?: number;
}

interface TextChunk {
  content: string;
  metadata: ChunkMetadata;
}

/**
 * Cleans and normalizes text extracted from PDF
 * @param text - Raw text from PDF
 * @returns Cleaned and normalized text
 */
function cleanText(text: string): string {
  return (
    text
      // Remove multiple spaces
      .replace(/\s+/g, " ")
      // Remove multiple newlines
      .replace(/\n+/g, "\n")
      // Remove leading/trailing whitespace
      .trim()
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      // Remove special characters that might be artifacts
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      // Remove page numbers and headers/footers
      .replace(/\n\d+\n/g, "\n")
      // Remove empty lines
      .replace(/^\s*[\r\n]/gm, "")
  );
}

/**
 * Extracts section headers from text
 * @param text - Cleaned text
 * @returns Array of section headers with their positions
 */
function extractSectionHeaders(
  text: string
): { header: string; position: number }[] {
  const headers: { header: string; position: number }[] = [];
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    // Look for lines that might be headers (all caps, followed by empty line, etc.)
    if (
      line.length < 50 && // Reasonable header length
      line.trim().length > 0 && // Not empty
      (line === line.toUpperCase() || // All caps
        line.match(/^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/)) // Title case
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
 * Parses a PDF file and returns its text content and metadata
 * @param filePath - Path to the PDF file
 * @returns Promise containing the parsed PDF data
 * @throws Error if file cannot be read or parsed
 */
export async function parsePDF(filePath: string): Promise<PDFParseResult> {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    // Clean the extracted text
    data.text = cleanText(data.text);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error("Failed to parse PDF: Unknown error occurred");
  }
}

/**
 * Extracts text content from a PDF file
 * @param filePath - Path to the PDF file
 * @returns Promise containing the extracted text
 * @throws Error if file cannot be read or parsed
 */
export async function extractPDFText(filePath: string): Promise<string> {
  const data = await parsePDF(filePath);
  return data.text;
}

/**
 * Splits text into chunks by paragraphs
 * @param text - The text to split
 * @returns Array of text chunks with metadata
 */
export function chunkByParagraphs(text: string): TextChunk[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  let currentIndex = 0;

  return paragraphs.map((paragraph) => {
    const chunk: TextChunk = {
      content: paragraph.trim(),
      metadata: {
        startIndex: currentIndex,
        endIndex: currentIndex + paragraph.length,
        wordCount: paragraph.trim().split(/\s+/).length,
        characterCount: paragraph.trim().length,
      },
    };
    currentIndex += paragraph.length + 2; // +2 for the newlines
    return chunk;
  });
}

/**
 * Splits text into chunks by approximate token count
 * @param text - The text to split
 * @param maxTokens - Maximum number of tokens per chunk
 * @returns Array of text chunks with metadata
 */
export function chunkByTokens(
  text: string,
  maxTokens: number = 1000
): TextChunk[] {
  const words = text.split(/\s+/);
  const chunks: TextChunk[] = [];
  let currentChunk: string[] = [];
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

  // Add the last chunk if there are remaining words
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

/**
 * Splits PDF text into chunks with page numbers
 * @param filePath - Path to the PDF file
 * @returns Promise containing array of text chunks with page metadata
 */
export async function chunkByPages(filePath: string): Promise<TextChunk[]> {
  const data = await parsePDF(filePath);
  const chunks: TextChunk[] = [];
  let currentIndex = 0;

  // Split text by page markers (assuming each page starts with a newline)
  const pages = data.text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  pages.forEach((pageContent, index) => {
    const cleanedContent = cleanText(pageContent);
    chunks.push({
      content: cleanedContent,
      metadata: {
        pageNumber: index + 1,
        startIndex: currentIndex,
        endIndex: currentIndex + cleanedContent.length,
        wordCount: cleanedContent.split(/\s+/).length,
        characterCount: cleanedContent.length,
      },
    });
    currentIndex += cleanedContent.length + 2; // +2 for the newlines
  });

  return chunks;
}

/**
 * Extracts and chunks PDF content with all available metadata
 * @param filePath - Path to the PDF file
 * @param chunkSize - Maximum number of tokens per chunk (for token-based chunking)
 * @returns Object containing different chunking methods and original PDF data
 */
export async function extractAndChunkPDF(
  filePath: string,
  chunkSize: number = 1000
) {
  const data = await parsePDF(filePath);
  const headers = extractSectionHeaders(data.text);

  return {
    originalData: data,
    paragraphs: chunkByParagraphs(data.text),
    pages: await chunkByPages(filePath),
    tokens: chunkByTokens(data.text, chunkSize),
    headers,
    stats: {
      totalPages: data.numpages,
      totalWords: data.text.split(/\s+/).length,
      totalCharacters: data.text.length,
      sectionCount: headers.length,
    },
  };
}
