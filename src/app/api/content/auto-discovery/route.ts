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

    // Return auto-discovery results (mock data for now)
    const mockDiscoveryData = {
      services: [
        "Web Development",
        "Mobile App Development", 
        "SEO Services",
        "Digital Marketing",
        "E-commerce Solutions",
        "Cloud Computing",
        "Cybersecurity Services",
        "Data Analytics",
        "AI Solutions",
        "IT Consulting"
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
        { url: "/about", type: "page", title: "About Us" },
        { url: "/contact", type: "page", title: "Contact Us" },
        { url: "/blog", type: "blog", title: "Blog" }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockDiscoveryData,
    });
  } catch (error) {
    console.error("[Auto-Discovery] GET Error:", error);
    return NextResponse.json(
      { error: "Failed to get auto-discovery data", details: String(error) },
      { status: 500 }
    );
  }
}
