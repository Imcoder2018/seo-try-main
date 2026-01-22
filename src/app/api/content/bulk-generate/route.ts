import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { tasks } from "@trigger.dev/sdk/v3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { 
      selectedTopics,
      selectedLocations,
      service,
      brandTone,
      targetAudience,
      aboutSummary,
      generateImages = false
    } = body;

    if (!selectedTopics || selectedTopics.length === 0) {
      return NextResponse.json(
        { error: "At least one topic must be selected" },
        { status: 400 }
      );
    }

    if (!selectedLocations || selectedLocations.length === 0) {
      return NextResponse.json(
        { error: "At least one location must be selected" },
        { status: 400 }
      );
    }

    console.log("[Bulk Generate] Starting bulk generation:", {
      topics: selectedTopics.length,
      locations: selectedLocations.length,
      service,
    });

    // Create all topic-location combinations
    const combinations = [];
    for (const topic of selectedTopics) {
      for (const location of selectedLocations) {
        combinations.push({
          topic,
          location,
          service,
          brandTone,
          targetAudience,
          aboutSummary,
          generateImages,
        });
      }
    }

    console.log("[Bulk Generate] Created", combinations.length, "topic-location combinations");

    // Trigger bulk content generation task
    const handle = await tasks.trigger("content-generator", {
      combinations,
      userId: user.id,
      generateImages,
    });

    return NextResponse.json({
      success: true,
      taskId: handle.id,
      totalCombinations: combinations.length,
      message: `Started generating ${combinations.length} pieces of content`,
    });
  } catch (error) {
    console.error("[Bulk Generate] Error:", error);
    return NextResponse.json(
      { error: "Failed to start bulk generation", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Check task status (mock implementation for now)
    const mockStatus = {
      status: "RUNNING",
      progress: 45,
      total: 20,
      completed: 9,
      failed: 0,
      currentTask: "Generating content for: 'Web Development Trends in Islamabad'",
      estimatedTimeRemaining: "5 minutes",
    };

    return NextResponse.json({
      success: true,
      ...mockStatus,
    });
  } catch (error) {
    console.error("[Bulk Generate GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to get generation status", details: String(error) },
      { status: 500 }
    );
  }
}
