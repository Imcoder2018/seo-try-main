import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { title, aiKeywords, userKeywords, promotedService, serviceContext, tone } = await request.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Combine AI keywords with user keywords
    const allKeywords = [...(aiKeywords || []), ...(userKeywords || [])];
    const keywordsString = allKeywords.length > 0 ? allKeywords.join(", ") : "Not specified";

    let prompt = `
You are an expert Content Strategist. Create a detailed, specific Blog Post Outline.

TITLE: "${title}"
TARGET KEYWORDS: ${allKeywords.length > 0 ? keywordsString : "Not specified"}
${promotedService ? `GOAL: This article must subtly sell the user's service: "${promotedService}".` : ''}
${serviceContext ? `CONTEXT (What the service is):\n${serviceContext}` : ''}
${tone ? `TONE INSTRUCTIONS: Write this outline in a ${tone} style.` : ''}
INSTRUCTIONS:
1. Create 6-8 Headings (H2) that are SPECIFIC to the topic, NOT generic like "Introduction" or "Conclusion"
2. Under each H2, write 2 bullet points on what to cover
3. ${promotedService ? `The "Solution" or "Implementation" section MUST mention how "${promotedService}" helps solve the problem.` : ''}
4. ${promotedService ? `The Conclusion MUST include a Call to Action for "${promotedService}".` : ''}
5. Do NOT use generic text like "Hook the reader". Be specific to the topic and keywords.
6. Make each section actionable and practical.
7. Use real-world examples and data points where appropriate.
8. ${tone ? `Maintain a ${tone} tone throughout the outline.` : ''}
Return the response as Markdown with H2 headings and bullet points.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist and SEO specialist. You create detailed, specific blog post outlines that are tailored to the target keywords and business goals. You avoid generic placeholders and always provide specific, actionable content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const outline = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      outline,
    });
  } catch (error) {
    console.error("Error generating outline:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate outline";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
