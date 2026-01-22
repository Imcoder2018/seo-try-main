import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// This webhook endpoint receives updates from Trigger.dev
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[Trigger Webhook] Received webhook:", body);

    // Extract relevant data from the webhook payload
    const { 
      event, 
      data: { 
        run, 
        task 
      } 
    } = body;

    if (!run || !task) {
      console.log("[Trigger Webhook] Invalid payload structure");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Handle different task types
    if (task.slug === "site-crawler") {
      await handleCrawlerCompletion(run);
    } else if (task.slug === "content-extractor") {
      await handleExtractorCompletion(run);
    } else if (task.slug === "content-analyzer") {
      await handleAnalyzerCompletion(run);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Trigger Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: String(error) },
      { status: 500 }
    );
  }
}

async function handleCrawlerCompletion(run: any) {
  try {
    console.log(`[Crawler Webhook] Processing completion for run: ${run.id}`);

    // Find the crawl request by Trigger.dev run ID
    const crawlRequest = await prisma.crawlRequest.findFirst({
      where: { triggerRunId: run.id },
    });

    if (!crawlRequest) {
      console.log(`[Crawler Webhook] No crawl request found for run: ${run.id}`);
      return;
    }

    // Update crawl request with results
    const updateData: any = {
      status: run.status === "COMPLETED" ? "COMPLETED" : "FAILED",
      completedAt: run.status === "COMPLETED" ? new Date() : null,
    };

    // Add pages found and crawl data if available
    if (run.status === "COMPLETED" && run.output) {
      updateData.pagesFound = run.output.pagesFound || 0;
      updateData.crawlData = run.output;
      updateData.pagesData = run.output.pages;
    }

    await prisma.crawlRequest.update({
      where: { id: crawlRequest.id },
      data: updateData,
    });

    console.log(`[Crawler Webhook] Updated crawl request: ${crawlRequest.id}`);
  } catch (error) {
    console.error("[Crawler Webhook] Error handling crawler completion:", error);
  }
}

async function handleExtractorCompletion(run: any) {
  try {
    console.log(`[Extractor Webhook] Processing completion for run: ${run.id}`);
    
    // The extractor task doesn't directly update our database
    // The analyzer task will handle the final results
    // We could add intermediate tracking here if needed
    
  } catch (error) {
    console.error("[Extractor Webhook] Error handling extractor completion:", error);
  }
}

async function handleAnalyzerCompletion(run: any) {
  try {
    console.log(`[Analyzer Webhook] Processing completion for run: ${run.id}`);

    // Find the content analysis by checking if the analysisId is in the run payload
    if (run.output && run.output.analysisId) {
      const analysisId = run.output.analysisId;
      
      const contentAnalysis = await prisma.contentAnalysis.findUnique({
        where: { id: analysisId },
      });

      if (!contentAnalysis) {
        console.log(`[Analyzer Webhook] No content analysis found: ${analysisId}`);
        return;
      }

      // Update content analysis with results
      const updateData: any = {
        status: run.status === "COMPLETED" ? "COMPLETED" : "FAILED",
        completedAt: run.status === "COMPLETED" ? new Date() : null,
      };

      // Add analysis results if available
      if (run.status === "COMPLETED" && run.output) {
        updateData.analysisOutput = run.output;
        updateData.dominantKeywords = run.output.dominantKeywords;
        updateData.contentGaps = run.output.contentGaps;
        updateData.audiencePersona = run.output.audiencePersona;
        updateData.tone = run.output.tone;
        updateData.aiSuggestions = run.output.aiSuggestions;
        updateData.pagesAnalyzed = run.output.pagesAnalyzed || contentAnalysis.pagesAnalyzed;
      }

      await prisma.contentAnalysis.update({
        where: { id: analysisId },
        data: updateData,
      });

      console.log(`[Analyzer Webhook] Updated content analysis: ${analysisId}`);
    }
  } catch (error) {
    console.error("[Analyzer Webhook] Error handling analyzer completion:", error);
  }
}
