import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

interface FlashCard {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options?: string[];
  answer?: string;
}

interface PracticeProblem {
  problem: string;
  solution?: string;
}

interface AgentResults {
  [agentName: string]: unknown;
  flashcard?: {
    flashcards: FlashCard[];
  };
  quiz?: {
    questions: QuizQuestion[];
  };
  practiceProblems?: {
    problems: PracticeProblem[];
  };
  translate?: {
    translations: Record<string, string>;
  };
}

// Helper function to format agent results into a readable format
function formatResults(results: AgentResults): string {
  let content = "";
  
  for (const [agentName, result] of Object.entries(results)) {
    content += `# ${agentName.charAt(0).toUpperCase() + agentName.slice(1)}\n\n`;
    
    // Format based on different agent result structures
    if (typeof result === "string") {
      content += result + "\n\n";
    } else if (agentName === "flashcard") {
      // Handle flashcards
      const flashcardResult = result as AgentResults["flashcard"];
      if (flashcardResult?.flashcards?.length) {
        flashcardResult.flashcards.forEach((card, index) => {
          content += `## Flashcard ${index + 1}\n`;
          content += `**Front:** ${card.front}\n`;
          content += `**Back:** ${card.back}\n\n`;
        });
      }
    } else if (agentName === "quiz") {
      // Handle quiz questions
      const quizResult = result as AgentResults["quiz"];
      if (quizResult?.questions?.length) {
        quizResult.questions.forEach((q, index) => {
          content += `## Question ${index + 1}\n`;
          content += `${q.question}\n`;
          
          if (q.options?.length) {
            q.options.forEach((option, i) => {
              content += `${String.fromCharCode(65 + i)}. ${option}\n`;
            });
          }
          
          if (q.answer) {
            content += `**Answer:** ${q.answer}\n\n`;
          }
        });
      }
    } else if (agentName === "practiceProblems") {
      // Handle practice problems
      const problemsResult = result as AgentResults["practiceProblems"];
      if (problemsResult?.problems?.length) {
        problemsResult.problems.forEach((problem, index) => {
          content += `## Problem ${index + 1}\n`;
          content += `${problem.problem}\n`;
          if (problem.solution) {
            content += `**Solution:** ${problem.solution}\n\n`;
          }
        });
      }
    } else if (agentName === "translate") {
      // Handle translations
      const translateResult = result as AgentResults["translate"];
      if (translateResult?.translations) {
        Object.entries(translateResult.translations).forEach(([language, text]) => {
          content += `## ${language}\n${text}\n\n`;
        });
      }
    } else {
      // Default handling for other types
      content += JSON.stringify(result, null, 2) + "\n\n";
    }
  }
  
  return content;
}

export async function POST(req: NextRequest) {
  try {
    const { results, title } = await req.json();
    
    if (!results || Object.keys(results).length === 0) {
      return NextResponse.json(
        { error: "No content to export" },
        { status: 400 }
      );
    }

    // Get the API key from environment variables
    const apiKey = process.env.GOOGLE_API_KEY;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    
    if (!apiKey || !clientId || !clientSecret || !redirectUri || !refreshToken) {
      console.error("Missing Google API credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create an OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Set credentials using the refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    // Create a new Google Docs instance
    const docs = google.docs({ version: "v1", auth: oauth2Client });
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    // Format the content
    const formattedContent = formatResults(results as AgentResults);
    
    // Create a new document
    const createResponse = await docs.documents.create({
      requestBody: {
        title: title || "AI Learning Notes",
      },
    });
    
    const documentId = createResponse.data.documentId;
    
    if (!documentId) {
      throw new Error("Failed to create Google Doc");
    }
    
    // Prepare the content for insertion
    const requests = [
      {
        insertText: {
          location: {
            index: 1,
          },
          text: formattedContent,
        },
      },
    ];
    
    // Update the document with content
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests,
      },
    });
    
    // Get the webViewLink to return to the client
    const fileResponse = await drive.files.get({
      fileId: documentId,
      fields: "webViewLink",
    });
    
    const webViewLink = fileResponse.data.webViewLink;
    
    return NextResponse.json({
      success: true,
      documentId,
      url: webViewLink,
      message: "Successfully exported to Google Docs",
    });
  } catch (error) {
    console.error("Error exporting to Google Docs:", error);
    return NextResponse.json(
      { error: "Failed to export to Google Docs" },
      { status: 500 }
    );
  }
} 