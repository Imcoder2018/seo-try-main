import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export const dynamic = "force-dynamic";

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    ) as { userId: string };

    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return decoded.userId;
  } catch {
    return null;
  }
}

// GET - Fetch scheduled content for editing
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("id");

    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Fetch the scheduled content
    const content = await prisma.scheduledContent.findFirst({
      where: {
        id: contentId,
        wordpressSite: {
          userId,
        },
      },
      include: {
        wordpressSite: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
          },
        },
        keyword: true,
        contentPlan: true,
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        content,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Content editor GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// PUT - Update scheduled content
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, content, excerpt, metaDescription, focusKeyword, secondaryKeywords, featuredImageUrl, featuredImageAlt, categories, tags, scheduledFor, timezone } = body;

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "id, title, and content are required" },
        { status: 400 }
      );
    }

    // Verify user owns this content
    const existingContent = await prisma.scheduledContent.findFirst({
      where: {
        id,
        wordpressSite: {
          userId,
        },
      },
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // Only allow editing if status is PENDING or READY
    if (
      existingContent.status !== "PENDING" &&
      existingContent.status !== "READY"
    ) {
      return NextResponse.json(
        { error: "Cannot edit content that is already being published or published" },
        { status: 400 }
      );
    }

    // Update the content
    const updatedContent = await prisma.scheduledContent.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        metaDescription: metaDescription || null,
        focusKeyword,
        secondaryKeywords: secondaryKeywords || [],
        featuredImageUrl: featuredImageUrl || null,
        featuredImageAlt: featuredImageAlt || null,
        categories: categories || [],
        tags: tags || [],
        scheduledFor: scheduledFor ? new Date(scheduledFor) : existingContent.scheduledFor,
        timezone: timezone || existingContent.timezone,
        status: "READY", // Mark as ready after manual edit
      },
      include: {
        wordpressSite: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        content: updatedContent,
        message: "Content updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Content editor PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

// DELETE - Delete scheduled content
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("id");

    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns this content
    const existingContent = await prisma.scheduledContent.findFirst({
      where: {
        id: contentId,
        wordpressSite: {
          userId,
        },
      },
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // Only allow deletion if status is PENDING or READY
    if (
      existingContent.status !== "PENDING" &&
      existingContent.status !== "READY"
    ) {
      return NextResponse.json(
        { error: "Cannot delete content that is already being published or published" },
        { status: 400 }
      );
    }

    // Delete the content
    await prisma.scheduledContent.delete({
      where: { id: contentId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Content editor DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
