import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { title, style = "minimalist corporate vector art", tone } = await req.json();

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

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Build prompt based on tone/style
    let stylePrompt = style;
    if (tone) {
      if (tone.includes("Professional") || tone.includes("Technical")) {
        stylePrompt = "professional, clean, corporate vector art with blue and gray color palette";
      } else if (tone.includes("Casual") || tone.includes("Friendly")) {
        stylePrompt = "modern, friendly, colorful illustration with warm tones";
      } else if (tone.includes("Authoritative") || tone.includes("Expert")) {
        stylePrompt = "authoritative, sophisticated, minimalist design with bold colors";
      }
    }

    const prompt = `Create a featured image for a blog post titled "${title}". Style: ${stylePrompt}. No text in the image. Clean, professional design suitable for business content.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data || response.data.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    return NextResponse.json({ 
      url: imageUrl,
      revisedPrompt: revisedPrompt
    });
  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "Image generation failed";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
