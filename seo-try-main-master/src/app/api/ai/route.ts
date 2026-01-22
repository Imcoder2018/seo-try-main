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

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Validate API key for WordPress plugin requests
function validatePluginRequest(request: NextRequest): { valid: boolean; error?: string } {
  const authHeader = request.headers.get("authorization");
  const pluginKey = request.headers.get("x-plugin-key");
  
  // Accept either Bearer token or plugin key
  if (!authHeader && !pluginKey) {
    return { valid: false, error: "Missing authorization" };
  }
  
  // For now, accept any authenticated request from the plugin
  // In production, you'd validate against stored API keys
  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API Key is not configured. Please add OPENAI_API_KEY to your environment variables in Vercel Dashboard." },
        { status: 400 }
      );
    }

    const validation = validatePluginRequest(request);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    switch (action) {
      case "generate_alt_text":
        return await generateAltText(data);
      
      case "generate_meta_description":
        return await generateMetaDescription(data);
      
      case "generate_title":
        return await generateTitle(data);
      
      case "generate_author_bio":
        return await generateAuthorBio(data);
      
      case "generate_testimonial_response":
        return await generateTestimonialResponse(data);
      
      case "generate_faq":
        return await generateFAQ(data);
      
      case "generate_service_area_content":
        return await generateServiceAreaContent(data);
      
      case "generate_llms_txt":
        return await generateLlmsTxt(data);
      
      case "analyze_content":
        return await analyzeContent(data);
      
      case "optimize_content":
        return await optimizeContent(data);
      
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI processing failed", details: String(error) },
      { status: 500 }
    );
  }
}

// Generate alt text for images
async function generateAltText(data: { imageUrl?: string; imageName?: string; pageContext?: string }) {
  const { imageUrl, imageName, pageContext } = data;
  
  const prompt = `Generate a concise, descriptive alt text for an image.
${imageName ? `Image filename: ${imageName}` : ""}
${pageContext ? `Page context: ${pageContext}` : ""}
${imageUrl ? `Image URL: ${imageUrl}` : ""}

Requirements:
- Be descriptive but concise (under 125 characters)
- Include relevant keywords naturally
- Don't start with "Image of" or "Picture of"
- Be specific about what the image shows
- Consider SEO value

Return ONLY the alt text, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
    temperature: 0.7,
  });

  const altText = completion.choices[0]?.message?.content?.trim() || "";
  
  return NextResponse.json({ success: true, altText });
}

// Generate meta description
async function generateMetaDescription(data: { title?: string; content?: string; keywords?: string[] }) {
  const { title, content, keywords } = data;
  
  const prompt = `Generate an SEO-optimized meta description for a webpage.

Title: ${title || "Unknown"}
Content summary: ${content?.substring(0, 500) || "No content provided"}
Target keywords: ${keywords?.join(", ") || "Not specified"}

Requirements:
- Between 150-160 characters
- Include primary keyword naturally
- Include a call-to-action
- Be compelling and click-worthy
- Accurately describe the page content

Return ONLY the meta description, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
    temperature: 0.7,
  });

  const metaDescription = completion.choices[0]?.message?.content?.trim() || "";
  
  return NextResponse.json({ success: true, metaDescription });
}

// Generate page title
async function generateTitle(data: { content?: string; keywords?: string[]; businessName?: string }) {
  const { content, keywords, businessName } = data;
  
  const prompt = `Generate an SEO-optimized page title.

Content summary: ${content?.substring(0, 300) || "No content provided"}
Target keywords: ${keywords?.join(", ") || "Not specified"}
Business name: ${businessName || ""}

Requirements:
- Between 50-60 characters
- Include primary keyword near the beginning
- Include business name if relevant
- Be compelling and descriptive
- Use power words when appropriate

Return ONLY the title, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 80,
    temperature: 0.7,
  });

  const title = completion.choices[0]?.message?.content?.trim() || "";
  
  return NextResponse.json({ success: true, title });
}

// Generate author bio
async function generateAuthorBio(data: { 
  name: string; 
  role?: string; 
  credentials?: string[]; 
  businessType?: string;
  yearsExperience?: number;
}) {
  const { name, role, credentials, businessType, yearsExperience } = data;
  
  const prompt = `Generate a professional author bio for E-E-A-T optimization.

Name: ${name}
Role: ${role || "Business Owner"}
Credentials: ${credentials?.join(", ") || "Not specified"}
Business type: ${businessType || "Local business"}
Years of experience: ${yearsExperience || "Several"}

Requirements:
- 2-3 sentences
- Highlight expertise and experience
- Include credentials naturally
- Establish trust and authority
- Professional but approachable tone

Return ONLY the bio, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  const bio = completion.choices[0]?.message?.content?.trim() || "";
  
  return NextResponse.json({ success: true, bio });
}

