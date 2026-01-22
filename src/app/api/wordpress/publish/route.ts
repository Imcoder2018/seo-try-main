import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Validate image URL
    let processedImageUrl = imageUrl;
    if (imageUrl) {
      // Check if it's a valid URL
      try {
        new URL(imageUrl);
        console.log("[WordPress Publish] Valid image URL provided:", imageUrl);
      } catch (urlError) {
        console.warn("[WordPress Publish] Invalid image URL, removing:", imageUrl);
        processedImageUrl = "";
      }
    }

    if (!title || !content) {
      return NextResponse.json(
        { 
          success: false,
          error: "Title and content are required" 
        },
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
    console.log("[WordPress Publish] Sending image URL:", processedImageUrl);
    console.log("[WordPress Publish] Image URL type:", typeof processedImageUrl);
    console.log("[WordPress Publish] Image URL length:", processedImageUrl?.length);
    
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
        imageUrl: processedImageUrl?.trim() || "", // Use validated URL
        primaryKeywords,
        status,
        // Add image metadata for debugging
        hasImage: !!processedImageUrl,
        imageSource: processedImageUrl ? "ai-generated" : "none",
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
    console.log("[WordPress Publish] Featured media ID:", responseData.post?.featured_media);
    console.log("[WordPress Publish] Response structure:", Object.keys(responseData));

    // Check if image was successfully set as featured image
    const featuredMediaId = responseData.post?.featured_media || 0;
    const imageSetSuccessfully = featuredMediaId > 0;
    
    console.log("[WordPress Publish] Image set as featured:", imageSetSuccessfully);
    console.log("[WordPress Publish] Featured media ID:", featuredMediaId);

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

    // Store successful publish in database
    try {
      await prisma.wordpressPublish.create({
        data: {
          title: title,
          content: content,
          excerpt: content ? content.substring(0, 200) + "..." : "",
          wordCount: content ? content.split(/\s+/).length : 0,
          wordpressPostId: postData?.id || 0,
          permalink: postData?.link || responseData.url || "",
          wordpressEditUrl: responseData.editUrl || "",
          status: responseData.status || status,
          location: location || "",
          contentType: contentType || "",
          primaryKeywords: primaryKeywords || [],
          imageUrl: imageUrl || "",
          imageDownloaded: !!imageUrl,
          wordpressUrl: WORDPRESS_URL,
          wordpressApiUrl: `${WORDPRESS_URL}/wp-json/seo-autofix/v1/content/publish`,
          userId: user.id,
          publishResponse: responseData,
        },
      });
      console.log("[WordPress Publish] Stored in database successfully");
    } catch (dbError) {
      console.log("[WordPress Publish] Database not ready, storing in console:", dbError);
      // Store in console for now until Prisma client is regenerated
      console.log("[WordPress Publish] Would store:", {
        title,
        wordpressPostId: postData?.id,
        status: responseData.status || status,
        publishedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      post: postData,
      message: responseData.message || `Content published as ${status}`,
      imageStatus: {
        sent: !!processedImageUrl,
        setAsFeatured: imageSetSuccessfully,
        featuredMediaId: featuredMediaId,
        originalUrl: processedImageUrl,
      }
    });
  } catch (error) {
    console.error("[WordPress Publish] Error:", error);
    
    // Store failed publish attempt
    try {
      const body = await request.json().catch(() => ({}));
      await prisma.wordpressPublish.create({
        data: {
          title: body.title || "Unknown",
          content: body.content || "",
          wordpressPostId: 0,
          permalink: "",
          status: "failed",
          location: body.location || "",
          contentType: body.contentType || "",
          primaryKeywords: body.primaryKeywords || [],
          imageUrl: body.imageUrl || "",
          imageDownloaded: false,
          wordpressUrl: WORDPRESS_URL,
          wordpressApiUrl: `${WORDPRESS_URL}/wp-json/seo-autofix/v1/content/publish`,
          userId: user.id,
          publishResponse: { error: String(error) },
          publishError: String(error),
        },
      });
    } catch (dbError) {
      console.log("[WordPress Publish] Database not ready, logging error:", dbError);
      console.log("[WordPress Publish] Would store error:", {
        error: String(error),
        title: await request.json().catch(() => ({})).then(b => b.title || "Unknown"),
        publishedAt: new Date().toISOString(),
      });
    }
    
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
