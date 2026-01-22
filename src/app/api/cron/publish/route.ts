import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  // Security check
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Find posts ready to publish
    const postsToPublish = await prisma.scheduledContent.findMany({
      where: {
        status: "READY",
        scheduledFor: {
          lte: new Date(),
        },
      },
      include: {
        wordpressSite: true,
      },
    });

    if (postsToPublish.length === 0) {
      return NextResponse.json({ message: "No posts to publish" });
    }

    const results = [];

    // 2. Loop and Publish
    for (const post of postsToPublish) {
      try {
        const creds = post.wordpressSite;
        
        if (!creds || !creds.wpUsername || !creds.wpAppPassword) {
          throw new Error("WordPress credentials not configured");
        }

        // A. Upload Image to WP (if exists)
        let featuredMediaId = 0;
        if (post.featuredImageUrl) {
          try {
            const imgRes = await fetch(post.featuredImageUrl);
            const imgBlob = await imgRes.blob();
            
            const mediaRes = await fetch(`${creds.siteUrl}/wp-json/wp/v2/media`, {
              method: "POST",
              headers: {
                "Authorization": "Basic " + Buffer.from(`${creds.wpUsername}:${creds.wpAppPassword}`).toString("base64"),
                "Content-Disposition": `attachment; filename="featured-image.png"`,
                "Content-Type": "image/png",
              },
              body: imgBlob,
            });
            const mediaData = await mediaRes.json();
            featuredMediaId = mediaData.id;
          } catch (imgError) {
            console.error(`Failed to upload image for post ${post.id}:`, imgError);
            // Continue without image
          }
        }

        // B. Create Post in WP
        const wpRes = await fetch(`${creds.siteUrl}/wp-json/wp/v2/posts`, {
          method: "POST",
          headers: {
            "Authorization": "Basic " + Buffer.from(`${creds.wpUsername}:${creds.wpAppPassword}`).toString("base64"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
            status: "publish",
            featured_media: featuredMediaId || undefined,
            excerpt: post.excerpt || "",
            meta: {
              description: post.metaDescription || "",
            },
          }),
        });

        if (!wpRes.ok) {
          const errorText = await wpRes.text();
          throw new Error(`WP API Error: ${errorText}`);
        }

        const wpData = await wpRes.json();

        // C. Update DB
        await prisma.scheduledContent.update({
          where: { id: post.id },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
            wpPostId: wpData.id,
          },
        });

        results.push({ id: post.id, status: "success", wpPostId: wpData.id });
      } catch (error) {
        console.error(`Failed to publish post ${post.id}:`, error);
        await prisma.scheduledContent.update({
          where: { id: post.id },
          data: {
            status: "FAILED",
            publishError: error instanceof Error ? error.message : String(error),
          },
        });
        results.push({
          id: post.id,
          status: "failed",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      processed: results.length,
      success: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "failed").length,
      details: results,
    });
  } catch (error) {
    console.error("Error in cron publish:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
