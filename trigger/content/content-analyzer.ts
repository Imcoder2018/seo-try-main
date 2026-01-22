import { task, metadata, runs } from "@trigger.dev/sdk";
import OpenAI from "openai";

interface ContentAnalysisPayload {
  baseUrl: string;
  targetAudience?: string;
  extractionRunId?: string; // Optional: if provided, wait for extraction to complete
  extractedPages?: Array<{
    url: string;
    type: string;
    title?: string;
    content: string;
    wordCount: number;
  }>;
  analysisId?: string;
  userId?: string;
}

interface ContentAnalysisOutput {
  baseUrl: string;
  contentContext: {
    dominantKeywords: Array<{
      term: string;
      density: "High" | "Medium" | "Low";
      pages: number;
    }>;
    contentGaps: string[];
    audiencePersona: string;
    tone: string;
  };
  aiSuggestions: Array<{
    type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
    title: string;
    reason: string;
    targetKeywords: string[];
    relatedServiceUrl?: string;
  }>;
  pages: Array<{
    url: string;
    type: string;
    wordCount: number;
    mainTopic?: string;
    summary?: string;
    keywords?: string[];
  }>;
}

// Helper to extract top keywords from text using frequency analysis
function extractTopKeywords(text: string, limit: number = 5): string[] {
  if (!text) return [];
  
  // Extract words (4+ characters, alphanumeric)
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  
  // Common stop words to exclude
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'been', 'will', 'would', 'could',
    'should', 'their', 'what', 'which', 'where', 'when', 'make', 'like', 'just',
    'also', 'into', 'over', 'such', 'your', 'they', 'them', 'than', 'then', 'look',
    'only', 'come', 'could', 'after', 'call', 'want', 'been', 'good', 'most', 'well',
    'even', 'because', 'any', 'give', 'day', 'same', 'find', 'think', 'take', 'work',
    'know', 'year', 'first', 'last', 'long', 'great', 'much', 'where', 'need', 'help',
    'try', 'ask', 'world', 'going', 'want', 'school', 'important', 'until', 'form',
    'food', 'keep', 'children', 'without', 'place', 'old', 'while', 'still', 'learn',
    'number', 'night', 'point', 'today', 'bring', 'next', 'small', 'large', 'group',
    'begin', 'seem', 'talk', 'turn', 'start', 'might', 'show', 'hear', 'play', 'run',
    'move', 'live', 'believe', 'hold', 'bring', 'happen', 'write', 'provide', 'sit',
    'stand', 'lose', 'pay', 'meet', 'include', 'continue', 'set', 'change', 'lead',
    'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read', 'allow', 'add',
    'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember', 'love', 'consider',
    'appear', 'buy', 'wait', 'serve', 'die', 'send', 'expect', 'build', 'stay', 'fall',
    'cut', 'reach', 'kill', 'remain', 'suggest', 'raise', 'pass', 'sell', 'require',
    'report', 'decide', 'pull', 'break', 'receive', 'agree', 'support', 'hit', 'produce',
    'eat', 'cover', 'catch', 'draw', 'choose', 'cause', 'point', 'listen', 'close',
    'develop', 'drive', 'include', 'support', 'create', 'serve', 'remain', 'suggest'
  ]);
  
  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top N
  const sortedWords = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
  
  return sortedWords;
}
function compressContent(pages: Array<{ url: string; type: string; title?: string; content: string; wordCount: number }>) {
  return pages.map(page => {
    const summary = page.content.substring(0, 800); // Limit to ~200 tokens per page
    return `
URL: ${page.url}
Type: ${page.type}
Title: ${page.title || "N/A"}
Summary: ${summary}...
    `.trim();
  }).join("\n---\n");
}

