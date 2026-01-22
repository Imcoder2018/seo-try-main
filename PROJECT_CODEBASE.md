# Project Codebase: seo-try-main-master

## 1. Project Structure

```text
.
├── .
├── src/app/api/content/analyze//route.ts
├── src/app/api/content/auto-discovery//route.ts
├── src/app/api/content/auto-plan//route.ts
├── src/app/api/content/generate-outline//route.ts
├── src/app/api/content/history//route.ts
                    ├── route.ts
                    ├── route.ts
                    ├── route.ts
                    ├── route.ts
                ├── route.ts
                    ├── route.ts
            ├── page.tsx
            ├── AutoContentEngineSplit.tsx
            ├── DraftSolutionModal.tsx
            ├── EmptyStateOnboarding.tsx
            ├── GapAnalysisCard.tsx
            ├── PagesTable.tsx
            ├── PersonaCard.tsx
            ├── PlannerView.tsx
            ├── PriorityMatrix.tsx
            ├── SEOHealthScore.tsx
            ├── SearchResultPreview.tsx
            ├── SuggestionKanbanCard.tsx
            ├── content-strategy-dashboard-improved.tsx
            ├── content-strategy-dashboard.tsx
            ├── SidebarLayout.tsx
        ├── ContentStrategyContext.tsx
```

## 2. File Contents

> Error reading file .: [Errno 13] Permission denied: 'C:\\Users\\PMYLS\\Downloads\\seo-try-main-master\\seo-try-main-master\\.'

---

### src/app/api/content/analyze//route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { tasks, configure, runs } from "@trigger.dev/sdk/v3";
import type { contentExtractorTask } from "@/trigger/content/content-extractor";
import type { contentAnalyzerTask } from "@/trigger/content/content-analyzer";
import { getRunOutput } from "@/lib/trigger-utils";
import { requireAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// CRITICAL: Configure SDK with secret key at module level
// This ensures all SDK operations use the secret key by default
// Do NOT call configure() inside handlers as it causes conflicts in warm serverless functions
if (process.env.TRIGGER_SECRET_KEY) {
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Analyze POST] Starting request");
    
    // Get authenticated user
    const user = await requireAuth();
    
    const body = await request.json();
    const { baseUrl, pages, maxPages = 50, targetAudience, crawlRequestId } = body;

    if (!baseUrl || !pages) {
      return NextResponse.json(
        { error: "Missing required fields: baseUrl and pages" },
        { status: 400 }
      );
    }

    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error("[Analyze POST] TRIGGER_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Trigger.dev is not configured. Please add TRIGGER_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // Create content analysis record in Prisma
    const domain = new URL(baseUrl).hostname;
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const contentAnalysis = await prisma.contentAnalysis.create({
      data: {
        id: analysisId,
        baseUrl,
        domain,
        status: "RUNNING",
        pagesAnalyzed: pages.length,
        userId: user.id,
        ...(crawlRequestId && { crawlRequestId }),
      },
    });

    console.log(`[Content Analysis] Created analysis record ${contentAnalysis.id} for user ${user.id}`);

    console.log("[Analyze POST] Triggering content extraction task...");

    // Step 1: Extract content from pages
    const extractionHandle = await tasks.trigger<typeof contentExtractorTask>(
      "content-extractor",
      {
        baseUrl,
        pages,
        maxPages,
        extractContent: true,
        analysisId,
        userId: user.id,
      }
    );

    if (!extractionHandle || !extractionHandle.id) {
      throw new Error("Failed to start content extraction task");
    }

    // Step 2: Perform AI analysis with extracted pages (will wait for extraction to complete in the task itself)
    const analysisHandle = await tasks.trigger<typeof contentAnalyzerTask>(
      "content-analyzer",
      {
        baseUrl,
        targetAudience,
        extractionRunId: extractionHandle.id,
        analysisId,
        userId: user.id,
      }
    );

    if (!analysisHandle || !analysisHandle.id) {
      throw new Error("Failed to start content analysis task");
    }

    console.log("Content analysis started:", {
      extractionRunId: extractionHandle.id,
      analysisRunId: analysisHandle.id,
    });

    return NextResponse.json({
      success: true,
      analysisId,
      extractionRunId: extractionHandle.id,
      analysisRunId: analysisHandle.id,
      message: "Content analysis started successfully",
    });
  } catch (error) {
    console.error("Error in content analysis:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to start content analysis";
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const user = await requireAuth();

  const searchParams = request.nextUrl.searchParams;
  const extractionRunId = searchParams.get("extractionRunId");
  const analysisRunId = searchParams.get("analysisRunId");
  const analysisId = searchParams.get("analysisId");

  if (!extractionRunId || !analysisRunId) {
    return NextResponse.json(
      { error: "Missing extractionRunId or analysisRunId" },
      { status: 400 }
    );
  }

  try {
    console.log("[Analyze GET] Retrieving run status...");

    // Get extraction run status using the secret key (configured at module level)
    let extractionStatus = "PENDING";
    let extractionOutput = null;
    let extractionError = null;

    try {
      const extractionRun = await runs.retrieve(extractionRunId);
      extractionStatus = extractionRun.status;
      
      if (extractionRun.status === "COMPLETED") {
        extractionOutput = await getRunOutput(extractionRunId);
      } else if (extractionRun.status === "FAILED") {
        extractionError = (extractionRun as any).error?.message || "Extraction failed";
      }
    } catch (error) {
      console.error("Error fetching extraction run:", error);
      extractionStatus = "ERROR";
      extractionError = error instanceof Error ? error.message : "Unknown error";
    }

    // Get analysis run status
    let analysisStatus = "PENDING";
    let analysisOutput = null;
    let analysisError = null;

    try {
      const analysisRun = await runs.retrieve(analysisRunId);
      analysisStatus = analysisRun.status;
      
      if (analysisRun.status === "COMPLETED") {
        analysisOutput = await getRunOutput(analysisRunId);
      } else if (analysisRun.status === "FAILED") {
        analysisError = (analysisRun as any).error?.message || "Analysis failed";
      }
    } catch (error) {
      console.error("Error fetching analysis run:", error);
      analysisStatus = "ERROR";
      analysisError = error instanceof Error ? error.message : "Unknown error";
    }

    const isComplete = extractionStatus === "COMPLETED" && analysisStatus === "COMPLETED";
    const hasFailed =
      extractionStatus === "FAILED" ||
      analysisStatus === "FAILED" ||
      extractionStatus === "ERROR" ||
      analysisStatus === "ERROR";

    // Persist result into Prisma when we know which record to update
    if (analysisId) {
      try {
        if (isComplete && analysisOutput) {
          const output: any = analysisOutput;
          await prisma.contentAnalysis.updateMany({
            where: {
              id: analysisId,
              userId: user.id,
            },
            data: {
              status: "COMPLETED",
              analysisOutput: output,
              dominantKeywords: output?.contentContext?.dominantKeywords ?? null,
              contentGaps: output?.contentContext?.contentGaps ?? null,
              audiencePersona: output?.contentContext?.audiencePersona ?? null,
              tone: output?.contentContext?.tone ?? null,
              aiSuggestions: output?.aiSuggestions ?? null,
              pagesAnalyzed: Array.isArray(output?.pages) ? output.pages.length : undefined,
              completedAt: new Date(),
            },
          });
        } else if (hasFailed) {
          await prisma.contentAnalysis.updateMany({
            where: {
              id: analysisId,
              userId: user.id,
            },
            data: {
              status: "FAILED",
              completedAt: new Date(),
            },
          });
        }
      } catch (dbError) {
        console.error("[Analyze GET] Failed to persist analysis:", dbError);
      }
    }

    return NextResponse.json({
      extractionStatus,
      extractionOutput,
      extractionError,
      analysisStatus,
      analysisOutput,
      analysisError,
      isComplete,
      hasFailed,
    });
  } catch (error) {
    console.error("Error fetching analysis status:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch analysis status",
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

```

---

### src/app/api/content/auto-discovery//route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { tasks } from "@trigger.dev/sdk/v3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { crawlRequestId } = body;

    if (!crawlRequestId) {
      return NextResponse.json(
        { error: "Crawl request ID is required" },
        { status: 400 }
      );
    }

    // Get crawl request data (using mock data for now due to Prisma issues)
    console.log("[Auto-Discovery] Starting context extraction for crawl:", crawlRequestId);

    // Trigger enhanced content extraction for auto-discovery
    const handle = await tasks.trigger("auto-discovery", {
      crawlRequestId,
      extractContext: true,
      extractServices: true,
      extractLocations: true,
      extractAbout: true,
      extractContact: true,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      taskId: handle.id,
      message: "Auto-discovery process started",
    });
  } catch (error) {
    console.error("[Auto-Discovery] Error:", error);
    return NextResponse.json(
      { error: "Failed to start auto-discovery", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const crawlRequestId = searchParams.get("crawlRequestId");

    if (!crawlRequestId) {
      return NextResponse.json(
        { error: "Crawl request ID is required" },
        { status: 400 }
      );
    }

    console.log("[Auto-Discovery] Fetching discovery data for crawl:", crawlRequestId);

    // Try to get data from latest content analysis
    try {
      // Fetch the latest content analysis
      const contentAnalysisResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/content/history`, {
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      });

      if (contentAnalysisResponse.ok) {
        const contentHistoryData = await contentAnalysisResponse.json();
        const contentHistory = contentHistoryData.analyses || [];
        
        if (contentHistory.length > 0) {
          const latestAnalysis = contentHistory[0]; // Most recent analysis
          
          console.log("[Auto-Discovery] Using data from latest content analysis");
          
          // Extract discovery data from content analysis
          const analysisOutput = latestAnalysis.analysisOutput;
          
          // Extract services from content analysis
          const services = analysisOutput?.services?.map((s: any) => s.name) || [
            "Data Science Services",
            "AI Programming Services", 
            "Machine Learning Services",
            "Cybersecurity Services",
            "Computer Vision Services",
            "Data Visualization Services",
            "Speech and Text Analytics Services",
            "Natural Language Processing Services",
            "Business Automation Services"
          ];
          
          // Extract existing pages
          const existingPages = analysisOutput?.pages?.slice(0, 10).map((p: any) => ({
            url: p.url,
            type: p.type || 'page',
            title: p.title || p.url
          })) || [];
          
          // Extract locations from content analysis or use defaults
          const locations = analysisOutput?.locations || 
            analysisOutput?.targetLocations ||
            analysisOutput?.serviceAreas ||
            [
              "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar",
              "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Quetta"
            ];
          
          // Log what we're extracting for debugging
          console.log("[Auto-Discovery] Extracted data:", {
            servicesCount: services.length,
            locationsCount: locations.length,
            pagesCount: existingPages.length,
            hasAboutSummary: !!analysisOutput?.aboutSummary,
            hasTargetAudience: !!analysisOutput?.targetAudience,
            hasBrandTone: !!analysisOutput?.brandTone,
            analysisKeys: Object.keys(analysisOutput || {})
          });
          
          // Extract other data from analysis with better fallbacks
          const aboutSummary = analysisOutput?.aboutSummary || 
            analysisOutput?.companyDescription || 
            analysisOutput?.businessDescription ||
            "DataTech Consultants - Leading provider of AI and data science solutions including machine learning, computer vision, and business automation services";

          const targetAudience = analysisOutput?.targetAudience || 
            analysisOutput?.audiencePersona?.targetAudience ||
            analysisOutput?.idealCustomer ||
            "Enterprises, startups, and organizations seeking to leverage AI, machine learning, and data science for digital transformation and business growth";

          const brandTone = analysisOutput?.brandTone || 
            analysisOutput?.tone ||
            analysisOutput?.communicationStyle ||
            "Professional, innovative, and technically sophisticated with a focus on delivering cutting-edge AI and data science solutions";

          const discoveryData = {
            services,
            locations,
            aboutSummary,
            targetAudience,
            brandTone,
            contactInfo: {
              email: "info@datatechconsultants.com.au",
              phone: "+92-300-1234567",
              address: "123 Business Park, Islamabad, Pakistan"
            },
            existingPages
          };

          return NextResponse.json({
            success: true,
            data: discoveryData,
            source: "content-analysis",
            analysisId: latestAnalysis.id
          });
        }
      }
    } catch (analysisError) {
      console.log("[Auto-Discovery] Could not fetch content analysis, using fallback:", analysisError);
    }

    // Fallback to mock data if no content analysis available
    console.log("[Auto-Discovery] Using mock discovery data as fallback");
    
    const mockDiscoveryData = {
      services: [
        "Data Science Services",
        "AI Programming Services", 
        "Machine Learning Services",
        "Cybersecurity Services",
        "Computer Vision Services",
        "Data Visualization Services",
        "Speech and Text Analytics Services",
        "Natural Language Processing Services",
        "Business Automation Services"
      ],
      locations: [
        "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar",
        "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Quetta"
      ],
      aboutSummary: "DataTech Consultants is a premier technology company specializing in cutting-edge AI and data science solutions. We provide comprehensive services including machine learning, computer vision, natural language processing, data visualization, and business automation. Our team of expert data scientists and AI engineers helps enterprises transform their operations through intelligent automation and data-driven decision making.",
      targetAudience: "Enterprises, startups, and government organizations seeking to leverage artificial intelligence, machine learning, and data science for digital transformation, operational efficiency, and competitive advantage. We serve clients across various industries including finance, healthcare, retail, manufacturing, and technology sectors.",
      brandTone: "Professional, innovative, and technically sophisticated. We communicate complex AI concepts in clear, business-focused language while maintaining our position as thought leaders in the data science and AI industry. Our approach is consultative, solution-oriented, and committed to delivering measurable business value.",
      contactInfo: {
        email: "info@datatechconsultants.com.au",
        phone: "+92-300-1234567",
        address: "123 Business Park, Islamabad, Pakistan"
      },
      existingPages: [
        { url: "/services/data-science-services", type: "service", title: "Data Science Services" },
        { url: "/services/ai-programming-services", type: "service", title: "AI Programming Services" },
        { url: "/services/machine-learning-services", type: "service", title: "Machine Learning Services" },
        { url: "/services/computer-vision-services", type: "service", title: "Computer Vision Services" },
        { url: "/services/cybersecurity-services", type: "service", title: "Cybersecurity Services" },
        { url: "/about", type: "page", title: "About DataTech Consultants" },
        { url: "/contact", type: "page", title: "Contact Us" },
        { url: "/blog", type: "blog", title: "AI and Data Science Blog" }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockDiscoveryData,
      source: "mock-data"
    });
    
  } catch (error) {
    console.error("[Auto-Discovery] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch discovery data", details: String(error) },
      { status: 500 }
    );
  }
}

```

---

### src/app/api/content/auto-plan//route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frequency, days, tone, focus, contentGaps, dominantKeywords } = body;

    // Generate a simple auto-plan based on the configuration
    const events = [];
    const startDate = new Date();
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    // Get available content ideas
    const contentIdeas = [
      ...contentGaps.map((gap: string) => ({
        title: `Addressing: ${gap}`,
        type: 'Content Gap',
        keywords: extractKeywords(gap),
      })),
      // Add some default suggestions if no AI suggestions are available
      {
        title: "Industry Insights and Trends",
        type: "Blog Post",
        keywords: ["industry", "insights", "trends"],
      },
      {
        title: "How-To Guide: Best Practices",
        type: "Guide",
        keywords: ["guide", "best practices", "tutorial"],
      },
      {
        title: "Case Study: Success Story",
        type: "Case Study",
        keywords: ["case study", "success", "results"],
      },
      {
        title: "Technical Deep Dive",
        type: "Whitepaper",
        keywords: ["technical", "deep dive", "analysis"],
      },
    ];

    // Calculate posting schedule
    const postsPerWeek = frequency || 2;
    const totalPosts = Math.min(postsPerWeek * 4, contentIdeas.length); // Max 4 weeks worth
    const daysBetweenPosts = Math.floor(7 / postsPerWeek);
    
    let currentDate = new Date(startDate);
    let postIndex = 0;

    for (let i = 0; i < totalPosts; i++) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (currentDate > endDate) break;

      const idea = contentIdeas[postIndex % contentIdeas.length];
      
      events.push({
        title: idea.title,
        date: currentDate.toISOString(),
        keywords: idea.keywords,
        type: idea.type,
      });

      postIndex++;
      currentDate = new Date(currentDate.getTime() + daysBetweenPosts * 24 * 60 * 60 * 1000);
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Auto-plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate auto-plan" },
      { status: 500 }
    );
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in real implementation, this would be more sophisticated
  const words = text.toLowerCase().split(/\s+/);
  const keywords = words
    .filter(word => word.length > 3)
    .filter(word => !['the', 'and', 'for', 'are', 'with', 'this', 'that', 'from', 'have', 'they', 'been'].includes(word))
    .slice(0, 3);
  
  return keywords;
}

```

---

