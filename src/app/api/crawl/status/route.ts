import { NextRequest, NextResponse } from "next/server";
import { runs } from "@trigger.dev/sdk/v3";
import { getRunOutput } from "@/lib/trigger-utils";

export const dynamic = "force-dynamic";

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
      metadata: run.metadata,
      createdAt: run.createdAt,
      finishedAt: run.finishedAt,
    });
  } catch (error) {
    console.error("Crawl status error:", error);
    return NextResponse.json(
      { error: "Failed to get crawl status", details: String(error) },
      { status: 500 }
    );
  }
}