export const contentAnalyzerTask = task({
  id: "content-analyzer",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 60000,
  },
  run: async (payload: ContentAnalysisPayload): Promise<ContentAnalysisOutput> => {
    const { baseUrl, targetAudience = "General audience", extractedPages = [], extractionRunId } = payload;

    try {
      metadata.set("status", {
        progress: 0,
        label: "Starting AI content analysis...",
      } as any);

      // If extractionRunId is provided, wait for extraction to complete
      let finalExtractedPages = extractedPages;
      if (extractionRunId && (!extractedPages || extractedPages.length === 0)) {
        metadata.set("status", {
          progress: 5,
          label: "Waiting for content extraction to complete...",
        } as any);

        let retries = 0;
        const maxRetries = 60; // Wait up to 2 minutes

        while (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000));

          try {
            const extractionRun = await runs.retrieve(extractionRunId as string);
            if (extractionRun.status === "COMPLETED") {
              const extractionOutput = extractionRun.output as any;
              if (extractionOutput?.extractedPages) {
                finalExtractedPages = extractionOutput.extractedPages;
                break;
              }
            } else if (extractionRun.status === "FAILED" || extractionRun.status === "CANCELED") {
              throw new Error(`Extraction failed with status: ${extractionRun.status}`);
            }
          } catch (error) {
            console.error("Error checking extraction status:", error);
          }

          retries++;
        }

        if (!finalExtractedPages || finalExtractedPages.length === 0) {
          throw new Error("Extraction timed out or failed");
        }
      }

      // If no extracted pages provided, return mock data for testing
      if (!finalExtractedPages || finalExtractedPages.length === 0) {
        metadata.set("status", {
          progress: 100,
          label: "No pages provided, returning mock data",
        } as any);

        return {
          baseUrl,
          contentContext: {
            dominantKeywords: [
              { term: "AI Automation", density: "High", pages: 12 },
              { term: "Healthcare Data", density: "Medium", pages: 5 },
              { term: "Computer Vision", density: "Medium", pages: 4 },
            ],
            contentGaps: [
              "No case studies mentioned for 'Cybersecurity' service.",
              "Lack of 'Implementation Guide' style content for Power BI.",
              "Missing comparison articles (e.g., 'Custom CRM vs Salesforce').",
            ],
            audiencePersona: "Technical Decision Makers & Healthcare Administrators",
            tone: "Professional, Technical, Authority-focused",
          },
          aiSuggestions: [
            {
              type: "Blog Post",
              title: "5 Risks of Ignoring AI Cybersecurity in Supply Chains",
              reason: "You have a Supply Chain service page but no blog content addressing its security risks.",
              targetKeywords: ["AI Cybersecurity", "Supply Chain Risk", "DataTech Security"],
            },
            {
              type: "Whitepaper",
              title: "The CTO's Guide to Hospital Operations Automation",
              reason: "Strong authority on Healthcare solutions; a whitepaper would capture leads better than standard blogs.",
              targetKeywords: ["Hospital Automation", "CTO Guide", "Healthcare Operations"],
            },
          ],
          pages: [],
        };
      }

      // Compress content to reduce token usage
      metadata.set("status", {
        progress: 20,
        label: "Compressing content for AI analysis...",
      } as any);

      const compressedContext = compressContent(finalExtractedPages);

      // Separate service pages and blog pages for gap analysis
      const servicePages = finalExtractedPages.filter(p => p.type === 'service');
      const blogPages = finalExtractedPages.filter(p => p.type === 'blog');

      const serviceSummary = servicePages.length > 0 
        ? compressContent(servicePages.slice(0, 10)) // Limit to 10 service pages
        : "No service pages found";

      const blogSummary = blogPages.length > 0
        ? compressContent(blogPages.slice(0, 10)) // Limit to 10 blog posts
        : "No blog posts found";

      // Initialize OpenAI client with Vercel environment variable
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      metadata.set("status", {
        progress: 40,
        label: "Analyzing content with AI...",
      } as any);

      // Call OpenAI API for content analysis
      const prompt = `
You are an SEO Content Strategist. Analyze this website content.

TARGET AUDIENCE: ${targetAudience}

SERVICE PAGES (What they sell):
${serviceSummary}

BLOG POSTS (What they write about):
${blogSummary}

TASK:
1. Extract the top 5 semantic keywords (excluding brand names).
2. Identify the "Audience Persona" based on tone and language.
3. Find the "Content Gap": What are they selling (Service pages) that they aren't writing about (Blog pages)?
4. Suggest 5 content pieces (Blog Posts, Whitepapers, Case Studies, Guides, or Infographics) to bridge the gap.
5. For each suggestion, identify which service page it relates to by finding the matching URL from the service pages.

Return ONLY valid JSON in this exact format:
{
  "dominantKeywords": [
    {"term": "AI Automation", "density": "High", "pages": 12},
    {"term": "Healthcare Data", "density": "Medium", "pages": 5}
  ],
  "contentGaps": [
    "No case studies mentioned for 'Cybersecurity' service.",
    "Lack of 'Implementation Guide' style content for Power BI."
  ],
  "audiencePersona": "Technical Decision Makers & Healthcare Administrators",
  "tone": "Professional, Technical, Authority-focused",
  "aiSuggestions": [
    {
      "type": "Blog Post",
      "title": "5 Risks of Ignoring AI Cybersecurity in Supply Chains",
      "reason": "You have a Supply Chain service page but no blog content addressing its security risks.",
      "targetKeywords": ["AI Cybersecurity", "Supply Chain Risk", "DataTech Security"],
      "relatedServiceUrl": "https://example.com/services/supply-chain"
    }
  ]
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO Content Strategist. Always respond with valid JSON only, no markdown formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      metadata.set("status", {
        progress: 80,
        label: "Processing AI analysis results...",
      } as any);

      const aiResponse = completion.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error("No response from OpenAI");
      }

      const analysisResult = JSON.parse(aiResponse);

      metadata.set("status", {
        progress: 100,
        label: "AI content analysis complete!",
      } as any);

      // CRITICAL FIX: Use finalExtractedPages (not extractedPages) to ensure pages are included
      // Format pages for output with keyword extraction
      const formattedPages = finalExtractedPages.map(page => ({
        url: page.url,
        type: page.type,
        wordCount: page.wordCount,
        mainTopic: page.title,
        summary: page.content.substring(0, 200),
        keywords: extractTopKeywords(page.content, 5),
      }));

      console.log(`[Content Analyzer] Returning ${formattedPages.length} pages`);

      return {
        baseUrl,
        contentContext: {
          dominantKeywords: analysisResult.dominantKeywords || [],
          contentGaps: analysisResult.contentGaps || [],
          audiencePersona: analysisResult.audiencePersona || "Unknown",
          tone: analysisResult.tone || "Unknown",
        },
        aiSuggestions: analysisResult.aiSuggestions || [],
        pages: formattedPages,
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Content analyzer fatal error:", error);
      metadata.set("status", {
        progress: 0,
        label: `Fatal error: ${errorMsg}`,
        error: errorMsg,
      } as any);
      throw error;
    }
  },
});
