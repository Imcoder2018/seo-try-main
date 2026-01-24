# Project Codebase: seo-try-main-master

## 1. Project Structure

```text
.
├── src/app/api/ai/route.ts
                    ├── route.ts
                    ├── route.ts
            ├── report-actions.tsx
            ├── report-header.tsx
            ├── wordpress-connect.tsx
```

## 2. File Contents

### src/app/api/ai/route.ts

```typescript
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

```

---

### src\app\api\report\pdf\route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";

interface AuditData {
  domain?: string;
  overallScore?: number;
  overallGrade?: string;
  crawlType?: string;
  pagesScanned?: number;
  createdAt?: string;
  localSeoScore?: number;
  seoScore?: number;
  linksScore?: number;
  usabilityScore?: number;
  performanceScore?: number;
  socialScore?: number;
  contentScore?: number;
  eeatScore?: number;
  technologyScore?: number;
  passedChecks?: number;
  warningChecks?: number;
  failedChecks?: number;
  recommendations?: Array<{
    title: string;
    category: string;
    priority: string;
    description?: string;
  }>;
}

// Color utilities
const COLORS = {
  primary: [79, 70, 229] as [number, number, number],
  primaryLight: [99, 102, 241] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  darkAlt: [30, 41, 59] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  grayLight: [243, 244, 246] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
};

function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return COLORS.green;
  if (score >= 60) return COLORS.amber;
  return COLORS.red;
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

function getPriorityColor(priority: string): [number, number, number] {
  switch (priority.toLowerCase()) {
    case "high": return COLORS.red;
    case "medium": return COLORS.amber;
    default: return [59, 130, 246];
  }
}

function drawSectionHeader(doc: jsPDF, pageWidth: number, title: string, subtitle: string, sectionNum: number) {
  // Dark header
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  // Accent line
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 40, pageWidth, 3, "F");
  
  // Section badge
  doc.setFillColor(...COLORS.primary);
  doc.circle(25, 20, 10, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(String(sectionNum), 25, 24, { align: "center" });
  
  // Title
  doc.setFontSize(16);
  doc.text(title, 45, 18);
  
  // Subtitle
  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 45, 30);
}