### src/app/api/content/generate-outline//route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { title, aiKeywords, userKeywords, promotedService, serviceContext, tone } = await request.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Combine AI keywords with user keywords
    const allKeywords = [...(aiKeywords || []), ...(userKeywords || [])];
    const keywordsString = allKeywords.length > 0 ? allKeywords.join(", ") : "Not specified";

    let prompt = `
You are an expert Content Strategist. Create a detailed, specific Blog Post Outline.

TITLE: "${title}"
TARGET KEYWORDS: ${allKeywords.length > 0 ? keywordsString : "Not specified"}
${promotedService ? `GOAL: This article must subtly sell the user's service: "${promotedService}".` : ''}
${serviceContext ? `CONTEXT (What the service is):\n${serviceContext}` : ''}
${tone ? `TONE INSTRUCTIONS: Write this outline in a ${tone} style.` : ''}
INSTRUCTIONS:
1. Create 6-8 Headings (H2) that are SPECIFIC to the topic, NOT generic like "Introduction" or "Conclusion"
2. Under each H2, write 2 bullet points on what to cover
3. ${promotedService ? `The "Solution" or "Implementation" section MUST mention how "${promotedService}" helps solve the problem.` : ''}
4. ${promotedService ? `The Conclusion MUST include a Call to Action for "${promotedService}".` : ''}
5. Do NOT use generic text like "Hook the reader". Be specific to the topic and keywords.
6. Make each section actionable and practical.
7. Use real-world examples and data points where appropriate.
8. ${tone ? `Maintain a ${tone} tone throughout the outline.` : ''}
Return the response as Markdown with H2 headings and bullet points.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist and SEO specialist. You create detailed, specific blog post outlines that are tailored to the target keywords and business goals. You avoid generic placeholders and always provide specific, actionable content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const outline = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      outline,
    });
  } catch (error) {
    console.error("Error generating outline:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate outline";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

```

---

### src/app/api/content/history//route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const analyses = await prisma.contentAnalysis.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      select: {
        id: true,
        baseUrl: true,
        domain: true,
        status: true,
        pagesAnalyzed: true,
        createdAt: true,
        completedAt: true,
        analysisOutput: true,
        dominantKeywords: true,
        contentGaps: true,
        audiencePersona: true,
        tone: true,
        aiSuggestions: true,
      },
    });

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Error fetching content analysis history:", error);
    return NextResponse.json(
      { error: "Failed to fetch content analysis history" },
      { status: 500 }
    );
  }
}

```

---

### src\app\api\content\analyze\route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { tasks, configure, runs } from "@trigger.dev/sdk/v3";
import type { contentExtractorTask } from "@/trigger/content/content-extractor";
import type { contentAnalyzerTask } from "@/trigger/content/content-analyzer";
import { getRunOutput } from "@/lib/trigger-utils";
import { requireAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// CRITICAL: Configure SDK with secret key at module level
// This ensures all SDK operations use the secret key by default
// Do NOT call configure() inside handlers as it causes conflicts in warm serverless functions
if (process.env.TRIGGER_SECRET_KEY) {
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Analyze POST] Starting request");
    
    // Get authenticated user
    const user = await requireAuth();
    
    const body = await request.json();
    const { baseUrl, pages, maxPages = 50, targetAudience, crawlRequestId } = body;

    if (!baseUrl || !pages) {
      return NextResponse.json(
        { error: "Missing required fields: baseUrl and pages" },
        { status: 400 }
      );
    }

    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error("[Analyze POST] TRIGGER_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Trigger.dev is not configured. Please add TRIGGER_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // Create content analysis record in Prisma
    const domain = new URL(baseUrl).hostname;
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const contentAnalysis = await prisma.contentAnalysis.create({
      data: {
        id: analysisId,
        baseUrl,
        domain,
        status: "RUNNING",
        pagesAnalyzed: pages.length,
        userId: user.id,
        ...(crawlRequestId && { crawlRequestId }),
      },
    });

    console.log(`[Content Analysis] Created analysis record ${contentAnalysis.id} for user ${user.id}`);

    console.log("[Analyze POST] Triggering content extraction task...");

    // Step 1: Extract content from pages
    const extractionHandle = await tasks.trigger<typeof contentExtractorTask>(
      "content-extractor",
      {
        baseUrl,
        pages,
        maxPages,
        extractContent: true,
        analysisId,
        userId: user.id,
      }
    );

    if (!extractionHandle || !extractionHandle.id) {
      throw new Error("Failed to start content extraction task");
    }

    // Step 2: Perform AI analysis with extracted pages (will wait for extraction to complete in the task itself)
    const analysisHandle = await tasks.trigger<typeof contentAnalyzerTask>(
      "content-analyzer",
      {
        baseUrl,
        targetAudience,
        extractionRunId: extractionHandle.id,
        analysisId,
        userId: user.id,
      }
    );

    if (!analysisHandle || !analysisHandle.id) {
      throw new Error("Failed to start content analysis task");
    }

    console.log("Content analysis started:", {
      extractionRunId: extractionHandle.id,
      analysisRunId: analysisHandle.id,
    });

    return NextResponse.json({
      success: true,
      analysisId,
      extractionRunId: extractionHandle.id,
      analysisRunId: analysisHandle.id,
      message: "Content analysis started successfully",
    });
  } catch (error) {
    console.error("Error in content analysis:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to start content analysis";
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const user = await requireAuth();

  const searchParams = request.nextUrl.searchParams;
  const extractionRunId = searchParams.get("extractionRunId");
  const analysisRunId = searchParams.get("analysisRunId");
  const analysisId = searchParams.get("analysisId");

  if (!extractionRunId || !analysisRunId) {
    return NextResponse.json(
      { error: "Missing extractionRunId or analysisRunId" },
      { status: 400 }
    );
  }

  try {
    console.log("[Analyze GET] Retrieving run status...");

    // Get extraction run status using the secret key (configured at module level)
    let extractionStatus = "PENDING";
    let extractionOutput = null;
    let extractionError = null;

    try {
      const extractionRun = await runs.retrieve(extractionRunId);
      extractionStatus = extractionRun.status;
      
      if (extractionRun.status === "COMPLETED") {
        extractionOutput = await getRunOutput(extractionRunId);
      } else if (extractionRun.status === "FAILED") {
        extractionError = (extractionRun as any).error?.message || "Extraction failed";
      }
    } catch (error) {
      console.error("Error fetching extraction run:", error);
      extractionStatus = "ERROR";
      extractionError = error instanceof Error ? error.message : "Unknown error";
    }

    // Get analysis run status
    let analysisStatus = "PENDING";
    let analysisOutput = null;
    let analysisError = null;

    try {
      const analysisRun = await runs.retrieve(analysisRunId);
      analysisStatus = analysisRun.status;
      
      if (analysisRun.status === "COMPLETED") {
        analysisOutput = await getRunOutput(analysisRunId);
      } else if (analysisRun.status === "FAILED") {
        analysisError = (analysisRun as any).error?.message || "Analysis failed";
      }
    } catch (error) {
      console.error("Error fetching analysis run:", error);
      analysisStatus = "ERROR";
      analysisError = error instanceof Error ? error.message : "Unknown error";
    }

    const isComplete = extractionStatus === "COMPLETED" && analysisStatus === "COMPLETED";
    const hasFailed =
      extractionStatus === "FAILED" ||
      analysisStatus === "FAILED" ||
      extractionStatus === "ERROR" ||
      analysisStatus === "ERROR";

    // Persist result into Prisma when we know which record to update
    if (analysisId) {
      try {
        if (isComplete && analysisOutput) {
          const output: any = analysisOutput;
          await prisma.contentAnalysis.updateMany({
            where: {
              id: analysisId,
              userId: user.id,
            },
            data: {
              status: "COMPLETED",
              analysisOutput: output,
              dominantKeywords: output?.contentContext?.dominantKeywords ?? null,
              contentGaps: output?.contentContext?.contentGaps ?? null,
              audiencePersona: output?.contentContext?.audiencePersona ?? null,
              tone: output?.contentContext?.tone ?? null,
              aiSuggestions: output?.aiSuggestions ?? null,
              pagesAnalyzed: Array.isArray(output?.pages) ? output.pages.length : undefined,
              completedAt: new Date(),
            },
          });
        } else if (hasFailed) {
          await prisma.contentAnalysis.updateMany({
            where: {
              id: analysisId,
              userId: user.id,
            },
            data: {
              status: "FAILED",
              completedAt: new Date(),
            },
          });
        }
      } catch (dbError) {
        console.error("[Analyze GET] Failed to persist analysis:", dbError);
      }
    }

    return NextResponse.json({
      extractionStatus,
      extractionOutput,
      extractionError,
      analysisStatus,
      analysisOutput,
      analysisError,
      isComplete,
      hasFailed,
    });
  } catch (error) {
    console.error("Error fetching analysis status:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch analysis status",
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

```

---

### src\app\api\content\auto-discovery\route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { tasks } from "@trigger.dev/sdk/v3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { crawlRequestId } = body;

    if (!crawlRequestId) {
      return NextResponse.json(
        { error: "Crawl request ID is required" },
        { status: 400 }
      );
    }

    // Get crawl request data (using mock data for now due to Prisma issues)
    console.log("[Auto-Discovery] Starting context extraction for crawl:", crawlRequestId);

    // Trigger enhanced content extraction for auto-discovery
    const handle = await tasks.trigger("auto-discovery", {
      crawlRequestId,
      extractContext: true,
      extractServices: true,
      extractLocations: true,
      extractAbout: true,
      extractContact: true,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      taskId: handle.id,
      message: "Auto-discovery process started",
    });
  } catch (error) {
    console.error("[Auto-Discovery] Error:", error);
    return NextResponse.json(
      { error: "Failed to start auto-discovery", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const crawlRequestId = searchParams.get("crawlRequestId");

    if (!crawlRequestId) {
      return NextResponse.json(
        { error: "Crawl request ID is required" },
        { status: 400 }
      );
    }

    console.log("[Auto-Discovery] Fetching discovery data for crawl:", crawlRequestId);

    // Try to get data from latest content analysis
    try {
      // Fetch the latest content analysis
      const contentAnalysisResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/content/history`, {
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      });

      if (contentAnalysisResponse.ok) {
        const contentHistoryData = await contentAnalysisResponse.json();
        const contentHistory = contentHistoryData.analyses || [];
        
        if (contentHistory.length > 0) {
          const latestAnalysis = contentHistory[0]; // Most recent analysis
          
          console.log("[Auto-Discovery] Using data from latest content analysis");
          
          // Extract discovery data from content analysis
          const analysisOutput = latestAnalysis.analysisOutput;
          
          // Extract services from content analysis
          const services = analysisOutput?.services?.map((s: any) => s.name) || [
            "Data Science Services",
            "AI Programming Services", 
            "Machine Learning Services",
            "Cybersecurity Services",
            "Computer Vision Services",
            "Data Visualization Services",
            "Speech and Text Analytics Services",
            "Natural Language Processing Services",
            "Business Automation Services"
          ];
          
          // Extract existing pages
          const existingPages = analysisOutput?.pages?.slice(0, 10).map((p: any) => ({
            url: p.url,
            type: p.type || 'page',
            title: p.title || p.url
          })) || [];
          
          // Extract locations from content analysis or use defaults
          const locations = analysisOutput?.locations || 
            analysisOutput?.targetLocations ||
            analysisOutput?.serviceAreas ||
            [
              "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar",
              "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Quetta"
            ];
          
          // Log what we're extracting for debugging
          console.log("[Auto-Discovery] Extracted data:", {
            servicesCount: services.length,
            locationsCount: locations.length,
            pagesCount: existingPages.length,
            hasAboutSummary: !!analysisOutput?.aboutSummary,
            hasTargetAudience: !!analysisOutput?.targetAudience,
            hasBrandTone: !!analysisOutput?.brandTone,
            analysisKeys: Object.keys(analysisOutput || {})
          });
          
          // Extract other data from analysis with better fallbacks
          const aboutSummary = analysisOutput?.aboutSummary || 
            analysisOutput?.companyDescription || 
            analysisOutput?.businessDescription ||
            "DataTech Consultants - Leading provider of AI and data science solutions including machine learning, computer vision, and business automation services";

          const targetAudience = analysisOutput?.targetAudience || 
            analysisOutput?.audiencePersona?.targetAudience ||
            analysisOutput?.idealCustomer ||
            "Enterprises, startups, and organizations seeking to leverage AI, machine learning, and data science for digital transformation and business growth";

          const brandTone = analysisOutput?.brandTone || 
            analysisOutput?.tone ||
            analysisOutput?.communicationStyle ||
            "Professional, innovative, and technically sophisticated with a focus on delivering cutting-edge AI and data science solutions";

          const discoveryData = {
            services,
            locations,
            aboutSummary,
            targetAudience,
            brandTone,
            contactInfo: {
              email: "info@datatechconsultants.com.au",
              phone: "+92-300-1234567",
              address: "123 Business Park, Islamabad, Pakistan"
            },
            existingPages
          };

          return NextResponse.json({
            success: true,
            data: discoveryData,
            source: "content-analysis",
            analysisId: latestAnalysis.id
          });
        }
      }
    } catch (analysisError) {
      console.log("[Auto-Discovery] Could not fetch content analysis, using fallback:", analysisError);
    }

    // Fallback to mock data if no content analysis available
    console.log("[Auto-Discovery] Using mock discovery data as fallback");
    
    const mockDiscoveryData = {
      services: [
        "Data Science Services",
        "AI Programming Services", 
        "Machine Learning Services",
        "Cybersecurity Services",
        "Computer Vision Services",
        "Data Visualization Services",
        "Speech and Text Analytics Services",
        "Natural Language Processing Services",
        "Business Automation Services"
      ],
      locations: [
        "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar",
        "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Quetta"
      ],
      aboutSummary: "DataTech Consultants is a premier technology company specializing in cutting-edge AI and data science solutions. We provide comprehensive services including machine learning, computer vision, natural language processing, data visualization, and business automation. Our team of expert data scientists and AI engineers helps enterprises transform their operations through intelligent automation and data-driven decision making.",
      targetAudience: "Enterprises, startups, and government organizations seeking to leverage artificial intelligence, machine learning, and data science for digital transformation, operational efficiency, and competitive advantage. We serve clients across various industries including finance, healthcare, retail, manufacturing, and technology sectors.",
      brandTone: "Professional, innovative, and technically sophisticated. We communicate complex AI concepts in clear, business-focused language while maintaining our position as thought leaders in the data science and AI industry. Our approach is consultative, solution-oriented, and committed to delivering measurable business value.",
      contactInfo: {
        email: "info@datatechconsultants.com.au",
        phone: "+92-300-1234567",
        address: "123 Business Park, Islamabad, Pakistan"
      },
      existingPages: [
        { url: "/services/data-science-services", type: "service", title: "Data Science Services" },
        { url: "/services/ai-programming-services", type: "service", title: "AI Programming Services" },
        { url: "/services/machine-learning-services", type: "service", title: "Machine Learning Services" },
        { url: "/services/computer-vision-services", type: "service", title: "Computer Vision Services" },
        { url: "/services/cybersecurity-services", type: "service", title: "Cybersecurity Services" },
        { url: "/about", type: "page", title: "About DataTech Consultants" },
        { url: "/contact", type: "page", title: "Contact Us" },
        { url: "/blog", type: "blog", title: "AI and Data Science Blog" }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockDiscoveryData,
      source: "mock-data"
    });
    
  } catch (error) {
    console.error("[Auto-Discovery] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch discovery data", details: String(error) },
      { status: 500 }
    );
  }
}

```

---

### src\app\api\content\auto-plan\route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frequency, days, tone, focus, contentGaps, dominantKeywords } = body;

    // Generate a simple auto-plan based on the configuration
    const events = [];
    const startDate = new Date();
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    // Get available content ideas
    const contentIdeas = [
      ...contentGaps.map((gap: string) => ({
        title: `Addressing: ${gap}`,
        type: 'Content Gap',
        keywords: extractKeywords(gap),
      })),
      // Add some default suggestions if no AI suggestions are available
      {
        title: "Industry Insights and Trends",
        type: "Blog Post",
        keywords: ["industry", "insights", "trends"],
      },
      {
        title: "How-To Guide: Best Practices",
        type: "Guide",
        keywords: ["guide", "best practices", "tutorial"],
      },
      {
        title: "Case Study: Success Story",
        type: "Case Study",
        keywords: ["case study", "success", "results"],
      },
      {
        title: "Technical Deep Dive",
        type: "Whitepaper",
        keywords: ["technical", "deep dive", "analysis"],
      },
    ];

    // Calculate posting schedule
    const postsPerWeek = frequency || 2;
    const totalPosts = Math.min(postsPerWeek * 4, contentIdeas.length); // Max 4 weeks worth
    const daysBetweenPosts = Math.floor(7 / postsPerWeek);
    
    let currentDate = new Date(startDate);
    let postIndex = 0;

    for (let i = 0; i < totalPosts; i++) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (currentDate > endDate) break;

      const idea = contentIdeas[postIndex % contentIdeas.length];
      
      events.push({
        title: idea.title,
        date: currentDate.toISOString(),
        keywords: idea.keywords,
        type: idea.type,
      });

      postIndex++;
      currentDate = new Date(currentDate.getTime() + daysBetweenPosts * 24 * 60 * 60 * 1000);
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Auto-plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate auto-plan" },
      { status: 500 }
    );
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in real implementation, this would be more sophisticated
  const words = text.toLowerCase().split(/\s+/);
  const keywords = words
    .filter(word => word.length > 3)
    .filter(word => !['the', 'and', 'for', 'are', 'with', 'this', 'that', 'from', 'have', 'they', 'been'].includes(word))
    .slice(0, 3);
  
  return keywords;
}

```

---

### src\app\api\content\generate-outline\route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { title, aiKeywords, userKeywords, promotedService, serviceContext, tone } = await request.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Combine AI keywords with user keywords
    const allKeywords = [...(aiKeywords || []), ...(userKeywords || [])];
    const keywordsString = allKeywords.length > 0 ? allKeywords.join(", ") : "Not specified";

    let prompt = `
You are an expert Content Strategist. Create a detailed, specific Blog Post Outline.

TITLE: "${title}"
TARGET KEYWORDS: ${allKeywords.length > 0 ? keywordsString : "Not specified"}
${promotedService ? `GOAL: This article must subtly sell the user's service: "${promotedService}".` : ''}
${serviceContext ? `CONTEXT (What the service is):\n${serviceContext}` : ''}
${tone ? `TONE INSTRUCTIONS: Write this outline in a ${tone} style.` : ''}
INSTRUCTIONS:
1. Create 6-8 Headings (H2) that are SPECIFIC to the topic, NOT generic like "Introduction" or "Conclusion"
2. Under each H2, write 2 bullet points on what to cover
3. ${promotedService ? `The "Solution" or "Implementation" section MUST mention how "${promotedService}" helps solve the problem.` : ''}
4. ${promotedService ? `The Conclusion MUST include a Call to Action for "${promotedService}".` : ''}
5. Do NOT use generic text like "Hook the reader". Be specific to the topic and keywords.
6. Make each section actionable and practical.
7. Use real-world examples and data points where appropriate.
8. ${tone ? `Maintain a ${tone} tone throughout the outline.` : ''}
Return the response as Markdown with H2 headings and bullet points.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist and SEO specialist. You create detailed, specific blog post outlines that are tailored to the target keywords and business goals. You avoid generic placeholders and always provide specific, actionable content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const outline = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      outline,
    });
  } catch (error) {
    console.error("Error generating outline:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate outline";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

```

---

### src\app\api\crawl\route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { tasks, auth, runs, configure } from "@trigger.dev/sdk/v3";
import type { siteCrawlerTask } from "../../../../trigger/crawl/site-crawler";
import { getRunOutput } from "@/lib/trigger-utils";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Allow up to 5 minutes for the GET endpoint

// CRITICAL: Configure SDK with secret key at module level
// The SDK will automatically use TRIGGER_SECRET_KEY if set, but we configure explicitly
// Do NOT call configure() inside handlers as it causes conflicts in warm serverless functions
if (process.env.TRIGGER_SECRET_KEY) {
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log(`[Crawl POST] Starting request at ${new Date().toISOString()}`);
  
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { url, maxPages = 50 } = body;

    console.log(`[Crawl POST] Body received:`, { url, maxPages });

    if (!url) {
      console.log(`[Crawl POST] Error: URL is required`);
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
      console.log(`[Crawl POST] URL validated: ${url}`);
    } catch (error) {
      console.log(`[Crawl POST] Error: Invalid URL format - ${error}`);
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error(`[Crawl POST] TRIGGER_SECRET_KEY is not configured`);
      return NextResponse.json(
        { error: "Trigger.dev is not configured. Please add TRIGGER_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // Extract domain from URL
    const domain = new URL(url).hostname;

    // Save crawl request to database
    let crawlRequest;
    try {
      crawlRequest = await prisma.crawlRequest.create({
        data: {
          url,
          domain,
          maxPages,
          status: "PENDING",
          userId: user.id,
        },
      });
      console.log(`[Crawl POST] Crawl request saved to database: ${crawlRequest.id}`);
    } catch (dbError) {
      console.error(`[Crawl POST] Failed to save crawl request:`, dbError);
      // Continue with Trigger.dev even if DB save fails
    }

    // Trigger the crawl task (SDK is already configured at module level)
    console.log(`[Crawl POST] Triggering site-crawler task...`);
    const handle = await tasks.trigger<typeof siteCrawlerTask>(
      "site-crawler",
      { url, maxPages }
    );
    console.log(`[Crawl POST] Task triggered successfully. runId: ${handle.id}`);

    // Update crawl request with Trigger.dev run ID
    if (crawlRequest) {
      try {
        await prisma.crawlRequest.update({
          where: { id: crawlRequest.id },
          data: {
            triggerRunId: handle.id,
            status: "RUNNING",
          },
        });
      } catch (updateError) {
        console.error(`[Crawl POST] Failed to update crawl request:`, updateError);
      }
    }

    // Generate a public access token for frontend polling
    console.log(`[Crawl POST] Creating public token...`);
    const publicToken = await auth.createPublicToken({
      scopes: {
        read: {
          runs: [handle.id],
        },
      },
      expirationTime: "1h",
    });
    console.log(`[Crawl POST] Public token created. Length: ${publicToken.length}`);

    // Update crawl request with public token
    if (crawlRequest) {
      try {
        await prisma.crawlRequest.update({
          where: { id: crawlRequest.id },
          data: { publicToken },
        });
      } catch (updateError) {
        console.error(`[Crawl POST] Failed to update crawl request with token:`, updateError);
      }
    }

    const response = {
      runId: handle.id,
      publicToken,
      crawlRequestId: crawlRequest?.id,
      message: "Crawl started",
    };
    
    const elapsed = Date.now() - startTime;
    console.log(`[Crawl POST] Request completed in ${elapsed}ms. Response:`, { ...response, publicToken: `${publicToken.substring(0, 10)}...` });

    return NextResponse.json(response);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[Crawl POST] Error after ${elapsed}ms:`, error);
    return NextResponse.json(
      { error: "Failed to start crawl. Is Trigger.dev configured?", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const runId = request.nextUrl.searchParams.get("runId");
  
  console.log(`[Crawl GET] Starting request at ${new Date().toISOString()}`);
  console.log(`[Crawl GET] runId: ${runId}`);
  
  if (!runId) {
    console.log(`[Crawl GET] Error: runId is required`);
    return NextResponse.json(
      { error: "runId is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`[Crawl GET] Retrieving run...`);
    // SDK is already configured at module level with secret key
    const run = await runs.retrieve(runId);
    console.log(`[Crawl GET] Run retrieved. Status: ${run.status}`);

    // Extract metadata properly
    const metadata = run.metadata as any;
    const statusData = metadata?.status || {};
    console.log(`[Crawl GET] Metadata extracted. statusData:`, statusData);

    // Get output, handling offloaded outputs
    let output = null;
    if (run.status === "COMPLETED") {
      try {
        output = await getRunOutput(runId);
      } catch (error) {
        console.error("Error fetching output:", error);
      }
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Crawl GET] Request completed in ${elapsed}ms`);

    return NextResponse.json({
      status: run.status,
      output,
      metadata: {
        status: statusData,
      },
    });
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[Crawl GET] Error after ${elapsed}ms:`, error);
    return NextResponse.json(
      { error: "Failed to fetch run status", details: String(error) },
      { status: 500 }
    );
  }
}

```

---

### src\app\api\crawl\status\route.ts

```typescript
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

```

---

### src\app\content-strategy\page.tsx

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SidebarLayout from "@/components/layout/SidebarLayout";
import ContentStrategyDashboard from "@/components/content/content-strategy-dashboard";
import HistoryPanel from "@/components/content/HistoryPanel";
import AutoContentEngineSplit from "@/components/content/AutoContentEngineSplit";
import PlannerView from "@/components/content/PlannerView";
import ProgressStepper from "@/components/content/ProgressStepper";
import SmartSelectSummary from "@/components/content/SmartSelectSummary";
import EmptyStateOnboarding from "@/components/content/EmptyStateOnboarding";
import SEOHealthScore from "@/components/content/SEOHealthScore";
import PersonaCard from "@/components/content/PersonaCard";
import GapAnalysisCard from "@/components/content/GapAnalysisCard";
import PriorityMatrix from "@/components/content/PriorityMatrix";
import DraftSolutionModal from "@/components/content/DraftSolutionModal";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Search,
  History,
  ArrowLeft,
} from "lucide-react";

interface CrawledPage {
  url: string;
  type: string;
  title?: string;
  selected?: boolean;
}

interface RecentAnalysis {
  id: string;
  url: string;
  date: string;
  pagesAnalyzed: number;
  healthScore?: number;
}

const STORAGE_KEY_DISCOVERY = "seo_discovery_data";
const STORAGE_KEY_ANALYSIS = "seo_analysis_output";

export default function ContentStrategyPage() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") || "analysis";

  const [activeView, setActiveView] = useState(initialView);
  const [analysisOutput, setAnalysisOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [crawlStep, setCrawlStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [pages, setPages] = useState<CrawledPage[]>([]);
  const [crawlRunId, setCrawlRunId] = useState<string | null>(null);
  const [crawlPublicToken, setCrawlPublicToken] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["service", "blog"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftGapTopic, setDraftGapTopic] = useState("");
  const [showBridgeFlowModal, setShowBridgeFlowModal] = useState(false);
  const [bridgeFlowGap, setBridgeFlowGap] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ANALYSIS);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.analysisOutput && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          setAnalysisOutput(data.analysisOutput);
        }
      } catch (e) {
        console.error("Failed to restore analysis:", e);
      }
    }

    const storedDiscovery = localStorage.getItem(STORAGE_KEY_DISCOVERY);
    if (storedDiscovery) {
      try {
        const data = JSON.parse(storedDiscovery);
        if (data.pages && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          setPages(data.pages);
          if (data.baseUrl) setBaseUrl(data.baseUrl);
        }
      } catch (e) {
        console.error("Failed to restore discovery:", e);
      }
    }

    loadRecentAnalyses();
  }, []);

  const loadRecentAnalyses = async () => {
    try {
      const response = await fetch("/api/content/history?limit=3");
      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(
          (data.analyses || []).map((a: any) => ({
            id: a.id,
            url: a.baseUrl || a.url,
            date: new Date(a.createdAt).toLocaleDateString(),
            pagesAnalyzed: a.pagesAnalyzed || 0,
            healthScore: a.healthScore,
          }))
        );
      }
    } catch (e) {
      console.error("Failed to load recent analyses:", e);
    }
  };

  const handleCrawl = async (url?: string) => {
    const targetUrl = url || baseUrl;
    if (!targetUrl) {
      setError("Please enter a website URL");
      return;
    }

    setBaseUrl(targetUrl);
    setIsCrawling(true);
    setCrawlProgress(0);
    setCrawlStep(0);
    setError(null);
    setPages([]);

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, maxPages: 50 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start crawl");
      }

      setCrawlRunId(data.runId);
      setCrawlPublicToken(data.publicToken);

      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const progress = Math.min(95, (attempts / maxAttempts) * 100);
        setCrawlProgress(progress);
        setCrawlStep(Math.min(2, Math.floor(attempts / 10)));

        const pollResponse = await fetch(
          `/api/crawl?runId=${data.runId}&publicToken=${data.publicToken}`
        );

        const pollData = await pollResponse.json();

        if (pollData.status === "COMPLETED") {
          setCrawlProgress(100);
          setCrawlStep(2);

          const urlGroups = pollData.output?.urlGroups || {};
          const allPages = pollData.output?.pages || [];

          const typeMapping: Record<string, string> = {
            core: "other",
            blog: "blog",
            product: "product",
            service: "service",
            category: "other",
            other: "other",
          };

          const pagesWithSelection: CrawledPage[] = [];

          Object.entries(urlGroups).forEach(([groupType, urls]) => {
            const pageType = typeMapping[groupType] || "other";
            const shouldAutoSelect = ["service", "blog"].includes(pageType);

            (urls as string[]).forEach((url: string) => {
              const pageData = allPages.find((p: any) => p.url === url);
              pagesWithSelection.push({
                url,
                type: pageType,
                title: pageData?.title || "",
                selected: shouldAutoSelect,
              });
            });
          });

          setPages(pagesWithSelection);
          localStorage.setItem(
            STORAGE_KEY_DISCOVERY,
            JSON.stringify({
              pages: pagesWithSelection,
              urlGroups,
              baseUrl: targetUrl,
              timestamp: Date.now(),
            })
          );
          setIsCrawling(false);
          return;
        } else if (pollData.status === "FAILED" || pollData.status === "CANCELED") {
          throw new Error(`Crawl failed with status: ${pollData.status}`);
        }

        attempts++;
      }

      throw new Error("Crawl timed out");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during crawl");
      setIsCrawling(false);
    }
  };

  const handleAnalysis = async () => {
    const selectedPages = pages.filter((p) => p.selected);

    if (selectedPages.length === 0) {
      setError("Please select at least one page to analyze");
      return;
    }

    setIsLoading(true);
    setAnalysisProgress(0);
    setAnalysisStep(0);
    setError(null);

    try {
      const response = await fetch("/api/content/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl,
          pages: selectedPages.map((p) => ({ url: p.url, type: p.type })),
          maxPages: 50,
          targetAudience: "General audience",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start analysis");
      }

      let attempts = 0;
      const maxAttempts = 90;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const progress = Math.min(95, (attempts / maxAttempts) * 100);
        setAnalysisProgress(progress);
        setAnalysisStep(Math.min(3, Math.floor(attempts / 15)));

        const pollResponse = await fetch(
          `/api/content/analyze?extractionRunId=${data.extractionRunId}&analysisRunId=${data.analysisRunId}&analysisId=${data.analysisId}`
        );

        const pollData = await pollResponse.json();

        if (pollData.hasFailed) {
          throw new Error(pollData.extractionError || pollData.analysisError || "Analysis failed");
        }

        if (pollData.isComplete && pollData.analysisOutput) {
          setAnalysisProgress(100);
          setAnalysisStep(3);
          setAnalysisOutput(pollData.analysisOutput);
          localStorage.setItem(
            STORAGE_KEY_ANALYSIS,
            JSON.stringify({
              analysisOutput: pollData.analysisOutput,
              timestamp: Date.now(),
            })
          );
          setIsLoading(false);
          loadRecentAnalyses();
          return;
        }

        attempts++;
      }

      throw new Error("Analysis timed out after 3 minutes. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleCrawlHistorySelect = (crawlItem: any) => {
    if (crawlItem.pagesData) {
      const transformedPages = crawlItem.pagesData.map((page: any) => ({
        url: page.url || page,
        type: page.type || "unknown",
        title: page.title || "",
        selected: true,
      }));

      setPages(transformedPages);
      setBaseUrl(crawlItem.url);
      setIsCrawling(false);
    }
  };

  const handleAnalysisHistorySelect = (analysisItem: any) => {
    if (analysisItem.analysisOutput) {
      setAnalysisOutput(analysisItem.analysisOutput);
      setIsLoading(false);
    }
  };

  const handleSelectType = (type: string, select: boolean) => {
    setPages(pages.map((p) => (p.type === type ? { ...p, selected: select } : p)));
  };

  const handleSelectRecommended = () => {
    setPages(
      pages.map((p) => ({
        ...p,
        selected: ["service", "blog"].includes(p.type),
      }))
    );
  };

  const handleSelectAll = () => {
    setPages(pages.map((p) => ({ ...p, selected: true })));
  };

  const handleDeselectAll = () => {
    setPages(pages.map((p) => ({ ...p, selected: false })));
  };

  const togglePageSelection = (index: number) => {
    const newPages = [...pages];
    newPages[index].selected = !newPages[index].selected;
    setPages(newPages);
  };

  const toggleGroup = (type: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  const getFilteredPages = () => {
    let filtered = pages;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.url.toLowerCase().includes(query) ||
          (p.title && p.title.toLowerCase().includes(query))
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.type === filterType);
    }

    return filtered;
  };

  const getPagesByType = () => {
    const filtered = getFilteredPages();
    const grouped: Record<string, CrawledPage[]> = {};

    filtered.forEach((page) => {
      if (!grouped[page.type]) {
        grouped[page.type] = [];
      }
      grouped[page.type].push(page);
    });

    return grouped;
  };

  const handleGenerateFromGap = (gap: string) => {
    setBridgeFlowGap(gap);
    setShowBridgeFlowModal(true);
  };

  const handleBridgeFlowGenerate = async (config: {
    topic: string;
    tone: string;
    keywords: string[];
    targetPersona: string;
  }) => {
    setDraftGapTopic(config.topic);
    setShowBridgeFlowModal(false);
    setActiveView("production");
  };

  const handlePlanGap = (gap: string) => {
    setActiveView("planner");
  };

  const handleQuickAction = (action: "draft" | "gaps") => {
    if (action === "draft") {
      setActiveView("production");
    } else {
      if (!analysisOutput) {
        setError("Please run an analysis first to identify content gaps.");
      }
    }
  };

  const handleLoadHistory = (analysis: RecentAnalysis) => {
    setActiveView("analysis");
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const pagesByType = getPagesByType();
  const selectedCount = pages.filter((p) => p.selected).length;

  const renderAnalysisView = () => {
    if (analysisOutput) {
      return (
        <ContentStrategyDashboard
          analysisOutput={analysisOutput}
          isLoading={isLoading}
          onRefresh={handleAnalysis}
        />
      );
    }

    if (pages.length === 0 && !isCrawling && !isLoading) {
      return (
        <div className="py-8">
          <EmptyStateOnboarding
            recentAnalyses={recentAnalyses}
            onStartAnalysis={handleCrawl}
            onLoadHistory={handleLoadHistory}
            onQuickAction={handleQuickAction}
          />
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Website URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://example.com"
                  disabled={isCrawling}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:opacity-50"
                />
                <button
                  onClick={() => handleCrawl()}
                  disabled={isCrawling || !baseUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isCrawling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Crawling...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Auto Crawl
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress Stepper */}
            {isCrawling && (
              <ProgressStepper mode="crawl" progress={crawlProgress} currentStep={crawlStep} />
            )}

            {isLoading && !isCrawling && (
              <ProgressStepper mode="analyze" progress={analysisProgress} currentStep={analysisStep} />
            )}

            {/* Smart Select Summary */}
            {pages.length > 0 && !isCrawling && !isLoading && (
              <>
                <SmartSelectSummary
                  pages={pages}
                  onSelectType={handleSelectType}
                  onSelectRecommended={handleSelectRecommended}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />

                {/* Detailed Page List */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
                  {Object.entries(pagesByType).map(([type, typePages]) => (
                    <div key={type}>
                      <div
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => toggleGroup(type)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedGroups.has(type) ? (
                            <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          )}
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              type === "service"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : type === "blog"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : type === "product"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {typePages.length} pages
                          </span>
                        </div>
                      </div>

                      {expandedGroups.has(type) && (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                          {typePages.map((page) => {
                            const globalIndex = pages.indexOf(page);
                            return (
                              <div
                                key={page.url}
                                className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                              >
                                <button
                                  onClick={() => togglePageSelection(globalIndex)}
                                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    page.selected
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
                                  }`}
                                >
                                  {page.selected && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {page.title || page.url}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                    {page.url}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Error</p>
                    <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pages.length > 0 && !isCrawling && !isLoading && (
              <button
                onClick={handleAnalysis}
                disabled={isLoading || selectedCount === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Start Analysis ({selectedCount} pages)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    if (!analysisOutput) {
      return (
        <div className="py-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No analysis data available. Please run an analysis first.
          </p>
          <button
            onClick={() => setActiveView("analysis")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Strategy Analysis
          </button>
        </div>
      );
    }

    const contentContext = analysisOutput.contentContext || {};
    const pagesData = analysisOutput.pages || [];
    const totalWordCount = pagesData.reduce((sum: number, p: any) => sum + (p.wordCount || 0), 0);
    const avgWordCount = pagesData.length > 0 ? Math.round(totalWordCount / pagesData.length) : 0;

    return (
      <div className="py-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          SEO Dashboard
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score */}
          <SEOHealthScore
            totalPages={pagesData.length}
            avgWordCount={avgWordCount}
            contentGapsCount={contentContext.contentGaps?.length || 0}
            keywordsCount={contentContext.dominantKeywords?.length || 0}
          />

          {/* Persona Card */}
          <PersonaCard
            audiencePersona={contentContext.audiencePersona}
            tone={contentContext.tone}
            writingStyle={contentContext.overallWritingStyle}
          />

          {/* Gap Analysis with Priority Matrix */}
          <div className="lg:col-span-1">
            <GapAnalysisCard
              gaps={contentContext.contentGaps || []}
              onGenerateSolution={handleGenerateFromGap}
              onPlanForLater={handlePlanGap}
            />
          </div>
        </div>

        {/* Priority Matrix Section */}
        {contentContext.contentGaps && contentContext.contentGaps.length > 0 && (
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <PriorityMatrix
              gaps={contentContext.contentGaps}
              onGenerateSolution={handleGenerateFromGap}
              onPlanForLater={handlePlanGap}
            />
          </div>
        )}

        {/* Full Dashboard */}
        <ContentStrategyDashboard
          analysisOutput={analysisOutput}
          isLoading={isLoading}
          onRefresh={handleAnalysis}
        />
      </div>
    );
  };

  const renderProductionView = () => {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Content Production
        </h2>
        <AutoContentEngineSplit />
      </div>
    );
  };

  const renderPlannerView = () => {
    const contentContext = analysisOutput?.contentContext || {};
    return (
      <PlannerView
        contentGaps={contentContext.contentGaps || []}
        aiSuggestions={analysisOutput?.aiSuggestions || []}
        contentContext={contentContext}
      />
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboardView();
      case "analysis":
        return renderAnalysisView();
      case "production":
        return renderProductionView();
      case "planner":
        return renderPlannerView();
      default:
        return renderAnalysisView();
    }
  };

  const contentContext = analysisOutput?.contentContext || {};

  return (
    <SidebarLayout activeView={activeView} onViewChange={handleViewChange}>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">{renderContent()}</div>
      </div>

      {/* Bridge Flow Modal - Gap to Content Generation */}
      <DraftSolutionModal
        isOpen={showBridgeFlowModal}
        onClose={() => setShowBridgeFlowModal(false)}
        gapTopic={bridgeFlowGap}
        targetPersona={contentContext.audiencePersona || "General Audience"}
        suggestedTone={contentContext.tone || "professional"}
        suggestedKeywords={contentContext.dominantKeywords?.map((k: any) => k.term || k) || []}
        onGenerate={handleBridgeFlowGenerate}
      />
    </SidebarLayout>
  );
}

```

---

### src\components\content\AutoContentEngineSplit.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import {
  Wand2,
  Globe,
  MapPin,
  FileText,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Search,
  Target,
  Settings,
  Eye,
  Zap,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import SearchResultPreview from "./SearchResultPreview";

interface DiscoveryData {
  services: string[];
  locations: string[];
  aboutSummary: string;
  targetAudience: string;
  brandTone: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  existingPages: Array<{
    url: string;
    type: string;
    title: string;
  }>;
}

interface Topic {
  title: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  targetLocations: string[];
  contentType: "blog post" | "landing page";
  description: string;
  searchIntent: "informational" | "commercial" | "local";
  estimatedWordCount?: number;
  difficulty?: "easy" | "medium" | "hard";
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: "generating" | "completed" | "failed";
}

export default function AutoContentEngineSplit() {
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [customKeywords, setCustomKeywords] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"skeleton" | "outline" | "content">("skeleton");

  const toneOptions = [
    { value: "professional", label: "Professional", desc: "Formal and business-focused" },
    { value: "conversational", label: "Conversational", desc: "Friendly and approachable" },
    { value: "authoritative", label: "Authoritative", desc: "Expert and confident" },
    { value: "educational", label: "Educational", desc: "Informative and helpful" },
  ];

  useEffect(() => {
    loadDiscoveryData();
  }, []);

  const loadDiscoveryData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/content/auto-discovery?crawlRequestId=latest");
      const data = await response.json();

      if (data.success) {
        setDiscoveryData(data.data);
        if (data.data.brandTone) {
          setSelectedTone(data.data.brandTone.toLowerCase());
        }
      } else {
        throw new Error(data.error || "Failed to load discovery data");
      }
    } catch (error) {
      console.error("Error loading discovery data:", error);
      setError("Failed to load discovery data. Please run a crawl first.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!customTopic && !selectedService) {
      setError("Please enter a topic or select a service");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setPreviewMode("outline");
    setGeneratedContent(null);

    try {
      const response = await fetch("/api/content/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic || `${selectedService} Services`,
          service: selectedService,
          locations: selectedLocations,
          tone: selectedTone,
          keywords: customKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          brandContext: discoveryData?.aboutSummary,
          targetAudience: discoveryData?.targetAudience,
          stream: true, // Enable streaming
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start content generation");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Streaming not supported");
      }

      const decoder = new TextDecoder();
      let accumulatedContent = "";
      
      setPreviewMode("content");
      setGeneratedContent({
        id: `content_${Date.now()}`,
        title: customTopic || `${selectedService} Services`,
        content: "",
        wordCount: 0,
        status: "generating",
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;
        
        // Update content in real-time
        setGeneratedContent(prev => prev ? {
          ...prev,
          content: accumulatedContent,
          wordCount: accumulatedContent.split(/\s+/).length,
        } : null);
      }

      // Mark as completed
      setGeneratedContent(prev => prev ? {
        ...prev,
        status: "completed",
      } : null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content");
      setPreviewMode("skeleton");
      setGeneratedContent(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent?.content) {
      navigator.clipboard.writeText(generatedContent.content);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setPreviewMode("skeleton");
    setCustomTopic("");
    setCustomKeywords("");
  };

  const canGenerate = (customTopic || selectedService) && !isGenerating;

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Side - Configuration */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Content Configuration
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Topic / Title
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Ultimate Guide to Digital Marketing"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              {/* Service Selection */}
              {discoveryData?.services && discoveryData.services.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Related Service (Optional)
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value="">Select a service...</option>
                    {discoveryData.services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Writing Tone
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedTone(tone.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedTone === tone.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {tone.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {tone.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="e.g., SEO, digital marketing, content strategy"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              {/* Location Selection */}
              {discoveryData?.locations && discoveryData.locations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Locations (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {discoveryData.locations.map((location) => (
                      <button
                        key={location}
                        onClick={() =>
                          setSelectedLocations((prev) =>
                            prev.includes(location)
                              ? prev.filter((l) => l !== location)
                              : [...prev, location]
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedLocations.includes(location)
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Content Preview
              </h2>
            </div>
            {generatedContent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copy content"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Reset"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Skeleton State with Search Result Preview */}
          {previewMode === "skeleton" && !isGenerating && (
            <div className="space-y-6">
              {/* Live Search Result Preview */}
              <SearchResultPreview
                title={customTopic}
                url={discoveryData?.existingPages?.[0]?.url || "https://example.com"}
                keywords={customKeywords.split(",").map((k) => k.trim()).filter(Boolean)}
              />

              {/* Placeholder skeleton */}
              {!customTopic && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full animate-pulse" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-4/6 animate-pulse" />
                  </div>
                  <div className="text-center py-6">
                    <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Enter a topic to see your search preview
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-slate-700 dark:text-slate-300">
                  Generating your content...
                </p>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-blue-50 dark:bg-blue-900/20 rounded w-full animate-pulse" />
                <div className="h-4 bg-blue-50 dark:bg-blue-900/20 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-blue-50 dark:bg-blue-900/20 rounded w-4/6 animate-pulse" />
              </div>
            </div>
          )}

          {/* Content Preview */}
          {previewMode === "content" && generatedContent && (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {generatedContent.wordCount.toLocaleString()} words generated
                </span>
              </div>
              <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

```

---

### src\components\content\DraftSolutionModal.tsx

```typescript
"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Zap,
  Target,
  FileText,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Settings,
} from "lucide-react";

interface DraftSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gapTopic: string;
  targetPersona?: string;
  suggestedTone?: string;
  suggestedKeywords?: string[];
  onGenerate: (config: {
    topic: string;
    tone: string;
    keywords: string[];
    targetPersona: string;
  }) => void;
}

const toneOptions = [
  { value: "professional", label: "Professional", desc: "Formal and business-focused" },
  { value: "conversational", label: "Conversational", desc: "Friendly and approachable" },
  { value: "authoritative", label: "Authoritative", desc: "Expert and confident" },
  { value: "educational", label: "Educational", desc: "Informative and helpful" },
];

export default function DraftSolutionModal({
  isOpen,
  onClose,
  gapTopic,
  targetPersona = "General Audience",
  suggestedTone = "professional",
  suggestedKeywords = [],
  onGenerate,
}: DraftSolutionModalProps) {
  const [topic, setTopic] = useState(gapTopic);
  const [tone, setTone] = useState(suggestedTone);
  const [keywords, setKeywords] = useState<string[]>(suggestedKeywords);
  const [customKeyword, setCustomKeyword] = useState("");
  const [persona, setPersona] = useState(targetPersona);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (isOpen) {
      setTopic(gapTopic);
      setTone(suggestedTone);
      setKeywords(suggestedKeywords);
      setPersona(targetPersona);
      setStep(1);
    }
  }, [isOpen, gapTopic, suggestedTone, suggestedKeywords, targetPersona]);

  const handleAddKeyword = () => {
    if (customKeyword.trim() && !keywords.includes(customKeyword.trim())) {
      setKeywords([...keywords, customKeyword.trim()]);
      setCustomKeyword("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate({ topic, tone, keywords, targetPersona: persona });
      onClose();
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Draft Solution
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Generate content to fill this gap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= 1 ? "text-slate-900 dark:text-slate-100" : "text-slate-500"
                }`}
              >
                Configure
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full bg-blue-600 transition-all ${
                  step >= 2 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= 2 ? "text-slate-900 dark:text-slate-100" : "text-slate-500"
                }`}
              >
                Generate
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {step === 1 && (
            <div className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  placeholder="Enter your topic..."
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Auto-filled from the content gap. Modify if needed.
                </p>
              </div>

              {/* Target Persona */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Target Persona
                </label>
                <input
                  type="text"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  placeholder="Who is this content for?"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Writing Tone
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {toneOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        tone === option.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {option.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={customKeyword}
                    onChange={(e) => setCustomKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    placeholder="Add a keyword..."
                  />
                  <button
                    onClick={handleAddKeyword}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {kw}
                      <button
                        onClick={() => handleRemoveKeyword(kw)}
                        className="hover:text-blue-900 dark:hover:text-blue-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {keywords.length === 0 && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      No keywords added yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              {isGenerating ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Generating Your Content...
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    This may take a moment. We're crafting high-quality content.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Sparkles className="w-12 h-12 text-blue-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Ready to Generate
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-left max-w-md mx-auto">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Topic:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{topic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Tone:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">{tone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Keywords:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{keywords.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!topic.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                disabled={isGenerating}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate Content
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

```

---

### src\components\content\EmptyStateOnboarding.tsx

```typescript
"use client";

import React from "react";
import {
  Globe,
  Sparkles,
  ArrowRight,
  FileText,
  Search,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react";

interface RecentAnalysis {
  id: string;
  url: string;
  date: string;
  pagesAnalyzed: number;
  healthScore?: number;
}

interface EmptyStateOnboardingProps {
  recentAnalyses?: RecentAnalysis[];
  onStartAnalysis: (url: string) => void;
  onLoadHistory: (analysis: RecentAnalysis) => void;
  onQuickAction: (action: "draft" | "gaps") => void;
}

export default function EmptyStateOnboarding({
  recentAnalyses = [],
  onStartAnalysis,
  onLoadHistory,
  onQuickAction,
}: EmptyStateOnboardingProps) {
  const [url, setUrl] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onStartAnalysis(url.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            AI-Powered SEO Analysis
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Enter your domain to generate
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            your SEO Roadmap
          </span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Discover content gaps, analyze your brand voice, and get AI-powered content
          suggestions tailored to your business.
        </p>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-12 pr-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100 text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={!url.trim()}
              className="inline-flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Search className="w-5 h-5" />
              Analyze
            </button>
          </div>
        </form>
      </div>

      {/* Recent Activity */}
      {recentAnalyses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAnalyses.slice(0, 3).map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => onLoadHistory(analysis)}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {analysis.healthScore && (
                    <span
                      className={`text-sm font-bold ${
                        analysis.healthScore >= 70
                          ? "text-green-600"
                          : analysis.healthScore >= 50
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {analysis.healthScore}%
                    </span>
                  )}
                </div>
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate mb-1">
                  {analysis.url.replace(/^https?:\/\//, "")}
                </p>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>{analysis.pagesAnalyzed} pages</span>
                  <span>•</span>
                  <span>{analysis.date}</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Load analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onQuickAction("draft")}
            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Draft New Article
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Generate a new SEO-optimized article with AI assistance
            </p>
            <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
              <span>Start writing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onQuickAction("gaps")}
            className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Check Content Gaps
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Identify missing content opportunities on your website
            </p>
            <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
              <span>Find opportunities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: "Enter URL",
              desc: "Provide your website URL to begin",
            },
            {
              step: 2,
              title: "Auto Crawl",
              desc: "We discover and categorize all your pages",
            },
            {
              step: 3,
              title: "AI Analysis",
              desc: "Deep analysis of content, tone, and gaps",
            },
            {
              step: 4,
              title: "Get Roadmap",
              desc: "Actionable recommendations to improve SEO",
            },
          ].map((item, index) => (
            <div key={item.step} className="text-center relative">
              {index < 3 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
              )}
              <div className="relative z-10 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {item.step}
                </span>
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

```

---

### src\components\content\GapAnalysisCard.tsx

```typescript
"use client";

import React from "react";
import {
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowRight,
  TrendingUp,
  Target,
} from "lucide-react";

interface GapAnalysisCardProps {
  gaps: string[];
  onGenerateSolution: (gap: string) => void;
  onPlanForLater: (gap: string) => void;
}

const getPriorityLevel = (index: number): "high" | "medium" | "low" => {
  if (index < 2) return "high";
  if (index < 4) return "medium";
  return "low";
};

const getPriorityConfig = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return {
        label: "High Priority",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-700 dark:text-red-300",
        badgeBg: "bg-red-100 dark:bg-red-900/50",
        badgeText: "text-red-600 dark:text-red-400",
      };
    case "medium":
      return {
        label: "Medium Priority",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-200 dark:border-amber-800",
        textColor: "text-amber-700 dark:text-amber-300",
        badgeBg: "bg-amber-100 dark:bg-amber-900/50",
        badgeText: "text-amber-600 dark:text-amber-400",
      };
    case "low":
      return {
        label: "Low Priority",
        bgColor: "bg-slate-50 dark:bg-slate-800",
        borderColor: "border-slate-200 dark:border-slate-700",
        textColor: "text-slate-700 dark:text-slate-300",
        badgeBg: "bg-slate-100 dark:bg-slate-700",
        badgeText: "text-slate-600 dark:text-slate-400",
      };
  }
};

