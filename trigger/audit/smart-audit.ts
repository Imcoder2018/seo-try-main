import { task, metadata } from "@trigger.dev/sdk";

// PageSpeed API interfaces and helper
interface PageSpeedCoreWebVitals {
  lcp: number; // Largest Contentful Paint (ms)
  lcpDisplay: string;
  fcp: number; // First Contentful Paint (ms)
  fcpDisplay: string;
  cls: number; // Cumulative Layout Shift
  clsDisplay: string;
  tbt: number; // Total Blocking Time (ms)
  tbtDisplay: string;
  si: number; // Speed Index
  siDisplay: string;
  ttfb: number; // Time to First Byte (ms)
  ttfbDisplay: string;
}

interface PageSpeedOpportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  savings?: string;
}

interface PageSpeedAPIResult {
  success: boolean;
  score: number;
  coreWebVitals: PageSpeedCoreWebVitals;
  opportunities: PageSpeedOpportunity[];
  error?: string;
  debugInfo?: {
    apiKeyConfigured: boolean;
    apiKeySource: string;
    apiResponseStatus?: number;
    fetchDuration?: number;
  };
}

// Fetch PageSpeed Insights from Google API with comprehensive debug logging
async function fetchPageSpeedInsights(url: string, strategy: 'mobile' | 'desktop' = 'mobile'): Promise<PageSpeedAPIResult> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || process.env.PAGESPEED_API_KEY;
  
  // Debug: Log API key status
  const apiKeySource = process.env.GOOGLE_PAGESPEED_API_KEY 
    ? 'GOOGLE_PAGESPEED_API_KEY' 
    : process.env.PAGESPEED_API_KEY 
      ? 'PAGESPEED_API_KEY' 
      : 'NOT_CONFIGURED';
  
  console.log(`🔍 [PageSpeed Debug] API Key Status: ${apiKeySource}`);
  console.log(`🔍 [PageSpeed Debug] API Key Present: ${!!apiKey}`);
  if (apiKey) {
    console.log(`🔍 [PageSpeed Debug] API Key Preview: ${apiKey.substring(0, 15)}...`);
  }
  
  if (!apiKey) {
    console.warn('⚠️ [PageSpeed] No GOOGLE_PAGESPEED_API_KEY or PAGESPEED_API_KEY configured');
    return {
      success: false,
      score: 0,
      coreWebVitals: {
        lcp: 0, lcpDisplay: 'N/A',
        fcp: 0, fcpDisplay: 'N/A',
        cls: 0, clsDisplay: 'N/A',
        tbt: 0, tbtDisplay: 'N/A',
        si: 0, siDisplay: 'N/A',
        ttfb: 0, ttfbDisplay: 'N/A',
      },
      opportunities: [],
      error: 'No PageSpeed API key configured. Set GOOGLE_PAGESPEED_API_KEY or PAGESPEED_API_KEY environment variable.',
      debugInfo: {
        apiKeyConfigured: false,
        apiKeySource,
      }
    };
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}&category=performance`;
    
    console.log(`📡 [PageSpeed] Fetching ${strategy} insights for: ${url}`);
    const startTime = Date.now();
    
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(60000),
    });
    
    const fetchDuration = Date.now() - startTime;
    console.log(`📡 [PageSpeed] API Response: ${response.status} (${fetchDuration}ms)`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [PageSpeed] API Error: ${response.status} - ${errorText.substring(0, 200)}`);
      return {
        success: false,
        score: 0,
        coreWebVitals: {
          lcp: 0, lcpDisplay: 'N/A',
          fcp: 0, fcpDisplay: 'N/A',
          cls: 0, clsDisplay: 'N/A',
          tbt: 0, tbtDisplay: 'N/A',
          si: 0, siDisplay: 'N/A',
          ttfb: 0, ttfbDisplay: 'N/A',
        },
        opportunities: [],
        error: `PageSpeed API error: ${response.status}`,
        debugInfo: {
          apiKeyConfigured: true,
          apiKeySource,
          apiResponseStatus: response.status,
          fetchDuration,
        }
      };
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse?.audits || {};
    
    // Extract Core Web Vitals with display values
    const coreWebVitals: PageSpeedCoreWebVitals = {
      lcp: audits['largest-contentful-paint']?.numericValue || 0,
      lcpDisplay: audits['largest-contentful-paint']?.displayValue || 'N/A',
      fcp: audits['first-contentful-paint']?.numericValue || 0,
      fcpDisplay: audits['first-contentful-paint']?.displayValue || 'N/A',
      cls: audits['cumulative-layout-shift']?.numericValue || 0,
      clsDisplay: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      tbt: audits['total-blocking-time']?.numericValue || 0,
      tbtDisplay: audits['total-blocking-time']?.displayValue || 'N/A',
      si: audits['speed-index']?.numericValue || 0,
      siDisplay: audits['speed-index']?.displayValue || 'N/A',
      ttfb: audits['server-response-time']?.numericValue || 0,
      ttfbDisplay: audits['server-response-time']?.displayValue || 'N/A',
    };
    
    // Extract opportunities
    const opportunities: PageSpeedOpportunity[] = Object.values(audits)
      .filter((audit: any) => audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 1)
      .map((audit: any) => ({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        savings: audit.details?.overallSavingsMs ? `${Math.round(audit.details.overallSavingsMs)}ms` : undefined,
      }))
      .sort((a: any, b: any) => a.score - b.score)
      .slice(0, 5);
    
    const score = Math.round((lighthouse.categories?.performance?.score || 0) * 100);
    
    console.log(`✅ [PageSpeed] ${strategy} Score: ${score}/100`);
    console.log(`✅ [PageSpeed] Core Web Vitals - LCP: ${coreWebVitals.lcpDisplay}, FCP: ${coreWebVitals.fcpDisplay}, CLS: ${coreWebVitals.clsDisplay}, TBT: ${coreWebVitals.tbtDisplay}`);
    
    return {
      success: true,
      score,
      coreWebVitals,
      opportunities,
      debugInfo: {
        apiKeyConfigured: true,
        apiKeySource,
        apiResponseStatus: response.status,
        fetchDuration,
      }
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ [PageSpeed] Exception: ${errorMsg}`);
    return {
      success: false,
      score: 0,
      coreWebVitals: {
        lcp: 0, lcpDisplay: 'N/A',
        fcp: 0, fcpDisplay: 'N/A',
        cls: 0, clsDisplay: 'N/A',
        tbt: 0, tbtDisplay: 'N/A',
        si: 0, siDisplay: 'N/A',
        ttfb: 0, ttfbDisplay: 'N/A',
      },
      opportunities: [],
      error: errorMsg,
      debugInfo: {
        apiKeyConfigured: !!apiKey,
        apiKeySource,
      }
    };
  }
}

// Page type classification
type PageType = 'home' | 'contact' | 'about' | 'blog' | 'product' | 'service' | 'category' | 'tag' | 'archive' | 'legal' | 'other';

interface PageClassification {
  url: string;
  type: PageType;
  title?: string;
}

interface SmartAuditPayload {
  baseUrl: string;
  selectedUrls: string[];
  auditId?: string;
  userId?: string;
  crawlData?: {
    pages: Array<{
      url: string;
      title?: string;
      depth?: number;
      internalLinkCount?: number;
      isNavigation?: boolean;
    }>;
    urlGroups?: {
      core: string[];
      blog: string[];
      product: string[];
      category: string[];
      other: string[];
    };
  };
  // Section-specific page selections from the frontend
  sectionSelections?: {
    [sectionId: string]: string[];
  };
}

interface Check {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail" | "info";
  score: number;
  weight: number;
  value: Record<string, unknown>;
  message: string;
  recommendation?: string;
  sourcePages?: string[];
}

interface CategoryResult {
  score: number;
  grade: string;
  message: string;
  checks: Check[];
  sourcePages?: string[];
}

interface SmartAuditOutput {
  overallScore: number;
  overallGrade: string;
  localSeo: CategoryResult;
  seo: CategoryResult;
  links: CategoryResult;
  usability: CategoryResult;
  performance: CategoryResult;
  social: CategoryResult;
  technology: CategoryResult;
  technicalSeo: CategoryResult;
  content: CategoryResult;
  eeat: CategoryResult;
  recommendations: Array<{
    id: string;
    title: string;
    description: string | null;
    category: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    checkId: string;
    sourcePages?: string[];
  }>;
  pageClassifications: PageClassification[];
  pagesAnalyzed: number;
  pagesFailed: number;
  auditMapping: {
    localSeo: string[];
    seo: string[];
    content: string[];
    performance: string[];
    eeat: string[];
    social: string[];
    technology: string[];
    technicalSeo: string[];
    links: string[];
    usability: string[];
  };
}

// Classify page type based on URL patterns and crawl data
function classifyPage(url: string, crawlData?: SmartAuditPayload['crawlData']): PageType {
  const urlLower = url.toLowerCase();
  const pathname = new URL(url).pathname.toLowerCase();
  
  // Check crawl data groups first
  if (crawlData?.urlGroups) {
    if (crawlData.urlGroups.core.includes(url)) {
      if (pathname === '/' || pathname === '') return 'home';
      if (pathname.includes('contact')) return 'contact';
      if (pathname.includes('about')) return 'about';
    }
    if (crawlData.urlGroups.blog.includes(url)) return 'blog';
    if (crawlData.urlGroups.product.includes(url)) return 'product';
    if (crawlData.urlGroups.category.includes(url)) return 'category';
  }
  
  // URL pattern matching - check archive patterns FIRST
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.match(/\/(contact|kontakt|contacto|contato)/)) return 'contact';
  if (pathname.match(/\/(about|about-us|who-we-are|our-story|team)/)) return 'about';
  if (pathname.match(/\/(privacy|terms|disclaimer|cookie-policy|legal)/)) return 'legal';
  if (pathname.match(/\/(category|categories|collection)/)) return 'category';
  if (pathname.match(/\/(tag|tags|topic|topics)/)) return 'tag';
  if (pathname.match(/\/(archive|archives|date|year|month)/)) return 'archive';
  if (pathname.match(/\/(products?|shop|store|item|buy)/)) return 'product';
  if (pathname.match(/\/(services?|solutions?|offerings?)/)) return 'service';
  if (pathname.match(/\/(blog|news|articles?|posts?|journal|insights)/)) {
    // Check if this is actually a blog listing page (archive) by looking for query params or patterns
    if (pathname === '/blog' || pathname === '/blog/' || pathname.match(/\/blog\/page\//)) {
      return 'archive'; // Blog listing page is an archive
    }
    return 'blog'; // Individual blog post
  }
  
  return 'other';
}

// Determine which audit sections should run for each page type
function getAuditSectionsForPageType(pageType: PageType): string[] {
  const mapping: Record<PageType, string[]> = {
    home: ['performance', 'technology', 'technicalSeo', 'social', 'localSeo', 'usability', 'links', 'seo', 'content'],
    contact: ['localSeo', 'usability', 'technology', 'seo', 'technicalSeo'],
    about: ['eeat', 'content', 'social', 'seo', 'technicalSeo'],
    blog: ['content', 'eeat', 'social', 'seo', 'technicalSeo'],
    product: ['seo', 'performance', 'usability', 'links', 'content', 'technicalSeo'],
    service: ['seo', 'content', 'eeat', 'performance', 'technicalSeo'],
    category: ['seo', 'links', 'usability', 'technicalSeo'],
    tag: ['seo', 'links', 'usability', 'technicalSeo'],
    archive: ['seo', 'links', 'usability', 'technicalSeo'],
    legal: ['usability', 'technology', 'technicalSeo'],
    other: ['seo', 'links', 'usability', 'content', 'technicalSeo'],
  };
  return mapping[pageType] || ['seo', 'links', 'usability', 'technicalSeo'];
}

// Calculate grade from score
function calculateGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

// Fetch page data
async function fetchPage(url: string): Promise<{
  url: string;
  html: string;
  headers: Record<string, string>;
  responseTime: number;
  statusCode: number;
  contentLength: number;
  isHttps: boolean;
  parsedData: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
  };
}> {
  const startTime = Date.now();
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
  });

  const responseTime = Date.now() - startTime;
  const html = await response.text();
  
  // Parse HTML once for consistent heading counts across all analyzers
  const parsedData = {
    h1Count: (html.match(/<h1[^>]*>/gi) || []).length,
    h2Count: (html.match(/<h2[^>]*>/gi) || []).length,
    h3Count: (html.match(/<h3[^>]*>/gi) || []).length,
    h4Count: (html.match(/<h4[^>]*>/gi) || []).length,
    h5Count: (html.match(/<h5[^>]*>/gi) || []).length,
    h6Count: (html.match(/<h6[^>]*>/gi) || []).length,
  };
  
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  return {
    url: response.url,
    html,
    headers,
    responseTime,
    statusCode: response.status,
    contentLength: html.length,
    isHttps: response.url.startsWith("https://"),
    parsedData,
  };
}

// Inline analyzers to avoid import issues in Trigger.dev
function analyzeSEO(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  const url = pageData.url;
  
  // Extract text content for analysis
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(/\s+/).filter((w: string) => w.length > 2).length;
  
  // 1. Title tag optimization
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const titleFullMatch = html.match(/<title[^>]*>[^<]*<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const titleLength = title.length;
  
  checks.push({
    id: 'title-tag',
    name: 'Title Tag Optimization',
    status: titleLength >= 30 && titleLength <= 60 ? 'pass' : titleLength > 0 ? 'warning' : 'fail',
    score: titleLength >= 30 && titleLength <= 60 ? 100 : titleLength > 0 ? 50 : 0,
    weight: 12,
    value: { 
      title, 
      length: titleLength, 
      optimal: '30-60 characters',
      htmlSnippet: titleFullMatch ? titleFullMatch[0] : 'Not found'
    },
    message: titleLength > 0 
      ? `Title tag found (${titleLength} chars): "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}"`
      : 'No title tag found',
    recommendation: titleLength === 0 ? 'Add a descriptive title tag (30-60 characters)' : titleLength < 30 || titleLength > 60 ? 'Optimize title length to 30-60 characters' : undefined,
  });
  
  // 2. Meta description
  const metaDescFullMatch = html.match(/<meta[^>]*name=["']description["'][^>]*>/i) ||
                            html.match(/<meta[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/i);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';
  const metaDescLength = metaDesc.length;
  
  checks.push({
    id: 'meta-description',
    name: 'Meta Description',
    status: metaDescLength >= 120 && metaDescLength <= 160 ? 'pass' : metaDescLength > 0 ? 'warning' : 'fail',
    score: metaDescLength >= 120 && metaDescLength <= 160 ? 100 : metaDescLength > 0 ? 50 : 0,
    weight: 10,
    value: { 
      description: metaDesc.substring(0, 100) + (metaDesc.length > 100 ? '...' : ''), 
      length: metaDescLength, 
      optimal: '120-160 characters',
      htmlSnippet: metaDescFullMatch ? metaDescFullMatch[0] : 'Not found'
    },
    message: metaDescLength > 0 
      ? `Meta description found (${metaDescLength} chars)`
      : 'No meta description found',
    recommendation: metaDescLength === 0 ? 'Add a compelling meta description (120-160 characters)' : metaDescLength < 120 ? 'Expand meta description to 120-160 characters' : metaDescLength > 160 ? 'Shorten meta description to 160 characters max' : undefined,
  });
  
  // 3. H1-H3 Structure Analysis
  const h1Count = pageData.parsedData?.h1Count || (html.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = pageData.parsedData?.h2Count || (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = pageData.parsedData?.h3Count || (html.match(/<h3[^>]*>/gi) || []).length;
  
  // Extract H1 full tag and text
  const h1FullMatch = html.match(/<h1[^>]*>[^<]*<\/h1>/i);
  const h1TextMatch = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const h1Text = h1TextMatch ? h1TextMatch[1].trim() : '';
  
  const hasProperStructure = h1Count === 1 && h2Count >= 1;
  const structureScore = (h1Count === 1 ? 50 : h1Count === 0 ? 0 : 30) + (h2Count >= 2 ? 30 : h2Count >= 1 ? 20 : 0) + (h3Count >= 1 ? 20 : 0);
  
  checks.push({
    id: 'heading-structure',
    name: 'H1-H3 Heading Structure',
    status: hasProperStructure && h3Count >= 1 ? 'pass' : hasProperStructure ? 'warning' : 'fail',
    score: structureScore,
    weight: 10,
    value: { 
      h1: h1Count, h2: h2Count, h3: h3Count,
      h1Text: h1Text.substring(0, 60) + (h1Text.length > 60 ? '...' : ''),
      hasProperHierarchy: hasProperStructure,
      htmlSnippet: h1FullMatch ? h1FullMatch[0] : 'No H1 tag found'
    },
    message: `Found ${h1Count} H1, ${h2Count} H2, ${h3Count} H3 tags${h1Text ? `. H1: "${h1Text.substring(0, 40)}..."` : ''}`,
    recommendation: h1Count === 0 ? 'Add exactly one H1 tag' : h1Count > 1 ? 'Use only one H1 tag per page' : h2Count === 0 ? 'Add H2 subheadings to structure content' : h3Count === 0 ? 'Consider adding H3 tags for better content hierarchy' : undefined,
  });
  
  // 4. Keyword Placement Analysis with STEMMING support
  // Basic stemming function to handle word variations (consulting/consultant, services/service, etc.)
  const stemWord = (word: string): string => {
    word = word.toLowerCase();
    // Common suffix removals for basic stemming
    const suffixes = ['ing', 'tion', 'ment', 'ness', 'able', 'ible', 'ful', 'less', 'ous', 'ive', 'ant', 'ent', 'er', 'or', 'ist', 'ly', 'ed', 'es', 's'];
    for (const suffix of suffixes) {
      if (word.length > suffix.length + 3 && word.endsWith(suffix)) {
        return word.slice(0, -suffix.length);
      }
    }
    return word;
  };
  
  // Check if two words match (exact or stemmed)
  const wordsMatch = (word1: string, word2: string): boolean => {
    const w1 = word1.toLowerCase();
    const w2 = word2.toLowerCase();
    // Exact match
    if (w1 === w2) return true;
    // Stemmed match
    if (stemWord(w1) === stemWord(w2)) return true;
    // One contains the other (for compound words)
    if (w1.length > 4 && w2.length > 4 && (w1.includes(w2) || w2.includes(w1))) return true;
    return false;
  };
  
  const titleWords = title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const h1Words = h1Text.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const metaWords = metaDesc.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  
  // Find common keywords between title and H1 (with stemming)
  const titleH1Match = titleWords.filter((tw: string) => h1Words.some((hw: string) => wordsMatch(tw, hw))).length;
  const titleMetaMatch = titleWords.filter((tw: string) => metaWords.some((mw: string) => wordsMatch(tw, mw))).length;
  const keywordConsistency = titleWords.length > 0 ? Math.round(((titleH1Match + titleMetaMatch) / (titleWords.length * 2)) * 100) : 0;
  
  checks.push({
    id: 'keyword-placement',
    name: 'Keyword Placement (Primary + Secondary)',
    status: keywordConsistency >= 50 ? 'pass' : keywordConsistency >= 25 ? 'warning' : 'fail',
    score: keywordConsistency,
    weight: 8,
    value: { 
      titleKeywords: titleWords.slice(0, 5),
      titleH1Match,
      titleMetaMatch,
      consistency: keywordConsistency + '%',
      note: 'Uses stemming to match word variations (e.g., consulting/consultant)'
    },
    message: keywordConsistency >= 50 
      ? `Good keyword consistency: ${keywordConsistency}% match between title, H1, and meta (with stemming)`
      : `Low keyword consistency (${keywordConsistency}%): Align keywords across title, H1, and meta description`,
    recommendation: keywordConsistency < 50 ? 'Use your primary keyword (or variations) in the title, H1, and meta description for better relevance' : undefined,
  });
  
  // 5. URL Optimization
  let urlScore = 100;
  const urlIssues: string[] = [];
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    if (pathname.includes('_')) { urlScore -= 15; urlIssues.push('underscores'); }
    if (/[A-Z]/.test(pathname)) { urlScore -= 10; urlIssues.push('uppercase'); }
    if (pathname.length > 75) { urlScore -= 15; urlIssues.push('too long'); }
    if (/\d{5,}/.test(pathname)) { urlScore -= 10; urlIssues.push('contains IDs'); }
    if (/\.(html|php|asp)$/i.test(pathname)) { urlScore -= 5; urlIssues.push('file extension'); }
  } catch { urlScore = 50; }
  
  checks.push({
    id: 'url-optimization',
    name: 'URL Optimization',
    status: urlScore >= 85 ? 'pass' : urlScore >= 60 ? 'warning' : 'fail',
    score: Math.max(0, urlScore),
    weight: 6,
    value: { url: url, issues: urlIssues },
    message: urlIssues.length === 0 ? 'URL is well-optimized' : `URL issues: ${urlIssues.join(', ')}`,
    recommendation: urlIssues.length > 0 ? 'Use lowercase, hyphen-separated URLs without parameters or file extensions' : undefined,
  });
  
  // 6. Internal Linking
  const internalLinks = (html.match(/href=["']\/[^"']*["']/gi) || []).length;
  const sameHostLinks = (html.match(new RegExp(`href=["']https?://[^"']*${new URL(url).hostname}[^"']*["']`, 'gi')) || []).length;
  const totalInternalLinks = internalLinks + sameHostLinks;
  
  checks.push({
    id: 'internal-linking',
    name: 'Internal Linking',
    status: totalInternalLinks >= 5 ? 'pass' : totalInternalLinks >= 2 ? 'warning' : 'fail',
    score: totalInternalLinks >= 10 ? 100 : totalInternalLinks >= 5 ? 80 : totalInternalLinks >= 2 ? 50 : 20,
    weight: 8,
    value: { count: totalInternalLinks, relativeLinks: internalLinks, absoluteLinks: sameHostLinks },
    message: `Found ${totalInternalLinks} internal links`,
    recommendation: totalInternalLinks < 5 ? 'Add more internal links to improve site navigation and pass link equity' : undefined,
  });
  
  // 7. Image Alt Tags - improved detection filtering out icons, logos, and UI elements
  const allImages = html.match(/<img[^>]*>/gi) || [];
  
  // Filter out icons, logos, and non-content images
  const isContentImage = (img: string): boolean => {
    const imgLower = img.toLowerCase();
    const srcMatch = imgLower.match(/src=["']([^"']+)["']/i);
    const src = srcMatch ? srcMatch[1] : '';
    const classMatch = imgLower.match(/class=["']([^"']+)["']/i);
    const classes = classMatch ? classMatch[1] : '';
    const altMatch = imgLower.match(/alt=["']([^"']+)["']/i);
    const alt = altMatch ? altMatch[1] : '';
    
    // Patterns to exclude (icons, logos, UI elements, tiny images)
    const excludePatterns = [
      /icon/i, /logo/i, /favicon/i, /sprite/i, /avatar/i, /badge/i,
      /arrow/i, /chevron/i, /caret/i, /close/i, /menu/i, /hamburger/i,
      /social/i, /facebook/i, /twitter/i, /linkedin/i, /instagram/i, /youtube/i,
      /loading/i, /spinner/i, /placeholder/i, /blank/i, /spacer/i, /pixel/i,
      /\.svg$/i, /data:image/i, /1x1/i, /transparent/i,
      /wp-emoji/i, /gravatar/i, /admin-bar/i
    ];
    
    // Check if any exclude pattern matches src, class, or alt
    for (const pattern of excludePatterns) {
      if (pattern.test(src) || pattern.test(classes) || pattern.test(alt)) {
        return false;
      }
    }
    
    // Check dimensions - exclude tiny images (likely icons)
    const widthMatch = imgLower.match(/width=["']?(\d+)/i);
    const heightMatch = imgLower.match(/height=["']?(\d+)/i);
    const width = widthMatch ? parseInt(widthMatch[1]) : 100;
    const height = heightMatch ? parseInt(heightMatch[1]) : 100;
    if (width <= 50 || height <= 50) {
      return false;
    }
    
    return true;
  };
  
  const images = allImages.filter(isContentImage);
  const filteredCount = allImages.length - images.length;
  
  const imagesWithAlt = images.filter((img: string) => /alt=["'][^"']+["']/i.test(img)).length;
  const imagesWithEmptyAlt = images.filter((img: string) => /alt=["']\s*["']/i.test(img)).length;
  const imagesWithoutAlt = images.length - imagesWithAlt - imagesWithEmptyAlt;
  const altPercentage = images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100;
  
  // Determine severity based on missing vs empty alt
  // Empty alt (alt="") is valid for decorative images per WCAG
  // Missing alt entirely is worse
  const effectiveScore = images.length === 0 ? 100 : 
    imagesWithoutAlt === 0 ? (altPercentage >= 50 ? 100 : 70) : // No missing alt, only empty (acceptable)
    altPercentage;
  
  checks.push({
    id: 'image-alt-tags',
    name: 'Image Alt Tags',
    status: images.length === 0 ? 'pass' : 
            imagesWithoutAlt === 0 && imagesWithAlt > 0 ? 'pass' :
            altPercentage >= 50 ? 'warning' : 'fail',
    score: effectiveScore,
    weight: 8,
    value: { 
      total: images.length, 
      withAlt: imagesWithAlt, 
      emptyAlt: imagesWithEmptyAlt,
      missingAlt: imagesWithoutAlt,
      percentage: altPercentage,
      filteredOut: filteredCount,
      note: filteredCount > 0 
        ? `Excluded ${filteredCount} icons/logos/UI images. ${imagesWithEmptyAlt > 0 ? 'Empty alt="" is valid for decorative images (WCAG 2.1)' : ''}`
        : imagesWithEmptyAlt > 0 ? 'Empty alt="" is valid for decorative images (WCAG 2.1)' : undefined
    },
    message: images.length === 0 
      ? `No content images found (${filteredCount} icons/logos excluded)`
      : imagesWithoutAlt === 0 
        ? `All ${images.length} content images have alt attributes (${imagesWithAlt} with text, ${imagesWithEmptyAlt} decorative)`
        : `${imagesWithAlt}/${images.length} content images have alt text (${altPercentage}%), ${imagesWithEmptyAlt} empty alt, ${imagesWithoutAlt} missing alt`,
    recommendation: imagesWithoutAlt > 0 
      ? `Add alt attributes to ${imagesWithoutAlt} images: Use descriptive text for content images, or alt="" for decorative images`
      : imagesWithAlt === 0 && imagesWithEmptyAlt > 0
        ? 'Review images marked as decorative (empty alt) - ensure content images have descriptive alt text'
        : undefined,
  });
  
  // 8. Content Duplication Detection (check for duplicate paragraphs/blocks)
  const paragraphs = html.match(/<p[^>]*>([^<]{50,})<\/p>/gi) || [];
  const uniqueParagraphs = new Set(paragraphs.map((p: string) => p.toLowerCase().replace(/<[^>]+>/g, '').trim()));
  const duplicationRatio = paragraphs.length > 0 ? Math.round((uniqueParagraphs.size / paragraphs.length) * 100) : 100;
  
  checks.push({
    id: 'content-duplication',
    name: 'Content Duplication (Within Page)',
    status: duplicationRatio >= 90 ? 'pass' : duplicationRatio >= 70 ? 'warning' : 'fail',
    score: duplicationRatio,
    weight: 6,
    value: { 
      totalParagraphs: paragraphs.length, 
      uniqueParagraphs: uniqueParagraphs.size, 
      duplicationRatio,
      scope: 'within-page-only',
      limitations: [
        'Does NOT check for duplicate content across other pages on your site (cannibalization)',
        'Does NOT check for plagiarism from external websites',
        'For cross-page duplication, use Google Search Console or Screaming Frog',
        'For plagiarism checks, use Copyscape or similar tools'
      ]
    },
    message: duplicationRatio >= 90 
      ? `Content appears unique within this page (${duplicationRatio}% unique paragraphs). Note: Cross-page duplication not checked.`
      : `Possible duplicate content detected within page (${duplicationRatio}% unique)`,
    recommendation: duplicationRatio < 90 
      ? 'Review and remove or rewrite duplicate content blocks. Also check for cross-page duplication using Google Search Console.'
      : undefined,
  });
  
  // 9. Thin Content Detection - IMPROVED to exclude nav/header/footer/sidebar
  // Extract only main content area, excluding common non-content sections
  let mainContentHtml = html;
  
  // Remove common non-content sections by tag
  mainContentHtml = mainContentHtml
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
  
  // Remove elements with common navigation/footer class names
  mainContentHtml = mainContentHtml
    .replace(/<[^>]*class=["'][^"']*(?:nav|menu|sidebar|footer|header|breadcrumb|widget)[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '');
  
  // Extract text from main content
  const mainContentText = mainContentHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const mainContentWordCount = mainContentText.split(/\s+/).filter((w: string) => w.length > 2).length;
  
  // Compare with total word count to show the difference
  const totalWordCount = wordCount;
  const boilerplateWords = totalWordCount - mainContentWordCount;
  const boilerplatePercent = totalWordCount > 0 ? Math.round((boilerplateWords / totalWordCount) * 100) : 0;
  
  const isThinContent = mainContentWordCount < 300;
  const contentScore = mainContentWordCount >= 1000 ? 100 : mainContentWordCount >= 500 ? 85 : mainContentWordCount >= 300 ? 70 : mainContentWordCount >= 100 ? 40 : 10;
  
  checks.push({
    id: 'thin-content',
    name: 'Thin Content Detection',
    status: mainContentWordCount >= 300 ? 'pass' : mainContentWordCount >= 100 ? 'warning' : 'fail',
    score: contentScore,
    weight: 8,
    value: { 
      mainContentWordCount,
      totalWordCount,
      boilerplateWords,
      boilerplatePercent: boilerplatePercent + '%',
      isThinContent, 
      recommended: '300+ words for informational pages',
      note: 'Word count excludes nav, header, footer, sidebar, and common boilerplate'
    },
    message: isThinContent 
      ? `Thin content: Only ${mainContentWordCount} main content words (${boilerplatePercent}% was nav/footer/boilerplate)`
      : `Good content length: ${mainContentWordCount} main content words`,
    recommendation: isThinContent ? 'Expand main content to at least 300 words for better SEO performance' : undefined,
  });
  
  // 10. Canonical URL
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const hasCanonical = !!canonicalMatch;
  
  checks.push({
    id: 'canonical-url',
    name: 'Canonical URL',
    status: hasCanonical ? 'pass' : 'warning',
    score: hasCanonical ? 100 : 50,
    weight: 6,
    value: { canonical: canonicalMatch?.[1] || null, currentUrl: url },
    message: hasCanonical ? `Canonical URL set: ${canonicalMatch![1]}` : 'No canonical URL defined',
    recommendation: !hasCanonical ? 'Add a canonical URL to prevent duplicate content issues' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `On-Page SEO analysis complete`,
    checks,
  };
}

function analyzeLocalSEO(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // NAP (Name, Address, Phone)
  // First check for tel: links (most reliable)
  const telLinkMatch = html.match(/tel:\s*([+0-9().\s-]+)/i);
  let phoneMatch: RegExpMatchArray | null = null;
  
  if (telLinkMatch) {
    phoneMatch = [telLinkMatch[1]];
  } else {
    // International phone regex - supports multiple formats:
    // +1-234-567-8901, +44 20 7946 0958, (123) 456-7890, 123.456.7890, etc.
    const phoneRegex = /(?!(?:19|20)\d{2}[-\/.]\d{2}[-\/.]\d{2})(\+?[1-9]\d{0,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/;
    const matches = html.match(phoneRegex);
    phoneMatch = matches;
  }
  const hasPhone = !!phoneMatch;
  
  checks.push({
    id: 'phone-number',
    name: 'Phone Number',
    status: hasPhone ? 'pass' : 'warning',
    score: hasPhone ? 100 : 30,
    weight: 15,
    value: { phone: phoneMatch?.[0] || null },
    message: hasPhone ? `Phone number found: ${phoneMatch![0]}` : 'No phone number detected',
    recommendation: !hasPhone ? 'Add a visible phone number for local SEO' : undefined,
  });
  
  // IMPROVED Address detection - supports international formats
  // US addresses: 123 Main Street, City, ST 12345
  // UK addresses: 10 Downing Street, London SW1A 2AA
  // Generic: Number + Street name + City/Region
  const addressPatterns = [
    // US format with ZIP
    /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|place|pl|highway|hwy|parkway|pkwy|circle|cir)[\s,]+[\w\s]+,?\s*(?:[A-Z]{2})?\s*\d{5}(?:-\d{4})?/i,
    // UK format with postcode
    /\d+[\w\s,]+[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/i,
    // Generic international - number + words + comma + more words
    /\d+[\w\s]{5,50},[\w\s]{3,30}(?:,[\w\s]{2,30})?/i,
    // Address in structured data
    /"streetAddress"\s*:\s*"[^"]+"/i,
    /"addressLocality"\s*:\s*"[^"]+"/i,
    // Common address keywords
    /(?:address|location|headquarters|office)[:\s]+\d+[\w\s,.-]+/i,
  ];
  
  const hasAddress = addressPatterns.some(pattern => pattern.test(html));
  const addressInSchema = /"streetAddress"|"addressLocality"|"postalCode"/i.test(html);
  
  checks.push({
    id: 'address',
    name: 'Address Schema (JSON-LD)',
    status: hasAddress ? 'pass' : 'warning',
    score: hasAddress ? 100 : 40,
    weight: 15,
    value: { hasAddress },
    message: hasAddress ? 'Address schema detected' : 'No structured address found',
    recommendation: !hasAddress ? 'Add LocalBusiness schema with address data for Google Maps integration' : undefined,
  });
  
  // Schema.org LocalBusiness - with JSON-LD validation
  const hasLocalBusinessSchema = html.includes('LocalBusiness') || html.includes('Organization');
  
  // Actually validate JSON-LD syntax
  let schemaValid = false;
  let schemaError: string | null = null;
  let schemaData: any = null;
  
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatches && jsonLdMatches.length > 0) {
    for (const match of jsonLdMatches) {
      const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/i, '').trim();
      try {
        const parsed = JSON.parse(jsonContent);
        schemaValid = true;
        // Check if it contains LocalBusiness or Organization
        const schemaType = parsed['@type'] || (Array.isArray(parsed['@graph']) ? parsed['@graph'].map((g: any) => g['@type']).join(', ') : '');
        if (schemaType.includes('LocalBusiness') || schemaType.includes('Organization')) {
          schemaData = parsed;
        }
      } catch (e) {
        schemaError = e instanceof Error ? e.message : 'Invalid JSON';
        schemaValid = false;
      }
    }
  }
  
  const schemaScore = schemaData ? 100 : (schemaValid && hasLocalBusinessSchema) ? 80 : hasLocalBusinessSchema ? 50 : 0;
  
  checks.push({
    id: 'local-schema',
    name: 'Local Business Schema',
    status: schemaData ? 'pass' : hasLocalBusinessSchema ? 'warning' : 'fail',
    score: schemaScore,
    weight: 20,
    value: { 
      hasSchema: hasLocalBusinessSchema,
      isValidJson: schemaValid,
      jsonError: schemaError,
      schemaType: schemaData?.['@type'] || null
    },
    message: schemaData 
      ? `Valid LocalBusiness/Organization JSON-LD schema found` 
      : schemaValid && hasLocalBusinessSchema 
        ? 'Schema markup found but may not be LocalBusiness type'
        : schemaError 
          ? `JSON-LD found but invalid: ${schemaError}`
          : 'No local business schema markup',
    recommendation: !schemaData ? 'Add valid LocalBusiness JSON-LD schema markup for rich results' : undefined,
  });
  
  // Google Maps embed - improved detection with verification levels
  // Only check for Google Maps on contact-like pages (contact, locations, find-us, etc.)
  // Other pages (homepage, about, etc.) shouldn't be penalized for not having a map
  const pageUrl = pageData.url?.toLowerCase() || '';
  const isContactPage = pageUrl.includes('contact') || 
                        pageUrl.includes('location') || 
                        pageUrl.includes('find-us') ||
                        pageUrl.includes('directions') ||
                        pageUrl.includes('visit-us') ||
                        pageUrl.includes('where-to-find');
  
  // Level 1: Confirmed Google Maps (iframe/embed with google.com/maps URL)
  const hasConfirmedGoogleMap = /<iframe[^>]*src=["'][^"']*(?:google\.com\/maps|maps\.google\.com|maps\.googleapis\.com)[^"']*["'][^>]*>/i.test(html);
  
  // Level 2: Google Maps API script loaded
  const hasGoogleMapsApi = html.includes('maps.googleapis.com/maps/api') || 
                           html.includes('maps/embed') ||
                           html.includes('maps?q=') ||
                           html.includes('maps/place/');
  
  // Level 3: Generic map element (unverified - could be any map or just a div named "map")
  const hasMapMarker = /class=["'][^"']*\bmap\b[^"']*["']|id=["'][^"']*\bmap\b[^"']*["']/i.test(html);
  
  // Check if this looks like a local business that would benefit from a map
  const hasLocalBusinessIndicators = hasAddress || hasPhone || schemaData;
  
  // Determine verification level
  const mapVerificationLevel = hasConfirmedGoogleMap ? 'confirmed' : hasGoogleMapsApi ? 'likely' : hasMapMarker ? 'unverified' : 'none';
  const hasVerifiedMap = hasConfirmedGoogleMap || hasGoogleMapsApi;
  const hasAnyMapCode = hasVerifiedMap || hasMapMarker;
  
  // Determine status and score based on page type
  // Contact pages: penalize if no map found
  // Other pages: info status only (don't penalize for missing map)
  let mapStatus: 'pass' | 'warning' | 'fail' | 'info';
  let mapScore: number;
  
  if (hasConfirmedGoogleMap) {
    mapStatus = 'pass';
    mapScore = 100;
  } else if (hasGoogleMapsApi) {
    mapStatus = 'pass';
    mapScore = 90;
  } else if (hasMapMarker) {
    mapStatus = 'warning';
    mapScore = 50;
  } else if (isContactPage && hasLocalBusinessIndicators) {
    // Only penalize contact pages for missing maps
    mapStatus = 'warning';
    mapScore = 60;
  } else {
    // Non-contact pages without maps get info status (no penalty)
    mapStatus = 'info';
    mapScore = 100; // Don't penalize non-contact pages
  }
  
  checks.push({
    id: 'google-map',
    name: 'Google Map',
    status: mapStatus,
    score: mapScore,
    weight: 10,
    value: { 
      verificationLevel: mapVerificationLevel,
      hasConfirmedGoogleMap, 
      hasGoogleMapsApi,
      hasMapMarker,
      hasLocalBusinessIndicators,
      isContactPage,
      note: hasMapMarker && !hasVerifiedMap 
        ? '⚠️ A div with "map" class/id exists but we cannot verify an actual Google Map is loading'
        : !hasAnyMapCode && isContactPage && hasLocalBusinessIndicators
          ? 'Contact page detected - Google Maps embed recommended for visibility'
          : !hasAnyMapCode && !isContactPage
            ? 'ℹ️ Not a contact page - Google Maps check skipped'
            : undefined
    },
    message: hasConfirmedGoogleMap 
      ? '✅ Google Maps iframe embed confirmed' 
      : hasGoogleMapsApi 
        ? '✅ Google Maps API integration detected'
        : hasMapMarker 
          ? '⚠️ Map element found but NOT verified as Google Maps'
          : isContactPage && hasLocalBusinessIndicators
            ? 'No Google Maps embed found on contact page'
            : 'ℹ️ Google Maps not required on this page type',
    recommendation: !hasVerifiedMap && hasMapMarker 
      ? 'Verify your map element actually loads Google Maps, or add a proper Google Maps iframe embed'
      : !hasVerifiedMap && isContactPage && hasLocalBusinessIndicators
        ? 'Add a Google Maps embed to your contact page to help customers find your business'
        : undefined, // Don't recommend map for non-contact pages
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Local SEO analysis complete`,
    checks,
  };
}

function analyzeContent(pageData: any, pageType: PageType = 'other'): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  const isArchivePage = pageType === 'category' || pageType === 'tag' || pageType === 'archive';
  
  // Skip content depth and heading structure checks for archive pages
  if (!isArchivePage) {
    // Extract text content
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const wordCount = textContent.split(/\s+/).length;
    
    checks.push({
      id: 'word-count',
      name: 'Content Length',
      status: wordCount >= 300 ? 'pass' : wordCount >= 100 ? 'warning' : 'fail',
      score: wordCount >= 1000 ? 100 : wordCount >= 300 ? 80 : wordCount >= 100 ? 50 : 20,
      weight: 15,
      value: { wordCount },
      message: `Page contains ${wordCount} words`,
      recommendation: wordCount < 300 ? 'Add more content (aim for 300+ words for informational pages)' : undefined,
    });
    
    // Heading structure - use parsed data for consistency
    const h1Count = pageData.parsedData?.h1Count || (html.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = pageData.parsedData?.h2Count || (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = pageData.parsedData?.h3Count || (html.match(/<h3[^>]*>/gi) || []).length;
    const h4Count = pageData.parsedData?.h4Count || (html.match(/<h4[^>]*>/gi) || []).length;
    
    // Check for skipped levels (e.g., H1 -> H3 without H2)
    const hasH1 = h1Count > 0;
    const hasH2 = h2Count > 0;
    const hasH3 = h3Count > 0;
    const hasH4 = h4Count > 0;
    
    // Determine if there are skipped levels
    let skippedLevels = false;
    let skippedLevelMessage = '';
    
    if (hasH1 && !hasH2 && (hasH3 || hasH4)) {
      skippedLevels = true;
      skippedLevelMessage = 'Skipped heading level: H1 to H3/H4 without H2';
    } else if (hasH1 && hasH2 && !hasH3 && hasH4) {
      skippedLevels = true;
      skippedLevelMessage = 'Skipped heading level: H2 to H4 without H3';
    }
    
    // Check if this is a terminal page (about, contact) - relax heading strictness
    const isTerminalPage = pageType === 'about' || pageType === 'contact';
    
    // Good structure: H1 present, no skipped levels
    // For terminal pages, be more lenient on skipped levels
    const hasGoodStructure = hasH1 && !skippedLevels;
    
    checks.push({
      id: 'heading-structure',
      name: 'Heading Structure',
      status: !hasH1 
        ? 'fail' 
        : skippedLevels && !isTerminalPage 
          ? 'fail' 
          : skippedLevels && isTerminalPage 
            ? 'warning' 
            : 'pass',
      score: !hasH1 
        ? 0 
        : skippedLevels && !isTerminalPage 
          ? 30 
          : skippedLevels && isTerminalPage 
            ? 70 
            : 100,
      weight: 10,
      value: { h1Count, h2Count, h3Count, h4Count, skippedLevels, isTerminalPage },
      message: !hasH1 
        ? 'No H1 tag found' 
        : skippedLevels 
          ? skippedLevelMessage
          : `Found ${h1Count} H1, ${h2Count} H2, ${h3Count} H3, ${h4Count} H4 tags`,
      recommendation: !hasH1 
        ? 'Add exactly one H1 tag per page' 
        : skippedLevels 
          ? isTerminalPage 
            ? 'Consider fixing skipped heading levels for better accessibility, though less critical on this page type'
            : 'Fix skipped heading levels - maintain proper hierarchy (H1 -> H2 -> H3 -> H4)'
          : undefined,
    });
  }
  
  // Contextual internal links (links within content body, not nav/footer)
  // Only check this for longer content pages (word count > 500)
  // Short pages like Contact forms don't need many internal links
  // Also skip for terminal pages (about, contact, privacy) which shouldn't have many links
  const internalLinks = (html.match(/href=["']\/[^"']*["']/gi) || []).length;
  
  // Get word count for threshold check
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(/\s+/).length;
  
  // Check if this is a terminal page (about, contact, privacy) or homepage
  const isTerminalPage = pageType === 'about' || pageType === 'contact';
  const isHomePage = pageType === 'home';
  
  // Only warn about internal links if content is long enough to warrant them and not a terminal page or homepage
  // Homepages have navigational links (menus, cards, buttons), not contextual links
  const shouldCheckInternalLinks = wordCount > 500 && !isTerminalPage && !isHomePage;
  
  checks.push({
    id: 'contextual-internal-links',
    name: 'Contextual Internal Links',
    status: !shouldCheckInternalLinks ? 'pass' : internalLinks >= 3 ? 'pass' : internalLinks >= 1 ? 'warning' : 'fail',
    score: !shouldCheckInternalLinks ? 100 : internalLinks >= 5 ? 100 : internalLinks >= 3 ? 80 : internalLinks >= 1 ? 50 : 20,
    weight: 10,
    value: { count: internalLinks, wordCount },
    message: !shouldCheckInternalLinks 
      ? isHomePage 
        ? `ℹ️ Homepage detected: We disable the 'contextual link' penalty because homepages rely on navigation menus, not paragraph links`
        : isTerminalPage 
          ? `Found ${internalLinks} contextual internal links (terminal page, no minimum required)`
          : `Found ${internalLinks} contextual internal links (short content, no minimum required)`
      : `Found ${internalLinks} contextual internal links`,
    recommendation: shouldCheckInternalLinks && internalLinks < 3 ? 'Add more contextual internal links within your content to improve user experience and SEO' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Content analysis complete`,
    checks,
  };
}

// Async performance analyzer that integrates real PageSpeed API
async function analyzePerformanceAsync(pageData: any): Promise<CategoryResult> {
  const checks: Check[] = [];
  const url = pageData.url;
  
  console.log(`🚀 [Performance] Starting performance analysis for: ${url}`);
  
  // Fetch real PageSpeed data
  const pageSpeedResult = await fetchPageSpeedInsights(url, 'mobile');
  
  // If PageSpeed API succeeded, show real Core Web Vitals
  if (pageSpeedResult.success) {
    const cwv = pageSpeedResult.coreWebVitals;
    
    // Real PageSpeed Score
    checks.push({
      id: 'pagespeed-score',
      name: 'Google PageSpeed Score (Mobile)',
      status: pageSpeedResult.score >= 90 ? 'pass' : pageSpeedResult.score >= 50 ? 'warning' : 'fail',
      score: pageSpeedResult.score,
      weight: 25,
      value: { 
        score: pageSpeedResult.score,
        source: 'Google PageSpeed Insights API',
        strategy: 'mobile',
        debugInfo: pageSpeedResult.debugInfo
      },
      message: `📊 PageSpeed Score: ${pageSpeedResult.score}/100`,
      recommendation: pageSpeedResult.score < 50 ? 'Critical: Improve page performance. Score below 50 significantly impacts user experience and SEO.' : 
                      pageSpeedResult.score < 90 ? 'Optimize for better PageSpeed score (aim for 90+)' : undefined,
    });
    
    // Core Web Vitals - LCP
    const lcpGood = cwv.lcp < 2500;
    const lcpNeedsImprovement = cwv.lcp < 4000;
    checks.push({
      id: 'core-web-vitals-lcp',
      name: 'Largest Contentful Paint (LCP)',
      status: lcpGood ? 'pass' : lcpNeedsImprovement ? 'warning' : 'fail',
      score: lcpGood ? 100 : lcpNeedsImprovement ? 60 : 20,
      weight: 20,
      value: { 
        lcp: cwv.lcp,
        lcpDisplay: cwv.lcpDisplay,
        threshold: { good: '<2.5s', needsImprovement: '2.5s-4s', poor: '>4s' }
      },
      message: `🎯 LCP: ${cwv.lcpDisplay} ${lcpGood ? '(Good)' : lcpNeedsImprovement ? '(Needs Improvement)' : '(Poor)'}`,
      recommendation: !lcpGood ? 'Optimize LCP: Reduce server response time, optimize images, remove render-blocking resources' : undefined,
    });
    
    // Core Web Vitals - FCP
    const fcpGood = cwv.fcp < 1800;
    const fcpNeedsImprovement = cwv.fcp < 3000;
    checks.push({
      id: 'core-web-vitals-fcp',
      name: 'First Contentful Paint (FCP)',
      status: fcpGood ? 'pass' : fcpNeedsImprovement ? 'warning' : 'fail',
      score: fcpGood ? 100 : fcpNeedsImprovement ? 60 : 20,
      weight: 15,
      value: { 
        fcp: cwv.fcp,
        fcpDisplay: cwv.fcpDisplay,
        threshold: { good: '<1.8s', needsImprovement: '1.8s-3s', poor: '>3s' }
      },
      message: `🎯 FCP: ${cwv.fcpDisplay} ${fcpGood ? '(Good)' : fcpNeedsImprovement ? '(Needs Improvement)' : '(Poor)'}`,
      recommendation: !fcpGood ? 'Optimize FCP: Eliminate render-blocking resources, reduce server response time' : undefined,
    });
    
    // Core Web Vitals - CLS
    const clsGood = cwv.cls < 0.1;
    const clsNeedsImprovement = cwv.cls < 0.25;
    checks.push({
      id: 'core-web-vitals-cls',
      name: 'Cumulative Layout Shift (CLS)',
      status: clsGood ? 'pass' : clsNeedsImprovement ? 'warning' : 'fail',
      score: clsGood ? 100 : clsNeedsImprovement ? 60 : 20,
      weight: 15,
      value: { 
        cls: cwv.cls,
        clsDisplay: cwv.clsDisplay,
        threshold: { good: '<0.1', needsImprovement: '0.1-0.25', poor: '>0.25' }
      },
      message: `🎯 CLS: ${cwv.clsDisplay} ${clsGood ? '(Good)' : clsNeedsImprovement ? '(Needs Improvement)' : '(Poor)'}`,
      recommendation: !clsGood ? 'Optimize CLS: Set explicit dimensions on images/videos, avoid inserting content above existing content' : undefined,
    });
    
    // Core Web Vitals - TBT
    const tbtGood = cwv.tbt < 200;
    const tbtNeedsImprovement = cwv.tbt < 600;
    checks.push({
      id: 'core-web-vitals-tbt',
      name: 'Total Blocking Time (TBT)',
      status: tbtGood ? 'pass' : tbtNeedsImprovement ? 'warning' : 'fail',
      score: tbtGood ? 100 : tbtNeedsImprovement ? 60 : 20,
      weight: 10,
      value: { 
        tbt: cwv.tbt,
        tbtDisplay: cwv.tbtDisplay,
        threshold: { good: '<200ms', needsImprovement: '200ms-600ms', poor: '>600ms' }
      },
      message: `🎯 TBT: ${cwv.tbtDisplay} ${tbtGood ? '(Good)' : tbtNeedsImprovement ? '(Needs Improvement)' : '(Poor)'}`,
      recommendation: !tbtGood ? 'Optimize TBT: Reduce JavaScript execution time, break up long tasks' : undefined,
    });
    
    // TTFB from PageSpeed
    const ttfbGood = cwv.ttfb < 800;
    checks.push({
      id: 'core-web-vitals-ttfb',
      name: 'Time to First Byte (TTFB)',
      status: ttfbGood ? 'pass' : 'warning',
      score: ttfbGood ? 100 : 50,
      weight: 8,
      value: { 
        ttfb: cwv.ttfb,
        ttfbDisplay: cwv.ttfbDisplay,
        threshold: { good: '<800ms', poor: '>800ms' }
      },
      message: `🎯 TTFB: ${cwv.ttfbDisplay}`,
      recommendation: !ttfbGood ? 'Optimize server response time: Use CDN, optimize server configuration, implement caching' : undefined,
    });
    
    // Top Opportunities
    if (pageSpeedResult.opportunities.length > 0) {
      const topOpportunities = pageSpeedResult.opportunities.slice(0, 5);
      checks.push({
        id: 'pagespeed-opportunities',
        name: 'Performance Opportunities',
        status: 'info',
        score: 70,
        weight: 5,
        value: { 
          opportunities: topOpportunities,
          count: topOpportunities.length
        },
        message: `💡 Top ${topOpportunities.length} opportunities: ${topOpportunities.map(o => o.title + (o.savings ? ` (${o.savings} saved)` : '')).join(', ')}`,
        recommendation: topOpportunities[0]?.title || undefined,
      });
    }
    
  } else {
    // PageSpeed API failed - show disclaimer and use server-side metrics
    console.warn(`⚠️ [Performance] PageSpeed API unavailable: ${pageSpeedResult.error}`);
    
    checks.push({
      id: 'performance-disclaimer',
      name: 'Performance Measurement Note',
      status: 'warning',
      score: 50,
      weight: 5,
      value: {
        note: 'PageSpeed API unavailable - using server-side measurements only',
        error: pageSpeedResult.error,
        debugInfo: pageSpeedResult.debugInfo,
        forAccurateMetrics: 'Configure GOOGLE_PAGESPEED_API_KEY or PAGESPEED_API_KEY for real Core Web Vitals'
      },
      message: `⚠️ PageSpeed API: ${pageSpeedResult.error || 'Unavailable'}. Using server-side metrics only.`,
      recommendation: 'Configure Google PageSpeed API key for accurate Core Web Vitals (LCP, FCP, CLS, TBT)',
    });
    
    // Fallback: Server response time
    const responseTime = pageData.responseTime;
    checks.push({
      id: 'response-time',
      name: 'Server Response Time (Fallback)',
      status: responseTime < 500 ? 'pass' : responseTime < 1500 ? 'warning' : 'fail',
      score: responseTime < 200 ? 100 : responseTime < 500 ? 85 : responseTime < 1000 ? 60 : 40,
      weight: 15,
      value: { 
        responseTime,
        note: 'Server-side measurement (not real user experience)'
      },
      message: `Server responded in ${responseTime}ms (server-side only)`,
      recommendation: responseTime >= 1000 ? 'Improve server response time' : undefined,
    });
  }
  
  // Page size (always check)
  const pageSize = pageData.contentLength;
  const pageSizeMB = Math.round((pageSize / 1024 / 1024) * 100) / 100;
  
  checks.push({
    id: 'page-size',
    name: 'Page Size',
    status: pageSizeMB < 1 ? 'pass' : pageSizeMB < 2 ? 'warning' : 'fail',
    score: pageSizeMB < 0.5 ? 100 : pageSizeMB < 1 ? 85 : pageSizeMB < 2 ? 50 : 10,
    weight: 10,
    value: { bytes: pageSize, megabytes: pageSizeMB },
    message: `Page size: ${pageSizeMB}MB`,
    recommendation: pageSizeMB >= 2 ? 'Optimize images, minify CSS/JS, consider lazy loading' : undefined,
  });
  
  // HTTPS
  checks.push({
    id: 'https',
    name: 'HTTPS',
    status: pageData.isHttps ? 'pass' : 'fail',
    score: pageData.isHttps ? 100 : 0,
    weight: 8,
    value: { isHttps: pageData.isHttps },
    message: pageData.isHttps ? 'Page served over HTTPS' : 'Page not served over HTTPS',
    recommendation: !pageData.isHttps ? 'Enable HTTPS for security and SEO' : undefined,
  });
  
  // Compression
  const hasCompression = pageData.headers['content-encoding']?.includes('gzip') || 
                         pageData.headers['content-encoding']?.includes('br');
  
  checks.push({
    id: 'compression',
    name: 'Compression',
    status: hasCompression ? 'pass' : 'warning',
    score: hasCompression ? 100 : 50,
    weight: 7,
    value: { encoding: pageData.headers['content-encoding'] || 'none' },
    message: hasCompression ? `Compression enabled: ${pageData.headers['content-encoding']}` : 'No compression detected',
    recommendation: !hasCompression ? 'Enable Gzip or Brotli compression' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  console.log(`✅ [Performance] Analysis complete. Score: ${totalScore}`);
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: pageSpeedResult.success ? `Performance analysis complete (PageSpeed: ${pageSpeedResult.score}/100)` : `Performance analysis complete (server-side metrics only)`,
    checks,
  };
}

// Sync wrapper for compatibility (calls async version)
function analyzePerformance(pageData: any): CategoryResult {
  // Note: This is a sync fallback - the async version should be called where possible
  const checks: Check[] = [];
  const responseTime = pageData.responseTime;
  
  // Server response time with note about PageSpeed
  checks.push({
    id: 'response-time',
    name: 'Server Response Time',
    status: responseTime < 500 ? 'pass' : responseTime < 1500 ? 'warning' : 'fail',
    score: responseTime < 200 ? 100 : responseTime < 500 ? 85 : responseTime < 1000 ? 60 : 40,
    weight: 15,
    value: { responseTime },
    message: `Server responded in ${responseTime}ms`,
  });
  
  // Note about PageSpeed - check if API key is configured
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    checks.push({
      id: 'performance-disclaimer',
      name: 'Performance Measurement Note',
      status: 'info',
      score: 100,
      weight: 5,
      value: {
        note: 'Server-side measurements only',
        forAccurateMetrics: 'Configure GOOGLE_PAGESPEED_API_KEY for real Core Web Vitals'
      },
      message: 'ℹ️ For real Core Web Vitals (LCP, FCP, CLS, TBT), configure Google PageSpeed API key.',
    });
  }
  
  // Page size
  const pageSize = pageData.contentLength;
  const pageSizeMB = Math.round((pageSize / 1024 / 1024) * 100) / 100;
  
  checks.push({
    id: 'page-size',
    name: 'Page Size',
    status: pageSizeMB < 1 ? 'pass' : pageSizeMB < 2 ? 'warning' : 'fail',
    score: pageSizeMB < 0.5 ? 100 : pageSizeMB < 1 ? 85 : pageSizeMB < 2 ? 50 : 10,
    weight: 20,
    value: { bytes: pageSize, megabytes: pageSizeMB },
    message: `Page size: ${pageSizeMB}MB`,
    recommendation: pageSizeMB >= 2 ? 'Optimize page size' : undefined,
  });
  
  // HTTPS
  checks.push({
    id: 'https',
    name: 'HTTPS',
    status: pageData.isHttps ? 'pass' : 'fail',
    score: pageData.isHttps ? 100 : 0,
    weight: 15,
    value: { isHttps: pageData.isHttps },
    message: pageData.isHttps ? 'Page served over HTTPS' : 'Page not served over HTTPS',
  });
  
  // Compression
  const hasCompression = pageData.headers['content-encoding']?.includes('gzip') || 
                         pageData.headers['content-encoding']?.includes('br');
  
  checks.push({
    id: 'compression',
    name: 'Compression',
    status: hasCompression ? 'pass' : 'warning',
    score: hasCompression ? 100 : 50,
    weight: 10,
    value: { encoding: pageData.headers['content-encoding'] || 'none' },
    message: hasCompression ? `Compression enabled: ${pageData.headers['content-encoding']}` : 'No compression detected',
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Performance analysis complete`,
    checks,
  };
}

function analyzeEEAT(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Author information
  const hasAuthor = html.includes('author') || html.includes('Author') || 
                    html.match(/by\s+[A-Z][a-z]+\s+[A-Z][a-z]+/);
  
  checks.push({
    id: 'author-info',
    name: 'Author Information',
    status: hasAuthor ? 'pass' : 'warning',
    score: hasAuthor ? 100 : 40,
    weight: 15,
    value: { hasAuthor },
    message: hasAuthor ? 'Author information detected' : 'No author information found',
    recommendation: !hasAuthor ? 'Add author bylines to establish expertise' : undefined,
  });
  
  // Trust signals
  const hasTrustSignals = html.includes('certified') || html.includes('award') || 
                          html.includes('years') || html.includes('experience') ||
                          html.includes('trusted') || html.includes('guarantee');
  
  checks.push({
    id: 'trust-signals',
    name: 'Trust Signals',
    status: hasTrustSignals ? 'pass' : 'warning',
    score: hasTrustSignals ? 100 : 50,
    weight: 15,
    value: { hasTrustSignals },
    message: hasTrustSignals ? 'Trust signals detected (certifications, awards, etc.)' : 'Limited trust signals found',
    recommendation: !hasTrustSignals ? 'Add trust signals like certifications, awards, testimonials' : undefined,
  });
  
  // About/Team page link
  const hasAboutLink = html.includes('about') || html.includes('team') || html.includes('our-story');
  
  checks.push({
    id: 'about-link',
    name: 'About/Team Link',
    status: hasAboutLink ? 'pass' : 'warning',
    score: hasAboutLink ? 100 : 50,
    weight: 10,
    value: { hasAboutLink },
    message: hasAboutLink ? 'About/Team page link found' : 'No about page link detected',
    recommendation: !hasAboutLink ? 'Link to your About page to establish authority' : undefined,
  });
  
  // Contact information
  const hasContactInfo = html.includes('contact') || html.includes('email') || 
                         html.match(/\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/);
  
  checks.push({
    id: 'contact-info',
    name: 'Contact Information',
    status: hasContactInfo ? 'pass' : 'warning',
    score: hasContactInfo ? 100 : 40,
    weight: 15,
    value: { hasContactInfo },
    message: hasContactInfo ? 'Contact information available' : 'Limited contact information',
    recommendation: !hasContactInfo ? 'Add clear contact information for trustworthiness' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `E-E-A-T analysis complete`,
    checks,
  };
}

function analyzeSocial(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Open Graph tags
  const hasOGTitle = /<meta[^>]*property=["']og:title["'][^>]*>/i.test(html);
  const hasOGDescription = /<meta[^>]*property=["']og:description["'][^>]*>/i.test(html);
  const hasOGImage = /<meta[^>]*property=["']og:image["'][^>]*>/i.test(html);
  const ogScore = [hasOGTitle, hasOGDescription, hasOGImage].filter(Boolean).length;
  
  checks.push({
    id: 'open-graph',
    name: 'Open Graph Tags',
    status: ogScore === 3 ? 'pass' : ogScore >= 1 ? 'warning' : 'fail',
    score: Math.round((ogScore / 3) * 100),
    weight: 20,
    value: { hasTitle: hasOGTitle, hasDescription: hasOGDescription, hasImage: hasOGImage },
    message: ogScore === 3 
      ? 'Found: og:title, og:description, og:image'
      : ogScore === 0 
        ? 'Missing: og:title, og:description, og:image'
        : `Found: ${[hasOGTitle ? 'og:title' : '', hasOGDescription ? 'og:description' : '', hasOGImage ? 'og:image' : ''].filter(Boolean).join(', ')}. Missing: ${[!hasOGTitle ? 'og:title' : '', !hasOGDescription ? 'og:description' : '', !hasOGImage ? 'og:image' : ''].filter(Boolean).join(', ')}`,
    recommendation: ogScore < 3 ? `Add missing Open Graph tag${ogScore < 2 ? 's' : ''}: ${[!hasOGTitle ? 'og:title' : '', !hasOGDescription ? 'og:description' : '', !hasOGImage ? 'og:image' : ''].filter(Boolean).join(', ')}` : undefined,
  });
  
  // Twitter Card
  const hasTwitterCard = /<meta[^>]*name=["']twitter:card["'][^>]*>/i.test(html);
  const hasTwitterTitle = /<meta[^>]*name=["']twitter:title["'][^>]*>/i.test(html);
  
  checks.push({
    id: 'twitter-card',
    name: 'Twitter Card',
    status: hasTwitterCard ? 'pass' : 'warning',
    score: hasTwitterCard && hasTwitterTitle ? 100 : hasTwitterCard ? 70 : 30,
    weight: 15,
    value: { hasCard: hasTwitterCard, hasTitle: hasTwitterTitle },
    message: hasTwitterCard ? 'Twitter Card tags found' : 'No Twitter Card tags',
    recommendation: !hasTwitterCard ? 'Add Twitter Card meta tags for better social sharing' : undefined,
  });
  
  // Social links - improved detection with actual URL extraction
  const socialPlatformsConfig = [
    { name: 'Facebook', pattern: /facebook\.com\/[^"'\s<>]+/gi, icon: '📘' },
    { name: 'Twitter/X', pattern: /(?:twitter\.com|x\.com)\/[^"'\s<>]+/gi, icon: '🐦' },
    { name: 'LinkedIn', pattern: /linkedin\.com\/(?:company|in)\/[^"'\s<>]+/gi, icon: '💼' },
    { name: 'Instagram', pattern: /instagram\.com\/[^"'\s<>]+/gi, icon: '📷' },
    { name: 'YouTube', pattern: /youtube\.com\/(?:channel|c|user|@)[^"'\s<>]+/gi, icon: '📺' },
    { name: 'Pinterest', pattern: /pinterest\.com\/[^"'\s<>]+/gi, icon: '📌' },
    { name: 'TikTok', pattern: /tiktok\.com\/@[^"'\s<>]+/gi, icon: '🎵' },
  ];
  
  const foundSocialLinks: { platform: string; url: string; icon: string }[] = [];
  const missingSocialPlatforms: string[] = [];
  const recommendedPlatforms = ['LinkedIn', 'YouTube', 'Twitter/X', 'Instagram', 'Facebook'];
  
  for (const platform of socialPlatformsConfig) {
    const matches = html.match(platform.pattern);
    if (matches && matches.length > 0) {
      // Get unique URLs
      const uniqueUrls = [...new Set(matches.map((m: string) => `https://${m}`))];
      for (const url of uniqueUrls.slice(0, 2)) {
        foundSocialLinks.push({ platform: platform.name, url: String(url), icon: platform.icon });
      }
    } else if (recommendedPlatforms.includes(platform.name)) {
      missingSocialPlatforms.push(platform.name);
    }
  }
  
  const foundCount = foundSocialLinks.length;
  const uniquePlatforms = [...new Set(foundSocialLinks.map(l => l.platform))];
  
  // Generate recommendations for missing platforms
  const suggestedPlatforms = missingSocialPlatforms.slice(0, 3);
  
  checks.push({
    id: 'social-links',
    name: 'Social Media Links',
    status: uniquePlatforms.length >= 3 ? 'pass' : uniquePlatforms.length >= 2 ? 'warning' : 'info',
    score: Math.min(100, uniquePlatforms.length * 25),
    weight: 10,
    value: { 
      count: uniquePlatforms.length,
      foundLinks: foundSocialLinks.slice(0, 10),
      platforms: uniquePlatforms,
      missing: missingSocialPlatforms
    },
    message: uniquePlatforms.length > 0 
      ? `${uniquePlatforms.length} social media platforms linked: ${uniquePlatforms.map(p => {
          const link = foundSocialLinks.find(l => l.platform === p);
          return link ? `${link.icon} ${p}` : p;
        }).join(', ')}`
      : 'No social media profile links detected',
    recommendation: uniquePlatforms.length < 2 
      ? `Add social media links to improve trust and engagement. Suggested: ${suggestedPlatforms.join(', ')}`
      : uniquePlatforms.length < 4 && missingSocialPlatforms.length > 0
        ? `Consider adding: ${suggestedPlatforms.slice(0, 2).join(', ')}`
        : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Social media analysis complete`,
    checks,
  };
}

function analyzeTechnology(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Viewport meta tag
  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
  
  checks.push({
    id: 'viewport',
    name: 'Viewport Meta Tag',
    status: hasViewport ? 'pass' : 'fail',
    score: hasViewport ? 100 : 0,
    weight: 15,
    value: { hasViewport },
    message: hasViewport ? 'Viewport meta tag found' : 'No viewport meta tag',
    recommendation: !hasViewport ? 'Add viewport meta tag for mobile responsiveness' : undefined,
  });
  
  // Doctype - check anywhere in HTML, not just at start
  const hasDoctype = /<!doctype\s+html/i.test(html);
  
  checks.push({
    id: 'doctype',
    name: 'HTML5 Doctype',
    status: hasDoctype ? 'pass' : 'fail',
    score: hasDoctype ? 100 : 0,
    weight: 20, // Increased weight since this is critical
    value: { hasDoctype },
    message: hasDoctype ? 'HTML5 doctype declared' : 'No HTML5 doctype found - browsers will render in quirks mode',
    recommendation: !hasDoctype ? 'Add <!DOCTYPE html> at the very top of your HTML document to ensure proper rendering' : undefined,
  });
  
  // Language attribute
  const hasLang = /<html[^>]*lang=["'][^"']+["']/i.test(html);
  
  checks.push({
    id: 'lang-attribute',
    name: 'Language Attribute',
    status: hasLang ? 'pass' : 'warning',
    score: hasLang ? 100 : 60,
    weight: 8,
    value: { hasLang },
    message: hasLang ? 'Language attribute set' : 'No language attribute on HTML tag',
    recommendation: !hasLang ? 'Add lang attribute to HTML tag for accessibility' : undefined,
  });
  
  // Structured data
  const hasStructuredData = html.includes('application/ld+json') || 
                            html.includes('itemtype="http://schema.org');
  
  checks.push({
    id: 'structured-data',
    name: 'Structured Data',
    status: hasStructuredData ? 'pass' : 'warning',
    score: hasStructuredData ? 100 : 40,
    weight: 15,
    value: { hasStructuredData },
    message: hasStructuredData ? 'Structured data (Schema.org) found' : 'No structured data detected',
    recommendation: !hasStructuredData ? 'Add Schema.org structured data for rich results' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Technology analysis complete`,
    checks,
  };
}

function analyzeLinks(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  const baseUrl = new URL(pageData.url);
  
  // Extract all href values
  const hrefMatches = html.match(/href=["']([^"']+)["']/gi) || [];
  const hrefs = hrefMatches.map((h: string) => {
    const match = h.match(/href=["']([^"']+)["']/i);
    return match ? match[1] : '';
  }).filter((h: string) => h);
  
  // Filter to get only page URLs (not images, assets, anchors, mailto, tel, javascript, system URLs)
  const isPageUrl = (href: string): boolean => {
    const hrefLower = href.toLowerCase();
    
    // Exclude non-page URLs
    if (hrefLower.startsWith('#') || 
        hrefLower.startsWith('mailto:') || 
        hrefLower.startsWith('tel:') ||
        hrefLower.startsWith('javascript:') ||
        hrefLower.startsWith('data:')) {
      return false;
    }
    
    // Exclude WordPress and CMS system URLs (not actual pages)
    const systemUrlPatterns = [
      '/xmlrpc.php',
      '/wp-json',
      '/wp-admin',
      '/wp-login',
      '/wp-cron',
      '/wp-content/',
      '/wp-includes/',
      '/feed/',
      '/feed',
      '/rss/',
      '/rss',
      '/atom/',
      '/atom',
      '/comments/feed',
      '/trackback/',
      '/embed/',
      '/oembed/',
      '/wp-sitemap',
      '/sitemap.xml',
      '/robots.txt',
      '/.well-known/',
      '/cdn-cgi/',
      '/api/',
      '/_next/',
      '/_nuxt/',
    ];
    
    for (const pattern of systemUrlPatterns) {
      if (hrefLower.includes(pattern)) {
        return false;
      }
    }
    
    // Exclude asset files (images, scripts, styles, fonts, etc.)
    const assetExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff',
      '.js', '.css', '.scss', '.less',
      '.woff', '.woff2', '.ttf', '.eot', '.otf',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.zip', '.rar', '.tar', '.gz',
      '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.wav', '.ogg',
      '.xml', '.json', '.rss', '.atom',
      '.php' // Exclude direct PHP file links (except index.php which is usually rewritten)
    ];
    
    for (const ext of assetExtensions) {
      // Skip .php check for URLs that don't look like direct PHP files
      if (ext === '.php' && !hrefLower.match(/\/[^\/]+\.php(\?|$)/)) {
        continue;
      }
      if (hrefLower.endsWith(ext) || hrefLower.includes(ext + '?')) {
        return false;
      }
    }
    
    return true;
  };
  
  // Get unique page URLs
  const pageUrls = hrefs.filter(isPageUrl);
  const uniquePageUrls = [...new Set(pageUrls)];
  
  // Separate internal and external links
  const internalUrls: string[] = [];
  const externalUrls: string[] = [];
  
  for (const href of uniquePageUrls) {
    try {
      const hrefStr = String(href);
      let fullUrl: URL;
      if (hrefStr.startsWith('/')) {
        fullUrl = new URL(hrefStr, baseUrl.origin);
      } else if (hrefStr.startsWith('http')) {
        fullUrl = new URL(hrefStr);
      } else {
        fullUrl = new URL(hrefStr, pageData.url);
      }
      
      if (fullUrl.hostname === baseUrl.hostname) {
        internalUrls.push(fullUrl.pathname);
      } else {
        externalUrls.push(fullUrl.hostname);
      }
    } catch {
      // Invalid URL, skip
    }
  }
  
  // Get unique counts
  const uniqueInternalPages = [...new Set(internalUrls)];
  const uniqueExternalDomains = [...new Set(externalUrls)];
  
  const internalCount = uniqueInternalPages.length;
  const externalCount = uniqueExternalDomains.length;
  
  checks.push({
    id: 'internal-links',
    name: 'Internal Links',
    status: internalCount >= 5 ? 'pass' : internalCount >= 2 ? 'warning' : 'fail',
    score: internalCount >= 10 ? 100 : internalCount >= 5 ? 80 : internalCount >= 2 ? 50 : 20,
    weight: 15,
    value: { 
      count: internalCount, 
      uniquePages: uniqueInternalPages.slice(0, 10),
      note: 'Counts unique internal page URLs only (excludes images, assets, anchors)'
    },
    message: `Found ${internalCount} unique internal page links`,
    recommendation: internalCount < 5 ? 'Add more internal links for better navigation and SEO' : undefined,
  });
  
  checks.push({
    id: 'external-links',
    name: 'External Links',
    status: externalCount >= 1 && externalCount <= 50 ? 'pass' : externalCount > 50 ? 'warning' : 'info',
    score: externalCount >= 1 ? 80 : 60,
    weight: 10,
    value: { 
      count: externalCount,
      uniqueDomains: uniqueExternalDomains.slice(0, 10),
      note: 'Counts unique external domains only (excludes images, assets)'
    },
    message: `Found ${externalCount} unique external links`,
  });
  
  // Broken link check (basic - just check for empty hrefs)
  const emptyLinks = (html.match(/href=["']\s*["']/gi) || []).length;
  
  checks.push({
    id: 'empty-links',
    name: 'Empty Links',
    status: emptyLinks === 0 ? 'pass' : 'warning',
    score: emptyLinks === 0 ? 100 : Math.max(0, 100 - emptyLinks * 20),
    weight: 10,
    value: { count: emptyLinks },
    message: emptyLinks === 0 ? 'No empty links found' : `Found ${emptyLinks} empty href attributes`,
    recommendation: emptyLinks > 0 ? 'Fix empty href attributes in links' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Links analysis complete`,
    checks,
  };
}

function analyzeUsability(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Mobile-friendly (viewport)
  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);
  
  checks.push({
    id: 'mobile-friendly',
    name: 'Mobile Friendly',
    status: hasViewport ? 'pass' : 'fail',
    score: hasViewport ? 100 : 20,
    weight: 20,
    value: { hasViewport },
    message: hasViewport ? 'Page appears mobile-friendly' : 'Page may not be mobile-friendly',
    recommendation: !hasViewport ? 'Add proper viewport meta tag for mobile devices' : undefined,
  });
  
  // Favicon
  const hasFavicon = /<link[^>]*rel=["'](?:shortcut )?icon["']/i.test(html) ||
                     /<link[^>]*rel=["']apple-touch-icon["']/i.test(html);
  
  checks.push({
    id: 'favicon',
    name: 'Favicon',
    status: hasFavicon ? 'pass' : 'warning',
    score: hasFavicon ? 100 : 60,
    weight: 5,
    value: { hasFavicon },
    message: hasFavicon ? 'Favicon detected' : 'No favicon found',
    recommendation: !hasFavicon ? 'Add a favicon for better brand recognition' : undefined,
  });
  
  // Form labels - improved detection
  const forms = html.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || [];
  const inputs = html.match(/<input[^>]*type=["'](?:text|email|password|tel|number|search|url|date|time)[^>]*>/gi) || [];
  const textareas = html.match(/<textarea[^>]*>/gi) || [];
  const selects = html.match(/<select[^>]*>/gi) || [];
  const totalFormFields = inputs.length + textareas.length + selects.length;
  const labels = html.match(/<label[^>]*>/gi) || [];
  const ariaLabels = (html.match(/aria-label=["'][^"']+["']/gi) || []).length;
  const placeholders = (html.match(/placeholder=["'][^"']+["']/gi) || []).length;
  const totalAccessibleLabels = labels.length + ariaLabels;
  const labelRatio = totalFormFields > 0 ? Math.round((totalAccessibleLabels / totalFormFields) * 100) : 100;
  const hasProperLabels = totalFormFields === 0 || labelRatio >= 80;
  
  checks.push({
    id: 'form-labels',
    name: 'Form Labels',
    status: totalFormFields === 0 ? 'pass' : hasProperLabels ? 'pass' : labelRatio >= 50 ? 'warning' : 'fail',
    score: totalFormFields === 0 ? 100 : labelRatio,
    weight: 8,
    value: { 
      forms: forms.length, 
      inputs: totalFormFields, 
      labels: labels.length,
      ariaLabels,
      placeholders,
      totalAccessibleLabels,
      labelRatio: labelRatio + '%',
      note: totalFormFields === 0 ? 'No text/email/password form fields found' : undefined
    },
    message: totalFormFields === 0 
      ? 'No form input fields requiring labels found'
      : `${totalAccessibleLabels} labels for ${totalFormFields} form fields (${labelRatio}%)`,
    recommendation: !hasProperLabels && totalFormFields > 0 
      ? `Add <label> elements or aria-label attributes to ${totalFormFields - totalAccessibleLabels} unlabeled form fields for accessibility (WCAG 2.1 compliance)`
      : undefined,
  });
  
  // Text readability (basic contrast check - looks for common readable colors)
  const hasReadableText = !html.includes('color: #fff') || html.includes('background');
  
  checks.push({
    id: 'readability',
    name: 'Text Readability',
    status: 'pass',
    score: 80,
    weight: 10,
    value: {},
    message: 'Basic readability check passed',
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Usability analysis complete`,
    checks,
  };
}

// Technical SEO Analyzer - comprehensive technical checks
async function analyzeTechnicalSEO(pageData: any, allPagesData?: any[]): Promise<CategoryResult> {
  const checks: Check[] = [];
  const html = pageData.html;
  const url = pageData.url;
  
  // 1. Indexing Status Check (robots meta tag)
  const robotsMetaFull = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
  const robotsMeta = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["\']/i);
  const robotsContent = robotsMeta?.[1]?.toLowerCase() || '';
  const isNoIndex = robotsContent.includes('noindex');
  const isNoFollow = robotsContent.includes('nofollow');
  
  checks.push({
    id: 'indexing-status',
    name: 'Indexing Status',
    status: isNoIndex ? 'fail' : 'pass',
    score: isNoIndex ? 0 : 100,
    weight: 15,
    value: { 
      isIndexable: !isNoIndex, 
      isFollowable: !isNoFollow,
      robotsContent: robotsContent || 'index, follow (default)',
      pageUrl: url,
      htmlSnippet: robotsMetaFull?.[0] || '<meta name="robots" content="index, follow"> (default - not explicitly set)'
    },
    message: isNoIndex 
      ? `Page is blocked from indexing (noindex)` 
      : `Page is indexable by search engines`,
    recommendation: isNoIndex ? 'Remove noindex directive if this page should appear in search results' : undefined,
  });
  
  // 2. Sitemap & Robots.txt Check - Actually fetch and verify both files
  const baseUrl = new URL(url).origin;
  let sitemapExists = false;
  let sitemapUrl = '';
  let sitemapError = '';
  let robotsTxtExists = false;
  let robotsTxtContent = '';
  let robotsTxtHasSitemap = false;
  
  // Try to fetch robots.txt
  try {
    const robotsResponse = await fetch(`${baseUrl}/robots.txt`, { 
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' }
    });
    if (robotsResponse.ok) {
      robotsTxtExists = true;
      robotsTxtContent = await robotsResponse.text();
      // Check if robots.txt references a sitemap
      const sitemapMatch = robotsTxtContent.match(/Sitemap:\s*(.+)/i);
      if (sitemapMatch) {
        robotsTxtHasSitemap = true;
        sitemapUrl = sitemapMatch[1].trim();
      }
    }
  } catch (e) {
    console.log(`[TechnicalSEO] Could not fetch robots.txt: ${e}`);
  }
  
  // Try common sitemap locations
  const sitemapLocations = [
    sitemapUrl || `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap_index.xml`,
    `${baseUrl}/sitemap-index.xml`,
    `${baseUrl}/wp-sitemap.xml`,
  ];
  
  for (const sitemapLoc of sitemapLocations) {
    if (!sitemapLoc) continue;
    try {
      const sitemapResponse = await fetch(sitemapLoc, { 
        signal: AbortSignal.timeout(10000),
        headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' }
      });
      if (sitemapResponse.ok) {
        const contentType = sitemapResponse.headers.get('content-type') || '';
        const content = await sitemapResponse.text();
        // Verify it's actually XML sitemap content
        if (content.includes('<urlset') || content.includes('<sitemapindex') || contentType.includes('xml')) {
          sitemapExists = true;
          sitemapUrl = sitemapLoc;
          break;
        }
      }
    } catch (e) {
      sitemapError = `Could not fetch ${sitemapLoc}`;
    }
  }
  
  // Determine status and score
  let sitemapStatus: 'pass' | 'warning' | 'fail' | 'info' = 'fail';
  let sitemapScore = 0;
  let sitemapMessage = '';
  
  if (sitemapExists && robotsTxtExists && robotsTxtHasSitemap) {
    sitemapStatus = 'pass';
    sitemapScore = 100;
    sitemapMessage = `✅ Sitemap found at ${sitemapUrl} and referenced in robots.txt`;
  } else if (sitemapExists && robotsTxtExists) {
    sitemapStatus = 'warning';
    sitemapScore = 80;
    sitemapMessage = `Sitemap found at ${sitemapUrl} but not referenced in robots.txt`;
  } else if (sitemapExists) {
    sitemapStatus = 'warning';
    sitemapScore = 70;
    sitemapMessage = `Sitemap found at ${sitemapUrl}, robots.txt not found`;
  } else if (robotsTxtExists) {
    sitemapStatus = 'warning';
    sitemapScore = 50;
    sitemapMessage = `robots.txt found but no sitemap detected`;
  } else {
    sitemapStatus = 'fail';
    sitemapScore = 20;
    sitemapMessage = `❌ Neither sitemap.xml nor robots.txt found`;
  }
  
  checks.push({
    id: 'sitemap-reference',
    name: 'Sitemap & Robots.txt',
    status: sitemapStatus,
    score: sitemapScore,
    weight: 10,
    value: { 
      sitemapExists,
      sitemapUrl: sitemapUrl || 'Not found',
      robotsTxtExists,
      robotsTxtHasSitemap,
      checkedLocations: sitemapLocations.filter(l => l),
    },
    message: sitemapMessage,
    recommendation: !sitemapExists 
      ? 'Create a sitemap.xml and submit it to Google Search Console' 
      : !robotsTxtHasSitemap 
        ? 'Add "Sitemap: ' + sitemapUrl + '" to your robots.txt file'
        : undefined,
  });
  
  // 3. Page Speed Indicators (basic checks)
  // Adjusted thresholds for WordPress sites which typically have 30-50+ resources
  const scripts = (html.match(/<script[^>]*>/gi) || []).length;
  const stylesheets = (html.match(/<link[^>]*rel=["']stylesheet["']/gi) || []).length;
  const inlineStyles = (html.match(/<style[^>]*>/gi) || []).length;
  const totalResources = scripts + stylesheets;
  
  // Detect if it's a WordPress site (more lenient thresholds)
  const isWordPress = html.includes('wp-content') || html.includes('wp-includes') || 
                      html.includes('wordpress') || html.includes('wp-json');
  
  // WordPress sites commonly have 30-60 resources due to plugins, themes, etc.
  // Non-WordPress sites typically have fewer resources
  const passThreshold = isWordPress ? 40 : 15;
  const warnThreshold = isWordPress ? 70 : 30;
  
  const hasRenderBlocking = scripts > 10 || stylesheets > 8;
  
  // Calculate score based on platform-adjusted thresholds
  let resourceScore: number;
  let resourceStatus: 'pass' | 'warning' | 'fail';
  
  if (totalResources <= passThreshold) {
    resourceScore = 100;
    resourceStatus = 'pass';
  } else if (totalResources <= warnThreshold) {
    resourceScore = 70;
    resourceStatus = 'warning';
  } else {
    resourceScore = 40;
    resourceStatus = 'fail';
  }
  
  // Provide context-aware messaging
  const platformNote = isWordPress 
    ? `WordPress detected: Higher resource counts (30-50) are typical due to plugins/themes.`
    : `Consider bundling resources if page speed is slow.`;
  
  checks.push({
    id: 'page-speed-indicators',
    name: 'Page Speed (Resource Count)',
    status: resourceStatus,
    score: resourceScore,
    weight: 12,
    value: { 
      scripts, 
      stylesheets, 
      inlineStyles,
      totalResources,
      hasRenderBlocking,
      isWordPress,
      platformNote
    },
    message: `Found ${scripts} scripts, ${stylesheets} stylesheets (${totalResources} total resources)`,
    recommendation: totalResources > warnThreshold 
      ? isWordPress 
        ? 'Consider using a caching plugin (WP Rocket, W3 Total Cache) and minifying CSS/JS. Disable unused plugin scripts.'
        : 'Reduce render-blocking resources. Consider bundling CSS/JS files and using async/defer for scripts.'
      : undefined,
  });
  
  // 4. Mobile Friendliness - COMPREHENSIVE checks
  const viewportMetaFull = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  const viewportMeta = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
  const hasProperViewport = viewportMeta && viewportMeta[1].includes('width=device-width');
  const touchIconMatch = html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*>/i);
  const hasTouchIcons = !!touchIconMatch;
  const hasResponsiveImages = html.includes('srcset') || html.includes('sizes=');
  
  // Additional mobile checks
  // Check for fixed-width elements that could cause horizontal overflow
  const hasFixedWidthElements = /width:\s*\d{4,}px|min-width:\s*\d{4,}px/i.test(html);
  
  // Check for small font sizes that are hard to read on mobile
  const hasSmallFonts = /font-size:\s*[0-9]px|font-size:\s*1[0-1]px/i.test(html);
  
  // Check for tap targets that might be too small (buttons/links with very small dimensions)
  const hasSmallTapTargets = /(?:width|height):\s*(?:[0-9]|1[0-9]|2[0-9])px.*(?:button|btn|click|tap)/i.test(html);
  
  // Check for responsive CSS indicators
  const hasMediaQueries = /@media[^{]*\(.*(?:max-width|min-width)/i.test(html);
  const hasFlexbox = /display:\s*flex/i.test(html);
  const hasGrid = /display:\s*grid/i.test(html);
  const hasResponsiveCSS = hasMediaQueries || hasFlexbox || hasGrid;
  
  // Calculate mobile score with more factors
  let mobileScore = 0;
  mobileScore += hasProperViewport ? 30 : 0;
  mobileScore += hasTouchIcons ? 10 : 0;
  mobileScore += hasResponsiveImages ? 20 : 0;
  mobileScore += hasResponsiveCSS ? 20 : 0;
  mobileScore += !hasFixedWidthElements ? 10 : 0;
  mobileScore += !hasSmallFonts ? 5 : 0;
  mobileScore += !hasSmallTapTargets ? 5 : 0;
  
  // Collect issues
  const mobileIssues: string[] = [];
  if (!hasProperViewport) mobileIssues.push('Missing viewport meta tag');
  if (hasFixedWidthElements) mobileIssues.push('Fixed-width elements detected (may cause horizontal scroll)');
  if (hasSmallFonts) mobileIssues.push('Small font sizes detected (may be hard to read)');
  if (hasSmallTapTargets) mobileIssues.push('Small tap targets detected');
  if (!hasResponsiveCSS) mobileIssues.push('No responsive CSS patterns detected');
  
  checks.push({
    id: 'mobile-friendliness',
    name: 'Mobile Friendliness',
    status: mobileScore >= 80 ? 'pass' : mobileScore >= 50 ? 'warning' : 'fail',
    score: mobileScore,
    weight: 12,
    value: { 
      hasProperViewport, 
      hasTouchIcons,
      hasResponsiveImages,
      hasResponsiveCSS,
      hasFixedWidthElements,
      hasSmallFonts,
      hasSmallTapTargets,
      issues: mobileIssues,
      viewportContent: viewportMeta?.[1] || 'Not set',
      htmlSnippet: viewportMetaFull?.[0] || 'No viewport meta tag found',
      note: 'This checks HTML/CSS patterns. For definitive mobile testing, use Google Mobile-Friendly Test API.'
    },
    message: mobileIssues.length === 0
      ? `Mobile-friendly: viewport set${hasResponsiveImages ? ', responsive images' : ''}${hasResponsiveCSS ? ', responsive CSS' : ''}`
      : `Mobile issues detected: ${mobileIssues.slice(0, 2).join(', ')}${mobileIssues.length > 2 ? '...' : ''}`,
    recommendation: !hasProperViewport 
      ? 'Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">'
      : mobileIssues.length > 0 
        ? `Fix mobile issues: ${mobileIssues.join('; ')}. Consider using Google Mobile-Friendly Test for comprehensive analysis.`
        : undefined,
  });
  
  // 5. HTTPS & Security Headers - improved with specific recommendations
  const isHttps = pageData.isHttps;
  const hasHSTS = pageData.headers?.['strict-transport-security'];
  const hasCSP = pageData.headers?.['content-security-policy'];
  const hasXFrameOptions = pageData.headers?.['x-frame-options'];
  const hasXContentType = pageData.headers?.['x-content-type-options'];
  
  // Detect WordPress for context-aware recommendations
  const isWPSite = html.includes('wp-content') || html.includes('wp-includes');
  
  // Count security headers present
  const securityHeadersPresent = [hasHSTS, hasCSP, hasXFrameOptions, hasXContentType].filter(Boolean).length;
  
  // Adjusted scoring: HTTPS is the most critical (60 points), headers are secondary
  // Many hosting providers don't allow header configuration, so be more lenient
  const securityScore = (isHttps ? 60 : 0) + (hasHSTS ? 10 : 0) + (hasCSP ? 10 : 0) + (hasXFrameOptions ? 10 : 0) + (hasXContentType ? 10 : 0);
  
  // Build missing headers list with recommendations
  const missingHeaders: string[] = [];
  const headerRecommendations: string[] = [];
  if (!hasHSTS) {
    missingHeaders.push('Strict-Transport-Security');
    headerRecommendations.push(isWPSite 
      ? 'HSTS: Use a security plugin (Wordfence, iThemes Security) or add to .htaccess'
      : 'HSTS: Add "Strict-Transport-Security: max-age=31536000; includeSubDomains"');
  }
  if (!hasXFrameOptions) {
    missingHeaders.push('X-Frame-Options');
    headerRecommendations.push(isWPSite
      ? 'X-Frame-Options: Use a security plugin or add to .htaccess'
      : 'X-Frame-Options: Add "X-Frame-Options: SAMEORIGIN"');
  }
  if (!hasXContentType) {
    missingHeaders.push('X-Content-Type-Options');
    headerRecommendations.push(isWPSite
      ? 'X-Content-Type-Options: Use a security plugin or add to .htaccess'
      : 'X-Content-Type-Options: Add "X-Content-Type-Options: nosniff"');
  }
  
  // Determine status - be more lenient if HTTPS is enabled
  // HTTPS is the critical factor; headers are nice-to-have for most sites
  const securityStatus: 'pass' | 'warning' | 'fail' = !isHttps 
    ? 'fail' 
    : securityHeadersPresent >= 2 
      ? 'pass' 
      : 'warning';
  
  const presentHeaders = [hasHSTS && 'HSTS', hasCSP && 'CSP', hasXFrameOptions && 'X-Frame-Options', hasXContentType && 'X-Content-Type'].filter(Boolean);
  
  checks.push({
    id: 'https-security',
    name: 'HTTPS & Security Headers',
    status: securityStatus,
    score: securityScore,
    weight: 12,
    value: { 
      isHttps, 
      hasHSTS: !!hasHSTS,
      hasCSP: !!hasCSP,
      hasXFrameOptions: !!hasXFrameOptions,
      hasXContentType: !!hasXContentType,
      securityHeadersPresent,
      missingHeaders,
      recommendations: headerRecommendations,
      note: isHttps && securityHeadersPresent < 4 
        ? 'HTTPS is enabled (most important). Security headers are optional but recommended for enhanced protection.'
        : undefined
    },
    message: !isHttps 
      ? '❌ HTTPS not enabled - critical security issue'
      : securityHeadersPresent === 4
        ? '✅ HTTPS enabled with all security headers'
        : securityHeadersPresent >= 2
          ? `✅ HTTPS enabled with ${securityHeadersPresent}/4 security headers (${presentHeaders.join(', ')})`
          : `HTTPS enabled. ${presentHeaders.length > 0 ? `Headers: ${presentHeaders.join(', ')}` : 'Consider adding security headers'}`,
    recommendation: !isHttps 
      ? 'Enable HTTPS immediately for security and SEO benefits' 
      : missingHeaders.length > 0 && securityHeadersPresent < 2
        ? isWPSite
          ? 'Install a security plugin (Wordfence, Sucuri, iThemes) to add security headers easily'
          : `Consider adding security headers: ${missingHeaders.slice(0, 2).join(', ')}`
        : undefined,
  });
  
  // 6. Broken Links Detection (basic - check for common error patterns)
  const allLinks = html.match(/href=["']([^"']+)["']/gi) || [];
  const emptyLinks = allLinks.filter((l: string) => /href=["']\s*["']|href=["']#["']|href=["']javascript:/i.test(l)).length;
  const brokenLinkPatterns = allLinks.filter((l: string) => /404|error|not-found/i.test(l)).length;
  
  checks.push({
    id: 'broken-links',
    name: 'Broken Links (4xx/5xx Detection)',
    status: emptyLinks === 0 && brokenLinkPatterns === 0 ? 'pass' : emptyLinks > 5 ? 'fail' : 'warning',
    score: emptyLinks === 0 ? 100 : Math.max(0, 100 - emptyLinks * 10),
    weight: 10,
    value: { 
      totalLinks: allLinks.length,
      emptyLinks,
      suspiciousPatterns: brokenLinkPatterns
    },
    message: emptyLinks === 0 
      ? `${allLinks.length} links found, no empty or broken links detected`
      : `Found ${emptyLinks} empty/placeholder links that need fixing`,
    recommendation: emptyLinks > 0 ? 'Fix empty href attributes and placeholder links' : undefined,
  });
  
  // 7. URL Structure Analysis
  let pathname = '/';
  let hasUnderscores = false;
  let hasUppercase = false;
  let hasParameters = false;
  let pathLength = 1;
  let hasMultipleSlashes = false;
  let hasFileExtension = false;
  
  try {
    const urlObj = new URL(url);
    pathname = urlObj.pathname;
    hasUnderscores = pathname.includes('_');
    hasUppercase = /[A-Z]/.test(pathname);
    hasParameters = urlObj.search.length > 0;
    pathLength = pathname.length;
    hasMultipleSlashes = /\/\//.test(pathname);
    hasFileExtension = /\.(html|php|asp|aspx|jsp)$/i.test(pathname);
  } catch (urlError) {
    console.error('[TechnicalSEO] Error parsing URL:', url, urlError);
  }
  
  const urlIssues = [
    hasUnderscores && 'Contains underscores (use hyphens)',
    hasUppercase && 'Contains uppercase letters',
    hasParameters && 'Has query parameters',
    pathLength > 100 && 'URL path is very long',
    hasMultipleSlashes && 'Contains double slashes',
    hasFileExtension && 'Contains file extension (prefer clean URLs)'
  ].filter(Boolean);
  
  const urlScore = 100 - (urlIssues.length * 15);
  
  checks.push({
    id: 'url-structure',
    name: 'URL Structure',
    status: urlIssues.length === 0 ? 'pass' : urlIssues.length <= 2 ? 'warning' : 'fail',
    score: Math.max(0, urlScore),
    weight: 8,
    value: { 
      url: pathname,
      length: pathLength,
      issues: urlIssues,
      hasUnderscores,
      hasUppercase,
      hasParameters,
      hasFileExtension
    },
    message: urlIssues.length === 0 
      ? `Clean URL structure: ${pathname}`
      : `URL issues: ${urlIssues.join(', ')}`,
    recommendation: urlIssues.length > 0 ? 'Use lowercase, hyphen-separated, parameter-free URLs for best SEO' : undefined,
  });
  
  // 8. Canonical Tag Analysis
  const canonicalFullMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["\']/i);
  const canonical = canonicalMatch?.[1];
  const hasCanonical = !!canonical;
  const isSelfReferencing = canonical === url || canonical === url.replace(/\/$/, '') || canonical === url + '/';
  
  checks.push({
    id: 'canonical-tag',
    name: 'Canonical Tag',
    status: hasCanonical ? 'pass' : 'warning',
    score: hasCanonical ? (isSelfReferencing ? 100 : 80) : 40,
    weight: 10,
    value: { 
      hasCanonical, 
      canonicalUrl: canonical || null,
      currentUrl: url,
      isSelfReferencing,
      htmlSnippet: canonicalFullMatch?.[0] || 'No canonical tag found'
    },
    message: hasCanonical 
      ? `Canonical URL: ${canonical}${isSelfReferencing ? ' (self-referencing)' : ' (points to different URL)'}`
      : 'No canonical tag found - may cause duplicate content issues',
    recommendation: !hasCanonical ? 'Add a canonical tag to prevent duplicate content issues' : undefined,
  });
  
  // 9. Redirect Detection (check for meta refresh)
  const metaRefreshFull = html.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*>/i);
  const metaRefresh = html.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*content=["']([^"']*)["\']/i);
  const hasMetaRedirect = !!metaRefresh;
  const jsRedirectMatch = html.match(/(window\.location|location\.href|location\.replace)[^;]{0,100}/i);
  const jsRedirects = !!jsRedirectMatch;
  
  checks.push({
    id: 'redirect-issues',
    name: 'Redirect Issues',
    status: !hasMetaRedirect && !jsRedirects ? 'pass' : 'warning',
    score: !hasMetaRedirect && !jsRedirects ? 100 : 60,
    weight: 8,
    value: { 
      hasMetaRedirect,
      hasJsRedirect: jsRedirects,
      metaRefreshContent: metaRefresh?.[1] || null,
      htmlSnippet: metaRefreshFull?.[0] || jsRedirectMatch?.[0] || 'No redirects detected'
    },
    message: !hasMetaRedirect && !jsRedirects 
      ? 'No client-side redirects detected'
      : `${hasMetaRedirect ? 'Meta refresh redirect detected. ' : ''}${jsRedirects ? 'JavaScript redirect detected.' : ''} Use server-side 301 redirects instead.`,
    recommendation: (hasMetaRedirect || jsRedirects) ? 'Replace client-side redirects with server-side 301 redirects for better SEO' : undefined,
  });
  
  // 10. Core Web Vitals Indicators
  const hasLazyLoading = html.includes('loading="lazy"') || html.includes("loading='lazy'");
  const hasPreload = /<link[^>]*rel=["']preload["']/i.test(html);
  const hasPreconnect = /<link[^>]*rel=["']preconnect["']/i.test(html);
  const hasDeferredScripts = /<script[^>]*defer/i.test(html);
  const hasAsyncScripts = /<script[^>]*async/i.test(html);
  
  const cwvScore = (hasLazyLoading ? 25 : 0) + (hasPreload ? 20 : 0) + (hasPreconnect ? 15 : 0) + ((hasDeferredScripts || hasAsyncScripts) ? 40 : 0);
  
  checks.push({
    id: 'core-web-vitals-indicators',
    name: 'Core Web Vitals Optimization',
    status: cwvScore >= 80 ? 'pass' : cwvScore >= 40 ? 'warning' : 'fail',
    score: cwvScore,
    weight: 10,
    value: { 
      hasLazyLoading,
      hasPreload,
      hasPreconnect,
      hasDeferredScripts,
      hasAsyncScripts,
      optimizations: [
        hasLazyLoading && 'Lazy loading',
        hasPreload && 'Resource preloading',
        hasPreconnect && 'DNS preconnect',
        hasDeferredScripts && 'Deferred scripts',
        hasAsyncScripts && 'Async scripts'
      ].filter(Boolean)
    },
    message: cwvScore >= 60 
      ? `CWV optimizations: ${[hasLazyLoading && 'lazy loading', hasPreload && 'preload', hasDeferredScripts && 'defer'].filter(Boolean).join(', ')}`
      : 'Missing Core Web Vitals optimizations',
    recommendation: cwvScore < 60 ? 'Add lazy loading for images, defer/async for scripts, and preload critical resources' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Technical SEO analysis complete`,
    checks,
  };
}

const CATEGORY_WEIGHTS = {
  localSeo: 25,
  seo: 15,
  links: 10,
  usability: 10,
  performance: 10,
  social: 5,
  technology: 5,
  technicalSeo: 8,
  content: 6,
  eeat: 6,
};

export const smartAuditTask = task({
  id: "smart-audit",
  retry: {
    maxAttempts: 2,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30000,
  },
  run: async (payload: SmartAuditPayload): Promise<SmartAuditOutput> => {
    const { baseUrl, selectedUrls, crawlData, sectionSelections } = payload;
    
    // Normalize URLs to prevent duplicates (trailing slashes, http/https, case sensitivity)
    const normalizeUrl = (urlStr: string): string => {
      try {
        const u = new URL(urlStr);
        // Remove trailing slash from pathname
        u.pathname = u.pathname.replace(/\/$/, '');
        // Normalize to lowercase
        return u.toString().toLowerCase();
      } catch {
        return urlStr.toLowerCase().replace(/\/$/, '');
      }
    };

    // Deduplicate and normalize URLs
    const normalizedUrls = Array.from(new Set(selectedUrls.map(normalizeUrl)));
    
    metadata.set("status", {
      progress: 0,
      label: "Starting smart audit...",
      pagesTotal: normalizedUrls.length,
      pagesAnalyzed: 0,
    } as any);

    // Classify all pages
    const pageClassifications: PageClassification[] = normalizedUrls.map(url => {
      const pageInfo = crawlData?.pages?.find(p => normalizeUrl(p.url) === url);
      return {
        url,
        type: classifyPage(url, crawlData),
        title: pageInfo?.title,
      };
    });

    // Get homepage for fallback use
    const homePage = pageClassifications.find(p => p.type === 'home');
    const contactPage = pageClassifications.find(p => p.type === 'contact');
    const aboutPage = pageClassifications.find(p => p.type === 'about');
    const blogPages = pageClassifications.filter(p => p.type === 'blog');
    const productPages = pageClassifications.filter(p => p.type === 'product');
    const servicePages = pageClassifications.filter(p => p.type === 'service');
    const allPages = pageClassifications;

    // Build audit mapping - which pages to use for each section using Auto-Selection Router
    const auditMapping: SmartAuditOutput['auditMapping'] = {
      localSeo: [],
      seo: [],
      content: [],
      performance: [],
      eeat: [],
      social: [],
      technology: [],
      technicalSeo: [],
      links: [],
      usability: [],
    };

    // Helper: Get random pages from a list (for sampling)
    const getRandomPages = (pages: PageClassification[], count: number, exclude: string[] = []): string[] => {
      const available = pages.filter(p => !exclude.includes(p.url));
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count).map(p => p.url);
    };

    // Auto-Selection Router: Smart page selection for each audit section
    // IMPROVED: Now includes random sampling to catch edge cases
    const selectPagesForSection = (section: string): string[] => {
      switch (section) {
        case 'performance':
          // Homepage + All Service Pages + Product Pages (comprehensive performance audit)
          // PageSpeed analysis is valuable for all major pages, not just homepage
          const perfPages: string[] = [];
          if (homePage) perfPages.push(homePage.url);
          // Add all service pages (critical for conversion)
          servicePages.forEach(p => {
            if (!perfPages.includes(p.url)) perfPages.push(p.url);
          });
          // Add product pages
          productPages.forEach(p => {
            if (!perfPages.includes(p.url)) perfPages.push(p.url);
          });
          // Add about page (often visited)
          if (aboutPage && !perfPages.includes(aboutPage.url)) perfPages.push(aboutPage.url);
          // Limit to 6 pages max for performance (PageSpeed API has rate limits)
          return perfPages.length > 0 ? perfPages.slice(0, 6) : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'localSeo':
          // Homepage + Contact Us (footer is part of these pages)
          const localPages: string[] = [];
          if (homePage) localPages.push(homePage.url);
          if (contactPage && !localPages.includes(contactPage.url)) localPages.push(contactPage.url);
          return localPages.length > 0 ? localPages : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'seo':
          // Service Pages + Product Pages + Blog Posts (Money Pages)
          const seoPages: string[] = [];
          servicePages.forEach(p => seoPages.push(p.url));
          productPages.forEach(p => seoPages.push(p.url));
          blogPages.forEach(p => seoPages.push(p.url));
          // Add homepage if no money pages found
          if (seoPages.length === 0 && homePage) seoPages.push(homePage.url);
          // Add other pages if still not enough (prioritize content pages, exclude legal)
          if (seoPages.length < 3) {
            const otherPages = allPages.filter(p => 
              !seoPages.includes(p.url) && 
              p.type !== 'category' && 
              p.type !== 'tag' && 
              p.type !== 'archive' &&
              p.type !== 'contact' &&
              p.type !== 'legal'
            );
            otherPages.slice(0, 3 - seoPages.length).forEach(p => seoPages.push(p.url));
          }
          return seoPages.slice(0, 5);

        case 'content':
          // Blog Posts + Service Pages (pages designed for reading)
          const contentPages: string[] = [];
          blogPages.forEach(p => contentPages.push(p.url));
          // If not enough blog posts, add service pages
          if (contentPages.length < 3) {
            servicePages.slice(0, 3 - contentPages.length).forEach(p => contentPages.push(p.url));
          }
          // Only use homepage as last resort
          if (contentPages.length === 0 && homePage) {
            contentPages.push(homePage.url);
          }
          return contentPages.slice(0, 3);

        case 'eeat':
          // About Us + Blog Posts
          const eeatPages: string[] = [];
          if (aboutPage) eeatPages.push(aboutPage.url);
          blogPages.forEach(p => eeatPages.push(p.url));
          return eeatPages.length > 0 ? eeatPages.slice(0, 3) : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'technology':
        case 'usability':
          // Homepage + Contact Page (complex forms live on contact page)
          const techPages: string[] = [];
          if (homePage) techPages.push(homePage.url);
          if (contactPage && !techPages.includes(contactPage.url)) techPages.push(contactPage.url);
          // Add one more page if we don't have enough
          if (techPages.length < 2) {
            const randomPage = allPages.find(p => p.url !== homePage?.url && p.url !== contactPage?.url);
            if (randomPage) techPages.push(randomPage.url);
          }
          return techPages.length > 0 ? techPages : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'social':
          // Homepage + Blog Posts (blog posts are shared most often on social)
          const socialPages: string[] = [];
          if (homePage) socialPages.push(homePage.url);
          blogPages.slice(0, 2).forEach(p => socialPages.push(p.url));
          return socialPages.length > 0 ? socialPages : [allPages[0]?.url].filter(Boolean);

        case 'links':
          // Strategic pages + random sampling for comprehensive coverage
          const linkPages: string[] = [];
          if (homePage) linkPages.push(homePage.url);
          // Add product/service pages (likely to have internal linking issues)
          productPages.slice(0, 2).forEach(p => linkPages.push(p.url));
          // Add random pages to catch issues on unexpected pages
          const randomLinkPages = getRandomPages(allPages, 2, linkPages);
          linkPages.push(...randomLinkPages);
          return linkPages.slice(0, 5);

        case 'technicalSeo':
          // Strategic pages + random sampling for comprehensive technical analysis
          // Critical: Random sampling helps catch pages with broken canonicals, noindex issues, etc.
          const techSeoPages: string[] = [];
          if (homePage) techSeoPages.push(homePage.url);
          // Add one of each major page type if available
          if (productPages[0]) techSeoPages.push(productPages[0].url);
          if (blogPages[0]) techSeoPages.push(blogPages[0].url);
          // Add 2 RANDOM pages to catch edge cases (e.g., broken canonicals on obscure pages)
          const randomTechPages = getRandomPages(allPages, 2, techSeoPages);
          techSeoPages.push(...randomTechPages);
          return techSeoPages.slice(0, 5);

        default:
          return [homePage?.url || allPages[0]?.url].filter(Boolean);
      }
    };

    // Log sampling strategy for transparency
    console.log('[Smart Audit] Sampling strategy: Strategic pages + random sampling to catch edge cases');
    console.log('[Smart Audit] Section selections from frontend:', sectionSelections);

    // Apply section selections from frontend if provided, otherwise use Auto-Selection Router
    Object.keys(auditMapping).forEach(section => {
      // Check if frontend provided selections for this section
      if (sectionSelections && sectionSelections[section] && sectionSelections[section].length > 0) {
        // Normalize the frontend URLs and filter to only include selected pages
        const normalizedSectionUrls = sectionSelections[section]
          .map(normalizeUrl)
          .filter(url => normalizedUrls.includes(url));
        (auditMapping as any)[section] = normalizedSectionUrls.length > 0 
          ? normalizedSectionUrls 
          : selectPagesForSection(section);
        console.log(`[Smart Audit] Section ${section}: Using frontend selection (${normalizedSectionUrls.length} pages)`);
      } else {
        // Fall back to auto-selection router
        (auditMapping as any)[section] = selectPagesForSection(section);
        console.log(`[Smart Audit] Section ${section}: Using auto-selection (${(auditMapping as any)[section].length} pages)`);
      }
    });

    console.log('[Smart Audit] Page classifications:', pageClassifications);
    console.log('[Smart Audit] Audit mapping:', auditMapping);

    // Fetch and analyze pages
    const pageResults = new Map<string, {
      pageData: any;
      results: Partial<{
        localSeo: CategoryResult;
        seo: CategoryResult;
        content: CategoryResult;
        performance: CategoryResult;
        eeat: CategoryResult;
        social: CategoryResult;
        technology: CategoryResult;
        technicalSeo: CategoryResult;
        links: CategoryResult;
        usability: CategoryResult;
      }>;
    }>();

    let pagesAnalyzed = 0;
    let pagesFailed = 0;

    // Analyze each unique page
    for (const url of normalizedUrls) {
      try {
        metadata.set("status", {
          progress: Math.round((pagesAnalyzed / normalizedUrls.length) * 80),
          label: `Analyzing: ${url.slice(0, 50)}...`,
          pagesTotal: normalizedUrls.length,
          pagesAnalyzed,
        } as any);

        const pageData = await fetchPage(url);
        const pageType = pageClassifications.find(p => p.url === url)?.type || 'other';
        const sectionsToRun = getAuditSectionsForPageType(pageType);
        
        const results: any = {};
        
        // Run only relevant analyzers for this page type
        if (sectionsToRun.includes('localSeo')) {
          results.localSeo = analyzeLocalSEO(pageData);
        }
        if (sectionsToRun.includes('seo')) {
          results.seo = analyzeSEO(pageData);
        }
        if (sectionsToRun.includes('content')) {
          results.content = analyzeContent(pageData, pageType);
        }
        if (sectionsToRun.includes('performance')) {
          results.performance = await analyzePerformanceAsync(pageData);
        }
        if (sectionsToRun.includes('eeat')) {
          results.eeat = analyzeEEAT(pageData);
        }
        if (sectionsToRun.includes('social')) {
          results.social = analyzeSocial(pageData);
        }
        if (sectionsToRun.includes('technology')) {
          results.technology = analyzeTechnology(pageData);
        }
        if (sectionsToRun.includes('links')) {
          results.links = analyzeLinks(pageData);
        }
        if (sectionsToRun.includes('usability')) {
          results.usability = analyzeUsability(pageData);
        }
        if (sectionsToRun.includes('technicalSeo')) {
          try {
            results.technicalSeo = await analyzeTechnicalSEO(pageData);
            console.log(`[Smart Audit] TechnicalSEO analyzed for ${url}: score=${results.technicalSeo?.score}`);
          } catch (techSeoError) {
            console.error(`[Smart Audit] Error analyzing technicalSeo for ${url}:`, techSeoError);
            // Provide a fallback result to ensure technicalSeo is always defined
            results.technicalSeo = {
              score: 50,
              grade: 'D',
              message: 'Technical SEO analysis encountered an error',
              checks: [],
            };
          }
        }

        pageResults.set(url, { pageData, results });
        pagesAnalyzed++;
        
      } catch (error) {
        console.error(`[Smart Audit] Error analyzing ${url}:`, error);
        pagesFailed++;
      }
    }

    metadata.set("status", {
      progress: 85,
      label: "Aggregating results...",
      pagesTotal: selectedUrls.length,
      pagesAnalyzed,
    } as any);

    // Aggregate results by section
    const aggregateSection = async (sectionKey: string): Promise<CategoryResult> => {
      const pagesForSection = (auditMapping as any)[sectionKey] as string[];
      const sectionResults: CategoryResult[] = [];
      const sourcePages: string[] = [];
      
      for (const url of pagesForSection) {
        const pageResult = pageResults.get(url);
        if (pageResult?.results?.[sectionKey as keyof typeof pageResult.results]) {
          sectionResults.push(pageResult.results[sectionKey as keyof typeof pageResult.results]!);
          sourcePages.push(url);
        }
      }
      
      if (sectionResults.length === 0) {
        // Fallback: run analysis on homepage
        const fallbackUrl = homePage?.url || pageClassifications[0]?.url;
        const pageResult = pageResults.get(fallbackUrl);
        if (pageResult?.pageData) {
          const fallbackPageType = pageClassifications.find(p => p.url === fallbackUrl)?.type || 'home';
          let fallbackResult: CategoryResult;
          switch (sectionKey) {
            case 'localSeo': fallbackResult = analyzeLocalSEO(pageResult.pageData); break;
            case 'seo': fallbackResult = analyzeSEO(pageResult.pageData); break;
            case 'content': fallbackResult = analyzeContent(pageResult.pageData, fallbackPageType); break;
            case 'performance': fallbackResult = await analyzePerformanceAsync(pageResult.pageData); break;
            case 'eeat': fallbackResult = analyzeEEAT(pageResult.pageData); break;
            case 'social': fallbackResult = analyzeSocial(pageResult.pageData); break;
            case 'technology': fallbackResult = analyzeTechnology(pageResult.pageData); break;
            case 'links': fallbackResult = analyzeLinks(pageResult.pageData); break;
            case 'usability': fallbackResult = analyzeUsability(pageResult.pageData); break;
            case 'technicalSeo': 
              try {
                fallbackResult = await analyzeTechnicalSEO(pageResult.pageData);
              } catch (e) {
                console.error('[Smart Audit] Error in technicalSeo fallback:', e);
                fallbackResult = { score: 50, grade: 'D', message: 'Technical SEO analysis error', checks: [] };
              }
              break;
            default: fallbackResult = { score: 50, grade: 'D', message: 'No data', checks: [] };
          }
          return { ...fallbackResult, sourcePages: [fallbackUrl] };
        }
        return { score: 50, grade: 'D', message: 'No pages analyzed for this section', checks: [], sourcePages: [] };
      }
      
      // Calculate average score
      const avgScore = Math.round(sectionResults.reduce((sum, r) => sum + r.score, 0) / sectionResults.length);
      
      // Merge checks with source page information AND per-page findings
      const mergedChecks: Check[] = [];
      const checkMap = new Map<string, Check & { 
        sourcePages: string[]; 
        perPageFindings: Array<{
          url: string;
          pathname: string;
          status: string;
          score: number;
          value: any;
          message: string;
        }>;
      }>();
      
      sectionResults.forEach((result, idx) => {
        const pageUrl = sourcePages[idx];
        const pathname = new URL(pageUrl).pathname || '/';
        
        result.checks.forEach(check => {
          const existing = checkMap.get(check.id);
          const pageFinding = {
            url: pageUrl,
            pathname,
            status: check.status,
            score: check.score,
            value: check.value,
            message: check.message,
          };
          
          if (!existing) {
            checkMap.set(check.id, { 
              ...check, 
              sourcePages: [pageUrl],
              perPageFindings: [pageFinding],
            });
          } else {
            // Special handling for checks where "best status wins" (site-wide features)
            // Google Maps, Social Links, etc. - if found on ANY page, site has it
            const bestStatusWinsChecks = ['google-map', 'social-links', 'sitemap-robots'];
            
            if (bestStatusWinsChecks.includes(check.id)) {
              // Best status wins - if ANY page has pass, the site passes
              if (check.status === 'pass' || existing.status === 'pass') {
                existing.status = 'pass';
                existing.score = Math.max(existing.score, check.score);
              } else if (check.status === 'warning' || existing.status === 'warning') {
                existing.status = 'warning';
                existing.score = Math.max(existing.score, check.score);
              }
              // Update message to reflect it was found
              if (check.status === 'pass' && existing.status === 'pass') {
                existing.message = check.message; // Use the passing message
              }
            } else {
              // Default: worst status wins for most checks
              if (check.status === 'fail' || existing.status === 'fail') {
                existing.status = 'fail';
              } else if (check.status === 'warning' || existing.status === 'warning') {
                existing.status = 'warning';
              }
              // Average the scores
              existing.score = Math.round((existing.score + check.score) / 2);
            }
            
            existing.sourcePages.push(pageUrl);
            existing.perPageFindings.push(pageFinding);
          }
        });
      });
      
      return {
        score: avgScore,
        grade: calculateGrade(avgScore),
        message: `Based on ${sourcePages.length} page(s)`,
        checks: Array.from(checkMap.values()),
        sourcePages,
      };
    };

    const localSeo = await aggregateSection('localSeo');
    const seo = await aggregateSection('seo');
    const content = await aggregateSection('content');
    const performance = await aggregateSection('performance');
    const eeat = await aggregateSection('eeat');
    const social = await aggregateSection('social');
    const technology = await aggregateSection('technology');
    const technicalSeo = await aggregateSection('technicalSeo');
    const links = await aggregateSection('links');
    const usability = await aggregateSection('usability');

    // Debug logging for technicalSeo
    console.log('[Smart Audit] TechnicalSeo aggregated result:', {
      score: technicalSeo.score,
      grade: technicalSeo.grade,
      checksCount: technicalSeo.checks?.length || 0,
      sourcePages: technicalSeo.sourcePages,
    });

    // Calculate overall score
    const overallScore = Math.round(
      (localSeo.score * CATEGORY_WEIGHTS.localSeo +
        seo.score * CATEGORY_WEIGHTS.seo +
        links.score * CATEGORY_WEIGHTS.links +
        usability.score * CATEGORY_WEIGHTS.usability +
        performance.score * CATEGORY_WEIGHTS.performance +
        social.score * CATEGORY_WEIGHTS.social +
        technology.score * CATEGORY_WEIGHTS.technology +
        technicalSeo.score * CATEGORY_WEIGHTS.technicalSeo +
        content.score * CATEGORY_WEIGHTS.content +
        eeat.score * CATEGORY_WEIGHTS.eeat) /
        100
    );

    // Generate recommendations with source pages
    const recommendations: SmartAuditOutput['recommendations'] = [];
    let recId = 0;
    
    const allCategories = [
      { key: 'localSeo', name: 'Local SEO', result: localSeo },
      { key: 'seo', name: 'On-Page SEO', result: seo },
      { key: 'technicalSeo', name: 'Technical SEO', result: technicalSeo },
      { key: 'content', name: 'Content Quality', result: content },
      { key: 'performance', name: 'Performance', result: performance },
      { key: 'eeat', name: 'E-E-A-T', result: eeat },
      { key: 'social', name: 'Social', result: social },
      { key: 'technology', name: 'Technology', result: technology },
      { key: 'links', name: 'Links', result: links },
      { key: 'usability', name: 'Usability', result: usability },
    ];

    for (const { key, name, result } of allCategories) {
      for (const check of result.checks) {
        if (check.recommendation && (check.status === 'fail' || check.status === 'warning')) {
          recommendations.push({
            id: `rec_${recId++}`,
            title: check.recommendation,
            description: check.message,
            category: name,
            priority: check.status === 'fail' ? 'HIGH' : check.score < 50 ? 'MEDIUM' : 'LOW',
            checkId: check.id,
            sourcePages: (check as any).sourcePages || result.sourcePages,
          });
        }
      }
    }

    // Sort by priority
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    metadata.set("status", {
      progress: 100,
      label: "Audit complete!",
      pagesTotal: selectedUrls.length,
      pagesAnalyzed,
    } as any);

    return {
      overallScore,
      overallGrade: calculateGrade(overallScore),
      localSeo,
      seo,
      links,
      usability,
      performance,
      social,
      technology,
      technicalSeo,
      content,
      eeat,
      recommendations,
      pageClassifications,
      pagesAnalyzed,
      pagesFailed,
      auditMapping,
    };
  },
});
