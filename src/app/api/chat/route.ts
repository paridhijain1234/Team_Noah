import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { embeddingStore } from "@/lib/store";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { messages, pdfId } = await req.json();
    const lastMessage = messages[messages.length - 1];

    let context = "";
    if (pdfId) {
      const pdfData = embeddingStore.get(pdfId);
      console.log("PDF Data found:", pdfData ? "Yes" : "No");
      console.log(
        "PDF Data structure:",
        pdfData ? Object.keys(pdfData) : "No data"
      );

      if (pdfData && pdfData.embeddings && pdfData.embeddings.length > 0) {
        console.log("Number of embeddings:", pdfData.embeddings.length);
        console.log(
          "Sample embedding structure:",
          Object.keys(pdfData.embeddings[0])
        );

        // Get embedding for the user's question
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(lastMessage.content);
        const questionEmbedding = result.embedding.values;
        console.log("Question embedding length:", questionEmbedding.length);

        // Find most relevant chunks
        const relevantChunks = findRelevantChunks(
          questionEmbedding,
          pdfData.embeddings,
          5 // Increased number of chunks for better context
        );

        console.log("Relevant chunks found:", relevantChunks.length);
        if (relevantChunks.length > 0) {
          console.log(
            "Sample relevant chunk:",
            relevantChunks[0].content.substring(0, 100) + "..."
          );
        }

        // Combine relevant chunks into context with metadata
        context = relevantChunks
          .map((chunk, index) => {
            const metadata = chunk.metadata || {};
            return `[Context ${index + 1}]:
${chunk.content}
[Metadata: Page ${metadata.pageNumber || "unknown"}, Chunk ${
              metadata.chunkNumber || "unknown"
            }]`;
          })
          .join("\n\n");
      } else {
        console.warn("No valid embeddings found in PDF data");
      }
    }

    // Get a language model
    const model = google("gemini-2.0-flash-001");

    // Prepare the prompt with context if available
    const systemMessage = context
      ? `You are a helpful AI assistant that has access to a PDF document. Here is some relevant context from the PDF that might help answer the user's question:

${context}

Please use this context to answer the user's question. If the context doesn't contain enough information to answer the question, please say so. If you can answer based on the context, please do so while referencing the relevant information. Try to maintain context continuity in your response.`
      : "You are a helpful AI assistant. Please answer the user's question.";

    // Call the language model with the prompt
    const result = streamText({
      model,
      messages: [{ role: "system", content: systemMessage }, ...messages],
      maxTokens: 8192,
      temperature: 0.7,
      topP: 0.4,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Error processing chat request", { status: 500 });
  }
}

function findRelevantChunks(
  questionEmbedding: number[],
  chunks: { content: string; embedding: number[]; metadata?: any }[],
  topK: number = 5
) {
  // Calculate cosine similarity for each chunk
  const similarities = chunks.map((chunk) => ({
    ...chunk,
    similarity: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  // Sort by similarity and get top K
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    console.warn(`Vector length mismatch: ${a.length} vs ${b.length}`);
    return 0;
  }

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    console.warn("Zero magnitude vector detected");
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}