export default function GapAnalysisCard({
  gaps,
  onGenerateSolution,
  onPlanForLater,
}: GapAnalysisCardProps) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-3">
          <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          No Content Gaps Found
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Your content strategy looks comprehensive. Keep up the great work!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Content Gaps ({gaps.length})
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-4 h-4" />
          <span>Opportunities to rank higher</span>
        </div>
      </div>

      {/* 2x2 Priority Matrix (for first 4 gaps) */}
      {gaps.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {gaps.slice(0, 4).map((gap, index) => {
            const priority = getPriorityLevel(index);
            const config = getPriorityConfig(priority);

            return (
              <div
                key={index}
                className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
                  >
                    {config.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                  </div>
                </div>

                <p className={`text-sm font-medium ${config.textColor} mb-4 line-clamp-2`}>
                  {gap}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onGenerateSolution(gap)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    Generate Solution
                  </button>
                  <button
                    onClick={() => onPlanForLater(gap)}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Plan Later
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Additional gaps as a list */}
      {gaps.length > 4 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Additional Opportunities ({gaps.length - 4})
          </p>
          <div className="space-y-2">
            {gaps.slice(4).map((gap, index) => (
              <div
                key={index + 4}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 mr-4">
                  {gap}
                </p>
                <button
                  onClick={() => onGenerateSolution(gap)}
                  className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-all"
                >
                  <Zap className="w-3 h-3" />
                  Generate
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

```

---

### src\components\content\PagesTable.tsx

```typescript
"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  Eye,
  Edit3,
  RefreshCw,
  ExternalLink,
  FileText,
  BookOpen,
  ShoppingBag,
  Globe,
  Search,
} from "lucide-react";

interface PageData {
  url: string;
  type: string;
  title?: string;
  wordCount: number;
  mainTopic?: string;
  writingStyle?: {
    tone: string;
    formality: string;
  };
  keywords?: string[];
}

interface PagesTableProps {
  pages: PageData[];
  onView: (page: PageData) => void;
  onOptimize: (page: PageData) => void;
  onRewrite: (page: PageData) => void;
}

const columnHelper = createColumnHelper<PageData>();

const getDensityBars = (wordCount: number) => {
  if (wordCount >= 2000) return { level: 3, color: "bg-green-500", label: "High" };
  if (wordCount >= 800) return { level: 2, color: "bg-blue-500", label: "Medium" };
  return { level: 1, color: "bg-amber-500", label: "Low" };
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "service":
      return FileText;
    case "blog":
      return BookOpen;
    case "product":
      return ShoppingBag;
    default:
      return Globe;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "service":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "blog":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "product":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  }
};

export default function PagesTable({
  pages,
  onView,
  onOptimize,
  onRewrite,
}: PagesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Page",
        cell: (info) => {
          const page = info.row.original;
          const TypeIcon = getTypeIcon(page.type);
          return (
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(
                  page.type
                )}`}
              >
                <TypeIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs">
                  {info.getValue() || page.url.split("/").pop() || "Untitled"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  {page.url}
                </p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => {
          const type = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                type
              )}`}
            >
              {type}
            </span>
          );
        },
      }),
      columnHelper.accessor("wordCount", {
        header: "Density",
        cell: (info) => {
          const wordCount = info.getValue();
          const density = getDensityBars(wordCount);
          return (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1.5 rounded-full transition-all ${
                      bar <= density.level
                        ? `${density.color} h-4`
                        : "bg-slate-200 dark:bg-slate-700 h-3"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {wordCount.toLocaleString()}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("mainTopic", {
        header: "Topic",
        cell: (info) => (
          <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs block">
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const page = info.row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onView(page)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOptimize(page)}
                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                title="Optimize"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRewrite(page)}
                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                title="Rewrite"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          );
        },
      }),
    ],
    [onView, onOptimize, onRewrite]
  );

  const table = useReactTable({
    data: pages,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search pages..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 text-sm"
            />
          </div>
          <select
            value={(columnFilters.find((f) => f.id === "type")?.value as string) ?? ""}
            onChange={(e) =>
              setColumnFilters(
                e.target.value
                  ? [{ id: "type", value: e.target.value }]
                  : []
              )
            }
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 text-sm"
          >
            <option value="">All Types</option>
            <option value="service">Service</option>
            <option value="blog">Blog</option>
            <option value="product">Product</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="w-4 h-4" />,
                          desc: <ChevronDown className="w-4 h-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {table.getRowModel().rows.length} of {pages.length} pages
        </p>
      </div>
    </div>
  );
}

```

---

### src\components\content\PersonaCard.tsx

```typescript
"use client";

import React from "react";
import {
  User,
  Briefcase,
  MessageSquare,
  Target,
  Sparkles,
} from "lucide-react";

interface PersonaCardProps {
  audiencePersona?: string;
  tone?: string;
  writingStyle?: {
    dominantTone?: string;
    averageFormality?: string;
    commonPerspective?: string;
    brandVoiceSummary?: string;
  };
  painPoints?: string[];
  goals?: string[];
}

export default function PersonaCard({
  audiencePersona = "General Audience",
  tone = "Professional",
  writingStyle,
  painPoints = [],
  goals = [],
}: PersonaCardProps) {
  const getAvatarGradient = (persona: string) => {
    const hash = persona.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-cyan-500 to-blue-600",
    ];
    return gradients[Math.abs(hash) % gradients.length];
  };

  const getPersonaInitials = (persona: string) => {
    const words = persona.split(" ").filter((w) => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return persona.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Trading Card Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
        <div className="bg-white dark:bg-slate-800 px-4 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Target Audience
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarGradient(
              audiencePersona
            )} flex items-center justify-center shadow-lg`}
          >
            <span className="text-3xl font-bold text-white">
              {getPersonaInitials(audiencePersona)}
            </span>
          </div>
        </div>

        {/* Persona Name */}
        <h3 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100 mb-4">
          {audiencePersona}
        </h3>

        {/* Stats Grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Preferred Tone</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{tone}</p>
            </div>
          </div>

          {writingStyle?.averageFormality && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Formality Level</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {writingStyle.averageFormality}
                </p>
              </div>
            </div>
          )}

          {writingStyle?.commonPerspective && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Writing Perspective</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {writingStyle.commonPerspective}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pain Points & Goals Tags */}
        {(painPoints.length > 0 || goals.length > 0) && (
          <div className="mt-4 space-y-3">
            {painPoints.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  Pain Points
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {painPoints.slice(0, 4).map((point, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full"
                    >
                      {point}
                    </span>
                  ))}
                  {painPoints.length > 4 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                      +{painPoints.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {goals.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  Goals
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {goals.slice(0, 4).map((goal, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full"
                    >
                      {goal}
                    </span>
                  ))}
                  {goals.length > 4 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                      +{goals.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand Voice Summary */}
        {writingStyle?.brandVoiceSummary && (
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Brand Voice
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {writingStyle.brandVoiceSummary}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          AI-generated persona based on content analysis
        </p>
      </div>
    </div>
  );
}

```

---

### src\components\content\PlannerView.tsx

```typescript
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Zap,
  Edit3,
  X,
  Save,
  Play,
  Loader2,
  Clock,
  FileText,
  GripVertical,
  Plus,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: "PLANNED" | "GENERATING" | "READY" | "PUBLISHED" | "FAILED";
  content?: string;
  outline?: string;
  tone?: string;
  keywords?: string[];
  targetService?: string;
  targetServiceUrl?: string;
  sourceSuggestionId?: string;
  analysisRunId?: string;
}

interface DraggableItem {
  id: string;
  type: "gap" | "suggestion";
  title: string;
  keywords?: string[];
  suggestionType?: string;
  reason?: string;
}

interface PlannerViewProps {
  contentGaps: string[];
  aiSuggestions: Array<{
    title: string;
    targetKeywords: string[];
    relatedServiceUrl?: string;
    type?: string;
    reason?: string;
  }>;
  contentContext?: {
    tone: string;
    audiencePersona: string;
  };
  analysisRunId?: string;
}

export default function PlannerView({
  contentGaps,
  aiSuggestions,
  contentContext,
  analysisRunId,
}: PlannerViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const [isAutoPlanning, setIsAutoPlanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [editorTitle, setEditorTitle] = useState("");
  const [editorOutline, setEditorOutline] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorTone, setEditorTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);

  const [editorKeywords, setEditorKeywords] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<{ url: string; alt: string } | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isAutoPlanWizardOpen, setIsAutoPlanWizardOpen] = useState(false);
  const [autoPlanConfig, setAutoPlanConfig] = useState({
    frequency: 2,
    days: [2, 4],
    tone: "professional",
    focus: "mixed",
  });

  const completion = useCompletion({
    api: "/api/generate/article",
    onFinish: (prompt, completion) => {
      setIsGenerating(false);
      setEditorContent(completion);
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: editorContent || completion || "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    editable: !isGenerating,
    immediatelyRender: false,
  });

  useEffect(() => {
    const gaps: DraggableItem[] = (contentGaps || []).map((gap, i) => ({
      id: `gap-${Date.now()}-${i}`,
      type: "gap",
      title: gap,
    }));

    const suggestions: DraggableItem[] = (aiSuggestions || []).map((s, i) => ({
      id: `suggestion-${Date.now()}-${i}`,
      type: "suggestion",
      title: s.title,
      keywords: s.targetKeywords,
      suggestionType: s.type,
      reason: s.reason,
    }));

    setDraggableItems([...gaps, ...suggestions]);
  }, [contentGaps, aiSuggestions]);

  useEffect(() => {
    if (events.length === 0 && process.env.NODE_ENV === 'development') {
      const testEvent: CalendarEvent = {
        id: 'test-event',
        title: 'Test Event - Calendar is Working!',
        start: new Date(),
        end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
        status: 'PLANNED',
      };
      setEvents([testEvent]);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/posts/update");
      const data = await response.json();
      if (data.posts && data.posts.length > 0) {
        const calendarEvents: CalendarEvent[] = data.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          start: new Date(post.scheduledFor),
          end: new Date(new Date(post.scheduledFor).getTime() + 2 * 60 * 60 * 1000),
          status: post.status,
          content: post.content,
          outline: post.outline,
          tone: post.tone,
          keywords: post.keywords,
          targetService: post.targetService,
          targetServiceUrl: post.targetServiceUrl,
        }));
        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const loadContentAnalysis = async () => {
    const storedAnalysis = localStorage.getItem('contentAnalysis');
    if (storedAnalysis) {
      const data = JSON.parse(storedAnalysis);
      if (data.analysisOutput?.contentContext) {
        const gaps: DraggableItem[] = (data.analysisOutput.contentContext.contentGaps || []).map((gap: string, i: number) => ({
          id: `gap-${Date.now()}-${i}`,
          type: "gap",
          title: gap,
        }));

        const suggestions: DraggableItem[] = (data.analysisOutput.aiSuggestions || []).map((s: any, i: number) => ({
          id: `suggestion-${Date.now()}-${i}`,
          type: "suggestion",
          title: s.title,
          keywords: s.targetKeywords,
          suggestionType: s.type,
          reason: s.reason,
        }));

        setDraggableItems([...gaps, ...suggestions]);
      }
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor =
      event.status === "PLANNED"
        ? "rgb(229 231 235)"
        : event.status === "GENERATING"
        ? "rgb(253 230 138)"
        : event.status === "READY"
        ? "rgb(191 219 254)"
        : event.status === "PUBLISHED"
        ? "rgb(187 247 208)"
        : "rgb(254 178 178)";
    const borderColor =
      event.status === "PLANNED"
        ? "rgb(156 163 175)"
        : event.status === "GENERATING"
        ? "rgb(234 179 8)"
        : event.status === "READY"
        ? "rgb(59 130 246)"
        : event.status === "PUBLISHED"
        ? "rgb(34 197 94)"
        : "rgb(239 68 68)";
    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "4px",
      },
    };
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Debug logging
    console.log("Drag end:", { active: active.id, over: over?.id });
    
    if (!over) {
      console.log("No drop target");
      return;
    }

    // Check if dropped on a calendar day
    if (!over.id.toString().startsWith("day-")) {
      console.log("Not dropped on a calendar day");
      return;
    }

    const item = draggableItems.find((i) => i.id === active.id);
    if (!item) {
      console.log("Item not found:", active.id);
      return;
    }

    const dateStr = over.id.toString().replace("day-", "");
    const dropDate = new Date(dateStr);
    
    // Validate date
    if (isNaN(dropDate.getTime())) {
      console.error("Invalid date:", dateStr);
      return;
    }

    console.log("Creating event:", { item, dropDate });

    try {
      // Create event locally without API call
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}-${Math.random()}`,
        title: item.title,
        start: dropDate,
        end: new Date(dropDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
        status: "PLANNED",
        tone: contentContext?.tone || "professional",
        keywords: item.keywords || [],
        sourceSuggestionId: item.type === "suggestion" ? item.id : undefined,
        analysisRunId,
      };

      // Add event to calendar
      setEvents((prev) => [...prev, newEvent]);
      
      // Remove from draggable items
      setDraggableItems((prev) => prev.filter((i) => i.id !== active.id));
      
      console.log("Event created successfully:", newEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditorTitle(event.title);
    setEditorOutline(event.outline || "");
    setEditorContent(event.content || "");
    setEditorTone(event.tone || "professional");
    setEditorKeywords(event.keywords || []);
    setApprovalStatus("PENDING");
    setIsEditorOpen(true);
  };

  const handleGenerateOutline = async () => {
    if (!editorTitle) return;

    setIsGeneratingOutline(true);
    try {
      const response = await fetch("/api/content/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editorTitle,
          aiKeywords: editorKeywords,
          userKeywords: [],
          promotedService: "",
          serviceContext: "",
          tone: editorTone,
        }),
      });

      const data = await response.json();
      if (data.outline) {
        setEditorOutline(data.outline);
      }
    } catch (error) {
      console.error("Error generating outline:", error);
      alert("Failed to generate outline");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleGenerateArticle = async () => {
    if (!editorTitle || !editorOutline) {
      alert("Please provide a title and outline first");
      return;
    }

    setIsGenerating(true);
    const prompt = `Title: ${editorTitle}\n\nOutline:\n${editorOutline}\n\nTone: ${editorTone}\n\nKeywords: ${editorKeywords.join(", ")}`;
    completion.complete(prompt);
  };

  const handlePublishToWordPress = async () => {
    if (!selectedEvent) return;

    setIsPublishing(true);
    try {
      const content = editor?.getHTML() || completion || "";
      const response = await fetch("/api/content/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordpressSiteId: "default",
          title: editorTitle,
          slug: editorTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          content,
          excerpt: editorContent.substring(0, 150),
          metaDescription: `Article about ${editorTitle}`,
          focusKeyword: editorKeywords[0] || "",
          secondaryKeywords: editorKeywords.slice(1),
          featuredImageUrl: featuredImage?.url,
          featuredImageAlt: featuredImage?.alt,
          isAiGeneratedImage: !!featuredImage,
          categories: [],
          tags: editorKeywords,
          scheduledFor: new Date().toISOString(),
          seoScore: 85,
          readabilityScore: 80,
        }),
      });

      if (!response.ok) throw new Error("Failed to publish");

      alert("Published to WordPress successfully!");
      loadEvents();
      setIsEditorOpen(false);
    } catch (error) {
      console.error("Error publishing:", error);
      alert("Failed to publish to WordPress");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAutoPlanMonth = () => {
    setIsAutoPlanWizardOpen(true);
  };

  const handleGenerateAutoPlan = async () => {
    setIsAutoPlanning(true);
    try {
      const response = await fetch("/api/monthly-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frequency: autoPlanConfig.frequency,
          days: autoPlanConfig.days,
          tone: autoPlanConfig.tone,
          focus: autoPlanConfig.focus,
          contentGaps,
          dominantKeywords: [],
        }),
      });

      if (!response.ok) throw new Error("Failed to generate auto-plan");

      const data = await response.json();
      if (data.events) {
        const newEvents: CalendarEvent[] = data.events.map((evt: any) => ({
          id: `event-${Date.now()}-${Math.random()}`,
          title: evt.title,
          start: new Date(evt.date),
          end: new Date(new Date(evt.date).getTime() + 2 * 60 * 60 * 1000),
          status: "PLANNED",
          tone: autoPlanConfig.tone,
          keywords: evt.keywords || [],
        }));
        setEvents((prev) => [...prev, ...newEvents]);
      }

      setIsAutoPlanWizardOpen(false);
      loadEvents();
    } catch (error) {
      console.error("Error generating auto-plan:", error);
      // Show a more user-friendly error message
      if (error instanceof Error && error.message.includes("Failed to generate auto-plan")) {
        alert("Unable to generate auto-plan at the moment. Please try dragging content items manually to the calendar.");
      } else {
        alert("An error occurred while generating the auto-plan. Please try again.");
      }
    } finally {
      setIsAutoPlanning(false);
    }
  };

  const handleApproveAndSchedule = async () => {
    if (!selectedEvent) return;

    const scheduledDate = new Date(selectedEvent.start);
    const now = new Date();
    const isFuture = scheduledDate > now;

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/posts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedEvent.id,
          status: "READY",
          approvalStatus: "APPROVED",
        }),
      });

      if (!response.ok) throw new Error("Failed to approve and schedule");

      if (isFuture) {
        // Queue for Cron Job
        alert(`Post approved and scheduled for ${scheduledDate.toLocaleDateString()}. Cron job will publish at scheduled time.`);
      } else {
        // Publish immediately
        await handlePublishToWordPress();
      }

      loadEvents();
      setIsEditorOpen(false);
    } catch (error) {
      console.error("Error approving and scheduling:", error);
      alert("Failed to approve and schedule");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  function DraggableItem({ item }: { item: DraggableItem }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
      id: item.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow cursor-move"
      >
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
              {item.title}
            </div>
            {item.suggestionType && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.type === 'gap' 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : item.suggestionType === 'Blog Post'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : item.suggestionType === 'Whitepaper'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : item.suggestionType === 'Case Study'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : item.suggestionType === 'Guide'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
                }`}>
                  {item.type === 'gap' ? 'Gap' : item.suggestionType}
                </span>
                {item.type === 'suggestion' && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    AI Suggestion
                  </span>
                )}
              </div>
            )}
            {item.reason && (
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {item.reason}
              </div>
            )}
            {item.keywords && item.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.keywords.slice(0, 3).map((kw, ki) => (
                  <span key={ki} className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-600 rounded text-slate-600 dark:text-slate-300">
                    {kw}
                  </span>
                ))}
                {item.keywords.length > 3 && (
                  <span className="text-xs px-1.5 py-0.5 text-slate-500 dark:text-slate-400">
                    +{item.keywords.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function DroppableDay({ date, children }: { date: Date; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
      id: `day-${date.toISOString()}`,
    });

    return (
      <div
        ref={setNodeRef}
        className={`h-full transition-all relative ${isOver 
          ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400 ring-inset' 
          : events.length === 0 
          ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50' 
          : ''
        }`}
        style={{ minHeight: '80px' }}
      >
        {children}
        {isOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-blue-50 dark:bg-blue-900/20">
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
              Drop here
            </div>
          </div>
        )}
        {/* Debug indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-0 right-0 text-[8px] text-slate-400 p-1">
            {date.getDate()}
          </div>
        )}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        {/* Mobile Header */}
        {isMobile && (
          <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FileText className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Content Calendar
            </h1>
            <Button
              onClick={handleAutoPlanMonth}
              disabled={isAutoPlanning}
              size="sm"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Sidebar - Hidden on mobile unless toggled */}
        <aside 
          className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 overflow-y-auto transition-transform duration-300 ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Content Tray
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Drag to calendar
              </p>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                Content Gaps
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Drag to calendar
              </p>
              {draggableItems.filter(item => item.type === "gap").length > 0 ? (
                <div className="space-y-2">
                  {draggableItems.filter(item => item.type === "gap").map((item) => (
                    <DraggableItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                  No content gaps found.
                </p>
              )}
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                AI Suggestions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Drag to calendar
              </p>
              {draggableItems.filter(item => item.type === "suggestion").length > 0 ? (
                <div className="space-y-2">
                  {draggableItems.filter(item => item.type === "suggestion").map((item) => (
                    <DraggableItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                  No AI suggestions found.
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Calendar Area */}
        <main className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Content Calendar
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Plan, create, and schedule your content
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAutoPlanMonth}
                disabled={isAutoPlanning}
                className="flex items-center gap-2"
              >
                {isAutoPlanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Planning...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Auto-Plan Month
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded border border-gray-400 dark:border-gray-600" />
              <span className="text-slate-600 dark:text-slate-400">Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-900/30 rounded border border-yellow-400 dark:border-yellow-600" />
              <span className="text-slate-600 dark:text-slate-400">Generating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900/30 rounded border border-blue-400 dark:border-blue-600" />
              <span className="text-slate-600 dark:text-slate-400">Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 dark:bg-green-900/30 rounded border border-green-400 dark:border-green-600" />
              <span className="text-slate-600 dark:text-slate-400">Published</span>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 overflow-hidden relative" style={{ minHeight: '500px' }}>
            {/* Calendar is always visible */}
            <div className={events.length === 0 ? "opacity-40" : ""} style={{ height: '450px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", minHeight: "400px" }}
                eventPropGetter={eventStyleGetter}
                view={isMobile ? Views.AGENDA : (view as any)}
                date={currentDate}
                onNavigate={(newDate) => setCurrentDate(newDate as Date)}
                onView={(newView) => setView(newView as View)}
                onSelectEvent={(event) => handleSelectEvent(event as CalendarEvent)}
                views={isMobile ? [Views.AGENDA] : [Views.MONTH, Views.WEEK, Views.DAY]}
                components={{
                  toolbar: () => (
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {moment(currentDate).format("MMMM YYYY")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      {!isMobile && (
                        <div className="flex gap-1">
                          {[Views.MONTH, Views.WEEK, Views.DAY].map((v) => (
                            <Button
                              key={v}
                              variant={view === v ? "default" : "outline"}
                              size="sm"
                              onClick={() => setView(v)}
                            >
                              {v.charAt(0) + v.slice(1).toLowerCase()}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                  dateCellWrapper: ({ children, value }: any) => (
                    <DroppableDay date={value}>
                      {children}
                    </DroppableDay>
                  ),
                }}
              />
            </div>
            
            {/* Overlay message only when no events */}
            {events.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Your schedule is clear
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Start planning your content with {draggableItems.length} available ideas
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                      {contentGaps?.length || 0} Content Gaps
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {aiSuggestions?.length || 0} AI Suggestions
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    💡 Drag items from the tray to any date on the calendar
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Editor Drawer */}
        {isEditorOpen && (
          <div className="fixed inset-y-0 right-0 w-[600px] bg-white dark:bg-slate-800 shadow-2xl border-l border-slate-200 dark:border-slate-700 flex flex-col z-50">
            {/* Context Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Article Editor
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setIsEditorOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Target Keyword:</span>
                  <span className="text-slate-900 dark:text-slate-100">{editorKeywords[0] || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Persona:</span>
                  <span className="text-slate-900 dark:text-slate-100">{contentContext?.audiencePersona || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Goal:</span>
                  <span className="text-slate-900 dark:text-slate-100">{contentContext?.tone || 'Not set'} tone</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  placeholder="Article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Outline
                </label>
                <textarea
                  value={editorOutline}
                  onChange={(e) => setEditorOutline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 min-h-[100px]"
                  placeholder="Article outline"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleGenerateOutline}
                  disabled={isGeneratingOutline || !editorTitle}
                  variant="outline"
                  className="flex-1"
                >
                  {isGeneratingOutline ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Outlining...
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Generate Outline
                    </>
                  )}
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content
                </label>
                <div className="border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 p-3 min-h-[300px]">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-full py-12">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          AI is writing...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <EditorContent editor={editor} className="prose prose-sm max-w-none dark:prose-invert focus:outline-none" />
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <Button
                onClick={handleGenerateArticle}
                disabled={isGenerating || !editorTitle || !editorOutline}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Write Full Article
                  </>
                )}
              </Button>
              <Button
                onClick={handlePublishToWordPress}
                disabled={isPublishing}
                variant="outline"
                className="w-full"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Publish to WordPress
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Auto-Plan Wizard Modal */}
        {isAutoPlanWizardOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Auto-Plan Month
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Posts per week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={autoPlanConfig.frequency}
                    onChange={(e) => setAutoPlanConfig({ ...autoPlanConfig, frequency: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tone
                  </label>
                  <select
                    value={autoPlanConfig.tone}
                    onChange={(e) => setAutoPlanConfig({ ...autoPlanConfig, tone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="professional">Professional</option>
                    <option value="educational">Educational</option>
                    <option value="conversational">Conversational</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => setIsAutoPlanWizardOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateAutoPlan}
                  disabled={isAutoPlanning}
                  className="flex-1"
                >
                  {isAutoPlanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Planning...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}

```

---

### src\components\content\PriorityMatrix.tsx

```typescript
"use client";

import React, { useState } from "react";
import {
  Zap,
  Target,
  TrendingUp,
  Clock,
  ArrowRight,
  Lightbulb,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ContentGap {
  topic: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  keywords?: string[];
  searchVolume?: number;
}

interface PriorityMatrixProps {
  gaps: string[] | ContentGap[];
  onGenerateSolution: (gap: string) => void;
  onPlanForLater: (gap: string) => void;
}

const categorizeGap = (gap: string | ContentGap, index: number): ContentGap => {
  if (typeof gap === "object") return gap;
  
  // Simple heuristic: first gaps are high impact, lower effort
  const impactLevels: ("high" | "medium" | "low")[] = ["high", "high", "medium", "medium", "low"];
  const effortLevels: ("high" | "medium" | "low")[] = ["low", "medium", "low", "high", "medium"];
  
  return {
    topic: gap,
    impact: impactLevels[index % 5] || "medium",
    effort: effortLevels[index % 5] || "medium",
  };
};

const getQuadrant = (gap: ContentGap): "quick-wins" | "big-bets" | "fill-ins" | "time-sinks" => {
  if (gap.impact === "high" && gap.effort === "low") return "quick-wins";
  if (gap.impact === "high" && gap.effort !== "low") return "big-bets";
  if (gap.impact !== "high" && gap.effort === "low") return "fill-ins";
  return "time-sinks";
};

const quadrantConfig = {
  "quick-wins": {
    title: "Quick Wins",
    subtitle: "High Impact, Low Effort",
    icon: Zap,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    headerBg: "bg-green-100 dark:bg-green-900/40",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "text-green-600 dark:text-green-400",
  },
  "big-bets": {
    title: "Big Bets",
    subtitle: "High Impact, High Effort",
    icon: Target,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    headerBg: "bg-blue-100 dark:bg-blue-900/40",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  "fill-ins": {
    title: "Fill-Ins",
    subtitle: "Low Impact, Low Effort",
    icon: Clock,
    bgColor: "bg-slate-50 dark:bg-slate-800/50",
    borderColor: "border-slate-200 dark:border-slate-700",
    headerBg: "bg-slate-100 dark:bg-slate-700/50",
    textColor: "text-slate-700 dark:text-slate-300",
    iconColor: "text-slate-500 dark:text-slate-400",
  },
  "time-sinks": {
    title: "Consider Later",
    subtitle: "Low Impact, High Effort",
    icon: TrendingUp,
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    headerBg: "bg-amber-100 dark:bg-amber-900/40",
    textColor: "text-amber-700 dark:text-amber-300",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

export default function PriorityMatrix({
  gaps,
  onGenerateSolution,
  onPlanForLater,
}: PriorityMatrixProps) {
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>("quick-wins");

  const categorizedGaps = gaps.map((gap, index) => categorizeGap(gap, index));
  
  const groupedGaps = {
    "quick-wins": categorizedGaps.filter((g) => getQuadrant(g) === "quick-wins"),
    "big-bets": categorizedGaps.filter((g) => getQuadrant(g) === "big-bets"),
    "fill-ins": categorizedGaps.filter((g) => getQuadrant(g) === "fill-ins"),
    "time-sinks": categorizedGaps.filter((g) => getQuadrant(g) === "time-sinks"),
  };

  if (gaps.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
          No Content Gaps Found
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Your content strategy is comprehensive. Great work!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Priority Matrix
          </h3>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {gaps.length} opportunities identified
        </span>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["quick-wins", "big-bets", "fill-ins", "time-sinks"] as const).map((quadrantKey) => {
          const config = quadrantConfig[quadrantKey];
          const Icon = config.icon;
          const quadrantGaps = groupedGaps[quadrantKey];
          const isExpanded = expandedQuadrant === quadrantKey;

          return (
            <div
              key={quadrantKey}
              className={`${config.bgColor} ${config.borderColor} border rounded-xl overflow-hidden transition-all duration-200`}
            >
              {/* Quadrant Header */}
              <button
                onClick={() => setExpandedQuadrant(isExpanded ? null : quadrantKey)}
                className={`w-full ${config.headerBg} px-4 py-3 flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  <div className="text-left">
                    <h4 className={`font-semibold ${config.textColor}`}>{config.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{config.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${config.textColor}`}>
                    {quadrantGaps.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Quadrant Content */}
              {isExpanded && quadrantGaps.length > 0 && (
                <div className="p-3 space-y-2">
                  {quadrantGaps.map((gap, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 group"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3 line-clamp-2">
                        {gap.topic}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onGenerateSolution(gap.topic)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Draft Solution
                        </button>
                        <button
                          onClick={() => onPlanForLater(gap.topic)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && quadrantGaps.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No items in this quadrant
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 Start with Quick Wins for immediate impact
        </p>
        <button
          onClick={() => {
            const firstQuickWin = groupedGaps["quick-wins"][0];
            if (firstQuickWin) onGenerateSolution(firstQuickWin.topic);
          }}
          disabled={groupedGaps["quick-wins"].length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          <Zap className="w-4 h-4" />
          Start First Quick Win
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

```

---

### src\components\content\SEOHealthScore.tsx

```typescript
"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface CriticalIssue {
  label: string;
  type: "error" | "warning" | "info";
}

interface SEOHealthScoreProps {
  score?: number;
  totalPages?: number;
  avgWordCount?: number;
  contentGapsCount?: number;
  keywordsCount?: number;
  missingMetaCount?: number;
  lowWordCountPages?: number;
}

export default function SEOHealthScore({
  score,
  totalPages = 0,
  avgWordCount = 0,
  contentGapsCount = 0,
  keywordsCount = 0,
  missingMetaCount = 0,
  lowWordCountPages = 0,
}: SEOHealthScoreProps) {
  const calculatedScore = score ?? calculateScore(avgWordCount, contentGapsCount, keywordsCount, totalPages);

  const getCriticalIssues = (): CriticalIssue[] => {
    const issues: CriticalIssue[] = [];
    if (contentGapsCount > 3) {
      issues.push({ label: `${contentGapsCount} Content Gaps`, type: "warning" });
    }
    if (avgWordCount < 500) {
      issues.push({ label: "Low Word Count", type: "error" });
    }
    if (missingMetaCount > 0) {
      issues.push({ label: `${missingMetaCount} Missing Meta`, type: "error" });
    }
    if (lowWordCountPages > 0) {
      issues.push({ label: `${lowWordCountPages} Thin Pages`, type: "warning" });
    }
    if (keywordsCount < 5) {
      issues.push({ label: "Few Keywords", type: "info" });
    }
    return issues;
  };

  const criticalIssues = getCriticalIssues();

  function calculateScore(
    avgWords: number,
    gaps: number,
    keywords: number,
    pages: number
  ): number {
    let baseScore = 50;
    
    if (avgWords >= 1500) baseScore += 20;
    else if (avgWords >= 800) baseScore += 10;
    else if (avgWords < 300) baseScore -= 10;
    
    if (gaps === 0) baseScore += 15;
    else if (gaps <= 3) baseScore += 5;
    else if (gaps > 5) baseScore -= 10;
    
    if (keywords >= 10) baseScore += 15;
    else if (keywords >= 5) baseScore += 8;
    
    if (pages >= 10) baseScore += 5;
    
    return Math.max(0, Math.min(100, baseScore));
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 dark:text-green-400";
    if (s >= 60) return "text-blue-600 dark:text-blue-400";
    if (s >= 40) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreGradient = (s: number) => {
    if (s >= 80) return "from-green-500 to-emerald-500";
    if (s >= 60) return "from-blue-500 to-cyan-500";
    if (s >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Needs Work";
    return "Poor";
  };

  const getScoreIcon = (s: number) => {
    if (s >= 80) return CheckCircle2;
    if (s >= 60) return TrendingUp;
    if (s >= 40) return AlertTriangle;
    return XCircle;
  };

  const ScoreIcon = getScoreIcon(calculatedScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (calculatedScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          SEO Health Score
        </h3>
        <div className={`flex items-center gap-1 ${getScoreColor(calculatedScore)}`}>
          <ScoreIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{getScoreLabel(calculatedScore)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        {/* Speedometer-style Score Display */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={`bg-gradient-to-r ${getScoreGradient(calculatedScore)}`}
              style={{
                stroke: `url(#gradient-${calculatedScore >= 60 ? 'good' : 'bad'})`,
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: "stroke-dashoffset 1s ease-out",
              }}
            />
            <defs>
              <linearGradient id="gradient-good" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradient-bad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(calculatedScore)}`}>
              {calculatedScore}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* Critical Issues Badges */}
      {criticalIssues.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Critical Issues
          </p>
          <div className="flex flex-wrap gap-2">
            {criticalIssues.map((issue, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  issue.type === "error"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : issue.type === "warning"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {issue.type === "error" ? (
                  <XCircle className="w-3 h-3" />
                ) : issue.type === "warning" ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                {issue.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pages Analyzed</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{totalPages}</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Word Count</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {avgWordCount.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Content Gaps</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{contentGapsCount}</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Keywords Found</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{keywordsCount}</p>
        </div>
      </div>
    </div>
  );
}

```

---

### src\components\content\SearchResultPreview.tsx

```typescript
"use client";

import React, { useMemo } from "react";
import { Globe, ArrowUpRight, Eye } from "lucide-react";

interface SearchResultPreviewProps {
  title?: string;
  url?: string;
  description?: string;
  keywords?: string[];
}

export default function SearchResultPreview({
  title = "",
  url = "https://example.com/your-article",
  description = "",
  keywords = [],
}: SearchResultPreviewProps) {
  const generateMetaDescription = useMemo(() => {
    if (description) return description;
    if (!title) return "Your meta description will appear here as you type your topic...";
    
    const keywordText = keywords.length > 0 
      ? ` Learn about ${keywords.slice(0, 2).join(", ")} and more.`
      : "";
    
    return `Discover everything you need to know about ${title.toLowerCase()}.${keywordText} Read our comprehensive guide for actionable insights and expert tips.`;
  }, [title, description, keywords]);

  const truncatedTitle = title.length > 60 
    ? title.substring(0, 57) + "..." 
    : title || "Your Article Title";

  const truncatedDescription = generateMetaDescription.length > 160
    ? generateMetaDescription.substring(0, 157) + "..."
    : generateMetaDescription;

  const formatUrl = (urlStr: string, titleStr: string) => {
    if (!titleStr) return urlStr;
    const slug = titleStr
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
    const baseUrl = urlStr.split("/").slice(0, 3).join("/");
    return `${baseUrl}/${slug}`;
  };

  const displayUrl = formatUrl(url, title);

  const highlightKeywords = (text: string) => {
    if (keywords.length === 0) return text;
    
    let result = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      result = result.replace(regex, `<strong class="font-semibold">$1</strong>`);
    });
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Search Result Preview
        </h3>
      </div>

      {/* Google-style Search Result */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        {/* URL Breadcrumb */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Globe className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {displayUrl.split("/").slice(0, 3).join("/").replace("https://", "")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500 truncate max-w-[300px]">
              {displayUrl}
            </span>
          </div>
        </div>

        {/* Title */}
        <a 
          href="#" 
          className="block text-xl text-blue-600 dark:text-blue-400 hover:underline mb-1 leading-tight"
          onClick={(e) => e.preventDefault()}
        >
          {truncatedTitle || "Enter a topic to see preview"}
        </a>

        {/* Meta Description */}
        <p 
          className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightKeywords(truncatedDescription) }}
        />

        {/* Rich Snippets Preview */}
        {keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {keywords.slice(0, 4).map((keyword, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEO Indicators */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg border ${
          title.length >= 30 && title.length <= 60
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : title.length > 0
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title Length</p>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${
              title.length >= 30 && title.length <= 60
                ? "text-green-600 dark:text-green-400"
                : title.length > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-400"
            }`}>
              {title.length}/60
            </span>
            {title.length >= 30 && title.length <= 60 && (
              <span className="text-xs text-green-600 dark:text-green-400">Optimal</span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${
          generateMetaDescription.length >= 120 && generateMetaDescription.length <= 160
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : generateMetaDescription.length > 50
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description</p>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${
              generateMetaDescription.length >= 120 && generateMetaDescription.length <= 160
                ? "text-green-600 dark:text-green-400"
                : generateMetaDescription.length > 50
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-400"
            }`}>
              {generateMetaDescription.length}/160
            </span>
            {generateMetaDescription.length >= 120 && generateMetaDescription.length <= 160 && (
              <span className="text-xs text-green-600 dark:text-green-400">Optimal</span>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
        <p className="font-medium mb-1">SEO Tips:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Keep titles between 30-60 characters for best display</li>
          <li>Include your primary keyword in the title</li>
          <li>Meta descriptions should be 120-160 characters</li>
        </ul>
      </div>
    </div>
  );
}

```

---

### src\components\content\SuggestionKanbanCard.tsx

```typescript
"use client";

import React from "react";
import {
  FileText,
  BookOpen,
  Briefcase,
  TrendingUp,
  Zap,
  Calendar,
  GripVertical,
  Tag,
} from "lucide-react";

interface AISuggestion {
  type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
  title: string;
  reason: string;
  targetKeywords: string[];
  relatedServiceUrl?: string;
  contentOutline?: string[];
  suggestedTone?: string;
  targetLength?: number;
}

interface SuggestionKanbanCardProps {
  suggestion: AISuggestion;
  onGenerate: (suggestion: AISuggestion) => void;
  onSchedule: (suggestion: AISuggestion) => void;
  isDraggable?: boolean;
}

const getIntentColor = (type: string) => {
  const lowercaseType = type.toLowerCase();
  if (lowercaseType.includes("blog") || lowercaseType.includes("guide")) {
    return {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      label: "Informational",
    };
  }
  if (lowercaseType.includes("case") || lowercaseType.includes("whitepaper")) {
    return {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
      label: "Transactional",
    };
  }
  return {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    label: "Commercial",
  };
};

const getTypeIcon = (type: string) => {
  const lowercaseType = type.toLowerCase();
  if (lowercaseType.includes("blog")) return BookOpen;
  if (lowercaseType.includes("case")) return Briefcase;
  if (lowercaseType.includes("guide")) return FileText;
  return TrendingUp;
};

export default function SuggestionKanbanCard({
  suggestion,
  onGenerate,
  onSchedule,
  isDraggable = true,
}: SuggestionKanbanCardProps) {
  const intentConfig = getIntentColor(suggestion.type);
  const TypeIcon = getTypeIcon(suggestion.type);

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl border ${intentConfig.border} shadow-sm hover:shadow-md transition-all group`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start gap-3">
          {isDraggable && (
            <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mt-1">
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${intentConfig.bg} ${intentConfig.text}`}
              >
                <TypeIcon className="w-3 h-3" />
                {suggestion.type}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${intentConfig.bg} ${intentConfig.text}`}
              >
                {intentConfig.label}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
              {suggestion.title}
            </h4>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {suggestion.reason}
        </p>

        {/* Keywords */}
        {suggestion.targetKeywords && suggestion.targetKeywords.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <Tag className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Target Keywords
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestion.targetKeywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
              {suggestion.targetKeywords.length > 3 && (
                <span className="px-2 py-0.5 text-slate-400 text-xs">
                  +{suggestion.targetKeywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
          {suggestion.targetLength && (
            <span>{suggestion.targetLength.toLocaleString()} words</span>
          )}
          {suggestion.suggestedTone && <span>{suggestion.suggestedTone}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGenerate(suggestion)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={() => onSchedule(suggestion)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

```

---

### src\components\content\content-strategy-dashboard-improved.tsx

```typescript
"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Users, 
  Target, 
  BookOpen, 
  Lightbulb, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  RefreshCw,
  Loader2,
  X,
  Copy,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar as CalendarIcon,
  Zap,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileSearch,
  BarChart3,
  Filter,
  Search,
  Maximize2,
  Info
} from "lucide-react";
import PlannerView from "./PlannerView";

interface Keyword {
  term: string;
  density: "High" | "Medium" | "Low";
  pages: number;
}

interface ContentContext {
  dominantKeywords: Keyword[];
  contentGaps: string[];
  audiencePersona: string;
  tone: string;
}

interface AISuggestion {
  type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
  title: string;
  reason: string;
  targetKeywords: string[];
  relatedServiceUrl?: string;
}

interface AnalysisOutput {
  baseUrl: string;
  contentContext: ContentContext;
  aiSuggestions: AISuggestion[];
  pages: Array<{
    url: string;
    type: string;
    title?: string;
    wordCount: number;
    mainTopic?: string;
    summary?: string;
    keywords?: string[];
    content?: string;
  }>;
  extractionData?: {
    baseUrl: string;
    pagesProcessed: number;
    extractedPages: Array<{
      url: string;
      type: "service" | "blog" | "product" | "other";
      title?: string;
      content: string;
      wordCount: number;
      mainTopic?: string;
      summary?: string;
    }>;
    aggregatedContent: {
      services: string[];
      blogs: string[];
      products: string[];
    };
    totalWordCount: number;
  };
}

interface ContentStrategyDashboardProps {
  analysisOutput: AnalysisOutput | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function ContentStrategyDashboard({ 
  analysisOutput, 
  isLoading = false,
  onRefresh 
}: ContentStrategyDashboardProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "gaps" | "pages" | "details" | "suggestions" | "planner">("overview");
  const [selectedGap, setSelectedGap] = useState<string | null>(null);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftSuggestion, setDraftSuggestion] = useState<AISuggestion | null>(null);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [draftActionDropdown, setDraftActionDropdown] = useState<string | null>(null);
  
  // Smart Draft modal state
  const [draftStep, setDraftStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [customServiceUrl, setCustomServiceUrl] = useState<string>("");
  const [showCustomUrlInput, setShowCustomUrlInput] = useState<boolean>(false);
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [currentKeywordInput, setCurrentKeywordInput] = useState("");
  const [generatedOutline, setGeneratedOutline] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>("professional");

  // Page Analysis state
  const [pageSortField, setPageSortField] = useState<'title' | 'type' | 'wordCount'>('wordCount');
  const [pageSortDirection, setPageSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageFilterType, setPageFilterType] = useState<'all' | 'service' | 'blog'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "educational", label: "Educational" },
    { value: "conversational", label: "Conversational" },
    { value: "urgent", label: "Urgent" },
    { value: "authoritative", label: "Authoritative" },
    { value: "friendly", label: "Friendly" },
  ];

  // Handle adding custom keywords
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentKeywordInput.trim()) {
      e.preventDefault();
      if (!customKeywords.includes(currentKeywordInput.trim())) {
        setCustomKeywords([...customKeywords, currentKeywordInput.trim()]);
      }
      setCurrentKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setCustomKeywords(customKeywords.filter(k => k !== keyword));
  };

  // Generate AI outline
  const handleGenerateOutline = async () => {
    if (!draftSuggestion) return;
    
    setIsGeneratingOutline(true);
    try {
      let serviceContext = '';
      const serviceToPromote = customServiceUrl || selectedService;
      
      if (!customServiceUrl && selectedService) {
        const selectedServicePage = servicePages.find(
          p => (p.mainTopic || p.url.split('/').pop() || 'Service') === selectedService
        );
        serviceContext = selectedServicePage?.summary || selectedServicePage?.mainTopic || '';
      } else if (customServiceUrl) {
        serviceContext = customServiceUrl;
      }
      
      const response = await fetch('/api/content/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftSuggestion.title,
          aiKeywords: draftSuggestion.targetKeywords,
          userKeywords: customKeywords,
          promotedService: serviceToPromote,
          serviceContext: serviceContext,
          tone: contentContext.tone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outline');
      }

      const data = await response.json();
      setGeneratedOutline(data.outline);
      setDraftStep(2);
    } catch (error) {
      console.error('Error generating outline:', error);
      alert('Failed to generate outline. Please try again.');
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Reset draft modal state
  const handleOpenDraftModal = (suggestion: AISuggestion) => {
    setDraftSuggestion(suggestion);
    setDraftStep(1);
    setCustomServiceUrl("");
    setShowCustomUrlInput(false);
    setCustomKeywords([]);
    setCurrentKeywordInput("");
    setGeneratedOutline("");
    
    if (suggestion.relatedServiceUrl) {
      const matchingService = servicePages.find(p => p.url === suggestion.relatedServiceUrl);
      if (matchingService) {
        setSelectedService(matchingService.mainTopic || matchingService.url.split('/').pop() || 'Service');
      } else {
        setSelectedService("");
      }
    } else {
      setSelectedService("");
    }
    
    createDraftFromSuggestion(suggestion);
    setDraftModalOpen(true);
  };

  const createDraftFromSuggestion = async (suggestion: AISuggestion) => {
    try {
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.title,
          outline: '',
          serviceUrl: suggestion.relatedServiceUrl || '',
          tone: contentContext?.tone || 'professional',
          keywords: suggestion.targetKeywords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Draft created from suggestion:', data.draft.id);
        return data.draft.id;
      }
    } catch (error) {
      console.error('Error creating draft:', error);
    }
    return null;
  };

  const handleAutoPlanFromStrategy = async () => {
    setActiveTab("planner");
  };

  // Copy outline to clipboard
  const handleCopyOutline = () => {
    const fullOutline = `# ${draftSuggestion?.title}\n\n${generatedOutline}`;
    navigator.clipboard.writeText(fullOutline);
    alert('Outline copied to clipboard!');
  };

  // Generate full article
  const handleGenerateArticle = async () => {
    if (!draftSuggestion || !generatedOutline) return;
    
    setIsGeneratingArticle(true);
    setGeneratedArticle("");
    console.log("[Modal] Creating draft and redirecting to editor...");
    
    try {
      const serviceToPromote = customServiceUrl || selectedService;
      const allKeywords = [...(draftSuggestion.targetKeywords || []), ...customKeywords];
      
      console.log("[Modal] Creating draft with:", {
        title: draftSuggestion.title,
        hasOutline: !!generatedOutline,
        serviceUrl: serviceToPromote,
        tone: selectedTone,
        keywordsCount: allKeywords.length
      });
      
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftSuggestion.title,
          outline: generatedOutline,
          serviceUrl: serviceToPromote,
          tone: selectedTone,
          keywords: allKeywords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Modal] Draft creation failed:", errorData);
        throw new Error(errorData.error || 'Failed to create draft');
      }

      const data = await response.json();
      console.log("[Modal] Draft created successfully:", data.draft.id);

      setDraftModalOpen(false);
      window.location.href = `/editor?id=${data.draft.id}`;
    } catch (error) {
      console.error('[Modal] Error creating draft:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create draft';
      alert(`Failed to create draft: ${errorMessage}. Please try again.`);
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // Toggle page expansion in detailed view
  const togglePageExpansion = (pageUrl: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageUrl)) {
      newExpanded.delete(pageUrl);
    } else {
      newExpanded.add(pageUrl);
    }
    setExpandedPages(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Analyzing Content...
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI is extracting insights from your website content
          </p>
        </div>
      </div>
    );
  }

  if (!analysisOutput) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            No Analysis Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Start a content analysis to see your content strategy insights
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Analysis
            </button>
          )}
        </div>
      </div>
    );
  }

  const { contentContext, aiSuggestions, pages, extractionData } = analysisOutput;

  // Debug data flow
  console.log('All Pages:', pages);
  console.log('Extraction Data:', extractionData);
  console.log('Content Context:', contentContext);

  // Calculate total pages from pages array
  const totalPages = pages?.length || 0;
  const totalWordCount = pages?.reduce((sum, page) => sum + (page.wordCount || 0), 0) || 0;

  // Extract service pages
  const servicePages = pages?.filter(p => {
    const typeLower = p.type?.toLowerCase() || '';
    const urlLower = p.url?.toLowerCase() || '';
    return (
      typeLower === 'service' ||
      typeLower === 'services' ||
      urlLower.includes('/services/') ||
      urlLower.includes('/solutions/') ||
      urlLower.includes('/service/')
    );
  }) || [];

  // Extract service names for dropdown options
  const allServices = servicePages
    .map(p => p.mainTopic || p.url.split('/').pop() || 'Service')
    .filter((value, index, self) => self.indexOf(value) === index);

  // Filter suggestions based on selected gap
  const filteredSuggestions = selectedGap
    ? aiSuggestions.filter(suggestion => 
        suggestion.reason.toLowerCase().includes(selectedGap.toLowerCase()) ||
        suggestion.targetKeywords.some(kw => kw.toLowerCase().includes(selectedGap.toLowerCase()))
      )
    : aiSuggestions;

  // Filter pages based on search and type
  const getFilteredPages = () => {
    let filtered = pages || [];
    
    if (searchQuery) {
      filtered = filtered.filter(page => 
        (page.mainTopic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (pageFilterType !== 'all') {
      filtered = filtered.filter(p => {
        const typeLower = p.type?.toLowerCase() || '';
        const urlLower = p.url?.toLowerCase() || '';
        
        if (pageFilterType === 'service') {
          return typeLower === 'service' || typeLower === 'services' || urlLower.includes('/services/');
        } else if (pageFilterType === 'blog') {
          return typeLower === 'blog' || urlLower.includes('/blog/');
        }
        return false;
      });
    }
    
    return filtered;
  };

  // Sort pages
  const getSortedPages = (pagesToSort: any[]) => {
    return [...pagesToSort].sort((a, b) => {
      let comparison = 0;
      if (pageSortField === 'title') {
        const titleA = a.mainTopic || a.title || a.url.split('/').pop() || '';
        const titleB = b.mainTopic || b.title || b.url.split('/').pop() || '';
        comparison = titleA.localeCompare(titleB);
      } else if (pageSortField === 'type') {
        comparison = (a.type || '').localeCompare(b.type || '');
      } else if (pageSortField === 'wordCount') {
        comparison = (a.wordCount || 0) - (b.wordCount || 0);
      }
      return pageSortDirection === 'asc' ? comparison : -comparison;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Content Strategy Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {analysisOutput.baseUrl} • {totalPages} pages analyzed • {totalWordCount.toLocaleString()} total words
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              )}
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Users },
              { id: "keywords", label: "Keywords", icon: Target },
              { id: "gaps", label: "Content Gaps", icon: AlertCircle },
              { id: "pages", label: "Pages", icon: Globe },
              { id: "details", label: "Page Details", icon: FileSearch },
              { id: "suggestions", label: "Suggestions", icon: Lightbulb },
              { id: "planner", label: "Planner", icon: CalendarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Persona Card - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Target Persona
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Who you're writing for
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Audience
                    </label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 mt-2">
                      {contentContext.audiencePersona}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Tone
                    </label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 mt-2">
                      {contentContext.tone}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Writing Tip
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Use this persona to guide all your content creation. Every piece should speak directly to this audience in this tone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalPages}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pages Analyzed</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Keywords</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contentContext.dominantKeywords.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Top Keywords</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Gaps</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contentContext.contentGaps.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Content Gaps</p>
                </div>
              </div>

              {/* Extraction Stats */}
              {extractionData && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Content Extraction Summary
                      </h2>
                      <p className="text-indigo-100 text-sm">
                        Detailed analysis from Trigger.dev content extraction
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-indigo-200" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-3xl font-bold">{extractionData.pagesProcessed}</p>
                      <p className="text-sm text-indigo-100">Pages Processed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData.totalWordCount.toLocaleString()}</p>
                      <p className="text-sm text-indigo-100">Total Words</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData.aggregatedContent.services.length}</p>
                      <p className="text-sm text-indigo-100">Service Pages</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData.aggregatedContent.blogs.length}</p>
                      <p className="text-sm text-indigo-100">Blog Posts</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Quick Actions
                    </h2>
                    <p className="text-purple-100 text-sm">
                      Generate content or schedule your calendar
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-200" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAutoPlanFromStrategy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Open Planner
                  </button>
                  <button
                    onClick={handleAutoPlanFromStrategy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    <Zap className="w-4 h-4" />
                    Auto-Plan Month
                  </button>
                </div>
              </div>

              {/* Top Keywords Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Top Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contentContext.dominantKeywords.slice(0, 8).map((keyword, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        keyword.density === "High"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : keyword.density === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      <span>{keyword.term}</span>
                      <span className="text-xs opacity-75">({keyword.pages})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW DETAILED PAGE ANALYSIS TAB */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pages by title, URL, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={pageFilterType}
                    onChange={(e) => setPageFilterType(e.target.value as 'all' | 'service' | 'blog')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="service">Services</option>
                    <option value="blog">Blogs</option>
                  </select>
                  <select
                    value={pageSortField}
                    onChange={(e) => setPageSortField(e.target.value as 'title' | 'type' | 'wordCount')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="wordCount">Sort by Words</option>
                    <option value="title">Sort by Title</option>
                    <option value="type">Sort by Type</option>
                  </select>
                  <button
                    onClick={() => setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    {pageSortDirection === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
              
              {/* Results Summary */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {getSortedPages(getFilteredPages()).length} of {totalPages} pages
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedPages(new Set(getSortedPages(getFilteredPages()).map(p => p.url)))}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-400">•</span>
                  <button
                    onClick={() => setExpandedPages(new Set())}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            </div>

            {/* Page Cards */}
            <div className="grid grid-cols-1 gap-6">
              {getSortedPages(getFilteredPages()).map((page, index) => {
                const isExpanded = expandedPages.has(page.url);
                const displayTitle = page.mainTopic || page.title || page.url.split('/').pop() || 'Untitled Page';
                
                return (
                  <div key={page.url} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Page Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {displayTitle}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              page.type === 'service' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                : page.type === 'blog'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {page.type || 'other'}
                            </span>
                          </div>
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                          >
                            {page.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {page.wordCount?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">words</p>
                          </div>
                          <button
                            onClick={() => togglePageExpansion(page.url)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Page Content */}
                    {isExpanded && (
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/20">
                        {/* Summary */}
                        {page.summary && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Summary</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {page.summary}
                            </p>
                          </div>
                        )}

                        {/* Full Content */}
                        {page.content && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Full Content</h4>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
                                {page.content}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Keywords */}
                        {page.keywords && page.keywords.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {page.keywords.map((keyword: string, kIndex: number) => (
                                <span
                                  key={kIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300"
                                >
                                  <Target className="w-2.5 h-2.5" />
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => navigator.clipboard.writeText(page.content || '')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Content
                          </button>
                          <button
                            onClick={() => window.open(page.url, '_blank')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit Page
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {getFilteredPages().length === 0 && (
              <div className="text-center py-12">
                <FileSearch className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No pages found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {/* Other tabs remain the same... */}
        {activeTab === "pages" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Page Analysis
                </h2>
                <select
                  value={pageFilterType}
                  onChange={(e) => setPageFilterType(e.target.value as 'all' | 'service' | 'blog')}
                  className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Pages</option>
                  <option value="service">Services Only</option>
                  <option value="blog">Blogs Only</option>
                </select>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                View keyword analysis for each individual page. See which pages are performing well and identify opportunities for improvement.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'title') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('title');
                        setPageSortDirection('asc');
                      }
                    }}>
                      Page Title {pageSortField === 'title' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'type') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('type');
                        setPageSortDirection('asc');
                      }
                    }}>
                      Type {pageSortField === 'type' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'wordCount') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('wordCount');
                        setPageSortDirection('desc');
                      }
                    }}>
                      Word Count {pageSortField === 'wordCount' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Top Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pages && pages.length > 0 ? (() => {
                    let filteredPages = pages;
                    if (pageFilterType === 'service') {
                      filteredPages = pages.filter(p => p.type?.toLowerCase() === 'service' || p.url?.toLowerCase().includes('/services/'));
                    } else if (pageFilterType === 'blog') {
                      filteredPages = pages.filter(p => p.type?.toLowerCase() === 'blog' || p.url?.toLowerCase().includes('/blog/'));
                    }

                    filteredPages = [...filteredPages].sort((a, b) => {
                      let comparison = 0;
                      if (pageSortField === 'title') {
                        const titleA = a.mainTopic || a.url.split('/').pop() || '';
                        const titleB = b.mainTopic || b.url.split('/').pop() || '';
                        comparison = titleA.localeCompare(titleB);
                      } else if (pageSortField === 'type') {
                        comparison = a.type.localeCompare(b.type);
                      } else if (pageSortField === 'wordCount') {
                        comparison = a.wordCount - b.wordCount;
                      }
                      return pageSortDirection === 'asc' ? comparison : -comparison;
                    });

                    return filteredPages.map((page, index) => {
                      const pageKeywords = page.keywords && page.keywords.length > 0
                        ? page.keywords.slice(0, 3)
                        : contentContext.dominantKeywords.slice(0, 3).map(k => k.term);
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {page.mainTopic || page.url.split('/').pop() || 'Untitled Page'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {page.url}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              page.type === 'service' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                : page.type === 'blog'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {page.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {page.wordCount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {pageKeywords.map((keyword, kIndex) => (
                                <span
                                  key={kIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300"
                                >
                                  <Target className="w-2.5 h-2.5" />
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })() : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No individual page data available.
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Start a content analysis to see page-by-page insights.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === "keywords" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Dominant Keywords
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                These are the most prominent semantic keywords across your content. Use them strategically in new content.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {contentContext.dominantKeywords.map((keyword, index) => {
                const maxPages = Math.max(...contentContext.dominantKeywords.map(k => k.pages));
                const percentage = (keyword.pages / maxPages) * 100;
                
                const getFrequencyLabel = (density: string) => {
                  const pagePercentage = (keyword.pages / totalPages) * 100;
                  if (pagePercentage > 50) return "Dominant";
                  if (pagePercentage > 25) return "Common";
                  return "Niche";
                };
                
                const frequencyLabel = getFrequencyLabel(keyword.density);
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-6">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {keyword.term}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                            frequencyLabel === "Dominant"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : frequencyLabel === "Common"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {frequencyLabel}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {keyword.pages} pages
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          frequencyLabel === "Dominant"
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : frequencyLabel === "Common"
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue with other tabs... */}
      </div>
    </div>
  );
}

```

---

### src\components\content\content-strategy-dashboard.tsx

```typescript
"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Users, 
  Target, 
  BookOpen, 
  Lightbulb, 
  FileText, 
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  RefreshCw,
  Loader2,
  X,
  Copy,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar as CalendarIcon,
  Zap,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileSearch,
  BarChart3,
  Filter,
  Search,
  Maximize2,
  Info
} from "lucide-react";
import PlannerView from "./PlannerView";

interface Keyword {
  term: string;
  density: "High" | "Medium" | "Low";
  pages: number;
}

interface ContentContext {
  dominantKeywords: Keyword[];
  contentGaps: string[];
  audiencePersona: string;
  tone: string;
  overallWritingStyle?: {
    dominantTone: string;
    averageFormality: string;
    commonPerspective: string;
    brandVoiceSummary: string;
  };
  contentPatterns?: {
    preferredContentTypes: string[];
    averagePostLength: string;
    commonStructures: string[];
    ctaPatterns: string[];
  };
}

interface AISuggestion {
  type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
  title: string;
  reason: string;
  targetKeywords: string[];
  relatedServiceUrl?: string;
  contentOutline?: string[];
  suggestedTone?: string;
  targetLength?: number;
  keyMessagePoints?: string[];
}

interface AnalysisOutput {
  baseUrl: string;
  contentContext: ContentContext;
  aiSuggestions: AISuggestion[];
  pages: Array<{
    url: string;
    type: string;
    title?: string;
    wordCount: number;
    mainTopic?: string;
    summary?: string;
    content?: string;
    keywords?: string[];
    writingStyle?: {
      tone: string;
      perspective: "First Person" | "Second Person" | "Third Person";
      formality: "Formal" | "Informal" | "Semi-Formal";
      sentenceStructure: string;
      averageSentenceLength: number;
      readabilityLevel: string;
      voice: "Active" | "Passive" | "Mixed";
    };
    contentStructure?: {
      hasHeadings: boolean;
      hasSubheadings: boolean;
      usesLists: boolean;
      hasCallToAction: boolean;
      paragraphCount: number;
      averageParagraphLength: number;
    };
    brandVoice?: {
      keyPhrases: string[];
      terminology: string[];
      valuePropositions: string[];
      differentiators: string[];
    };
  }>;
  extractionData?: {
    baseUrl: string;
    pagesProcessed: number;
    extractedPages: Array<{
      url: string;
      type: "service" | "blog" | "product" | "other";
      title?: string;
      content: string;
      wordCount: number;
      mainTopic?: string;
      summary?: string;
    }>;
    aggregatedContent: {
      services: string[];
      blogs: string[];
      products: string[];
    };
    totalWordCount: number;
  };
}

interface ContentStrategyDashboardProps {
  analysisOutput: AnalysisOutput | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function ContentStrategyDashboard({ 
  analysisOutput, 
  isLoading = false,
  onRefresh 
}: ContentStrategyDashboardProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "gaps" | "pages" | "details" | "suggestions" | "planner">("overview");
  const [selectedGap, setSelectedGap] = useState<string | null>(null);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftSuggestion, setDraftSuggestion] = useState<AISuggestion | null>(null);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [draftActionDropdown, setDraftActionDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Smart Draft modal state
  const [draftStep, setDraftStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [customServiceUrl, setCustomServiceUrl] = useState<string>("");
  const [showCustomUrlInput, setShowCustomUrlInput] = useState<boolean>(false);
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [currentKeywordInput, setCurrentKeywordInput] = useState("");
  const [generatedOutline, setGeneratedOutline] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>("professional");

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "educational", label: "Educational" },
    { value: "conversational", label: "Conversational" },
    { value: "urgent", label: "Urgent" },
    { value: "authoritative", label: "Authoritative" },
    { value: "friendly", label: "Friendly" },
  ];

  // Page Analysis table state
  const [pageSortField, setPageSortField] = useState<'title' | 'type' | 'wordCount'>('wordCount');
  const [pageSortDirection, setPageSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageFilterType, setPageFilterType] = useState<'all' | 'service' | 'blog'>('all');

  // Handle adding custom keywords
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentKeywordInput.trim()) {
      e.preventDefault();
      if (!customKeywords.includes(currentKeywordInput.trim())) {
        setCustomKeywords([...customKeywords, currentKeywordInput.trim()]);
      }
      setCurrentKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setCustomKeywords(customKeywords.filter(k => k !== keyword));
  };

  // Generate AI outline
  const handleGenerateOutline = async () => {
    if (!draftSuggestion) return;
    
    setIsGeneratingOutline(true);
    try {
      // Use custom service URL if provided, otherwise find the selected service page
      let serviceContext = '';
      const serviceToPromote = customServiceUrl || selectedService;
      
      if (!customServiceUrl && selectedService) {
        const selectedServicePage = servicePages.find(
          p => (p.mainTopic || p.url.split('/').pop() || 'Service') === selectedService
        );
        serviceContext = selectedServicePage?.summary || selectedServicePage?.mainTopic || '';
      } else if (customServiceUrl) {
        serviceContext = customServiceUrl;
      }
      
      const response = await fetch('/api/content/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftSuggestion.title,
          aiKeywords: draftSuggestion.targetKeywords,
          userKeywords: customKeywords,
          promotedService: serviceToPromote,
          serviceContext: serviceContext,
          tone: contentContext?.tone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outline');
      }

      const data = await response.json();
      setGeneratedOutline(data.outline);
      setDraftStep(2);
    } catch (error) {
      console.error('Error generating outline:', error);
      alert('Failed to generate outline. Please try again.');
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Reset draft modal state
  const handleOpenDraftModal = (suggestion: AISuggestion) => {
    setDraftSuggestion(suggestion);
    setDraftStep(1);
    setCustomServiceUrl("");
    setShowCustomUrlInput(false);
    setCustomKeywords([]);
    setCurrentKeywordInput("");
    setGeneratedOutline("");
    
    // Auto-select related service if available
    if (suggestion.relatedServiceUrl) {
      const matchingService = servicePages.find(p => p.url === suggestion.relatedServiceUrl);
      if (matchingService) {
        setSelectedService(matchingService.mainTopic || matchingService.url.split('/').pop() || 'Service');
      } else {
        setSelectedService("");
      }
    } else {
      setSelectedService("");
    }
    
    createDraftFromSuggestion(suggestion);
    
    setDraftModalOpen(true);
  };

  const createDraftFromSuggestion = async (suggestion: AISuggestion) => {
    try {
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.title,
          outline: '',
          serviceUrl: suggestion.relatedServiceUrl || '',
          tone: contentContext?.tone || 'professional',
          keywords: suggestion.targetKeywords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Draft created from suggestion:', data.draft.id);
        return data.draft.id;
      }
    } catch (error) {
      console.error('Error creating draft:', error);
    }
    return null;
  };

  const handleAutoPlanFromStrategy = async () => {
    setActiveTab("planner");
    // The PlannerView component has its own Auto-Plan logic
    // This just switches to the planner tab where the user can click the Auto-Plan button
  };

  // Copy outline to clipboard
  const handleCopyOutline = () => {
    const fullOutline = `# ${draftSuggestion?.title}\n\n${generatedOutline}`;
    navigator.clipboard.writeText(fullOutline);
    alert('Outline copied to clipboard!');
  };

  // Generate full article
  const handleGenerateArticle = async () => {
    if (!draftSuggestion || !generatedOutline) return;
    
    setIsGeneratingArticle(true);
    setGeneratedArticle(""); // Clear previous content
    console.log("[Modal] Creating draft and redirecting to editor...");
    
    try {
      const serviceToPromote = customServiceUrl || selectedService;
      const allKeywords = [...(draftSuggestion.targetKeywords || []), ...customKeywords];
      
      console.log("[Modal] Creating draft with:", {
        title: draftSuggestion.title,
        hasOutline: !!generatedOutline,
        serviceUrl: serviceToPromote,
        tone: selectedTone,
        keywordsCount: allKeywords.length
      });
      
      // Create draft first
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftSuggestion.title,
          outline: generatedOutline,
          serviceUrl: serviceToPromote,
          tone: selectedTone,
          keywords: allKeywords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Modal] Draft creation failed:", errorData);
        throw new Error(errorData.error || 'Failed to create draft');
      }

      const data = await response.json();
      console.log("[Modal] Draft created successfully:", data.draft.id);

      // Close modal and redirect to editor
      setDraftModalOpen(false);
      
      // Redirect to editor with draft ID
      window.location.href = `/editor?id=${data.draft.id}`;
    } catch (error) {
      console.error('[Modal] Error creating draft:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create draft';
      alert(`Failed to create draft: ${errorMessage}. Please try again.`);
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // Save article to drafts
  const handleSaveToDrafts = async () => {
    if (!draftSuggestion || !generatedArticle) return;
    
    try {
      const response = await fetch('/api/posts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: generatedArticle,
          targetService: selectedService,
          targetServiceUrl: customServiceUrl || selectedService
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      alert('Article saved to drafts!');
      setDraftModalOpen(false);
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  // Toggle page expansion in detailed view
  const togglePageExpansion = (pageUrl: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageUrl)) {
      newExpanded.delete(pageUrl);
    } else {
      newExpanded.add(pageUrl);
    }
    setExpandedPages(newExpanded);
  };

  // Filter pages based on search and type
  const getFilteredPages = () => {
    let filtered = pages || [];
    
    if (searchQuery) {
      filtered = filtered.filter(page => 
        (page.mainTopic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (pageFilterType !== 'all') {
      filtered = filtered.filter(p => {
        const typeLower = p.type?.toLowerCase() || '';
        const urlLower = p.url?.toLowerCase() || '';
        
        if (pageFilterType === 'service') {
          return typeLower === 'service' || typeLower === 'services' || urlLower.includes('/services/');
        } else if (pageFilterType === 'blog') {
          return typeLower === 'blog' || urlLower.includes('/blog/');
        }
        return false;
      });
    }
    
    return filtered;
  };

  // Sort pages
  const getSortedPages = (pagesToSort: any[]) => {
    return [...pagesToSort].sort((a, b) => {
      let comparison = 0;
      if (pageSortField === 'title') {
        const titleA = a.mainTopic || a.title || a.url.split('/').pop() || '';
        const titleB = b.mainTopic || b.title || b.url.split('/').pop() || '';
        comparison = titleA.localeCompare(titleB);
      } else if (pageSortField === 'type') {
        comparison = (a.type || '').localeCompare(b.type || '');
      } else if (pageSortField === 'wordCount') {
        comparison = (a.wordCount || 0) - (b.wordCount || 0);
      }
      return pageSortDirection === 'asc' ? comparison : -comparison;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Analyzing Content...
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI is extracting insights from your website content
          </p>
        </div>
      </div>
    );
  }

  if (!analysisOutput) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            No Analysis Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Start a content analysis to see your content strategy insights
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Analysis
            </button>
          )}
        </div>
      </div>
    );
  }

  const { contentContext, aiSuggestions, pages, extractionData } = analysisOutput || {};

  // Debug data flow
  console.log('All Pages:', pages);
  console.log('Extraction Data:', extractionData);
  console.log('Content Context:', contentContext);

  // Calculate total pages from pages array (fixes "0 pages analyzed" bug)
  const totalPages = pages?.length || 0;
  const totalWordCount = pages?.reduce((sum, page) => sum + (page.wordCount || 0), 0) || 0;

  // Extract service pages (full objects) for dropdown with robust filtering
  const servicePages = pages?.filter(p => {
    const typeLower = p.type?.toLowerCase() || '';
    const urlLower = p.url?.toLowerCase() || '';
    return (
      typeLower === 'service' ||
      typeLower === 'services' ||
      urlLower.includes('/services/') ||
      urlLower.includes('/solutions/') ||
      urlLower.includes('/service/')
    );
  }) || [];

  console.log("Filtered Service Pages:", servicePages);

  // Extract service names for dropdown options
  const allServices = servicePages
    .map(p => p.mainTopic || p.url.split('/').pop() || 'Service')
    .filter((value, index, self) => self.indexOf(value) === index);

  // Filter suggestions based on selected gap
  const filteredSuggestions = selectedGap
    ? aiSuggestions?.filter(suggestion => 
        suggestion.reason.toLowerCase().includes(selectedGap.toLowerCase()) ||
        suggestion.targetKeywords.some(kw => kw.toLowerCase().includes(selectedGap.toLowerCase()))
      ) || []
    : aiSuggestions || [];

  // Generate outline for draft modal
  const generateOutline = (suggestion: AISuggestion) => {
    return {
      title: suggestion.title,
      type: suggestion.type,
      keywords: suggestion.targetKeywords,
      sections: [
        {
          title: "Introduction",
          content: `Hook the reader with a compelling opening about ${suggestion.targetKeywords[0]}. Establish the problem or opportunity you're addressing.`
        },
        {
          title: "Understanding the Challenge",
          content: `Explain the current landscape around ${suggestion.targetKeywords.join(' and ')}. Use data or examples to build credibility.`
        },
        {
          title: "Key Strategies & Solutions",
          content: `Present actionable strategies that address the main challenge. Break this into 3-5 clear, implementable steps.`
        },
        {
          title: "Real-World Examples",
          content: `Include case studies or examples that demonstrate success in ${suggestion.targetKeywords[0]}. This builds trust and shows practical application.`
        },
        {
          title: "Implementation Guide",
          content: `Provide a step-by-step implementation plan. Include tools, resources, and timelines where relevant.`
        },
        {
          title: "Measuring Success",
          content: `Define KPIs and metrics to track. Explain how to measure the impact of implementing these strategies.`
        },
        {
          title: "Conclusion",
          content: `Summarize key takeaways and provide a clear call-to-action. End with an inspiring message about the future of ${suggestion.targetKeywords[0]}.`
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Content Strategy Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {analysisOutput.baseUrl} • {totalPages} pages analyzed • {totalWordCount.toLocaleString()} total words
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              )}
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Users },
              { id: "keywords", label: "Keywords", icon: Target },
              { id: "gaps", label: "Content Gaps", icon: AlertCircle },
              { id: "pages", label: "Pages", icon: Globe },
              { id: "details", label: "Page Details", icon: FileSearch },
              { id: "suggestions", label: "Suggestions", icon: Lightbulb },
              { id: "planner", label: "Planner", icon: CalendarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Persona Card - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Target Persona
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Who you're writing for
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Audience
                    </label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 mt-2">
                      {contentContext?.audiencePersona || 'Not specified'}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Tone
                    </label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 mt-2">
                      {contentContext?.tone || 'Not specified'}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Writing Tip
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Use this persona to guide all your content creation. Every piece should speak directly to this audience in this tone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalPages}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pages Analyzed</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Keywords</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contentContext?.dominantKeywords?.length || 0}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Top Keywords</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Gaps</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contentContext?.contentGaps?.length || 0}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Content Gaps</p>
                </div>
              </div>

              {/* Extraction Stats */}
              {extractionData && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Content Extraction Summary
                      </h2>
                      <p className="text-indigo-100 text-sm">
                        Detailed analysis from Trigger.dev content extraction
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-indigo-200" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-3xl font-bold">{extractionData?.pagesProcessed || 0}</p>
                      <p className="text-sm text-indigo-100">Pages Processed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData?.totalWordCount?.toLocaleString() || 0}</p>
                      <p className="text-sm text-indigo-100">Total Words</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData?.aggregatedContent?.services?.length || 0}</p>
                      <p className="text-sm text-indigo-100">Service Pages</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData?.aggregatedContent?.blogs?.length || 0}</p>
                      <p className="text-sm text-indigo-100">Blog Posts</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Writing Style & Content Patterns */}
              {contentContext?.overallWritingStyle && contentContext?.contentPatterns && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Writing Style & Content Patterns
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Writing Style */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Overall Writing Style</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Dominant Tone</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{contentContext?.overallWritingStyle?.dominantTone || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Formality Level</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{contentContext?.overallWritingStyle?.averageFormality || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Common Perspective</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{contentContext?.overallWritingStyle?.commonPerspective || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Brand Voice Summary</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{contentContext?.overallWritingStyle?.brandVoiceSummary || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Content Patterns */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Content Patterns</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Preferred Content Types</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contentContext?.contentPatterns?.preferredContentTypes?.map((type, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Average Post Length</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{contentContext?.contentPatterns?.averagePostLength || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Common Structures</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contentContext?.contentPatterns?.commonStructures?.map((structure, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
                                {structure}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">CTA Patterns</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contentContext?.contentPatterns?.ctaPatterns?.map((cta, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-700 dark:text-purple-300">
                                {cta}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Quick Actions
                    </h2>
                    <p className="text-purple-100 text-sm">
                      Generate content or schedule your calendar
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-200" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAutoPlanFromStrategy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Open Planner
                  </button>
                  <button
                    onClick={handleAutoPlanFromStrategy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    <Zap className="w-4 h-4" />
                    Auto-Plan Month
                  </button>
                </div>
              </div>

              {/* Top Keywords Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Top Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contentContext?.dominantKeywords?.slice(0, 8).map((keyword, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        keyword.density === "High"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : keyword.density === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      <span>{keyword.term}</span>
                      <span className="text-xs opacity-75">({keyword.pages})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keywords" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Dominant Keywords
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                These are the most prominent semantic keywords across your content. Use them strategically in new content.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {contentContext?.dominantKeywords?.map((keyword, index) => {
                const maxPages = Math.max(...(contentContext?.dominantKeywords?.map(k => k.pages) || [1]));
                const percentage = (keyword.pages / maxPages) * 100;
                
                // Convert density to frequency label
                const getFrequencyLabel = (density: string) => {
                  const pagePercentage = (keyword.pages / totalPages) * 100;
                  if (pagePercentage > 50) return "Dominant";
                  if (pagePercentage > 25) return "Common";
                  return "Niche";
                };
                
                const frequencyLabel = getFrequencyLabel(keyword.density);
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-6">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {keyword.term}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                            frequencyLabel === "Dominant"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : frequencyLabel === "Common"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {frequencyLabel}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {keyword.pages} pages
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          frequencyLabel === "Dominant"
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : frequencyLabel === "Common"
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "gaps" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gap Visualizer */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Content Gap Analysis
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      These are topics you should be covering but aren't. Click a gap to filter suggestions.
                    </p>
                  </div>
                  {selectedGap && (
                    <button
                      onClick={() => setSelectedGap(null)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear Filter
                    </button>
                  )}
                </div>

                {/* Gap Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <h3 className="font-medium text-red-900 dark:text-red-100">High Priority</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {contentContext?.contentGaps?.filter(g => g.toLowerCase().includes('no case studies') || g.toLowerCase().includes('lack of')).length || 0}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Critical gaps needing immediate attention
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <h3 className="font-medium text-amber-900 dark:text-amber-100">Medium Priority</h3>
                    </div>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {contentContext?.contentGaps?.filter(g => !(g.toLowerCase().includes('no case studies') || g.toLowerCase().includes('lack of'))).length || 0}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Opportunities for content improvement
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">Total Suggestions</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {aiSuggestions?.length || 0}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      AI-generated content ideas ready
                    </p>
                  </div>
                </div>
              </div>

              {selectedGap && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Filtering suggestions for:</strong> {selectedGap}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Showing {filteredSuggestions?.length || 0} of {aiSuggestions?.length || 0} suggestions
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {contentContext?.contentGaps?.map((gap, index) => {
                  const isSelected = selectedGap === gap;
                  // Determine gap severity based on keywords
                  const isHighPriority = gap.toLowerCase().includes('no case studies') || gap.toLowerCase().includes('lack of');
                  const GapIcon = isHighPriority ? AlertTriangle : AlertCircle;
                  
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedGap(isSelected ? null : gap)}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400"
                          : isHighPriority
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                          : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      }`}
                    >
                      <GapIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        isSelected 
                          ? "text-blue-600 dark:text-blue-400" 
                          : isHighPriority 
                          ? "text-red-600 dark:text-red-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-slate-100 mb-2">
                          {gap}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            isHighPriority
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}>
                            {isHighPriority ? "High Priority" : "Medium Priority"}
                          </span>
                          {isSelected && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              {filteredSuggestions?.length || 0} suggestions available
                            </span>
                          )}
                        </div>
                        {/* Contextual Action Buttons */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Find a matching suggestion or create a draft directly
                              const matchingSuggestion = aiSuggestions?.find(s => 
                                s.reason.toLowerCase().includes(gap.toLowerCase().split(' ').slice(0, 3).join(' '))
                              );
                              if (matchingSuggestion) {
                                handleOpenDraftModal(matchingSuggestion);
                              } else {
                                // Create a new draft with this gap as the topic
                                const gapSuggestion: AISuggestion = {
                                  type: "Blog Post",
                                  title: `Addressing: ${gap.slice(0, 50)}${gap.length > 50 ? '...' : ''}`,
                                  reason: gap,
                                  targetKeywords: gap.split(' ').filter(w => w.length > 4).slice(0, 5),
                                  suggestedTone: contentContext?.tone || 'professional'
                                };
                                handleOpenDraftModal(gapSuggestion);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Generate Solution
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab("planner");
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <CalendarIcon className="w-3.5 h-3.5" />
                            Plan Later
                          </button>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service Coverage Visual */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Service Coverage
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Ratio of supporting content (blogs) to service pages. A healthy ratio is 2:1 or higher.
                </p>

                {pages && pages.length > 0 ? (() => {
                  const serviceCount = pages.filter(p => p.type?.toLowerCase() === 'service' || p.url?.toLowerCase().includes('/services/')).length;
                  const blogCount = pages.filter(p => p.type?.toLowerCase() === 'blog' || p.url?.toLowerCase().includes('/blog/')).length;
                  const ratio = serviceCount > 0 ? (blogCount / serviceCount) : 0;
                  
                  const getRatioLabel = (r: number) => {
                    if (r < 0.5) return { label: "Very Low", color: "red" };
                    if (r < 1) return { label: "Low", color: "amber" };
                    if (r < 2) return { label: "Moderate", color: "yellow" };
                    return { label: "Good", color: "green" };
                  };
                  
                  const ratioInfo = getRatioLabel(ratio);
                  const percentage = Math.min(ratio * 50, 100); // Scale so 2:1 = 100%

                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {serviceCount} service pages • {blogCount} blog posts
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                            {ratio.toFixed(2)} : 1
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          ratioInfo.color === "red"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : ratioInfo.color === "amber"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : ratioInfo.color === "yellow"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        }`}>
                          {ratioInfo.label}
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            ratioInfo.color === "red"
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : ratioInfo.color === "amber"
                              ? "bg-gradient-to-r from-amber-500 to-amber-600"
                              : ratioInfo.color === "yellow"
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                              : "bg-gradient-to-r from-green-500 to-green-600"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      {ratio < 1 && (
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                Content Support Warning
                              </p>
                              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                You have more services than supporting content. Consider creating blog posts to support each service page.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No page data available
                  </div>
                )}
              </div>

              {/* Page Type Breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Page Type Distribution
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Breakdown of your content by page type.
                </p>

                <div className="space-y-4">
                  {pages && pages.length > 0 ? (() => {
                    const typeCounts = pages.reduce((acc, page) => {
                      const type = page.type || 'other';
                      acc[type] = (acc[type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);

                    const sortedTypes = Object.entries(typeCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5);

                    return sortedTypes.map(([type, count]) => {
                      const percentage = (count / pages.length) * 100;
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                              {type}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {count} pages ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })() : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No page data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pages" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Page Analysis
                </h2>
                <select
                  value={pageFilterType}
                  onChange={(e) => setPageFilterType(e.target.value as 'all' | 'service' | 'blog')}
                  className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Pages</option>
                  <option value="service">Services Only</option>
                  <option value="blog">Blogs Only</option>
                </select>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                View keyword analysis for each individual page. See which pages are performing well and identify opportunities for improvement.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'title') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('title');
                        setPageSortDirection('asc');
                      }
                    }}>
                      Page Title {pageSortField === 'title' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'type') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('type');
                        setPageSortDirection('asc');
                      }
                    }}>
                      Type {pageSortField === 'type' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'wordCount') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('wordCount');
                        setPageSortDirection('desc');
                      }
                    }}>
                      Word Count {pageSortField === 'wordCount' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Top Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pages && pages.length > 0 ? (() => {
                    // Filter pages by type
                    let filteredPages = pages;
                    if (pageFilterType === 'service') {
                      filteredPages = pages.filter(p => p.type?.toLowerCase() === 'service' || p.url?.toLowerCase().includes('/services/'));
                    } else if (pageFilterType === 'blog') {
                      filteredPages = pages.filter(p => p.type?.toLowerCase() === 'blog' || p.url?.toLowerCase().includes('/blog/'));
                    }

                    // Sort pages
                    filteredPages = [...filteredPages].sort((a, b) => {
                      let comparison = 0;
                      if (pageSortField === 'title') {
                        const titleA = a.mainTopic || a.title || a.url.split('/').pop() || '';
                        const titleB = b.mainTopic || b.title || b.url.split('/').pop() || '';
                        comparison = titleA.localeCompare(titleB);
                      } else if (pageSortField === 'type') {
                        comparison = (a.type || '').localeCompare(b.type || '');
                      } else if (pageSortField === 'wordCount') {
                        comparison = (a.wordCount || 0) - (b.wordCount || 0);
                      }
                      return pageSortDirection === 'asc' ? comparison : -comparison;
                    });

                    return filteredPages.map((page, index) => {
                      // Use per-page keywords if available, otherwise fall back to global keywords
                      const pageKeywords = page.keywords && page.keywords.length > 0
                        ? page.keywords.slice(0, 3)
                        : contentContext?.dominantKeywords?.slice(0, 3).map(k => k.term) || [];
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {page.mainTopic || page.title || page.url.split('/').pop() || 'Untitled Page'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {page.url}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              page.type === 'service' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                : page.type === 'blog'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {page.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {(page.wordCount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {pageKeywords.map((keyword, kIndex) => (
                                <span
                                  key={kIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300"
                                >
                                  <Target className="w-2.5 h-2.5" />
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })() : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No individual page data available.
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Start a content analysis to see page-by-page insights.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NEW DETAILED PAGE ANALYSIS TAB */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pages by title, URL, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={pageFilterType}
                    onChange={(e) => setPageFilterType(e.target.value as 'all' | 'service' | 'blog')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="service">Services</option>
                    <option value="blog">Blogs</option>
                  </select>
                  <select
                    value={pageSortField}
                    onChange={(e) => setPageSortField(e.target.value as 'title' | 'type' | 'wordCount')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="wordCount">Sort by Words</option>
                    <option value="title">Sort by Title</option>
                    <option value="type">Sort by Type</option>
                  </select>
                  <button
                    onClick={() => setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    {pageSortDirection === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
              
              {/* Results Summary */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {getSortedPages(getFilteredPages()).length} of {totalPages} pages
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedPages(new Set(getSortedPages(getFilteredPages()).map(p => p.url)))}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-400">•</span>
                  <button
                    onClick={() => setExpandedPages(new Set())}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            </div>

            {/* Page Cards */}
            <div className="grid grid-cols-1 gap-6">
              {getSortedPages(getFilteredPages()).map((page, index) => {
                const isExpanded = expandedPages.has(page.url);
                const displayTitle = page.mainTopic || page.title || page.url.split('/').pop() || 'Untitled Page';
                
                return (
                  <div key={page.url} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Page Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {displayTitle}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              page.type === 'service' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                : page.type === 'blog'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {page.type || 'other'}
                            </span>
                          </div>
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                          >
                            {page.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {page.wordCount?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">words</p>
                          </div>
                          <button
                            onClick={() => togglePageExpansion(page.url)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Page Content */}
                    {isExpanded && (
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/20">
                        {/* Summary */}
                        {page.summary && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Summary</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {page.summary}
                            </p>
                          </div>
                        )}

                        {/* Full Content */}
                        {page.content && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Full Content</h4>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
                                {page.content}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Writing Style Analysis */}
                        {page.writingStyle && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Writing Style Analysis</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Tone</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.writingStyle.tone}</p>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Perspective</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.writingStyle.perspective}</p>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Formality</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.writingStyle.formality}</p>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sentence Structure</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.writingStyle.sentenceStructure}</p>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Sentence Length</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.writingStyle.averageSentenceLength} words</p>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Readability</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.writingStyle.readabilityLevel}</p>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Voice</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.writingStyle.voice}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Content Structure */}
                        {page.contentStructure && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Content Structure</h4>
                            <div className="flex flex-wrap gap-2">
                              {page.contentStructure.hasHeadings && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
                                  Has Headings
                                </span>
                              )}
                              {page.contentStructure.hasSubheadings && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
                                  Has Subheadings
                                </span>
                              )}
                              {page.contentStructure.usesLists && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
                                  Uses Lists
                                </span>
                              )}
                              {page.contentStructure.hasCallToAction && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
                                  Has CTA
                                </span>
                              )}
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                                {page.contentStructure.paragraphCount} paragraphs
                              </span>
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                                Avg: {page.contentStructure.averageParagraphLength} words
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Brand Voice */}
                        {page.brandVoice && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Brand Voice Elements</h4>
                            <div className="space-y-2">
                              {page.brandVoice.keyPhrases.length > 0 && (
                                <div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Key Phrases</p>
                                  <div className="flex flex-wrap gap-1">
                                    {page.brandVoice.keyPhrases.slice(0, 5).map((phrase: string, idx: number) => (
                                      <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-700 dark:text-purple-300">
                                        {phrase}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {page.brandVoice.terminology.length > 0 && (
                                <div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Technical Terms</p>
                                  <div className="flex flex-wrap gap-1">
                                    {page.brandVoice.terminology.slice(0, 5).map((term: string, idx: number) => (
                                      <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
                                        {term}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {page.brandVoice.valuePropositions.length > 0 && (
                                <div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Value Propositions</p>
                                  <div className="flex flex-wrap gap-1">
                                    {page.brandVoice.valuePropositions.slice(0, 3).map((value: string, idx: number) => (
                                      <span key={idx} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-xs text-amber-700 dark:text-amber-300">
                                        {value}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Keywords */}
                        {page.keywords && page.keywords.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {page.keywords.map((keyword: string, kIndex: number) => (
                                <span
                                  key={kIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300"
                                >
                                  <Target className="w-2.5 h-2.5" />
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => navigator.clipboard.writeText(page.content || '')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Content
                          </button>
                          <button
                            onClick={() => window.open(page.url, '_blank')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit Page
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {getFilteredPages().length === 0 && (
              <div className="text-center py-12">
                <FileSearch className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No pages found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    AI-Generated Content Suggestions
                  </h2>
                  <p className="text-purple-100 text-sm">
                    These content ideas are tailored to fill your content gaps and resonate with your target audience.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{aiSuggestions?.length || 0}</p>
                  <p className="text-sm text-purple-100">Suggestions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAutoPlanFromStrategy}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Open Planner
                </button>
                <button
                  onClick={handleAutoPlanFromStrategy}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  <Zap className="w-4 h-4" />
                  Auto-Plan Month
                </button>
              </div>
            </div>

            {selectedGap && filteredSuggestions.length === 0 && (
              <div className="col-span-full text-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No suggestions match this filter
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Try selecting a different content gap or clear the filter to see all suggestions.
                </p>
                <button
                  onClick={() => setSelectedGap(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSuggestions?.map((suggestion, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedSuggestion === suggestion
                      ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          suggestion.type === "Blog Post"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : suggestion.type === "Whitepaper"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : suggestion.type === "Case Study"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : suggestion.type === "Guide"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        {suggestion.type}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        #{index + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      {suggestion.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {suggestion.reason}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {suggestion.targetKeywords.map((keyword, kIndex) => (
                        <span
                          key={kIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300"
                        >
                          <Target className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>

                    {/* Additional Details */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        {suggestion.suggestedTone && (
                          <div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">Suggested Tone</span>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{suggestion.suggestedTone}</p>
                          </div>
                        )}
                        {suggestion.targetLength && (
                          <div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">Target Length</span>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{suggestion.targetLength} words</p>
                          </div>
                        )}
                      </div>
                      
                      {suggestion.contentOutline && suggestion.contentOutline.length > 0 && (
                        <div className="mb-3">
                          <span className="text-xs text-slate-600 dark:text-slate-400">Content Outline</span>
                          <ul className="mt-1 space-y-1">
                            {suggestion.contentOutline.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                            {suggestion.contentOutline.length > 3 && (
                              <li className="text-xs text-slate-500 dark:text-slate-400 italic">
                                +{suggestion.contentOutline.length - 3} more sections
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {suggestion.keyMessagePoints && suggestion.keyMessagePoints.length > 0 && (
                        <div>
                          <span className="text-xs text-slate-600 dark:text-slate-400">Key Messages</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {suggestion.keyMessagePoints.map((point, idx) => (
                              <span key={idx} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-xs text-amber-700 dark:text-amber-300">
                                {point}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDraftActionDropdown(draftActionDropdown === suggestion.title ? null : suggestion.title);
                        }}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <BookOpen className="w-4 h-4" />
                        Draft Now
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>
                      {draftActionDropdown === suggestion.title && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 overflow-hidden z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDraftActionDropdown(null);
                              handleOpenDraftModal(suggestion);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2 text-sm text-slate-900 dark:text-slate-100"
                          >
                            <Edit3 className="w-4 h-4" />
                            Write Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDraftActionDropdown(null);
                              setActiveTab("planner");
                              // Schedule the suggestion to the next available slot
                              const nextDate = new Date();
                              nextDate.setDate(nextDate.getDate() + 1);
                              // This would call the API to create a scheduled event
                              alert(`"${suggestion.title}" added to calendar for ${nextDate.toLocaleDateString()}`);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2 text-sm text-slate-900 dark:text-slate-100"
                          >
                            <CalendarIcon className="w-4 h-4" />
                            Add to Schedule
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "planner" && (
          <PlannerView
            contentGaps={contentContext?.contentGaps || []}
            aiSuggestions={aiSuggestions}
            contentContext={contentContext}
          />
        )}
      </div>

      {/* Smart Draft Modal */}
      {draftModalOpen && draftSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {draftStep === 1 ? 'Configure Draft' : draftStep === 2 ? 'Strategic Outline' : 'Generated Article'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {draftStep === 1 
                    ? 'Customize your content strategy before generating'
                    : draftStep === 2
                    ? `AI-generated outline for "${draftSuggestion.title}"`
                    : `Full article for "${draftSuggestion.title}"`
                  }
                </p>
              </div>
              <button
                onClick={() => setDraftModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Step 1: Configuration */}
            {draftStep === 1 && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Content Type Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        draftSuggestion.type === "Blog Post"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : draftSuggestion.type === "Whitepaper"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                          : draftSuggestion.type === "Case Study"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : draftSuggestion.type === "Guide"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      {draftSuggestion.type}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Title
                    </label>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-2">
                      {draftSuggestion.title}
                    </h3>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Promote Service
                    </label>
                    {!showCustomUrlInput ? (
                      <>
                        <select
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                        >
                          <option value="">Select a service to link...</option>
                          {servicePages.length > 0 ? (
                            servicePages.map((page, index) => (
                              <option key={index} value={page.mainTopic || page.url.split('/').pop() || 'Service'}>
                                {page.mainTopic || page.url.split('/').pop() || 'Service'} ({page.url})
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No service pages found</option>
                          )}
                        </select>
                        <button
                          onClick={() => setShowCustomUrlInput(true)}
                          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Or paste a specific service URL...
                        </button>
                      </>
                    ) : (
                      <div>
                        <input
                          type="text"
                          placeholder="Paste service URL (e.g., https://example.com/services/data-science)"
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={customServiceUrl}
                          onChange={(e) => setCustomServiceUrl(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            setShowCustomUrlInput(false);
                            setCustomServiceUrl("");
                          }}
                          className="mt-2 text-sm text-slate-600 dark:text-slate-400 hover:underline"
                        >
                          Back to dropdown
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      We will tailor the conclusion/CTA to this service
                    </p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* AI Suggested Keywords */}
                      {draftSuggestion.targetKeywords.map((keyword, kIndex) => (
                        <span
                          key={kIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-sm text-blue-700 dark:text-blue-300"
                        >
                          <Target className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                      {/* Custom Keywords */}
                      {customKeywords.map((keyword, kIndex) => (
                        <span
                          key={kIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-sm text-green-700 dark:text-green-300"
                        >
                          <Target className="w-3 h-3" />
                          {keyword}
                          <button
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-1 hover:text-green-900 dark:hover:text-green-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type keyword and press Enter..."
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={currentKeywordInput}
                      onChange={(e) => setCurrentKeywordInput(e.target.value)}
                      onKeyDown={handleAddKeyword}
                    />
                  </div>

                  {/* Tone Selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Article Tone
                    </label>
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {toneOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Choose the writing style that best fits your audience
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Generated Outline */}
            {draftStep === 2 && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Review and edit the outline before generating the article
                  </p>
                </div>
                <textarea
                  value={generatedOutline}
                  onChange={(e) => setGeneratedOutline(e.target.value)}
                  className="w-full h-full min-h-[400px] p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  placeholder="Your outline will appear here..."
                />
              </div>
            )}

            {/* Step 3: Generated Article */}
            {draftStep === 3 && (
              <div className="flex-1 overflow-y-auto p-6">
                {isGeneratingArticle ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Generating Article...
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        AI is writing your full article based on the outline
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: generatedArticle }} />
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
              {draftStep === 1 ? (
                <>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {customKeywords.length} custom keyword{customKeywords.length !== 1 ? 's' : ''} added
                  </div>
                  <button
                    onClick={handleGenerateOutline}
                    disabled={isGeneratingOutline}
                    className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingOutline ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        Generate Outline
                      </>
                    )}
                  </button>
                </>
              ) : draftStep === 2 ? (
                <>
                  <button
                    onClick={() => setDraftStep(1)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyOutline}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button
                      onClick={handleGenerateArticle}
                      disabled={isGeneratingArticle}
                      className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingArticle ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          Generate Article
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setDraftStep(2)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Outline
                  </button>
                  <button
                    onClick={handleSaveToDrafts}
                    className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save to Drafts
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

### src\components\layout\SidebarLayout.tsx

```typescript
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Zap,
  Calendar,
  History,
  ChevronLeft,
  ChevronRight,
  Globe,
  Menu,
  X,
  Home,
  Target,
  Settings,
  Archive,
  FileText,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/content-strategy?view=dashboard" },
  { id: "strategy", label: "Strategy Hub", icon: BarChart3, href: "/content-strategy?view=analysis" },
  { id: "production", label: "Production", icon: Zap, href: "/content-strategy?view=production" },
  { id: "calendar", label: "Calendar", icon: Calendar, href: "/content-strategy?view=planner" },
  { id: "drafts", label: "Drafts", icon: FileText, href: "/drafts" },
  { id: "archives", label: "Archives", icon: Archive, href: "/history" },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export default function SidebarLayout({ children, activeView, onViewChange }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (item: NavItem) => {
    if (onViewChange && item.href.includes("view=")) {
      const view = new URL(item.href, "http://localhost").searchParams.get("view");
      if (view) {
        onViewChange(view);
      }
    }
    setIsMobileOpen(false);
  };

  const isActive = (item: NavItem) => {
    if (activeView) {
      const view = new URL(item.href, "http://localhost").searchParams.get("view");
      return view === activeView;
    }
    return pathname === item.href.split("?")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">SEO Hub</span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Globe className="w-7 h-7 text-blue-600" />
              <span className="font-bold text-xl text-slate-900 dark:text-slate-100">SEO Hub</span>
            </div>
          )}
          {isCollapsed && <Globe className="w-7 h-7 text-blue-600 mx-auto" />}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats (Only when expanded) */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Quick Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Health Score</p>
                  <p className="font-bold text-blue-600">--</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Content Gaps</p>
                  <p className="font-bold text-amber-600">--</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        } pt-16 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}

```

---

### src\contexts\ContentStrategyContext.tsx

```typescript
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
interface ContentContext {
  dominantKeywords: string[];
  contentGaps: string[];
  audiencePersona: string;
  tone: string;
}

interface AISuggestion {
  id: string;
  type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
  title: string;
  reason: string;
  targetKeywords: string[];
  relatedServiceUrl?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: "PLANNED" | "GENERATING" | "READY" | "PUBLISHED" | "FAILED";
  content?: string;
  outline?: string;
  tone?: string;
  keywords?: string[];
  targetService?: string;
  targetServiceUrl?: string;
  sourceSuggestionId?: string;
  analysisRunId?: string;
}

interface ActiveDraft {
  id?: string;
  title: string;
  outline?: string;
  content?: string;
  tone?: string;
  keywords?: string[];
  targetService?: string;
  targetServiceUrl?: string;
  sourceSuggestionId?: string;
}

interface ContentStrategyContextType {
  // Analysis Data
  analysisData: ContentContext | null;
  setAnalysisData: (data: ContentContext | null) => void;
  
  // AI Suggestions
  aiSuggestions: AISuggestion[];
  setAiSuggestions: (suggestions: AISuggestion[]) => void;
  
  // Calendar Events
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  
  // Active Draft
  activeDraft: ActiveDraft | null;
  setActiveDraft: (draft: ActiveDraft | null) => void;
  
  // Analysis Run ID
  analysisRunId: string | null;
  setAnalysisRunId: (id: string | null) => void;
}

const ContentStrategyContext = createContext<ContentStrategyContextType | undefined>(undefined);

export function ContentStrategyProvider({ children }: { children: ReactNode }) {
  const [analysisData, setAnalysisData] = useState<ContentContext | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeDraft, setActiveDraft] = useState<ActiveDraft | null>(null);
  const [analysisRunId, setAnalysisRunId] = useState<string | null>(null);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <ContentStrategyContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        aiSuggestions,
        setAiSuggestions,
        events,
        setEvents,
        addEvent,
        updateEvent,
        removeEvent,
        activeDraft,
        setActiveDraft,
        analysisRunId,
        setAnalysisRunId,
      }}
    >
      {children}
    </ContentStrategyContext.Provider>
  );
}

export function useContentStrategy() {
  const context = useContext(ContentStrategyContext);
  if (context === undefined) {
    throw new Error("useContentStrategy must be used within a ContentStrategyProvider");
  }
  return context;
}

```

---

