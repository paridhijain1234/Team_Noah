// pages/api/autoPipeline.ts
import { autoOrchestratePipeline } from "@/lib/orchestrator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const result = await autoOrchestratePipeline(text);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
