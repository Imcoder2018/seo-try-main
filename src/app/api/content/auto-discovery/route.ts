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
          
          // Extract locations from content analysis or use defaults
          const locations = analysisOutput?.locations || [
            "Islamabad",
            "Rawalpindi", 
            "Lahore",
            "Karachi",
            "Peshawar"
          ];
          
          // Extract other data from analysis
          const aboutSummary = analysisOutput?.aboutSummary || "Professional technology services provider";
          const targetAudience = analysisOutput?.targetAudience || "Businesses seeking digital solutions";
          const brandTone = analysisOutput?.brandTone || "Professional and innovative";
          
          // Extract existing pages
          const existingPages = analysisOutput?.pages?.slice(0, 10).map((p: any) => ({
            url: p.url,
            type: p.type || 'page',
            title: p.title || p.url
          })) || [];

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
        "Islamabad",
        "Rawalpindi", 
        "Lahore",
        "Karachi",
        "Peshawar",
        "Wah Cantt",
        "Faisalabad",
        "Multan",
        "Quetta",
        "Gujranwala"
      ],
      aboutSummary: "Leading technology solutions provider specializing in custom software development, digital transformation, and innovative IT consulting services. With over 10 years of experience, we help businesses leverage cutting-edge technology to achieve their goals.",
      targetAudience: "Small to medium businesses, startups, and enterprises looking for digital transformation and technology solutions",
      brandTone: "Professional, innovative, reliable, and customer-focused",
      contactInfo: {
        email: "info@datatechconsultants.com.au",
        phone: "+92-300-1234567",
        address: "123 Business Park, Islamabad, Pakistan"
      },
      existingPages: [
        { url: "/services/web-development", type: "service", title: "Web Development Services" },
        { url: "/services/seo", type: "service", title: "SEO Services" },
        { url: "/services/mobile-app-development", type: "service", title: "Mobile App Development" },
        { url: "/services/digital-marketing", type: "service", title: "Digital Marketing" },
        { url: "/about", type: "page", title: "About Us" },
        { url: "/contact", type: "page", title: "Contact Us" },
        { url: "/blog", type: "blog", title: "Blog" },
        { url: "/", type: "homepage", title: "Home" }
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
