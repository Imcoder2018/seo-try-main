import { task, logger } from "@trigger.dev/sdk";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ContentCombination {
  topic: {
    title: string;
    primaryKeywords: string[];
    secondaryKeywords: string[];
    contentType: "blog post" | "landing page";
    description: string;
    searchIntent: "informational" | "commercial" | "local";
  };
  location: string;
  service: string;
  brandTone: string;
  targetAudience: string;
  aboutSummary: string;
  generateImages: boolean;
  customPrompt?: string;
  scrapedContent?: string;
}

interface GeneratedContent {
  id: string;
  title: string;
  location: string;
  contentType: string;
  content: string;
  imageUrl?: string;
  wordCount: number;
  keywords: string[];
  status: "completed" | "failed";
}

export const contentGeneratorTask = task({
  id: "content-generator",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30000,
  },
  run: async (payload: {
    combinations: ContentCombination[];
    userId: string;
    generateImages: boolean;
    singlePage?: boolean;
  }) => {
    const mode = payload.singlePage ? "Single Page" : "Bulk";
    logger.log(`Starting ${mode.toLowerCase()} content generation for ${payload.combinations.length} combination${payload.combinations.length === 1 ? '' : 's'}`);
    
    const results: GeneratedContent[] = [];
    
    // Process combinations in parallel for better performance (but limit concurrency)
    const concurrencyLimit = payload.singlePage ? 1 : 3; // Single page: sequential, Bulk: parallel with limit
    const chunks = [];
    
    for (let i = 0; i < payload.combinations.length; i += concurrencyLimit) {
      chunks.push(payload.combinations.slice(i, i + concurrencyLimit));
    }
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (combination, index) => {
        const globalIndex = payload.combinations.indexOf(combination);
        
        logger.log(`Processing combination ${globalIndex + 1}/${payload.combinations.length}: ${combination.topic.title} for ${combination.location}`);
        
        try {
          // Generate content and image in parallel for better performance
          const [content, imageUrl] = await Promise.all([
            generateContentForCombination(combination),
            payload.generateImages ? generateImageForContent(combination) : Promise.resolve(undefined)
          ]);
          
          const generatedContent: GeneratedContent = {
            id: `content_${Date.now()}_${globalIndex}`,
            title: combination.topic.title,
            location: combination.location,
            contentType: combination.topic.contentType,
            content: content,
            imageUrl: imageUrl,
            wordCount: content.length,
            keywords: [...combination.topic.primaryKeywords, ...combination.topic.secondaryKeywords],
            status: "completed"
          };
          
          logger.log(`Successfully generated content for: ${combination.topic.title} (${combination.location})`);
          return generatedContent;
          
        } catch (error) {
          logger.error(`Failed to generate content for ${combination.topic.title} (${combination.location}):`, { error: String(error) });
          
          return {
            id: `content_${Date.now()}_${globalIndex}`,
            title: combination.topic.title,
            location: combination.location,
            contentType: combination.topic.contentType,
            content: "",
            wordCount: 0,
            keywords: [],
            status: "failed" as const
          };
        }
      });
      
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }
    
    const completed = results.filter(r => r.status === "completed").length;
    const failed = results.filter(r => r.status === "failed").length;
    
    logger.log(`${mode} content generation completed. ${completed}/${results.length} successful, ${failed} failed`);
    
    return {
      success: true,
      results,
      summary: {
        total: results.length,
        completed,
        failed,
      }
    };
  },
});

async function generateContentForCombination(combination: ContentCombination): Promise<string> {
  const prompt = createContentPrompt(combination);
  const systemPrompt = `You are a professional content writer for a technology company. Write in a ${combination.brandTone} tone for ${combination.targetAudience}.`;
  
  // Debug logs for OpenAI prompts
  console.log("\n========== OPENAI CONTENT GENERATION DEBUG ==========");
  console.log("[OpenAI Content] Topic:", combination.topic.title);
  console.log("[OpenAI Content] Location:", combination.location);
  console.log("[OpenAI Content] Service:", combination.service);
  console.log("[OpenAI Content] Brand Tone:", combination.brandTone);
  console.log("[OpenAI Content] Target Audience:", combination.targetAudience);
  console.log("[OpenAI Content] Content Type:", combination.topic.contentType);
  console.log("[OpenAI Content] Primary Keywords:", combination.topic.primaryKeywords.join(", "));
  console.log("[OpenAI Content] Secondary Keywords:", combination.topic.secondaryKeywords.join(", "));
  console.log("\n[OpenAI Content] SYSTEM PROMPT:");
  console.log(systemPrompt);
  console.log("\n[OpenAI Content] USER PROMPT:");
  console.log(prompt);
  console.log("======================================================\n");
  
  logger.log(`[OpenAI Debug] Sending content prompt for: ${combination.topic.title}`, {
    systemPrompt: systemPrompt.substring(0, 200),
    userPrompt: prompt.substring(0, 500) + "...",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000
  });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  if (!response.choices[0]?.message.content) {
    throw new Error("Failed to generate content");
  }
  
  console.log("[OpenAI Content] Response received, word count:", response.choices[0].message.content.split(/\s+/).length);

  return response.choices[0].message.content;
}

