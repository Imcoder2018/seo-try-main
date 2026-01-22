import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { section, title, tone, context } = await req.json();

  if (!section || !title) {
    return new Response(JSON.stringify({ error: "Section and title are required" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenAI API key is not configured" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const prompt = `
You are rewriting a section of a B2B blog post.
Article Title: "${title}"
${tone ? `Tone: ${tone}` : ''}
${context ? `Context: ${context}` : ''}

Current Section Content:
${section}

Instructions:
1. Rewrite this section to be more engaging and informative
2. Keep the same general structure and length
3. Make it more actionable and specific
4. Include real-world examples or data points where appropriate
5. ${tone ? `Maintain a ${tone} tone throughout.` : ''}
6. Return ONLY the HTML content (no markdown formatting)

Rewrite the section now:
`;

    const result = await streamText({
      model: openai("gpt-4o") as any,
      prompt: prompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error regenerating section:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to regenerate section";
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
