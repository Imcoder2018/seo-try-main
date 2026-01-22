import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { 
      title,
      content,
      location,
      contentType,
      imageUrl,
      primaryKeywords,
      status = "draft" // Can be 'draft', 'publish', 'pending'
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    console.log("[WordPress Publish] Publishing content:", {
      title,
      location,
      contentType,
      status,
    });

    // Mock WordPress API call - in production, this would use the user's WordPress credentials
    const mockWordPressResponse = {
      id: 12345,
      title: {
        rendered: title
      },
      content: {
        rendered: content
      },
      status: status,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      link: `https://example.com/${title.toLowerCase().replace(/\s+/g, '-')}`,
      date: new Date().toISOString(),
      featured_media: imageUrl || 0,
      meta: {
        primary_keywords: primaryKeywords || [],
        location: location,
        content_type: contentType,
        generated_by: "auto-content-engine"
      }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("[WordPress Publish] Successfully published:", mockWordPressResponse.id);

    return NextResponse.json({
      success: true,
      post: mockWordPressResponse,
      message: `Content published as ${status}`,
    });
  } catch (error) {
    console.error("[WordPress Publish] Error:", error);
    return NextResponse.json(
      { error: "Failed to publish to WordPress", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (postId) {
      // Get specific post
      const mockPost = {
        id: parseInt(postId),
        title: { rendered: "Sample Generated Post" },
        content: { rendered: "This is sample content..." },
        status: "draft",
        date: new Date().toISOString(),
        link: "https://example.com/sample-post"
      };

      return NextResponse.json({
        success: true,
        post: mockPost,
      });
    } else {
      // Get all posts by this user
      const mockPosts = [
        {
          id: 12345,
          title: { rendered: "Web Development Trends in Islamabad" },
          status: "draft",
          date: new Date().toISOString(),
          link: "https://example.com/web-development-trends-islamabad"
        },
        {
          id: 12346,
          title: { rendered: "SEO Services for Lahore Businesses" },
          status: "published",
          date: new Date(Date.now() - 86400000).toISOString(),
          link: "https://example.com/seo-services-lahore"
        }
      ];

      return NextResponse.json({
        success: true,
        posts: mockPosts,
      });
    }
  } catch (error) {
    console.error("[WordPress Publish GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch WordPress data", details: String(error) },
      { status: 500 }
    );
  }
}
