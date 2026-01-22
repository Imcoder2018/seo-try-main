import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { id, status, scheduledAt, content, featuredImageUrl, targetService, targetServiceUrl } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Update the post
    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (scheduledAt) updateData.scheduledFor = new Date(scheduledAt);
    if (content !== undefined) updateData.content = content;
    if (featuredImageUrl !== undefined) updateData.featuredImageUrl = featuredImageUrl;
    if (targetService !== undefined) updateData.targetService = targetService;
    if (targetServiceUrl !== undefined) updateData.targetServiceUrl = targetServiceUrl;

    const updatedPost = await prisma.scheduledContent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const posts = await prisma.scheduledContent.findMany({
      where,
      include: {
        wordpressSite: true,
      },
      orderBy: {
        scheduledFor: "desc",
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
