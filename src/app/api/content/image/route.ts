import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// Generate featured image using DALL-E
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, keyword, businessType, style = "professional" } = body;

    if (!title || !keyword) {
      return NextResponse.json(
        { error: "Title and keyword are required" },
        { status: 400 }
      );
    }

    // Generate image prompt based on content
    const promptResponse = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert at creating image prompts for DALL-E. Create prompts for professional blog featured images that are:
- Clean and modern
- Relevant to the topic
- Suitable for local business websites
- Not containing any text or words
- Professional quality
- ${style} style`,
        },
        {
          role: "user",
          content: `Create a DALL-E prompt for a featured image for a blog post titled "${title}" about "${keyword}" for a ${businessType || "local business"}.

The image should be suitable as a featured/hero image for a blog post. Keep the prompt under 200 characters. Do not include any text in the image.

Return only the prompt, nothing else.`,
        },
      ],
      max_tokens: 200,
    });

    const imagePrompt = promptResponse.choices[0].message.content?.trim() || 
      `Professional ${style} photograph related to ${keyword}, clean modern composition, suitable for business website`;

    // Generate image with DALL-E
    const imageResponse = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1792x1024", // Wide format for featured images
      quality: "standard",
      style: style === "artistic" ? "vivid" : "natural",
    });

    const imageUrl = imageResponse.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Generate alt text
    const altTextResponse = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Generate concise, SEO-friendly alt text for images. Keep it under 125 characters and describe the image content accurately.",
        },
        {
          role: "user",
          content: `Generate alt text for a featured image of a blog post about "${keyword}" titled "${title}".`,
        },
      ],
      max_tokens: 50,
    });

    const altText = altTextResponse.choices[0].message.content?.trim() || 
      `Featured image for ${title}`;

    return NextResponse.json({
      success: true,
      data: {
        imageUrl,
        altText,
        prompt: imagePrompt,
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image generation failed" },
      { status: 500 }
    );
  }
}