async function generateImageForContent(combination: ContentCombination): Promise<string> {
  const prompt = createImagePrompt(combination);
  
  // Debug logs for OpenAI image generation
  console.log("\n========== OPENAI IMAGE GENERATION DEBUG ==========");
  console.log("[OpenAI Image] Topic:", combination.topic.title);
  console.log("[OpenAI Image] Location:", combination.location);
  console.log("[OpenAI Image] Model: dall-e-3");
  console.log("\n[OpenAI Image] IMAGE PROMPT:");
  console.log(prompt);
  console.log("====================================================\n");
  
  logger.log(`[OpenAI Debug] Sending image prompt for: ${combination.topic.title}`, {
    prompt: prompt.substring(0, 300) + "...",
    model: "dall-e-3",
    size: "1024x1024"
  });
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
  });

  if (!response.data?.[0]?.url) {
    throw new Error("Failed to generate image");
  }
  
  console.log("[OpenAI Image] Image generated successfully:", response.data[0].url.substring(0, 100) + "...");

  return response.data[0].url;
}

function createContentPrompt(combination: ContentCombination): string {
  // Build location context - only include if location is provided
  const locationContext = combination.location 
    ? `for the location "${combination.location}"` 
    : '';
  const locationRequirement = combination.location 
    ? `3. Make it location-specific to ${combination.location}` 
    : '3. Keep content general without specific location targeting';

  // Build scraped content reference section if available
  const scrapedContentSection = combination.scrapedContent 
    ? `\n\nReference Content from Website (use for style and context, do not copy directly):\n${combination.scrapedContent}\n` 
    : '';

  // Build custom prompt section if available
  const customPromptSection = combination.customPrompt 
    ? `\n\nAdditional Writing Instructions:\n${combination.customPrompt}\n` 
    : '';

  return `Write a ${combination.topic.contentType} about "${combination.topic.title}" ${locationContext}.

Context:
- Service: ${combination.service}
- Company: ${combination.aboutSummary}
- Brand Tone: ${combination.brandTone}
- Target Audience: ${combination.targetAudience}
- Content Type: ${combination.topic.contentType}
- Search Intent: ${combination.topic.searchIntent}
${scrapedContentSection}
Requirements:
1. Incorporate these primary keywords naturally: ${combination.topic.primaryKeywords.join(", ")}
2. Include these secondary keywords where relevant: ${combination.topic.secondaryKeywords.join(", ")}
${locationRequirement}
4. Write in a ${combination.brandTone} tone
5. Target ${combination.targetAudience}
6. Length: 800-1200 words
7. Include a clear call-to-action
8. Structure with proper headings and paragraphs
${customPromptSection}
Description: ${combination.topic.description}

Please write compelling, SEO-optimized content that meets these requirements.`;
}

function createImagePrompt(combination: ContentCombination): string {
  const basePrompt = `Create a professional, modern image for a ${combination.topic.contentType} about "${combination.topic.title}"`;
  
  const serviceContext = combination.service ? `related to ${combination.service} services` : '';
  const locationContext = combination.location ? `targeting ${combination.location}` : '';
  const toneContext = getToneDescription(combination.brandTone);
  
  return `${basePrompt} ${serviceContext} ${locationContext}. ${toneContext}. The image should be suitable for a technology company website, clean and professional, with good visual hierarchy and modern design aesthetics. Avoid text overlays - focus on visual representation of the concept.`;
}

function getToneDescription(tone: string): string {
  const toneMap: Record<string, string> = {
    'professional': 'Use corporate colors, clean lines, and business imagery',
    'innovative': 'Use modern, tech-forward visuals with dynamic elements',
    'friendly': 'Use warm colors and approachable imagery',
    'technical': 'Use precise, detailed imagery with technology focus',
    'creative': 'Use artistic, visually striking elements',
  };
  
  return toneMap[tone.toLowerCase()] || 'Use professional, clean imagery';
}
