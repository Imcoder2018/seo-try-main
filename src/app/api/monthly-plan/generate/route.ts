import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { services, contentGaps, postsPerWeek = 4, tone } = await req.json();

  if (!services || !contentGaps) {
    return NextResponse.json({ error: "Services and content gaps are required" }, { status: 400 });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
You are a Content Strategist creating a monthly content plan.

AVAILABLE SERVICES (What we sell):
${services.map((s: any, i: number) => `${i + 1}. ${s.title} - ${s.url}`).join("\n")}

CONTENT GAPS (What we should write about):
${contentGaps.map((gap: string, i: number) => `${i + 1}. ${gap}`).join("\n")}

REQUIREMENTS:
- Generate ${postsPerWeek} blog post ideas per week (total: ${postsPerWeek * 4} posts for the month)
- Each post should address a content gap and promote a relevant service
- Mix of content types: Blog Post, Case Study, Guide, Whitepaper
- Schedule posts on Tuesdays and Thursdays
${tone ? `Tone: ${tone}` : ''}

Return ONLY valid JSON in this exact format:
{
  "monthlyPlan": [
    {
      "date": "2026-01-07",
      "dayOfWeek": "Tuesday",
      "title": "Blog Post Title",
      "type": "Blog Post",
      "contentGap": "Related content gap",
      "promotedService": "Service Name",
      "targetKeywords": ["keyword1", "keyword2"]
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist. You create data-driven monthly content plans that align services with content gaps. Always return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const planData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      plan: planData.monthlyPlan,
    });
  } catch (error) {
    console.error("Error generating monthly plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate monthly plan" },
      { status: 500 }
    );
  }
}
