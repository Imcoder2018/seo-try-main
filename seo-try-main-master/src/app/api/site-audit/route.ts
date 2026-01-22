import { NextRequest, NextResponse } from "next/server";
import { tasks, runs, configure } from "@trigger.dev/sdk/v3";
import type { siteWideAuditTask } from "@/../../trigger/crawl/site-wide-audit";
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
    console.log("[Site Audit POST] Starting request");
    
    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error("[Site Audit POST] TRIGGER_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Trigger.dev is not configured. Please add TRIGGER_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { url, maxPages = 100 } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Trigger the site-wide audit task (SDK is already configured at module level)
    console.log("[Site Audit POST] Triggering site-wide-audit task...");
    const handle = await tasks.trigger<typeof siteWideAuditTask>(
      "site-wide-audit",
      { url, maxPages }
    );

    return NextResponse.json({
      taskId: handle.id,
      status: "TRIGGERED",
      message: "Site-wide audit started",
    });
  } catch (error) {
    console.error("Site Audit API error:", error);
    return NextResponse.json(
      { error: "Failed to start site audit", details: String(error) },
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
    console.error("Site Audit status error:", error);
    return NextResponse.json(
      { error: "Failed to get task status", details: String(error) },
      { status: 500 }
    );
  }
}
