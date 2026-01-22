import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log("[Article Generation] Starting request...", { timestamp: new Date().toISOString() });

  try {
    const { outline, title, serviceUrl, tone, keywords } = await req.json();
    console.log("[Article Generation] Request payload:", { 
      title, 
      hasOutline: !!outline, 
      hasServiceUrl: !!serviceUrl,
      tone,
      keywordsCount: keywords?.length
    });

    if (!title || !outline) {
      console.error("[Article Generation] Validation failed: Missing title or outline");
      return new Response(JSON.stringify({ error: "Title and outline are required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[Article Generation] Missing OPENAI_API_KEY");
      return new Response(JSON.stringify({ error: "OpenAI API key is not configured" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create a structured prompt based on the outline
    const prompt = `
You are writing a professional B2B blog post.
Title: "${title}"
${tone ? `Tone: ${tone}` : ''}
${keywords ? `Target Keywords: ${keywords.join(", ")}` : ''}

Structure the article exactly according to this outline:
${typeof outline === 'string' ? outline : JSON.stringify(outline)}

CRITICAL RULES:
1. Write in HTML format (use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>).
2. Write at least 1,500-2,000 words total.
3. Each H2 section should be substantial (200-300 words).
4. Use bullet points and numbered lists where appropriate.
5. Include real-world examples and data points.
6. ${serviceUrl ? `In the "Solution", "Implementation", or "Conclusion" section, naturally link to: ${serviceUrl}` : ''}
7. Make the content actionable and practical.
8. Use a professional, authoritative voice.
9. Include a compelling introduction that hooks the reader.
10. End with a strong conclusion with a call to action.
${tone ? `11. Maintain a ${tone} tone throughout the article.` : ''}

Return ONLY the HTML content, no markdown formatting, no intro/outro text.
`;

    console.log("[Article Generation] Calling streamText with GPT-4o...");
    const streamStartTime = Date.now();

    const result = await streamText({
      model: openai("gpt-4o") as any,
      prompt: prompt,
      temperature: 0.7,
    });

    const streamDuration = Date.now() - streamStartTime;
    console.log("[Article Generation] StreamText call completed in", streamDuration, "ms");

    const response = result.toTextStreamResponse();
    const totalDuration = Date.now() - startTime;
    console.log("[Article Generation] Request completed successfully in", totalDuration, "ms");

    return response;
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error("[Article Generation] ERROR after", totalDuration, "ms:", error);
    
    if (error instanceof Error) {
      console.error("[Article Generation] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to generate article";
    return new Response(JSON.stringify({ 
      error: errorMessage,
      duration: totalDuration,
      timestamp: new Date().toISOString()
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
