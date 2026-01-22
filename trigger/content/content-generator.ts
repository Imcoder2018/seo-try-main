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
  }) => {
    logger.log(`Starting bulk content generation for ${payload.combinations.length} combinations`);
    
    const results: GeneratedContent[] = [];
    
    for (let i = 0; i < payload.combinations.length; i++) {
      const combination = payload.combinations[i];
      
      // Update progress
      logger.log(`Processing combination ${i + 1}/${payload.combinations.length}: ${combination.topic.title} for ${combination.location}`);
      
      try {
        const content = await generateContentForCombination(combination);
        const imageUrl = payload.generateImages ? await generateImageForContent(combination) : undefined;
        
        const generatedContent: GeneratedContent = {
          id: `content_${Date.now()}_${i}`,
          title: combination.topic.title,
          location: combination.location,
          contentType: combination.topic.contentType,
          content: content,
          imageUrl: imageUrl,
          wordCount: content.length,
          keywords: [...combination.topic.primaryKeywords, ...combination.topic.secondaryKeywords],
          status: "completed"
        };
        
        results.push(generatedContent);
        
        logger.log(`Successfully generated content for: ${combination.topic.title} (${combination.location})`);
        
      } catch (error) {
        logger.error(`Failed to generate content for ${combination.topic.title} (${combination.location}):`, error);
        
        results.push({
          id: `content_${Date.now()}_${i}`,
          title: combination.topic.title,
          location: combination.location,
          contentType: combination.topic.contentType,
          content: "",
          wordCount: 0,
          keywords: [],
          status: "failed"
        });
      }
    }
    
    logger.log(`Bulk content generation completed. ${results.filter(r => r.status === "completed").length}/${results.length} successful`);
    
    return {
      success: true,
      results,
      summary: {
        total: results.length,
        completed: results.filter(r => r.status === "completed").length,
        failed: results.filter(r => r.status === "failed").length,
      }
    };
  },
});

async function generateContentForCombination(combination: ContentCombination): Promise<string> {
  const prompt = createContentPrompt(combination);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional content writer for a technology company. Write in a ${combination.brandTone} tone for ${combination.targetAudience}.`
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

  return response.choices[0].message.content;
}

async function generateImageForContent(combination: ContentCombination): Promise<string> {
  const prompt = createImagePrompt(combination);
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
  });

  if (!response.data[0]?.url) {
    throw new Error("Failed to generate image");
  }

  return response.data[0].url;
}

function createContentPrompt(combination: ContentCombination): string {
  return `Write a ${combination.topic.contentType} about "${combination.topic.title}" for the location "${combination.location}".

Context:
- Service: ${combination.service}
- Company: ${combination.aboutSummary}
- Brand Tone: ${combination.brandTone}
- Target Audience: ${combination.targetAudience}
- Content Type: ${combination.topic.contentType}
- Search Intent: ${combination.topic.searchIntent}

Requirements:
1. Incorporate these primary keywords naturally: ${combination.topic.primaryKeywords.join(", ")}
2. Include these secondary keywords where relevant: ${combination.topic.secondaryKeywords.join(", ")}
3. Make it location-specific to ${combination.location}
4. Write in a ${combination.brandTone} tone
5. Target ${combination.targetAudience}
6. Length: 800-1200 words
7. Include a clear call-to-action
8. Structure with proper headings and paragraphs

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
