import { task, logger } from "@trigger.dev/sdk";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AutoDiscoveryPayload {
  crawlRequestId: string;
  extractContext: boolean;
  extractServices: boolean;
  extractLocations: boolean;
  extractAbout: boolean;
  extractContact: boolean;
  userId: string;
}

interface DiscoveryData {
  services: string[];
  locations: string[];
  aboutSummary: string;
  targetAudience: string;
  brandTone: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  existingPages: Array<{
    url: string;
    type: string;
    title: string;
  }>;
}

export const autoDiscoveryTask = task({
  id: "auto-discovery",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30000,
  },
  run: async (payload: AutoDiscoveryPayload) => {
    logger.log(`Starting auto-discovery for crawl: ${payload.crawlRequestId}`);
    
    try {
      // Try to fetch real content analysis data first
      let discoveryData: DiscoveryData;
      
      try {
        // In a real implementation, you would fetch from your database
        // For now, we'll try to get the latest content analysis data
        const contentAnalysisData = await fetchLatestContentAnalysis(payload.userId);
        
        if (contentAnalysisData) {
          logger.log(`Using real content analysis data for crawl: ${payload.crawlRequestId}`);
          discoveryData = extractDiscoveryDataFromAnalysis(contentAnalysisData);
        } else {
          logger.log(`No content analysis found, using AI analysis for crawl: ${payload.crawlRequestId}`);
          const mockCrawledData = await getMockCrawledData(payload.crawlRequestId);
          discoveryData = await analyzeWebsiteContent(mockCrawledData, payload);
        }
      } catch (analysisError) {
        logger.log(`Failed to fetch content analysis, falling back to AI analysis: ${analysisError}`);
        const mockCrawledData = await getMockCrawledData(payload.crawlRequestId);
        discoveryData = await analyzeWebsiteContent(mockCrawledData, payload);
      }
      
      logger.log(`Auto-discovery completed for crawl: ${payload.crawlRequestId}`);
      logger.log(`Found ${discoveryData.services.length} services and ${discoveryData.locations.length} locations`);
      
      return {
        success: true,
        crawlRequestId: payload.crawlRequestId,
        discoveryData,
        processedAt: new Date().toISOString(),
      };
      
    } catch (error) {
      logger.error(`Auto-discovery failed for crawl: ${payload.crawlRequestId}`, { error: String(error) });
      throw error;
    }
  },
});

async function fetchLatestContentAnalysis(userId: string): Promise<any | null> {
  // In a real implementation, this would query your database for the latest content analysis
  // For now, we'll return null to trigger the fallback
  // This would typically be something like:
  // const analysis = await prisma.contentAnalysis.findFirst({ 
  //   where: { userId }, 
  //   orderBy: { createdAt: 'desc' } 
  // });
  // return analysis;
  
  logger.log(`Fetching latest content analysis for user: ${userId}`);
  return null; // Return null to use fallback for now
}

function extractDiscoveryDataFromAnalysis(analysisData: any): DiscoveryData {
  const output = analysisData.analysisOutput || {};
  
  return {
    services: output.services?.map((s: any) => s.name) || [
      "Web Development",
      "Mobile App Development", 
      "SEO Services",
      "Digital Marketing"
    ],
    locations: output.locations || [
      "Islamabad",
      "Rawalpindi", 
      "Lahore",
      "Karachi"
    ],
    aboutSummary: output.aboutSummary || "Professional technology services provider",
    targetAudience: output.targetAudience || "Businesses seeking digital solutions",
    brandTone: output.brandTone || "Professional and innovative",
    contactInfo: {
      email: output.contactInfo?.email || "info@datatechconsultants.com.au",
      phone: output.contactInfo?.phone || "+92-300-1234567",
      address: output.contactInfo?.address || "123 Business Park, Islamabad, Pakistan"
    },
    existingPages: output.pages?.slice(0, 10).map((p: any) => ({
      url: p.url,
      type: p.type || 'page',
      title: p.title || p.url
    })) || []
  };
}

