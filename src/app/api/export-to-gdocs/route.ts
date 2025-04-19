import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { marked } from "marked" // Add this to your dependencies

interface FlashCard {
  front: string
  back: string
}

interface QuizQuestion {
  question: string
  options?: string[]
  answer?: string
}

interface PracticeProblem {
  problem: string
  solution?: string
}

interface AgentResults {
  [agentName: string]: unknown
  flashcard?: {
    flashcards: FlashCard[]
  }
  quiz?: {
    questions: QuizQuestion[]
  }
  practiceProblems?: {
    problems: PracticeProblem[]
  }
  translate?: {
    translations: Record<string, string>
  }
}

// Helper function to format agent results into a structured markdown format
function formatResults(results: AgentResults): string {
  let content = ""

  for (const [agentName, result] of Object.entries(results)) {
    // Ensure proper spacing between sections
    if (content) content += "\n\n";
    
    // Use proper heading format with no extra spaces
    content += `# ${agentName.charAt(0).toUpperCase() + agentName.slice(1)}\n\n`

    // Format based on different agent result structures
    if (typeof result === "string") {
      content += result
    } else if (agentName === "flashcard") {
      // Handle flashcards
      const flashcardResult = result as AgentResults["flashcard"]
      if (flashcardResult?.flashcards?.length) {
        flashcardResult.flashcards.forEach((card, index) => {
          content += `## Flashcard ${index + 1}\n\n`
          content += `**Front:** ${card.front}\n\n`
          content += `**Back:** ${card.back}\n\n`
        })
      }
    } else if (agentName === "quiz") {
      // Handle quiz questions
      const quizResult = result as AgentResults["quiz"]
      if (quizResult?.questions?.length) {
        quizResult.questions.forEach((q, index) => {
          content += `## Question ${index + 1}\n\n`
          content += `${q.question}\n\n`

          if (q.options?.length) {
            q.options.forEach((option, i) => {
              content += `${String.fromCharCode(65 + i)}. ${option}\n`
            })
            content += "\n"
          }

          if (q.answer) {
            content += `**Answer:** ${q.answer}\n\n`
          }
        })
      }
    } else if (agentName === "practiceProblems") {
      // Handle practice problems
      const problemsResult = result as AgentResults["practiceProblems"]
      if (problemsResult?.problems?.length) {
        problemsResult.problems.forEach((problem, index) => {
          content += `## Problem ${index + 1}\n\n`
          content += `${problem.problem}\n\n`
          if (problem.solution) {
            content += `**Solution:** ${problem.solution}\n\n`
          }
        })
      }
    } else if (agentName === "translate") {
      // Handle translations
      const translateResult = result as AgentResults["translate"]
      if (translateResult?.translations) {
        Object.entries(translateResult.translations).forEach(([language, text]) => {
          content += `## ${language}\n\n${text}\n\n`
        })
      }
    } else {
      // Format complex objects better
      try {
        if (typeof result === 'object' && result !== null) {
          const objResult = result as Record<string, any>;
          
          for (const [key, value] of Object.entries(objResult)) {
            content += `## ${key}\n\n`;
            
            if (typeof value === 'string') {
              content += `${value}\n\n`;
            } else if (Array.isArray(value)) {
              value.forEach((item, idx) => {
                content += `### Item ${idx + 1}\n\n`;
                if (typeof item === 'object' && item !== null) {
                  Object.entries(item).forEach(([k, v]) => {
                    content += `**${k}:** ${v}\n\n`;
                  });
                } else {
                  content += `${item}\n\n`;
                }
              });
            } else if (typeof value === 'object' && value !== null) {
              Object.entries(value).forEach(([k, v]) => {
                content += `**${k}:** ${v}\n\n`;
              });
            } else {
              content += `${value}\n\n`;
            }
          }
        } else {
          // Use pretty JSON formatting with proper spacing
          content += "```json\n" + JSON.stringify(result, null, 2) + "\n```\n\n";
        }
      } catch (err) {
        content += "```json\n" + JSON.stringify(result, null, 2) + "\n```\n\n";
      }
    }
  }

  return content.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { results, title } = await req.json()

    if (!results || Object.keys(results).length === 0) {
      return NextResponse.json({ error: "No content to export" }, { status: 400 })
    }

    // Get the user session from NextAuth
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get Google tokens from the database
    const userId = session.user.id;

    const googleAccount = await prisma.account.findFirst({
      where: { 
        userId,
        provider: "google" 
      }
    });
    
    if (!googleAccount || !googleAccount.access_token) {
      return NextResponse.json({ error: "Google account not connected or missing permissions" }, { status: 403 })
    }

    // Create an OAuth2 client with the tokens from the session
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    // Set credentials using the access token from the session
    oauth2Client.setCredentials({
      access_token: googleAccount.access_token,
      refresh_token: googleAccount.refresh_token,
      expiry_date: googleAccount.expires_at ? googleAccount.expires_at * 1000 : undefined,
    })
    
    // Create Drive API client
    const drive = google.drive({ 
      version: "v3", 
      auth: oauth2Client 
    })
    
    // Test connection with a simple Drive API call
    try {
      await drive.about.get({ fields: 'user' });
    } catch (error) {
      console.error("Drive API test failed:", error.response?.data || error);
      return NextResponse.json({ 
        error: "Failed to connect to Google Drive API", 
        details: error.response?.data?.error?.message || error.message 
      }, { status: 403 });
    }

    // Format the content for the document using markdown
    const formattedMarkdown = formatResults(results as AgentResults);
    
    try {
      // Format the current date
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/');
      
      // Create document title with date
      const documentTitle = `${title || "AI Learning Notes"} - ${formattedDate}`;
      
      // Use marked library to convert markdown to HTML
      // Install marked with: npm install marked
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta content="text/html; charset=UTF-8" http-equiv="content-type">
            <title>${documentTitle}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 40px;
                line-height: 1.6;
                color: #333;
              }
              h1 {
                font-size: 24px;
                margin-top: 30px;
                margin-bottom: 16px;
                color: #333;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
              }
              h2 {
                font-size: 20px;
                margin-top: 25px;
                margin-bottom: 12px;
                color: #444;
              }
              h3 {
                font-size: 18px;
                margin-top: 20px;
                margin-bottom: 8px;
                color: #555;
              }
              p {
                margin: 12px 0;
              }
              strong {
                font-weight: bold;
              }
              em {
                font-style: italic;
              }
              code {
                font-family: Consolas, Monaco, 'Courier New', monospace;
                background-color: #f4f4f4;
                padding: 2px 4px;
                border-radius: 3px;
              }
              pre {
                background-color: #f4f4f4;
                padding: 16px;
                border-radius: 4px;
                overflow-x: auto;
                font-family: Consolas, Monaco, 'Courier New', monospace;
                margin: 16px 0;
              }
              ul {
                margin-left: 20px;
                padding-left: 20px;
              }
              li {
                margin: 8px 0;
              }
              blockquote {
                border-left: 4px solid #ddd;
                padding-left: 16px;
                margin: 16px 0;
                color: #666;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 16px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px 12px;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
              }
            </style>
          </head>
          <body>
            <h1>${documentTitle}</h1>
            ${marked(formattedMarkdown)}
          </body>
        </html>
      `;
      
      // Create file metadata
      const fileMetadata = {
        name: documentTitle,
        mimeType: 'application/vnd.google-apps.document'
      };
      
      // Create media with HTML content
      const media = {
        mimeType: 'text/html',
        body: htmlContent
      };
      
      // Create and upload the file
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,webViewLink'
      });
      
      return NextResponse.json({
        success: true,
        documentId: response.data.id,
        url: response.data.webViewLink,
        message: "Successfully exported to Google Docs"
      });
    } catch (error) {
      console.error("Error creating document:", error.response?.data || error);
      
      const googleError = error.response?.data?.error || {};
      
      return NextResponse.json({ 
        error: "Failed to export to Google Docs", 
        details: googleError.message || error.message 
      }, { status: error.response?.status || 500 });
    }
  } catch (error) {
    console.error("Error exporting to Google Docs:", error)
    return NextResponse.json({ 
      error: "Failed to export to Google Docs",
      details: error.message
    }, { status: 500 })
  }
}