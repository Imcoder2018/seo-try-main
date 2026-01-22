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
