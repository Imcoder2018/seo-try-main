import { NextRequest, NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/analyzers";
import { tasks, auth, configure } from "@trigger.dev/sdk/v3";
import type { smartAuditTask } from "../../../../trigger/audit/smart-audit";
import { getRunOutput } from "@/lib/trigger-utils";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for analysis

// CRITICAL: Configure SDK with secret key at module level
// The SDK will automatically use TRIGGER_SECRET_KEY if set, but we configure explicitly
// Do NOT call configure() inside handlers as it causes conflicts in warm serverless functions
if (process.env.TRIGGER_SECRET_KEY) {
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Audit POST] Starting request");

    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error("[Audit POST] TRIGGER_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Trigger.dev is not configured. Please add TRIGGER_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { url, selectedUrls, crawlData, auditId } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URLs to prevent duplicates (trailing slashes, http/https)
    const normalizeUrl = (urlStr: string): string => {
      try {
        const u = new URL(urlStr);
        // Remove trailing slash from pathname
        u.pathname = u.pathname.replace(/\/$/, '');
        // Normalize to lowercase
        return u.toString().toLowerCase();
      } catch {
        return urlStr.toLowerCase().replace(/\/$/, '');
      }
    };

    // If selectedUrls is provided, use those for multi-page audit
    const urlsToAudit = selectedUrls && selectedUrls.length > 0
      ? Array.from(new Set(selectedUrls.map(normalizeUrl)))
      : [normalizeUrl(url)];

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const domain = parsedUrl.hostname;
    const finalAuditId = auditId || `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Starting comprehensive analysis for ${domain}`);
    console.log(`Auditing ${urlsToAudit.length} pages: ${urlsToAudit.slice(0, 5).join(', ')}${urlsToAudit.length > 5 ? '...' : ''}`);

    try {
      // If crawlData is provided and multiple pages, use Trigger.dev background task
      if (crawlData && urlsToAudit.length > 1) {
        console.log(`[Multi-page Audit] Triggering smart-audit task for ${urlsToAudit.length} pages`);

        // Create audit record in Prisma
        const auditRecord = await prisma.audit.create({
          data: {
            id: finalAuditId,
            url: parsedUrl.toString(),
            domain,
            status: "RUNNING",
            userId: user.id,
          },
        });

        console.log(`[Audit] Created audit record ${auditRecord.id} for user ${user.id}`);

        // Trigger the smart audit task in background
        const handle = await tasks.trigger<typeof smartAuditTask>(
          "smart-audit",
          {
            baseUrl: parsedUrl.toString(),
            selectedUrls: urlsToAudit as string[],
            crawlData,
            auditId: finalAuditId,
            userId: user.id,
          }
        );

        // Generate a public access token for frontend polling
        const publicToken = await auth.createPublicToken({
          scopes: {
            read: {
              runs: [handle.id],
            },
          },
          expirationTime: "1h",
        });

        return NextResponse.json({
          id: finalAuditId,
          runId: handle.id,
          publicToken,
          status: "RUNNING",
          domain,
          url: parsedUrl.toString(),
          auditedPages: urlsToAudit.length,
          message: "Multi-page audit started in background",
        });
      }

      // Single page audit - run inline (fast enough for Vercel)
      const results = await analyzeWebsite(parsedUrl.toString());

      console.log(`Analysis complete for ${domain}: ${results.overallGrade} (${results.overallScore})`);

      // Save audit results to Prisma
      const auditRecord = await prisma.audit.create({
        data: {
          id: finalAuditId,
          url: parsedUrl.toString(),
          domain,
          status: "COMPLETED",
          overallScore: results.overallScore,
          overallGrade: results.overallGrade,
          localSeoScore: results.localSeo.score,
          seoScore: results.seo.score,
          linksScore: results.links.score,
          usabilityScore: results.usability.score,
          performanceScore: results.performance.score,
          socialScore: results.social.score,
          contentScore: results.content.score,
          eeatScore: results.eeat.score,
          technicalSeoScore: results.technicalSeo?.score,
          localSeoResults: results.localSeo as any,
          seoResults: results.seo as any,
          linksResults: results.links as any,
          usabilityResults: results.usability as any,
          performanceResults: results.performance as any,
          socialResults: results.social as any,
          technologyResults: results.technology as any,
          contentResults: results.content as any,
          eeatResults: results.eeat as any,
          technicalSeoResults: results.technicalSeo as any,
          userId: user.id,
          completedAt: new Date(),
        },
      });

      console.log(`[Audit] Saved audit record ${auditRecord.id} to Prisma for user ${user.id}`);

      // Return full results directly (no separate polling needed)
      return NextResponse.json({
        id: auditRecord.id,
        status: "COMPLETED",
        domain,
        url: parsedUrl.toString(),
        overallScore: results.overallScore,
        overallGrade: results.overallGrade,
        localSeoScore: results.localSeo.score,
        localSeoResults: results.localSeo,
        seoScore: results.seo.score,
        seoResults: results.seo,
        linksScore: results.links.score,
        linksResults: results.links,
        usabilityScore: results.usability.score,
        usabilityResults: results.usability,
        performanceScore: results.performance.score,
        performanceResults: results.performance,
        socialScore: results.social.score,
        socialResults: results.social,
        technologyResults: results.technology,
        contentScore: results.content.score,
        contentResults: results.content,
        eeatScore: results.eeat.score,
        eeatResults: results.eeat,
        technicalSeoScore: results.technicalSeo?.score,
        technicalSeoResults: results.technicalSeo,
        recommendations: results.recommendations,
        createdAt: auditRecord.createdAt,
      });
    } catch (analysisError) {
      console.error("Analysis error:", analysisError);

      // Update audit status to FAILED
      if (finalAuditId) {
        await prisma.audit.update({
          where: { id: finalAuditId },
          data: { status: "FAILED" },
        }).catch(console.error);
      }

      return NextResponse.json({
        id: finalAuditId,
        status: "FAILED",
        error: "Analysis failed",
        details: String(analysisError),
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Failed to start audit", details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint for polling audit status
export async function GET(request: NextRequest) {
  // Enforce auth for polling too (prevents publicToken abuse)
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runId = request.nextUrl.searchParams.get("runId");
  const publicToken = request.nextUrl.searchParams.get("publicToken");
  const auditId = request.nextUrl.searchParams.get("auditId");
  
  if (!runId) {
    return NextResponse.json(
      { error: "runId is required" },
      { status: 400 }
    );
  }

  try {
    const { runs, configure } = await import("@trigger.dev/sdk/v3");
    
    // Configure with public token if provided
    if (publicToken) {
      configure({ accessToken: publicToken });
    }
    
    const run = await runs.retrieve(runId);

    // If completed, transform output to match expected format
    if (run.status === "COMPLETED") {
      let results;
      try {
        results = await getRunOutput(runId);
      } catch (error) {
        console.error("Error fetching output:", error);
        return NextResponse.json({
          status: "FAILED",
          error: "Failed to fetch output",
          metadata: run.metadata,
        });
      }

      // Persist results into Prisma (if audit exists and belongs to current user)
      if (auditId) {
        try {
          const existing = await prisma.audit.findFirst({
            where: { id: auditId, userId: user.id },
            select: { id: true },
          });

          if (existing) {
            const recs = (results.recommendations || []).map((rec: any) => ({
              auditId,
              title: rec.title,
              description: rec.description ?? null,
              category: rec.category,
              priority: rec.priority,
              checkId: rec.checkId,
            }));

            await prisma.$transaction(async (tx) => {
              await tx.audit.update({
                where: { id: auditId },
                data: {
                  status: "COMPLETED",
                  overallScore: results.overallScore,
                  overallGrade: results.overallGrade,
                  localSeoScore: results.localSeo?.score,
                  seoScore: results.seo?.score,
                  linksScore: results.links?.score,
                  usabilityScore: results.usability?.score,
                  performanceScore: results.performance?.score,
                  socialScore: results.social?.score,
                  contentScore: results.content?.score,
                  eeatScore: results.eeat?.score,
                  technicalSeoScore: results.technicalSeo?.score,
                  localSeoResults: results.localSeo as any,
                  seoResults: results.seo as any,
                  linksResults: results.links as any,
                  usabilityResults: results.usability as any,
                  performanceResults: results.performance as any,
                  socialResults: results.social as any,
                  technologyResults: results.technology as any,
                  contentResults: results.content as any,
                  eeatResults: results.eeat as any,
                  technicalSeoResults: results.technicalSeo as any,
                  completedAt: new Date(),
                },
              });

              await tx.recommendation.deleteMany({ where: { auditId } });

              if (recs.length > 0) {
                await tx.recommendation.createMany({ data: recs });
              }
            });
          }
        } catch (dbError) {
          console.error("[Audit Poll] Failed to persist audit:", dbError);
        }
      }

      return NextResponse.json({
        status: "COMPLETED",
        output: {
          id: auditId || `audit_${runId}`,
          status: "COMPLETED",
          overallScore: results.overallScore,
          overallGrade: results.overallGrade,
          localSeoScore: results.localSeo?.score,
          localSeoResults: results.localSeo,
          seoScore: results.seo?.score,
          seoResults: results.seo,
          linksScore: results.links?.score,
          linksResults: results.links,
          usabilityScore: results.usability?.score,
          usabilityResults: results.usability,
          performanceScore: results.performance?.score,
          performanceResults: results.performance,
          socialScore: results.social?.score,
          socialResults: results.social,
          technologyResults: results.technology,
          contentScore: results.content?.score,
          contentResults: results.content,
          eeatScore: results.eeat?.score,
          eeatResults: results.eeat,
          technicalSeoScore: results.technicalSeo?.score,
          technicalSeoResults: results.technicalSeo,
          recommendations: results.recommendations,
          pageClassifications: results.pageClassifications,
          auditMapping: results.auditMapping,
          pagesAnalyzed: results.pagesAnalyzed,
          pagesFailed: results.pagesFailed,
          createdAt: new Date().toISOString(),
        },
        metadata: run.metadata,
      });
    }

    return NextResponse.json({
      status: run.status,
      output: null,
      metadata: run.metadata,
    });
  } catch (error) {
    console.error("Error fetching audit run:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit status" },
      { status: 500 }
    );
  }
}
