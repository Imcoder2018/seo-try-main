import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { 
      selectedService, 
      locations, 
      existingContent, 
      brandTone, 
      targetAudience,
      aboutSummary 
    } = body;

    if (!selectedService) {
      return NextResponse.json(
        { error: "Selected service is required" },
        { status: 400 }
      );
    }

    console.log("[AI Topics] Generating topics for service:", selectedService);

    // Create comprehensive prompt for topic generation
    const prompt = `You are a content strategy expert for a technology company. 

Company Context:
- Service: ${selectedService}
- About: ${aboutSummary}
- Brand Tone: ${brandTone}
- Target Audience: ${targetAudience}
- Existing Content: ${existingContent?.map((p: any) => p.title).join(', ') || 'None'}
- Target Locations: ${locations?.join(', ') || 'Not specified'}

Generate 8-10 high-quality blog post and landing page topics that will:
1. Target the ${targetAudience} audience
2. Incorporate the ${selectedService} service
3. Have SEO potential with specific keywords
4. Be location-specific where relevant
5. Fill gaps in existing content
6. Match the ${brandTone} brand tone

For each topic, provide:
- A compelling title (60-70 characters max)
- Primary keywords (3-5)
- Secondary keywords (5-8)
- Target locations (if applicable)
- Content type (blog post or landing page)
- Brief description (1-2 sentences)
- Search intent (informational, commercial, local)

Return ONLY a valid JSON object with this structure:
{
  "topics": [
    {
      "title": "Topic Title",
      "primaryKeywords": ["keyword1", "keyword2", "keyword3"],
      "secondaryKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
      "targetLocations": ["Location1", "Location2"],
      "contentType": "blog post",
      "description": "Brief description of the topic",
      "searchIntent": "informational",
      "estimatedWordCount": 1200,
      "difficulty": "medium"
    }
  ]
}`;

    const result = await generateText({
      model: openai('gpt-4-turbo'),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    console.log("[AI Topics] Generated response length:", result.text.length);

    // Parse the JSON response
    let topicsData;
    try {
      topicsData = JSON.parse(result.text);
    } catch (parseError) {
      console.error("[AI Topics] JSON parse error:", parseError);
      console.log("[AI Topics] Raw response:", result.text);
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!topicsData.topics || !Array.isArray(topicsData.topics)) {
      throw new Error("Invalid response structure from AI");
    }

    console.log("[AI Topics] Generated", topicsData.topics.length, "topics");

    return NextResponse.json({
      success: true,
      topics: topicsData.topics,
      service: selectedService,
    });
  } catch (error) {
    console.error("[AI Topics] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate topics", details: String(error) },
      { status: 500 }
    );
  }
}