// Generate response to testimonial
async function generateTestimonialResponse(data: { 
  reviewText: string; 
  rating: number; 
  businessName: string;
}) {
  const { reviewText, rating, businessName } = data;
  
  const prompt = `Generate a professional response to a customer review.

Review: "${reviewText}"
Rating: ${rating}/5 stars
Business: ${businessName}

Requirements:
- Thank the customer by name if mentioned
- Address specific points from the review
- Be genuine and personalized
- Keep it brief (2-3 sentences)
- If negative, be empathetic and offer resolution

Return ONLY the response, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content?.trim() || "";
  
  return NextResponse.json({ success: true, response });
}

// Generate FAQ content
async function generateFAQ(data: { 
  businessType: string; 
  services?: string[]; 
  location?: string;
  count?: number;
}) {
  const { businessType, services, location, count = 5 } = data;
  
  const prompt = `Generate ${count} FAQ questions and answers for a local business.

Business type: ${businessType}
Services: ${services?.join(", ") || "General services"}
Location: ${location || "Local area"}

Requirements:
- Questions should be what customers actually ask
- Include "near me" and local intent questions
- Answers should be 2-3 sentences
- Be helpful and informative
- Include service-specific questions

Return as JSON array:
[{"question": "...", "answer": "..."}, ...]`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content?.trim() || "[]";
  
  try {
    const faqs = JSON.parse(content);
    return NextResponse.json({ success: true, faqs });
  } catch {
    return NextResponse.json({ success: true, faqs: [], raw: content });
  }
}

// Generate service area page content
async function generateServiceAreaContent(data: { 
  service: string; 
  location: string; 
  businessName: string;
  phone?: string;
}) {
  const { service, location, businessName, phone } = data;
  
  const prompt = `Generate SEO-optimized content for a service area page.

Service: ${service}
Location: ${location}
Business: ${businessName}
Phone: ${phone || ""}

Generate:
1. Page title (50-60 chars)
2. Meta description (150-160 chars)
3. H1 heading
4. Introduction paragraph (100-150 words)
5. 3 benefits of choosing this service in this location
6. Call-to-action text

Return as JSON:
{
  "title": "...",
  "metaDescription": "...",
  "h1": "...",
  "intro": "...",
  "benefits": ["...", "...", "..."],
  "cta": "..."
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content?.trim() || "{}";
  
  try {
    const pageContent = JSON.parse(content);
    return NextResponse.json({ success: true, content: pageContent });
  } catch {
    return NextResponse.json({ success: true, content: {}, raw: content });
  }
}

// Generate llms.txt content
async function generateLlmsTxt(data: { 
  businessName: string; 
  businessType: string;
  services?: string[];
  location?: string;
  description?: string;
}) {
  const { businessName, businessType, services, location, description } = data;
  
  const prompt = `Generate an llms.txt file content for AI crawlers.

Business: ${businessName}
Type: ${businessType}
Services: ${services?.join(", ") || "Various services"}
Location: ${location || "Local area"}
Description: ${description || ""}

The llms.txt format helps AI understand your business. Generate content that:
- Clearly describes the business
- Lists key services
- Mentions location and service areas
- Includes contact information placeholder
- Is concise but comprehensive

Return the content in llms.txt format.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  });

  const llmsTxt = completion.choices[0]?.message?.content?.trim() || "";
  
  return NextResponse.json({ success: true, llmsTxt });
}

// Analyze content for SEO improvements
async function analyzeContent(data: { content: string; targetKeywords?: string[] }) {
  const { content, targetKeywords } = data;
  
  const prompt = `Analyze this content for SEO and provide specific improvements.

Content: "${content.substring(0, 2000)}"
Target keywords: ${targetKeywords?.join(", ") || "Not specified"}

Analyze:
1. Keyword usage and density
2. Readability
3. Structure (headings, paragraphs)
4. Call-to-action presence
5. Local SEO signals

Return as JSON:
{
  "score": 0-100,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "keywordDensity": {"keyword": percentage},
  "readabilityScore": "easy|medium|hard"
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.5,
  });

  const result = completion.choices[0]?.message?.content?.trim() || "{}";
  
  try {
    const analysis = JSON.parse(result);
    return NextResponse.json({ success: true, analysis });
  } catch {
    return NextResponse.json({ success: true, analysis: {}, raw: result });
  }
}

// Optimize content with AI suggestions
async function optimizeContent(data: { 
  content: string; 
  targetKeywords?: string[];
  tone?: string;
}) {
  const { content, targetKeywords, tone = "professional" } = data;
  
  const prompt = `Optimize this content for SEO while maintaining readability.

Original content: "${content.substring(0, 1500)}"
Target keywords: ${targetKeywords?.join(", ") || "Not specified"}
Tone: ${tone}

Requirements:
- Naturally incorporate target keywords
- Improve readability
- Add local SEO signals if appropriate
- Maintain the original meaning
- Keep approximately the same length

Return ONLY the optimized content, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.7,
  });

  const optimizedContent = completion.choices[0]?.message?.content?.trim() || "";
  
  return NextResponse.json({ success: true, optimizedContent });
}
