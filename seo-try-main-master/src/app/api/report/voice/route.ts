import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface AuditData {
  domain: string;
  overallScore: number;
  overallGrade: string;
  seoScore: number;
  linksScore: number;
  usabilityScore: number;
  performanceScore: number;
  socialScore: number;
  contentScore?: number;
  eeatScore?: number;
  recommendations: Array<{
    title: string;
    category: string;
    priority: string;
  }>;
}

function generateSummaryText(audit: AuditData): string {
  const highPriority = audit.recommendations.filter(r => r.priority.toLowerCase() === "high");
  
  let summary = `SEO Audit Summary for ${audit.domain}. `;
  
  // Overall score
  if (audit.overallScore >= 90) {
    summary += `Excellent news! Your website scored ${audit.overallScore} out of 100, earning a grade of ${audit.overallGrade}. Your site is well-optimized for search engines. `;
  } else if (audit.overallScore >= 70) {
    summary += `Good job! Your website scored ${audit.overallScore} out of 100, earning a grade of ${audit.overallGrade}. There's room for improvement, but you're on the right track. `;
  } else if (audit.overallScore >= 50) {
    summary += `Your website scored ${audit.overallScore} out of 100, earning a grade of ${audit.overallGrade}. There are several areas that need attention to improve your search rankings. `;
  } else {
    summary += `Your website scored ${audit.overallScore} out of 100, earning a grade of ${audit.overallGrade}. Your site needs significant improvements to rank well in search engines. `;
  }

  // Highlight best and worst categories
  const categories = [
    { name: "On-Page SEO", score: audit.seoScore },
    { name: "Links", score: audit.linksScore },
    { name: "Usability", score: audit.usabilityScore },
    { name: "Performance", score: audit.performanceScore },
    { name: "Social", score: audit.socialScore },
  ];

  if (audit.contentScore !== undefined) {
    categories.push({ name: "Content Quality", score: audit.contentScore });
  }
  if (audit.eeatScore !== undefined) {
    categories.push({ name: "E-E-A-T signals", score: audit.eeatScore });
  }

  const sortedCategories = [...categories].sort((a, b) => b.score - a.score);
  const best = sortedCategories[0];
  const worst = sortedCategories[sortedCategories.length - 1];

  summary += `Your strongest area is ${best.name} with a score of ${best.score}. `;
  
  if (worst.score < 70) {
    summary += `However, ${worst.name} needs the most attention with a score of ${worst.score}. `;
  }

  // Top recommendations
  if (highPriority.length > 0) {
    summary += `Here are your top priorities: `;
    highPriority.slice(0, 3).forEach((rec, index) => {
      summary += `${index + 1}. ${rec.title}. `;
    });
  }

  // Closing
  summary += `For detailed recommendations and to fix these issues automatically, connect your WordPress site using the SEO AutoFix plugin. Good luck improving your rankings!`;

  return summary;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditData, voice = "alloy" } = body;

    if (!auditData) {
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API Key is not configured. Please add OPENAI_API_KEY to your environment variables in Vercel Dashboard." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Generate summary text
    const summaryText = generateSummaryText(auditData);

    // Generate speech using OpenAI TTS
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
      input: summaryText,
    });

    // Get the audio data as ArrayBuffer
    const buffer = await mp3Response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="seo-audit-summary-${auditData.domain}.mp3"`,
      },
    });
  } catch (error) {
    console.error("Voice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice summary", details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to just get the text summary without voice
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auditDataParam = searchParams.get("auditData");

    if (!auditDataParam) {
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    const auditData: AuditData = JSON.parse(auditDataParam);
    const summaryText = generateSummaryText(auditData);

    return NextResponse.json({ summary: summaryText });
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary", details: String(error) },
      { status: 500 }
    );
  }
}