export async function POST(request: NextRequest) {
  try {
    console.log("[PDF API] Starting PDF generation");
    const body = await request.json();
    const auditData: AuditData = body.auditData;
    
    console.log("[PDF API] Audit data received:", JSON.stringify(auditData, null, 2).substring(0, 500));

    if (!auditData) {
      console.error("[PDF API] No audit data provided");
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Extract domain properly
    const domain = auditData.domain || "Website";
    const overallScore = auditData.overallScore ?? 0;
    const [r, g, b] = getScoreColor(overallScore);
    const grade = auditData.overallGrade || (overallScore >= 80 ? "A" : overallScore >= 60 ? "B" : overallScore >= 40 ? "C" : "D");
    const createdDate = auditData.createdAt ? new Date(auditData.createdAt) : new Date();
    
    // Calculate stats from recommendations or use provided
    const passedCount = auditData.passedChecks ?? Math.round(overallScore / 10);
    const warningCount = auditData.warningChecks ?? Math.round((100 - overallScore) / 25);
    const failedCount = auditData.failedChecks ?? (auditData.recommendations?.filter(r => r.priority === 'high').length ?? 0);

    // ==================== COVER PAGE ====================
    // Dark gradient background
    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    
    // Top accent bar
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 5, "F");
    
    // Bottom accent bar  
    doc.setFillColor(79, 70, 229);
    doc.rect(0, pageHeight - 5, pageWidth, 5, "F");

    // Logo circle
    doc.setFillColor(79, 70, 229);
    doc.circle(pageWidth / 2, 50, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SEO", pageWidth / 2, 47, { align: "center" });
    doc.setFontSize(10);
    doc.text("AUDIT", pageWidth / 2, 58, { align: "center" });

    // Main title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Website SEO", pageWidth / 2, 100, { align: "center" });
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241);
    doc.text("Health Report", pageWidth / 2, 115, { align: "center" });

    // Domain box
    doc.setFillColor(31, 41, 55);
    doc.roundedRect(30, 130, pageWidth - 60, 20, 4, 4, "F");
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(domain, pageWidth / 2, 143, { align: "center" });

    // Score circle - outer ring
    doc.setFillColor(r, g, b);
    doc.circle(pageWidth / 2, 195, 40, "F");
    // Inner dark circle
    doc.setFillColor(17, 24, 39);
    doc.circle(pageWidth / 2, 195, 32, "F");
    // Score text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(String(overallScore), pageWidth / 2, 200, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text("out of 100", pageWidth / 2, 212, { align: "center" });

    // Grade badge
    doc.setFillColor(r, g, b);
    doc.roundedRect(pageWidth / 2 - 20, 230, 40, 18, 9, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grade ${grade}`, pageWidth / 2, 242, { align: "center" });

    // Stats boxes
    const boxWidth = 50;
    const boxGap = 10;
    const totalWidth = boxWidth * 3 + boxGap * 2;
    const startX = (pageWidth - totalWidth) / 2;
    const statsY = 265;

    // Passed box
    doc.setFillColor(22, 163, 74);
    doc.roundedRect(startX, statsY, boxWidth, 40, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(String(passedCount), startX + boxWidth / 2, statsY + 18, { align: "center" });
    doc.setFontSize(8);
    doc.text("PASSED", startX + boxWidth / 2, statsY + 32, { align: "center" });

    // Warnings box
    doc.setFillColor(217, 119, 6);
    doc.roundedRect(startX + boxWidth + boxGap, statsY, boxWidth, 40, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(String(warningCount), startX + boxWidth + boxGap + boxWidth / 2, statsY + 18, { align: "center" });
    doc.setFontSize(8);
    doc.text("WARNINGS", startX + boxWidth + boxGap + boxWidth / 2, statsY + 32, { align: "center" });

    // Issues box
    doc.setFillColor(220, 38, 38);
    doc.roundedRect(startX + (boxWidth + boxGap) * 2, statsY, boxWidth, 40, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(String(failedCount), startX + (boxWidth + boxGap) * 2 + boxWidth / 2, statsY + 18, { align: "center" });
    doc.setFontSize(8);
    doc.text("ISSUES", startX + (boxWidth + boxGap) * 2 + boxWidth / 2, statsY + 32, { align: "center" });

    // Metadata
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const crawlText = auditData.crawlType ? `${auditData.crawlType} Audit` : "SEO Audit";
    const pagesText = auditData.pagesScanned ? ` | ${auditData.pagesScanned} pages` : "";
    doc.text(`${crawlText}${pagesText}`, pageWidth / 2, 325, { align: "center" });
    doc.text(`Generated: ${createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 338, { align: "center" });

    // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
    doc.addPage();
    drawSectionHeader(doc, pageWidth, "Executive Summary", `Performance analysis for ${domain}`, 1);
    
    let yPos = 58;

    // Score overview card
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(15, yPos, pageWidth - 30, 50, 4, 4, "F");
    
    // Score circle in card
    doc.setFillColor(r, g, b);
    doc.circle(45, yPos + 25, 18, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(45, yPos + 25, 14, "F");
    doc.setTextColor(r, g, b);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(String(overallScore), 45, yPos + 29, { align: "center" });

    // Grade box
    doc.setFillColor(r, g, b);
    doc.roundedRect(75, yPos + 12, 30, 18, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(grade, 90, yPos + 24, { align: "center" });
    
    // Label
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(getScoreLabel(overallScore), 90, yPos + 38, { align: "center" });

    // Metrics row
    const metricsData = [
      { label: "Pages", value: auditData.pagesScanned ? String(auditData.pagesScanned) : "N/A" },
      { label: "Type", value: auditData.crawlType || "Quick" },
      { label: "Date", value: createdDate.toLocaleDateString() },
    ];
    
    let metricX = 120;
    metricsData.forEach(m => {
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.text(m.label, metricX, yPos + 15);
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(m.value, metricX, yPos + 26);
      doc.setFont("helvetica", "normal");
      metricX += 30;
    });

    yPos += 60;

    // Key insights box
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(15, yPos, pageWidth - 30, 35, 4, 4, "F");
    doc.setFillColor(59, 130, 246);
    doc.circle(30, yPos + 17, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("i", 30, yPos + 21, { align: "center" });
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(11);
    doc.text("Key Insights", 45, yPos + 12);
    
    const insightText = overallScore >= 80 
      ? "Excellent SEO health! Focus on maintaining current practices and addressing minor improvements."
      : overallScore >= 60 
      ? "Good foundation with room for growth. Address high-priority issues for best results."
      : "Significant improvements needed. Start with critical issues to boost visibility.";
    
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const insightLines = doc.splitTextToSize(insightText, pageWidth - 60);
    doc.text(insightLines, 45, yPos + 24);

    yPos += 45;

    // Category performance header
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(15, yPos, pageWidth - 30, 12, 2, 2, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Performance by Category", 20, yPos + 8);
    
    yPos += 18;

    // Categories list
    const categories = [
      ...(auditData.localSeoScore !== null && auditData.localSeoScore !== undefined ? [{ name: "Local SEO", score: auditData.localSeoScore }] : []),
      { name: "On-Page SEO", score: auditData.seoScore ?? 0 },
      { name: "Links", score: auditData.linksScore ?? 0 },
      { name: "Usability", score: auditData.usabilityScore ?? 0 },
      { name: "Performance", score: auditData.performanceScore ?? 0 },
      { name: "Social", score: auditData.socialScore ?? 0 },
      ...(auditData.contentScore !== null && auditData.contentScore !== undefined ? [{ name: "Content Quality", score: auditData.contentScore }] : []),
      ...(auditData.eeatScore !== null && auditData.eeatScore !== undefined ? [{ name: "E-E-A-T", score: auditData.eeatScore }] : []),
      ...(auditData.technologyScore !== null && auditData.technologyScore !== undefined ? [{ name: "Technology", score: auditData.technologyScore }] : []),
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    categories.forEach((cat, index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, yPos - 2, pageWidth - 30, 14, "F");
      } else {
        doc.setFillColor(241, 245, 249);
        doc.rect(15, yPos - 2, pageWidth - 30, 14, "F");
      }

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(cat.name, 25, yPos + 6);

      doc.setFillColor(226, 232, 240);
      doc.roundedRect(100, yPos + 1, 80, 6, 2, 2, "F");
      const [cr, cg, cb] = getScoreColor(cat.score);
      doc.setFillColor(cr, cg, cb);
      const barWidth = Math.max((cat.score / 100) * 80, 4);
      doc.roundedRect(100, yPos + 1, barWidth, 6, 2, 2, "F");

      doc.setFillColor(cr, cg, cb);
      doc.circle(193, yPos + 5, 7, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${cat.score}`, 193, yPos + 8, { align: "center" });

      yPos += 14;
    });

    // ==================== PAGE 3: RECOMMENDATIONS ====================
    if (auditData.recommendations && auditData.recommendations.length > 0) {
      doc.addPage();
      drawSectionHeader(doc, pageWidth, "Actionable Recommendations", `${auditData.recommendations.length} prioritized improvements for ${domain}`, 2);
      
      yPos = 58;

      const highPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "high");
      const mediumPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "medium");
      const lowPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "low");

      const printRecommendations = (recs: typeof auditData.recommendations, label: string) => {
        if (recs.length === 0) return;

        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 20;
        }

        const [pr, pg, pb] = getPriorityColor(label);
        doc.setFillColor(pr, pg, pb);
        doc.roundedRect(15, yPos - 5, pageWidth - 30, 16, 3, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${label.toUpperCase()} PRIORITY`, 25, yPos + 7);

        doc.setFillColor(255, 255, 255, 0.25);
        doc.roundedRect(pageWidth - 55, yPos - 2, 30, 12, 2, 2, "F");
        doc.setFontSize(10);
        doc.text(`${recs.length} items`, pageWidth - 40, yPos + 5, { align: "center" });

        yPos += 22;

        recs.slice(0, 6).forEach((rec, idx) => {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFillColor(0, 0, 0, 0.04);
          doc.roundedRect(22, yPos, pageWidth - 44, 26, 3, 3, "F");

          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(20, yPos - 2, pageWidth - 40, 26, 3, 3, "FD");

          doc.setFillColor(pr, pg, pb, 0.3);
          doc.circle(40, yPos + 11, 10, "F");
          doc.setFillColor(pr, pg, pb);
          doc.circle(40, yPos + 11, 8, "F");
          doc.setFillColor(255, 255, 255, 0.2);
          doc.circle(40, yPos + 11, 6, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`${idx + 1}`, 40, yPos + 15, { align: "center" });

          doc.setTextColor(15, 23, 42);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          const titleLines = doc.splitTextToSize(rec.title, pageWidth - 85);
          doc.text(titleLines[0], 58, yPos + 6);

          doc.setFillColor(241, 245, 249);
          doc.roundedRect(58, yPos + 13, 38, 7, 2, 2, "F");
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.text(rec.category.toUpperCase(), 77, yPos + 18, { align: "center" });

          doc.setFillColor(pr, pg, pb);
          doc.circle(pageWidth - 45, yPos + 11, 5, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(6);
          doc.text("!", pageWidth - 45, yPos + 13, { align: "center" });

          yPos += 30;
        });

        yPos += 12;
      };

      printRecommendations(highPriority, "High");
      printRecommendations(mediumPriority, "Medium");
      printRecommendations(lowPriority, "Low");
    }

    // ==================== FOOTER ON ALL PAGES ====================
    const pageCount = doc.getNumberOfPages();
    const footerDate = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer background
      doc.setFillColor(17, 24, 39);
      doc.rect(0, pageHeight - 25, pageWidth, 25, "F");
      
      // Accent line
      doc.setFillColor(79, 70, 229);
      doc.rect(0, pageHeight - 25, pageWidth, 2, "F");

      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(domain, 15, pageHeight - 10);
      
      doc.text(
        `Generated ${footerDate} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(
        "SEO Audit Tool - Professional SEO Analysis",
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    }

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${auditData.domain || "report"}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[PDF API] PDF generation error:", error);
    console.error("[PDF API] Error stack:", error instanceof Error ? error.stack : "No stack available");
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error) },
      { status: 500 }
    );
  }
}

```

---

### src\app\api\report\voice\route.ts

```typescript
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

```

---

### src\components\report\report-actions.tsx

```typescript
"use client";

import { useState } from "react";
import { FileText, Volume2, Download, Loader2, Play, Pause, Sparkles } from "lucide-react";

interface ReportActionsProps {
  auditData: Record<string, unknown>;
}

export function ReportActions({ auditData }: ReportActionsProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Compute check counts from audit data
  const computeCheckCounts = () => {
    const data = auditData as Record<string, unknown>;
    let passed = 0, warnings = 0, failed = 0;
    
    // Count from category results if available
    const categories = ['localSeo', 'seo', 'links', 'usability', 'performance', 'social', 'content', 'eeat', 'technology'];
    categories.forEach(cat => {
      const catData = data[cat] as { checks?: Array<{ status?: string }> } | undefined;
      if (catData?.checks) {
        catData.checks.forEach((check: { status?: string }) => {
          if (check.status === 'passed' || check.status === 'good') passed++;
          else if (check.status === 'warning' || check.status === 'moderate') warnings++;
          else if (check.status === 'failed' || check.status === 'poor' || check.status === 'error') failed++;
        });
      }
    });
    
    // Fallback: estimate from scores if no check data
    if (passed === 0 && warnings === 0 && failed === 0) {
      const score = (data.overallScore as number) || 50;
      passed = Math.round(score / 10);
      warnings = Math.round((100 - score) / 20);
      failed = Math.round((100 - score) / 15);
    }
    
    return { passed, warnings, failed };
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const counts = computeCheckCounts();
      const enrichedData = {
        ...auditData,
        passedChecks: counts.passed,
        warningChecks: counts.warnings,
        failedChecks: counts.failed,
      };
      
      const response = await fetch("/api/report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditData: enrichedData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("PDF API error:", response.status, errorText);
        throw new Error(`Failed to generate PDF (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seo-audit-${(auditData as { domain?: string }).domain || "report"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to generate PDF: ${errorMessage}. Please try again.`);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleGenerateVoice = async () => {
    setVoiceLoading(true);
    try {
      const response = await fetch("/api/report/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditData, voice: "nova" }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate voice summary");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      // Create and play audio
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Voice generation error:", error);
      alert("Failed to generate voice summary. Please ensure OpenAI API key is configured.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `seo-audit-summary-${(auditData as { domain?: string }).domain || "report"}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden mb-8 shadow-lg">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5"></div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Export & Share</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Download or share your audit results</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* PDF Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 font-medium"
          >
            {pdfLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            {pdfLoading ? "Generating PDF..." : "Download PDF Report"}
          </button>

          {/* Voice Summary */}
          {!audioUrl ? (
            <button
              onClick={handleGenerateVoice}
              disabled={voiceLoading}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 font-medium"
            >
              {voiceLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
              {voiceLoading ? "Generating..." : "AI Voice Summary"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg font-medium"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                {isPlaying ? "Pause" : "Play Summary"}
              </button>
              <button
                onClick={downloadAudio}
                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors shadow-lg"
                title="Download Audio"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-5 flex items-center gap-2">
          <span className="text-lg">📄</span>
          Download a branded PDF report or listen to an AI-generated voice summary of your audit results.
        </p>
      </div>
    </div>
  );
}

```

---

### src\components\report\report-header.tsx

```typescript
import { ScoreRing } from "./score-ring";
import { getGradeColor } from "@/lib/utils";
import { Globe, Calendar, TrendingUp, TrendingDown, Minus, Award, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ReportHeaderProps {
  domain: string;
  score: number;
  grade: string;
  createdAt: string;
  pagesScanned?: number;
  crawlType?: string;
}

export function ReportHeader({ domain, score, grade, createdAt, pagesScanned, crawlType }: ReportHeaderProps) {
  const gradeColor = getGradeColor(grade);
  const { message, icon: StatusIcon, bgClass, borderClass } = getScoreInfo(score);

  return (
    <div className={`relative overflow-hidden rounded-2xl mb-8 ${bgClass} ${borderClass} border-2`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-24 -mb-24" />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Ring */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
            <ScoreRing score={score} grade={grade} size="lg" />
          </div>
          
          {/* Info Section */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">SEO Audit Report</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-slate-100">
              {domain}
            </h1>
            
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <StatusIcon className={`w-6 h-6 ${gradeColor}`} />
              <p className={`text-xl font-semibold ${gradeColor}`}>{message}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>{new Date(createdAt).toLocaleString()}</span>
              </div>
              {crawlType && (
                <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span>{crawlType} Audit</span>
                </div>
              )}
              {pagesScanned && pagesScanned > 1 && (
                <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                  <Award className="w-4 h-4" />
                  <span>{pagesScanned} pages analyzed</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex-shrink-0 hidden xl:block">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
                  {score}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Overall Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function getScoreInfo(score: number): { message: string; icon: typeof CheckCircle2; bgClass: string; borderClass: string } {
  if (score >= 90) return { 
    message: "Excellent! Your site is well optimized", 
    icon: CheckCircle2,
    bgClass: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    borderClass: "border-green-200 dark:border-green-800"
  };
  if (score >= 80) return { 
    message: "Very good! Minor improvements possible", 
    icon: CheckCircle2,
    bgClass: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    borderClass: "border-blue-200 dark:border-blue-800"
  };
  if (score >= 70) return { 
    message: "Good foundation with room to improve", 
    icon: TrendingUp,
    bgClass: "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30",
    borderClass: "border-sky-200 dark:border-sky-800"
  };
  if (score >= 60) return { 
    message: "Needs improvement in several areas", 
    icon: Minus,
    bgClass: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
    borderClass: "border-amber-200 dark:border-amber-800"
  };
  if (score >= 50) return { 
    message: "Significant work needed", 
    icon: TrendingDown,
    bgClass: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
    borderClass: "border-orange-200 dark:border-orange-800"
  };
  return { 
    message: "Critical issues require immediate attention", 
    icon: AlertTriangle,
    bgClass: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
    borderClass: "border-red-200 dark:border-red-800"
  };
}

```

---

### src\components\report\wordpress-connect.tsx

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check, Loader2, Plug, Zap, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

interface WordPressConnection {
  siteUrl: string;
  apiKey: string;
  connected: boolean;
  siteName?: string;
}

interface FixResult {
  success: boolean;
  message?: string;
  fixed?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface WordPressConnectProps {
  domain: string;
  onConnectionChange?: (connected: boolean) => void;
}

export function WordPressConnect({ domain, onConnectionChange }: WordPressConnectProps) {
  const [showModal, setShowModal] = useState(false);
  const [connection, setConnection] = useState<WordPressConnection | null>(null);
  const [siteUrl, setSiteUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [connectMode, setConnectMode] = useState<"manual" | "auto" | "fix">("manual");
  const [handshakeStatus, setHandshakeStatus] = useState<"idle" | "pending" | "approved" | "error">("idle");
  const [connectToken, setConnectToken] = useState("");
  const [authUrl, setAuthUrl] = useState("");

  // Load saved connection - use global key for WordPress connection
  // WordPress site is independent of the audited domain
  useEffect(() => {
    // Try global connection first, then domain-specific for backward compatibility
    const globalSaved = localStorage.getItem('wp_connection_global');
    const domainSaved = localStorage.getItem(`wp_connection_${domain}`);
    const saved = globalSaved || domainSaved;
    
    if (saved) {
      const conn = JSON.parse(saved);
      setConnection(conn);
      onConnectionChange?.(conn.connected);
      
      // Migrate to global key if using domain-specific
      if (!globalSaved && domainSaved) {
        localStorage.setItem('wp_connection_global', domainSaved);
      }
    }
  }, [domain, onConnectionChange]);

  // Poll for handshake approval
  useEffect(() => {
    if (handshakeStatus !== "pending" || !connectToken || !siteUrl) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/wordpress?action=handshake_status&site_url=${encodeURIComponent(siteUrl)}&connect_token=${connectToken}`
        );
        const data = await response.json();

        if (data.status === "approved") {
          setHandshakeStatus("approved");
          
          // First try to get API key from status response (plugin v5+ includes it)
          let apiKey = data.api_key || data.apiKey;
          let siteName = data.site_name || data.siteName;
          let returnedSiteUrl = data.site_url || data.siteUrl || siteUrl;
          
          // If not in status, complete the handshake to get API key
          if (!apiKey) {
            const completeResponse = await fetch("/api/wordpress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                site_url: siteUrl,
                action: "handshake_complete",
                options: { connect_token: connectToken },
              }),
            });
            const completeData = await completeResponse.json();
            console.log("[WP Connect] Handshake complete response:", completeData);

            // Handle various response formats from the plugin
            apiKey = completeData.api_key || completeData.apiKey || completeData.key;
            siteName = completeData.site_name || completeData.siteName || completeData.name || siteName;
            returnedSiteUrl = completeData.site_url || completeData.siteUrl || returnedSiteUrl;
          }
          
          console.log("[WP Connect] Extracted API key:", apiKey ? 'present (length: ' + apiKey.length + ')' : 'missing');
          
          if (apiKey && apiKey.length >= 20) {
            const conn: WordPressConnection = {
              siteUrl: returnedSiteUrl,
              apiKey: apiKey, // Use the actual API key from plugin
              connected: true,
              siteName: siteName || returnedSiteUrl,
            };
            // Save to global key so it works across all audited domains
            localStorage.setItem('wp_connection_global', JSON.stringify(conn));
            console.log("[WP Connect] Connection saved with real API key");
            setConnection(conn);
            onConnectionChange?.(true);
            setShowModal(false);
            setHandshakeStatus("idle");
          } else {
            // DO NOT use connectToken as fallback - it won't work for authentication
            console.error("[WP Connect] Failed to get valid API key from plugin");
            setHandshakeStatus("error");
            setError("Connection approved but failed to retrieve API key. Please use Manual Setup with the API key from WordPress admin → SEO AutoFix → API / Connect.");
          }
        }
      } catch {
        // Continue polling
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [handshakeStatus, connectToken, siteUrl, domain, onConnectionChange]);

  const handleAutoConnect = async () => {
    if (!siteUrl) {
      setError("Please enter your WordPress site URL");
      return;
    }

    setConnecting(true);
    setError("");

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          action: "handshake_init",
        }),
      });
      const data = await response.json();

      // Handle both auth_url and approval_url for compatibility
      const authUrlFromResponse = data.auth_url || data.approval_url;
      const tokenFromResponse = data.connect_token || data.token;
      
      if (data.success && authUrlFromResponse) {
        setConnectToken(tokenFromResponse);
        setAuthUrl(authUrlFromResponse);
        setHandshakeStatus("pending");
        // Open WordPress admin in new tab
        window.open(authUrlFromResponse, "_blank");
      } else {
        // Show detailed error message
        const errorMsg = data.error || "Failed to initiate connection";
        const details = data.details ? ` (${data.details.substring(0, 100)})` : "";
        setError(`${errorMsg}${details}`);
      }
    } catch (err) {
      setError(`Connection failed: ${err instanceof Error ? err.message : "Make sure SEO AutoFix Pro plugin is installed and activated on your WordPress site."}`);
    } finally {
      setConnecting(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/wordpress?site_url=${encodeURIComponent(siteUrl)}&api_key=${encodeURIComponent(apiKey)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to connect");
        return;
      }

      const conn: WordPressConnection = {
        siteUrl,
        apiKey,
        connected: true,
        siteName: data.name,
      };

      // Save to global key so it works across all audited domains
      localStorage.setItem('wp_connection_global', JSON.stringify(conn));
      setConnection(conn);
      onConnectionChange?.(true);
      setShowModal(false);
    } catch {
      setError("Connection failed. Check your credentials.");
    } finally {
      setConnecting(false);
    }
  };

  const handleFixApiKey = async () => {
    setConnecting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/wordpress?site_url=${encodeURIComponent(siteUrl)}&api_key=${encodeURIComponent(apiKey)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to verify API key");
        return;
      }

      const conn: WordPressConnection = {
        siteUrl,
        apiKey,
        connected: true,
        siteName: data.name,
      };

      // Save to global key so it works across all audited domains
      localStorage.setItem('wp_connection_global', JSON.stringify(conn));
      setConnection(conn);
      onConnectionChange?.(true);
      setShowModal(false);
      console.log("[WP Connect] API key updated successfully");
    } catch {
      setError("API key verification failed. Check the key and try again.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    // Remove both global and domain-specific keys
    localStorage.removeItem('wp_connection_global');
    localStorage.removeItem(`wp_connection_${domain}`);
    setConnection(null);
    onConnectionChange?.(false);
  };

  return (
    <>
      {connection?.connected ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-green-800 dark:text-green-200">
                  ✅ WordPress Connected
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {connection.siteName || connection.siteUrl}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto flex-wrap">
              <span className="px-3 py-1.5 bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full flex items-center gap-1.5 border border-green-200 dark:border-green-700">
                <Zap className="h-4 w-4" />
                Auto-Fix Ready
              </span>
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-500 border border-blue-300 dark:border-blue-700 rounded-lg transition-all flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Fix Connection
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 border border-red-300 dark:border-red-700 rounded-lg transition-all flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Clear Connection
              </button>
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-500 mt-3 bg-green-100/50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
            💡 Auto-fix buttons are now available on each category section and individual issues below.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <Plug className="h-4 w-4" />
          Connect WordPress
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Connect WordPress Site
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setHandshakeStatus("idle");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Connection Mode Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setConnectMode("auto")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  connectMode === "auto"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                🚀 Auto Connect
              </button>
              <button
                onClick={() => setConnectMode("manual")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  connectMode === "manual"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                🔧 Manual Setup
              </button>
              {connection?.connected && (
                <button
                  onClick={() => setConnectMode("fix")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    connectMode === "fix"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 hover:bg-orange-200 text-orange-700"
                  }`}
                >
                  🔑 Fix API Key
                </button>
              )}
            </div>

            <div className="space-y-4">
              {connectMode === "auto" ? (
                <>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      One-Click Connection
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Enter your WordPress URL and click connect. You'll be redirected to approve the connection in your WordPress admin.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      WordPress Site URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {handshakeStatus === "pending" && (
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
                        </div>
                        <div>
                          <span className="font-semibold block">Waiting for Approval</span>
                          <span className="text-sm text-yellow-700 dark:text-yellow-300">Check your WordPress admin panel</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                          A new tab should have opened. If not, click below:
                        </p>
                        <a
                          href={authUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open WordPress Admin
                        </a>
                      </div>
                    </div>
                  )}

                  {handshakeStatus === "approved" && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-green-800 dark:text-green-200">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold block">Connection Successful!</span>
                          <span className="text-sm text-green-700 dark:text-green-300">Your WordPress site is now connected</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAutoConnect}
                    disabled={connecting || !siteUrl || handshakeStatus === "pending"}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : handshakeStatus === "pending" ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Waiting for approval...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Connect Automatically
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Setup Instructions
                    </h3>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                      <li>Install SEO AutoFix Pro plugin on your WordPress site</li>
                      <li>Go to SEO AutoFix → API / Connect</li>
                      <li>Enable Remote API</li>
                      <li>Copy Site URL and API Key below</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      WordPress Site URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Your API key from plugin"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={connecting || !siteUrl || !apiKey}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Connect & Verify
                      </>
                    )}
                  </button>
                </>
              )}
              
              {connectMode === "fix" ? (
                <>
                  <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                      Fix API Key Authentication
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                      If auto-fix buttons are failing, you need to update the API key with the correct one from WordPress admin.
                    </p>
                    <ol className="text-sm text-orange-700 dark:text-orange-300 space-y-1 list-decimal list-inside">
                      <li>Go to WordPress admin: <code className="bg-orange-100 px-1 rounded">https://arialflow.com/wp-admin</code></li>
                      <li>Navigate to <strong>SEO AutoFix → API / Connect</strong></li>
                      <li>Ensure <strong>Remote API</strong> is enabled</li>
                      <li>Copy the <strong>API Key</strong> shown on the page</li>
                      <li>Paste it below and click Update</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      WordPress Site URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://arialflow.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Correct API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Paste the API key from WordPress admin"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleFixApiKey}
                    disabled={connecting || !siteUrl || !apiKey}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Update API Key
                      </>
                    )}
                  </button>
                </>
              ) : null}

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// AI-Powered Fix Button - generates content on website and sends to WordPress
interface AIFixButtonProps {
  domain: string;
  fixType: 'alt_text' | 'meta_description' | 'social';
  label: string;
  onFixed?: (result: FixResult) => void;
}

export function AIFixButton({ domain, fixType, label, onFixed }: AIFixButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [result, setResult] = useState<FixResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleAIFix = async () => {
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) {
      setResult({ success: false, message: "No WordPress connection found" });
      return;
    }

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setResult(null);

    try {
      // Step 1: Fetch pending items from WordPress
      setProgress('Fetching items from WordPress...');
      const pendingRes = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: fixType === 'social' ? 'social_settings' : 'ai_pending',
          options: { type: fixType === 'alt_text' ? 'images' : 'posts' }
        }),
      });
      
      if (!pendingRes.ok) {
        throw new Error('Failed to fetch pending items');
      }
      
      const pendingData = await pendingRes.json();
      console.log('[AIFix] Pending items:', pendingData);

      // Handle social fixes differently
      if (fixType === 'social') {
        setProgress('Configuring social settings...');
        const availableImage = pendingData.available_images?.logo || pendingData.available_images?.featured;
        
        const applyRes = await fetch("/api/wordpress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            site_url: siteUrl,
            api_key: apiKey,
            action: 'social_apply',
            options: {
              enable_og_tags: true,
              enable_twitter_cards: true,
              default_og_image: availableImage || ''
            }
          }),
        });
        
        const applyData = await applyRes.json();
        setResult({
          success: true,
          message: 'Social settings applied',
          fixes_applied: applyData.fixes_applied,
          og_image_set: !!availableImage,
          needs_manual_action: !availableImage ? [{
            issue: 'og_image',
            message: 'No logo or featured image found. Upload a default social image in WordPress Media Library.',
            admin_url: `${siteUrl}/wp-admin/upload.php`
          }] : []
        });
        onFixed?.(applyData);
        return;
      }

      // Step 2: Generate AI content for each item
      const items = fixType === 'alt_text' ? pendingData.images : pendingData.posts;
      if (!items || items.length === 0) {
        setResult({ success: true, message: 'No items need fixing', fixed: 0 });
        return;
      }

      setProgress(`Generating AI content for ${items.length} items...`);
      const generatedItems: Array<{ id: number; alt_text?: string; meta_description?: string }> = [];
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setProgress(`Generating ${i + 1}/${items.length}...`);
        
        try {
          if (fixType === 'alt_text') {
            const aiRes = await fetch("/api/ai", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: 'generate_alt_text',
                data: {
                  imageName: item.filename,
                  pageContext: item.page_context || item.title,
                  imageUrl: item.url
                }
              }),
            });
            const aiData = await aiRes.json();
            if (aiData.altText) {
              generatedItems.push({ id: item.id, alt_text: aiData.altText });
            }
          } else if (fixType === 'meta_description') {
            const aiRes = await fetch("/api/ai", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: 'generate_meta_description',
                data: {
                  title: item.title,
                  content: item.excerpt
                }
              }),
            });
            const aiData = await aiRes.json();
            if (aiData.metaDescription) {
              generatedItems.push({ id: item.id, meta_description: aiData.metaDescription });
            }
          }
        } catch (err) {
          console.error(`[AIFix] Failed to generate for item ${item.id}:`, err);
        }
      }

      // Step 3: Send generated content to WordPress
      setProgress(`Applying ${generatedItems.length} fixes to WordPress...`);
      const applyRes = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: 'ai_apply',
          options: {
            type: fixType,
            items: generatedItems
          }
        }),
      });

      const applyData = await applyRes.json();
      console.log('[AIFix] Apply result:', applyData);

      const remaining = items.length - generatedItems.length;
      setResult({
        success: true,
        message: `Applied ${applyData.applied} AI-generated ${fixType === 'alt_text' ? 'alt texts' : 'meta descriptions'}`,
        fixed: applyData.applied,
        needs_manual_action: remaining > 0 ? [{
          issue: fixType,
          message: `${remaining} items could not be processed. Try running again or fix manually.`,
          admin_url: `${siteUrl}/wp-admin/${fixType === 'alt_text' ? 'upload.php' : 'edit.php'}`
        }] : []
      });
      onFixed?.(applyData);
      
    } catch (error) {
      console.error('[AIFix] Error:', error);
      setResult({ success: false, message: String(error) });
    } finally {
      setFixing(false);
      setProgress('');
    }
  };

  if (result) {
    const needsManual = result.needs_manual_action?.length > 0;
    return (
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            needsManual
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200'
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200'
          }`}
        >
          <Check className="h-4 w-4" />
          <span className="font-medium">{needsManual ? 'Partial' : 'Fixed!'}</span>
          <span className="text-xs opacity-75">({result.fixed || 0} items)</span>
        </button>
        {showDetails && (
          <div className="absolute top-full right-0 mt-1 z-10 p-3 bg-white dark:bg-slate-800 border rounded-lg shadow-lg text-xs max-w-sm">
            <p className="text-green-600 font-medium mb-2">✓ {result.message}</p>
            {needsManual && result.needs_manual_action?.map((action: { issue: string; message: string; admin_url?: string }, i: number) => (
              <div key={i} className="mt-2 text-yellow-600">
                <p>⚠ {action.message}</p>
                {action.admin_url && (
                  <a href={action.admin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px]">
                    Open in WordPress →
                  </a>
                )}
              </div>
            ))}
            <button onClick={() => { setResult(null); handleAIFix(); }} className="mt-2 text-blue-600 hover:underline text-[10px]">
              Run Again
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleAIFix}
      disabled={fixing}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 shadow-sm font-medium"
    >
      {fixing ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {progress || 'Processing...'}
        </>
      ) : (
        <>
          <Zap className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

// Auto-Fix Button Component
interface AutoFixButtonProps {
  domain: string;
  fixType: string;
  label: string;
  checkId?: string;
  onFixed?: (result: FixResult) => void;
}

export function AutoFixButton({ domain, fixType, label, onFixed }: AutoFixButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFix = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) {
      setResult({ success: false, message: "No WordPress connection found" });
      return;
    }

    const { siteUrl, apiKey } = JSON.parse(saved);
    console.log(`[AutoFix] Starting fix: ${fixType}`);
    console.log(`[AutoFix] Site URL: ${siteUrl}`);
    console.log(`[AutoFix] API Key: ${apiKey ? apiKey.substring(0, 8) + '...' : 'missing'}`);
    
    setFixing(true);
    setResult(null);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: fixType,
        }),
      });

      console.log(`[AutoFix] Response status: ${response.status}`);
      const data = await response.json();
      console.log(`[AutoFix] Response data:`, data);
      
      // Handle 401 authentication errors specifically
      if (response.status === 401 || data.error === "Invalid API key") {
        console.error(`[AutoFix] Authentication failed - API key invalid`);
        setResult({ 
          success: false, 
          message: "Authentication failed. Click 'Fix Connection' button above to update your API key from WordPress admin → SEO AutoFix → API / Connect." 
        });
        return;
      }
      
      setResult(data);
      onFixed?.(data);
    } catch (error) {
      console.error(`[AutoFix] Error:`, error);
      setResult({ success: false, message: "Fix failed - check plugin connection" });
    } finally {
      setFixing(false);
    }
  };

  // Extract fix details from result
  const getFixSummary = () => {
    if (!result) return null;
    const items: string[] = [];
    
    // Check various result properties for fix counts
    if (result.fixed) items.push(`${result.fixed} items fixed`);
    if (result.alt_result?.fixed) items.push(`${result.alt_result.fixed} alt texts`);
    if (result.meta_result?.fixed) items.push(`${result.meta_result.fixed} meta descriptions`);
    if (result.content_images_fixed?.fixed) items.push(`${result.content_images_fixed.fixed} content images`);
    if (result.title_optimization?.optimized) items.push(`${result.title_optimization.optimized} titles`);
    if (result.fixes_applied?.length) items.push(`${result.fixes_applied.length} settings enabled`);
    
    return items.length > 0 ? items.join(', ') : result.message;
  };

  // Check if there are manual actions needed
  const needsManualAction = result?.needs_manual_action?.length > 0;

  if (result) {
    if (result.success) {
      return (
        <div className="relative">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              needsManualAction 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-200'
            }`}
          >
            <Check className="h-4 w-4" />
            <span className="font-medium">{needsManualAction ? 'Partial Fix' : 'Fixed!'}</span>
            <span className="text-xs opacity-75">(details)</span>
          </button>
          {showDetails && (
            <div className="absolute top-full right-0 mt-1 z-10 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg text-xs max-w-sm min-w-[280px]">
              <p className="text-green-700 dark:text-green-300 font-medium mb-2">✓ Applied:</p>
              <p className="text-slate-600 dark:text-slate-400 mb-2">{getFixSummary()}</p>
              
              {needsManualAction && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-yellow-700 dark:text-yellow-300 font-medium mb-2">⚠ Manual Action Needed:</p>
                  {result.needs_manual_action.map((action: { issue: string; message: string; admin_url?: string }, i: number) => (
                    <div key={i} className="mb-2 text-slate-600 dark:text-slate-400">
                      <p className="text-xs">{action.message}</p>
                      {action.admin_url && (
                        <a href={action.admin_url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline text-[10px]">
                          Open in WordPress →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setResult(null); handleFix(); }}
                  className="text-blue-600 hover:underline text-[10px]"
                >
                  Run Again
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="relative">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Failed</span>
          </button>
          {showDetails && (
            <div className="absolute top-full right-0 mt-1 z-10 p-3 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 rounded-lg shadow-lg text-xs max-w-xs">
              <p className="text-red-700 dark:text-red-300 font-medium mb-1">Error:</p>
              <p className="text-slate-600 dark:text-slate-400">{result.message || 'Unknown error'}</p>
              <button
                onClick={(e) => { e.stopPropagation(); setResult(null); }}
                className="mt-2 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <button
      onClick={handleFix}
      disabled={fixing}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-sm hover:shadow transition-all font-medium"
    >
      {fixing ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Fixing...
        </>
      ) : (
        <>
          <Zap className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

// Verify/Rescan Button Component - checks if fixes were actually applied
interface VerifyButtonProps {
  domain: string;
  category?: 'local_seo' | 'onpage' | 'social';
  onVerified?: (status: VerifyStatus) => void;
}

interface VerifyStatus {
  success: boolean;
  status: Record<string, {
    issues: Array<{
      type: string;
      fixable: boolean;
      message: string;
      action: string;
      count?: number;
    }>;
    [key: string]: unknown;
  }>;
  timestamp: string;
}

export function VerifyButton({ domain, category, onVerified }: VerifyButtonProps) {
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<VerifyStatus | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleVerify = async () => {
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setVerifying(true);

    try {
      const url = `/api/wordpress?action=verify&site_url=${encodeURIComponent(siteUrl)}&api_key=${encodeURIComponent(apiKey)}${category ? `&category=${category}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      setStatus(data);
      onVerified?.(data);
    } catch (error) {
      console.error('[Verify] Error:', error);
    } finally {
      setVerifying(false);
    }
  };

  const getTotalIssues = () => {
    if (!status?.status) return 0;
    return Object.values(status.status).reduce((total, cat) => 
      total + (cat.issues?.length || 0), 0);
  };

  const getFixableCount = () => {
    if (!status?.status) return 0;
    return Object.values(status.status).reduce((total, cat) => 
      total + (cat.issues?.filter((i: { fixable: boolean }) => i.fixable).length || 0), 0);
  };

  if (status) {
    const totalIssues = getTotalIssues();
    const fixable = getFixableCount();
    const allFixed = totalIssues === 0;

    return (
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            allFixed 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200'
          }`}
        >
          {allFixed ? <Check className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          <span className="font-medium">{allFixed ? 'All Fixed!' : `${totalIssues} issues`}</span>
          {fixable > 0 && <span className="text-xs opacity-75">({fixable} fixable)</span>}
        </button>
        {showDetails && (
          <div className="absolute top-full right-0 mt-1 z-10 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg text-xs max-w-sm min-w-[280px]">
            <p className="font-medium mb-2">Current Status:</p>
            {Object.entries(status.status).map(([cat, data]) => (
              <div key={cat} className="mb-2">
                <p className="font-medium text-slate-700 dark:text-slate-300 capitalize">{cat.replace('_', ' ')}</p>
                {data.issues?.length === 0 ? (
                  <p className="text-green-600 text-[10px]">✓ No issues</p>
                ) : (
                  data.issues?.map((issue: { type: string; fixable: boolean; message: string; action: string }, i: number) => (
                    <div key={i} className={`text-[10px] ${issue.fixable ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {issue.fixable ? '🔧' : '⚠'} {issue.message}
                    </div>
                  ))
                )}
              </div>
            ))}
            <button
              onClick={(e) => { e.stopPropagation(); handleVerify(); }}
              className="mt-2 text-blue-600 hover:underline text-[10px] flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Rescan
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleVerify}
      disabled={verifying}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-200 transition-colors"
    >
      {verifying ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Checking...
        </>
      ) : (
        <>
          <RefreshCw className="h-3.5 w-3.5" />
          Verify Fixes
        </>
      )}
    </button>
  );
}

// Bulk Fix All Button
interface BulkFixButtonProps {
  domain: string;
  fixes: string[];
  onComplete?: () => void;
}

export function BulkFixButton({ domain, fixes, onComplete }: BulkFixButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleBulkFix = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setProgress(0);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: "fix_bulk",
          options: { fixes },
        }),
      });

      const data = await response.json();
      
      // Handle 401 authentication errors
      if (response.status === 401 || data.error === "Invalid API key") {
        console.error("[BulkFix] Authentication failed");
        alert("Authentication failed. Click 'Fix Connection' to update your API key from WordPress admin.");
        return;
      }
      
      setDone(true);
      onComplete?.();
    } catch {
      // Handle error
    } finally {
      setFixing(false);
      setProgress(100);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Check className="h-5 w-5" />
        All fixes applied! Refresh to see updated results.
      </div>
    );
  }

  return (
    <button
      onClick={handleBulkFix}
      disabled={fixing}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-medium"
    >
      {fixing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Applying {fixes.length} fixes... {progress}%
        </>
      ) : (
        <>
          <Zap className="h-5 w-5" />
          Auto-Fix All Issues ({fixes.length})
        </>
      )}
    </button>
  );
}

// Category Auto-Fix Button Component
interface CategoryFixButtonProps {
  domain: string;
  category: string;
  label: string;
  icon?: React.ReactNode;
  onFixed?: (result: FixResult) => void;
}

export function CategoryFixButton({ domain, category, label, icon, onFixed }: CategoryFixButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);

  const categoryToAction: Record<string, string> = {
    local_seo: "fix_local_seo",
    onpage: "fix_onpage",
    links: "fix_links",
    usability: "fix_usability",
    performance: "fix_performance",
    social: "fix_social",
    technology: "fix_technology",
    content: "fix_content",
    eeat: "fix_eeat",
  };

  const handleFix = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setResult(null);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: categoryToAction[category] || `fix_${category}`,
        }),
      });

      const data = await response.json();
      
      // Handle 401 authentication errors
      if (response.status === 401 || data.error === "Invalid API key") {
        setResult({ 
          success: false, 
          message: "Auth failed - use 'Fix Connection' to update API key" 
        });
        return;
      }
      
      setResult(data);
      onFixed?.(data);
    } catch {
      setResult({ success: false, message: "Fix failed" });
    } finally {
      setFixing(false);
    }
  };

  if (result?.success) {
    return (
      <span className="flex items-center gap-1 text-green-600 text-sm">
        <Check className="h-4 w-4" />
        Fixed!
      </span>
    );
  }

  return (
    <button
      onClick={handleFix}
      disabled={fixing}
      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
    >
      {fixing ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Fixing...
        </>
      ) : (
        <>
          {icon || <Zap className="h-3 w-3" />}
          {label}
        </>
      )}
    </button>
  );
}

// Comprehensive Auto-Fix All Button
interface AutoFixAllButtonProps {
  domain: string;
  onComplete?: () => void;
}

export function AutoFixAllButton({ domain, onComplete }: AutoFixAllButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    setConnected(!!saved);
  }, [domain]);

  const handleAutoFixAll = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setResult(null);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: "auto_fix_all",
          options: { categories: ["all"] },
        }),
      });

      const data = await response.json();
      
      // Handle 401 authentication errors
      if (response.status === 401 || data.error === "Invalid API key") {
        setResult({ 
          success: false, 
          message: "Authentication failed. Click 'Fix Connection' to update your API key from WordPress admin." 
        });
        return;
      }
      
      setResult(data);
      onComplete?.();
    } catch {
      setResult({ success: false, message: "Auto-fix failed" });
    } finally {
      setFixing(false);
    }
  };

  if (!connected) {
    return null;
  }

  if (result?.success) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl">
        <Check className="h-6 w-6 text-green-600" />
        <div>
          <p className="font-medium text-green-800 dark:text-green-200">All fixes applied successfully!</p>
          <p className="text-sm text-green-700 dark:text-green-300">
            {result.fixes_applied} fixes were applied. Refresh the page to see updated results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleAutoFixAll}
      disabled={fixing}
      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:opacity-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
    >
      {fixing ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin" />
          Applying All Fixes...
        </>
      ) : (
        <>
          <Zap className="h-6 w-6" />
          🚀 Auto-Fix All SEO Issues
        </>
      )}
    </button>
  );
}

// Issue Detection Component
interface IssueDetectorProps {
  domain: string;
  onIssuesDetected?: (issues: DetectedIssues) => void;
}

interface DetectedIssues {
  total_issues: number;
  total_fixable: number;
  issues: Record<string, Array<{
    id: string;
    message: string;
    severity: string;
    fixable: boolean;
    count?: number;
  }>>;
  fixable_actions: string[];
}

export function IssueDetector({ domain, onIssuesDetected }: IssueDetectorProps) {
  const [detecting, setDetecting] = useState(false);
  const [issues, setIssues] = useState<DetectedIssues | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    setConnected(!!saved);
  }, [domain]);

  const handleDetect = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setDetecting(true);

    try {
      const response = await fetch(
        `/api/wordpress?action=detect_issues&site_url=${encodeURIComponent(siteUrl)}&api_key=${encodeURIComponent(apiKey)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setIssues(data);
        onIssuesDetected?.(data);
      }
    } catch {
      // Handle error
    } finally {
      setDetecting(false);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleDetect}
        disabled={detecting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {detecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning WordPress Site...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Detect Issues from Plugin
          </>
        )}
      </button>

      {issues && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Plugin Issues Detected</span>
            <span className="text-sm text-muted-foreground">
              {issues.total_issues} issues, {issues.total_fixable} fixable
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.entries(issues.issues).map(([category, categoryIssues]) => (
              categoryIssues.length > 0 && (
                <div key={category} className="flex items-center justify-between p-2 bg-background rounded">
                  <span className="capitalize">{category.replace(/_/g, " ")}</span>
                  <span className="text-orange-600 font-medium">{categoryIssues.length}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

```

---