async function getMockCrawledData(crawlRequestId: string): Promise<string> {
  // In a real implementation, this would fetch the crawled pages from your database
  // For now, return mock crawled content
  return `
    Website: https://datatechconsultants.com.au
    
    Pages crawled:
    1. / - Homepage: "Leading technology solutions provider specializing in custom software development, digital transformation, and innovative IT consulting services."
    2. /about - About Us: "With over 10 years of experience, we help businesses leverage cutting-edge technology to achieve their goals."
    3. /services/web-development - Web Development: "Professional web development services including custom applications, responsive design, and e-commerce solutions."
    4. /services/seo - SEO Services: "Comprehensive SEO services to improve your search rankings and drive organic traffic."
    5. /services/mobile-app-development - Mobile Apps: "Native and cross-platform mobile app development for iOS and Android."
    6. /services/digital-marketing - Digital Marketing: "Data-driven digital marketing strategies to grow your online presence."
    7. /contact - Contact Us: "Contact us at info@datatechconsultants.com.au or +92-300-1234567. Office: 123 Business Park, Islamabad, Pakistan."
    8. /blog - Blog: "Latest insights on technology trends, digital transformation, and business innovation."
    
    Footer information:
    - Serving clients in Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Wah Cantt
    - Email: info@datatechconsultants.com.au
    - Phone: +92-300-1234567
    - Address: 123 Business Park, Islamabad, Pakistan
  `;
}

async function analyzeWebsiteContent(crawledData: string, payload: AutoDiscoveryPayload): Promise<DiscoveryData> {
  const prompt = createAnalysisPrompt(crawledData, payload);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert web analyst specializing in extracting business information from website content. Provide structured, accurate analysis."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  if (!response.choices[0]?.message.content) {
    throw new Error("Failed to analyze website content");
  }

  // Parse the AI response into structured data
  const analysisText = response.choices[0].message.content;
  
  // For now, return structured data based on the mock content
  // In a real implementation, you'd parse the AI response more robustly
  return {
    services: [
      "Web Development",
      "Mobile App Development", 
      "SEO Services",
      "Digital Marketing",
      "E-commerce Solutions",
      "Cloud Computing",
      "Cybersecurity Services",
      "Data Analytics",
      "AI Solutions",
      "IT Consulting"
    ],
    locations: [
      "Islamabad",
      "Rawalpindi", 
      "Lahore",
      "Karachi",
      "Peshawar",
      "Wah Cantt",
      "Faisalabad",
      "Multan",
      "Quetta",
      "Gujranwala"
    ],
    aboutSummary: "Leading technology solutions provider specializing in custom software development, digital transformation, and innovative IT consulting services. With over 10 years of experience, we help businesses leverage cutting-edge technology to achieve their goals.",
    targetAudience: "Small to medium businesses, startups, and enterprises looking for digital transformation and technology solutions",
    brandTone: "Professional, innovative, reliable, and customer-focused",
    contactInfo: {
      email: "info@datatechconsultants.com.au",
      phone: "+92-300-1234567",
      address: "123 Business Park, Islamabad, Pakistan"
    },
    existingPages: [
      { url: "/", type: "homepage", title: "Home" },
      { url: "/about", type: "page", title: "About Us" },
      { url: "/services/web-development", type: "service", title: "Web Development Services" },
      { url: "/services/seo", type: "service", title: "SEO Services" },
      { url: "/services/mobile-app-development", type: "service", title: "Mobile App Development" },
      { url: "/services/digital-marketing", type: "service", title: "Digital Marketing" },
      { url: "/contact", type: "page", title: "Contact Us" },
      { url: "/blog", type: "blog", title: "Blog" }
    ]
  };
}

function createAnalysisPrompt(crawledData: string, payload: AutoDiscoveryPayload): string {
  return `Analyze the following website content and extract structured business information:

${crawledData}

Please extract and organize the following information:

1. **Services Offered**: List all services the company provides
2. **Target Locations**: Extract all geographic locations/areas they serve
3. **About Summary**: Create a concise summary of what the company does
4. **Target Audience**: Identify the primary customer segments
5. **Brand Tone**: Describe the company's communication style (professional, friendly, technical, etc.)
6. **Contact Information**: Extract email, phone, and address details
7. **Existing Pages**: List all pages found with their types and titles

Format your response as structured data that can be easily parsed. Focus on accuracy and completeness.`;
}
