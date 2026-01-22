import { NextRequest, NextResponse } from "next/server";
import { tasks, runs, configure } from "@trigger.dev/sdk/v3";
import type { generateRankingStrategy } from "@/../../trigger/ai/ranking-strategy";
import { getRunOutput } from "@/lib/trigger-utils";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// CRITICAL: Configure SDK with secret key at module level
// The SDK will automatically use TRIGGER_SECRET_KEY if set, but we configure explicitly
// Do NOT call configure() inside handlers as it causes conflicts in warm serverless functions
if (process.env.TRIGGER_SECRET_KEY) {
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
}

export async function POST(request: NextRequest) {
  try {
    console.log("[AI Strategy POST] Starting request");
    
    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error("[AI Strategy POST] TRIGGER_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Trigger.dev is not configured. Please add TRIGGER_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { auditData, businessInfo } = body;

    if (!auditData) {
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    // Trigger the AI strategy generation task (SDK is already configured at module level)
    console.log("[AI Strategy POST] Triggering generate-ranking-strategy task...");
    const handle = await tasks.trigger<typeof generateRankingStrategy>(
      "generate-ranking-strategy",
      {
        auditData,
        businessInfo: businessInfo || {},
      }
    );
    console.log("[AI Strategy POST] Task triggered successfully. runId:", handle.id);

    return NextResponse.json({
      taskId: handle.id,
      status: "TRIGGERED",
      message: "AI strategy generation started",
    });
  } catch (error) {
    console.error("AI Strategy API error:", error);
    return NextResponse.json(
      { error: "Failed to start AI strategy generation", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // Get task status from Trigger.dev
    const run = await runs.retrieve(taskId);

    if (!run) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Get output, handling offloaded outputs
    let output = null;
    if (run.status === "COMPLETED") {
      try {
        output = await getRunOutput(taskId);
      } catch (error) {
        console.error("Error fetching output:", error);
      }
    }

    return NextResponse.json({
      taskId: run.id,
      status: run.status,
      output,
      createdAt: run.createdAt,
      finishedAt: run.finishedAt,
    });
  } catch (error) {
    console.error("AI Strategy status error:", error);
    return NextResponse.json(
      { error: "Failed to get task status", details: String(error) },
      { status: 500 }
    );
  }
}
