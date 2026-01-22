import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// WordPress configuration - you should store these in environment variables
const WORDPRESS_URL = process.env.WORDPRESS_URL || "https://your-wordpress-site.com";
const API_KEY = process.env.WORDPRESS_API_KEY || "";

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
      hasImage: !!imageUrl,
    });

    // Check if WordPress is configured
    if (!WORDPRESS_URL || WORDPRESS_URL === "https://your-wordpress-site.com") {
      return NextResponse.json(
        { 
          success: false,
          error: "WordPress URL not configured. Please set WORDPRESS_URL in your environment variables." 
        },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: "WordPress API key not configured. Please set WORDPRESS_API_KEY in your environment variables." 
        },
        { status: 400 }
      );
    }

    // Call the real WordPress plugin API
    const wordpressResponse = await fetch(`${WORDPRESS_URL}/wp-json/seo-autofix/v1/content/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SEO-AutoFix-Key": API_KEY,
      },
      body: JSON.stringify({
        title,
        content,
        location,
        contentType,
        imageUrl,
        primaryKeywords,
        status,
      }),
    });

    console.log("[WordPress Publish] API response status:", wordpressResponse.status);

    if (!wordpressResponse.ok) {
      const errorText = await wordpressResponse.text();
      console.error("[WordPress Publish] API error response:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `WordPress API error: ${wordpressResponse.status}`);
      } catch {
        throw new Error(`WordPress API error: ${wordpressResponse.status} - ${errorText}`);
      }
    }

    const responseData = await wordpressResponse.json();
    console.log("[WordPress Publish] Full API response:", JSON.stringify(responseData, null, 2));
    console.log("[WordPress Publish] Post ID:", responseData.post?.id || responseData.postId);
    console.log("[WordPress Publish] Response structure:", Object.keys(responseData));

    // Handle both old and new response formats for backward compatibility
    let postData;
    if (responseData.post) {
      // New format: { success: true, post: { id: 123, ... } }
      postData = responseData.post;
    } else if (responseData.postId) {
      // Old format: { success: true, postId: 123, url: "...", status: "..." }
      postData = {
        id: responseData.postId,
        link: responseData.url,
        status: responseData.status,
        title: { rendered: title || "Published Content" },
        content: { rendered: "" },
        slug: responseData.url?.split('/')?.filter(Boolean)?.pop() || "",
        date: new Date().toISOString(),
        featured_media: 0,
        meta: {
          generated_by: "auto-content-engine"
        }
      };
    } else {
      console.error("[WordPress Publish] No post data found in response");
      postData = null;
    }

    return NextResponse.json({
      success: true,
      post: postData,
      message: responseData.message || `Content published as ${status}`,
    });
  } catch (error) {
    console.error("[WordPress Publish] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to publish to WordPress", 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    // Call the real WordPress plugin API
    const wordpressUrl = postId 
      ? `${WORDPRESS_URL}/wp-json/seo-autofix/v1/content?postId=${postId}`
      : `${WORDPRESS_URL}/wp-json/seo-autofix/v1/content`;

    const wordpressResponse = await fetch(wordpressUrl, {
      method: "GET",
      headers: {
        "X-SEO-AutoFix-Key": API_KEY,
      },
    });

    if (!wordpressResponse.ok) {
      const errorData = await wordpressResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `WordPress API error: ${wordpressResponse.status}`);
    }

    const responseData = await wordpressResponse.json();

    return NextResponse.json({
      success: true,
      ...(postId ? { post: responseData.post } : { posts: responseData.posts }),
    });
  } catch (error) {
    console.error("[WordPress Publish GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch WordPress data", details: String(error) },
      { status: 500 }
    );
  }
}
