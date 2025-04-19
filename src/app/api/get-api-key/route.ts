import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEBIUS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Return the API key in a JSON response
    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error("Error in get-api-key route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
