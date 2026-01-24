import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

export function analyzeSEO(data: PageData): CategoryResult {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];

  // 1. Title Tag
  const titleEl = $("title");
  const title = titleEl.text().trim();
  const titleLength = title.length;
  const titleHtml = titleEl.length > 0 ? `<title>${title}</title>` : 'Not found';
  checks.push({
    id: "title",
    name: "Title Tag",
    status: titleLength >= 50 && titleLength <= 60 ? "pass" : titleLength > 0 ? "warning" : "fail",
    score: titleLength >= 50 && titleLength <= 60 ? 100 : titleLength > 60 ? 70 : titleLength > 0 ? 50 : 0,
    weight: 15,
    value: { title, length: titleLength, htmlSnippet: titleHtml },
    message: title
      ? `Title: "${title}" (${titleLength} characters)`
      : "No Title Tag found",
    recommendation: !title
      ? "Add a Title Tag"
      : titleLength > 60
      ? "Reduce length of Title Tag to 50-60 characters"
      : titleLength < 50
      ? "Expand Title Tag to 50-60 characters"
      : undefined,
  });

  // 2. Meta Description
  const metaDescEl = $('meta[name="description"]');
  const metaDesc = metaDescEl.attr("content") || "";
  const descLength = metaDesc.length;
  const metaDescHtml = metaDescEl.length > 0 ? `<meta name="description" content="${metaDesc.substring(0, 100)}${metaDesc.length > 100 ? '...' : ''}">` : 'Not found';
  checks.push({
    id: "metaDescription",
    name: "Meta Description Tag",
    status: descLength >= 120 && descLength <= 160 ? "pass" : descLength > 0 ? "warning" : "fail",
    score: descLength >= 120 && descLength <= 160 ? 100 : descLength > 0 ? 50 : 0,
    weight: 12,
    value: { description: metaDesc, length: descLength, htmlSnippet: metaDescHtml },
    message: metaDesc
      ? `Meta Description: ${descLength} characters`
      : "No Meta Description found",
    recommendation: !metaDesc
      ? "Add a Meta Description Tag"
      : descLength > 160
      ? "Shorten Meta Description to 120-160 characters"
      : descLength < 120
      ? "Expand Meta Description to 120-160 characters"
      : undefined,
  });

  // 3. H1 Tag
  const h1Tags = $("h1");
  const h1Count = h1Tags.length;
  const h1Text = h1Tags.first().text().trim();
  const h1Html = h1Count > 0 ? `<h1>${h1Text.substring(0, 80)}${h1Text.length > 80 ? '...' : ''}</h1>` : 'No H1 tag found';
  checks.push({
    id: "h1Tag",
    name: "H1 Header Tag",
    status: h1Count === 1 ? "pass" : h1Count > 1 ? "warning" : "fail",
    score: h1Count === 1 ? 100 : h1Count > 1 ? 70 : 0,
    weight: 10,
    value: { count: h1Count, text: h1Text, htmlSnippet: h1Html },
    message: h1Count === 1
      ? `H1 Tag: "${h1Text}"`
      : h1Count > 1
      ? `Multiple H1 Tags found (${h1Count})`
      : "No H1 Tag found",
    recommendation: h1Count === 0
      ? "Add an H1 Tag"
      : h1Count > 1
      ? "Use only one H1 Tag per page"
      : undefined,
  });

  // 4. H2-H6 Header Tags
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;
  const h4Count = $("h4").length;
  const h5Count = $("h5").length;
  const h6Count = $("h6").length;
  const totalHeaders = h2Count + h3Count + h4Count + h5Count + h6Count;
  checks.push({
    id: "headingStructure",
    name: "H2-H6 Header Tags",
    status: totalHeaders > 0 ? "pass" : "warning",
    score: totalHeaders >= 3 ? 100 : totalHeaders > 0 ? 70 : 30,
    weight: 5,
    value: { h2: h2Count, h3: h3Count, h4: h4Count, h5: h5Count, h6: h6Count },
    message: totalHeaders > 0
      ? `Found ${totalHeaders} header tags (H2: ${h2Count}, H3: ${h3Count}, H4: ${h4Count})`
      : "No H2-H6 header tags found",
    recommendation: totalHeaders === 0
      ? "Add H2-H6 header tags to structure content"
      : undefined,
  });

  // 5. Image Alt Attributes
  const images = $("img");
  const totalImages = images.length;
  let missingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim() === "") missingAlt++;
  });
  checks.push({
    id: "imageAlt",
    name: "Image Alt Attributes",
    status: missingAlt === 0 && totalImages > 0 ? "pass" : missingAlt > 0 ? "warning" : "info",
    score: totalImages === 0 ? 100 : Math.round(((totalImages - missingAlt) / totalImages) * 100),
    weight: 8,
    value: { total: totalImages, missing: missingAlt },
    message: totalImages === 0
      ? "No images found"
      : missingAlt === 0
      ? `All ${totalImages} images have Alt attributes`
      : `${missingAlt} of ${totalImages} images missing Alt attributes`,
    recommendation: missingAlt > 0
      ? "Add Alt attributes to all images"
      : undefined,
  });

  // 6. Canonical Tag
  const canonicalEl = $('link[rel="canonical"]');
  const canonical = canonicalEl.attr("href") || "";
  const canonicalHtml = canonical ? `<link rel="canonical" href="${canonical}">` : 'No canonical tag found';
  checks.push({
    id: "canonical",
    name: "Canonical Tag",
    status: canonical ? "pass" : "warning",
    score: canonical ? 100 : 50,
    weight: 8,
    value: { canonical, htmlSnippet: canonicalHtml },
    message: canonical
      ? `Canonical URL: ${canonical}`
      : "No Canonical Tag found",
    recommendation: !canonical ? "Add a Canonical Tag" : undefined,
  });

  // 7. Language Attribute
  const lang = $("html").attr("lang") || "";
  checks.push({
    id: "langAttribute",
    name: "Language Attribute",
    status: lang ? "pass" : "warning",
    score: lang ? 100 : 50,
    weight: 5,
    value: { lang },
    message: lang ? `Language declared: ${lang}` : "No language attribute found",
    recommendation: !lang ? "Add a lang attribute to the html tag" : undefined,
  });

  // 8. Noindex Check
  const robotsMeta = $('meta[name="robots"]').attr("content") || "";
  const hasNoindex = robotsMeta.toLowerCase().includes("noindex");
  checks.push({
    id: "noindex",
    name: "Noindex Tag Test",
    status: hasNoindex ? "fail" : "pass",
    score: hasNoindex ? 0 : 100,
    weight: 15,
    value: { noindex: hasNoindex, robotsMeta },
    message: hasNoindex
      ? "Page is set to noindex - Search engines will NOT index this page"
      : "Page can be indexed by search engines",
    recommendation: hasNoindex
      ? "Remove noindex directive if you want the page indexed"
      : undefined,
  });

  // 9. Schema.org Structured Data
  const jsonLdScripts = $('script[type="application/ld+json"]');
  const schemaCount = jsonLdScripts.length;
  let schemaTypes: string[] = [];
  jsonLdScripts.each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "{}");
      if (json["@type"]) schemaTypes.push(json["@type"]);
    } catch {}
  });
  checks.push({
    id: "schemaMarkup",
    name: "Schema.org Structured Data",
    status: schemaCount > 0 ? "pass" : "info",
    score: schemaCount > 0 ? 100 : 70,
    weight: 6,
    value: { count: schemaCount, types: schemaTypes },
    message: schemaCount > 0
      ? `Found ${schemaCount} JSON-LD schema(s): ${schemaTypes.join(", ")}`
      : "No JSON-LD schema found",
    recommendation: schemaCount === 0
      ? "Add Schema.org structured data"
      : undefined,
  });

  // 10. Word Count / Content Amount
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter((w) => w.length > 0).length;
  checks.push({
    id: "wordCount",
    name: "Amount of Content",
    status: wordCount >= 300 ? "pass" : wordCount >= 100 ? "warning" : "fail",
    score: wordCount >= 500 ? 100 : wordCount >= 300 ? 80 : wordCount >= 100 ? 50 : 20,
    weight: 6,
    value: { wordCount },
    message: wordCount >= 300
      ? `Good content amount: ${wordCount} words`
      : `Low content: ${wordCount} words. Aim for 300+`,
    recommendation: wordCount < 300
      ? "Add more content to your page (aim for 300+ words)"
      : undefined,
  });

  // 11. Keywords in URL
  const urlPath = new URL(data.url).pathname;
  const hasKeywordsInUrl = urlPath.length > 1 && !urlPath.includes("?") && /^[\w\-\/]+$/.test(urlPath);
  checks.push({
    id: "keywordsUrl",
    name: "Keywords in URL",
    status: hasKeywordsInUrl ? "pass" : "info",
    score: hasKeywordsInUrl ? 100 : 70,
    weight: 4,
    value: { path: urlPath },
    message: hasKeywordsInUrl
      ? "URL structure is clean and SEO-friendly"
      : "Consider using descriptive keywords in URL",
  });

  // 12. Google Analytics Check
  const hasGoogleAnalytics =
    data.html.includes("google-analytics.com") ||
    data.html.includes("googletagmanager.com") ||
    data.html.includes("gtag(") ||
    data.html.includes("UA-") ||
    data.html.includes("G-");
  checks.push({
    id: "hasAnalytics",
    name: "Analytics Tracking",
    status: hasGoogleAnalytics ? "pass" : "warning",
    score: hasGoogleAnalytics ? 100 : 50,
    weight: 4,
    value: { hasAnalytics: hasGoogleAnalytics },
    message: hasGoogleAnalytics
      ? "Analytics tracking detected"
      : "No analytics tracking detected",
    recommendation: !hasGoogleAnalytics
      ? "Implement an Analytics Tracking Tool (e.g., Google Analytics)"
      : undefined,
  });

  // 13. Meta Keywords (deprecated but still checked)
  const metaKeywords = $('meta[name="keywords"]').attr("content") || "";
  checks.push({
    id: "metaKeywords",
    name: "Meta Keywords Tag",
    status: "info",
    score: 100, // Doesn't affect score
    weight: 0,
    value: { keywords: metaKeywords },
    message: metaKeywords
      ? `Meta Keywords present (note: not used by Google)`
      : "No Meta Keywords (not required by modern search engines)",
  });

  // 14. Open Graph Basic
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  const ogDesc = $('meta[property="og:description"]').attr("content") || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const hasOpenGraph = ogTitle || ogDesc || ogImage;
  checks.push({
    id: "openGraph",
    name: "Open Graph Tags",
    status: hasOpenGraph ? "pass" : "warning",
    score: hasOpenGraph ? 100 : 50,
    weight: 5,
    value: { ogTitle, ogDesc, ogImage: !!ogImage },
    message: hasOpenGraph
      ? "Open Graph tags found for social sharing"
      : "No Open Graph tags found",
    recommendation: !hasOpenGraph
      ? "Add Open Graph meta tags for better social sharing"
      : undefined,
  });

  // 15. Hreflang Tags
  const hreflangTags = $('link[hreflang]');
  const hreflangCount = hreflangTags.length;
  const hreflangLangs: string[] = [];
  hreflangTags.each((_, el) => {
    const lang = $(el).attr("hreflang");
    if (lang) hreflangLangs.push(lang);
  });
  checks.push({
    id: "hreflang",
    name: "Hreflang Tags",
    status: hreflangCount > 0 ? "pass" : "info",
    score: 100, // Info only, doesn't penalize
    weight: 0,
    value: { count: hreflangCount, languages: hreflangLangs },
    message: hreflangCount > 0
      ? `Hreflang tags found for ${hreflangCount} language(s): ${hreflangLangs.join(", ")}`
      : "No Hreflang tags found (only needed for multi-language sites)",
  });

  // 16. Noindex Header Check (from HTTP headers)
  const noindexHeader = data.headers["x-robots-tag"]?.toLowerCase().includes("noindex") || false;
  checks.push({
    id: "noindexHeader",
    name: "Noindex Header Test",
    status: noindexHeader ? "fail" : "pass",
    score: noindexHeader ? 0 : 100,
    weight: 10,
    value: { hasNoindexHeader: noindexHeader },
    message: noindexHeader
      ? "Page has X-Robots-Tag: noindex header - Search engines will NOT index this page"
      : "No noindex HTTP header found",
    recommendation: noindexHeader
      ? "Remove X-Robots-Tag: noindex header if you want the page indexed"
      : undefined,
  });

  // 17. Keyword Consistency Analysis
  const textContent = $("body").text().toLowerCase();
  const titleLower = title.toLowerCase();
  const metaDescLower = metaDesc.toLowerCase();
  const headersText = $("h1, h2, h3, h4, h5, h6").text().toLowerCase();
  
  // Extract top keywords (simple word frequency)
  // Only get text from visible content, exclude scripts/styles
  const visibleText = $("body").clone().find("script, style, noscript").remove().end().text().toLowerCase();
  const words = visibleText.split(/\s+/).filter(w => w.length > 3 && !/^\d+$/.test(w));
  
  // Extended stop words including CSS properties and common non-keywords
  const stopWords = new Set([
    // Common English stop words
    "this", "that", "with", "from", "have", "been", "were", "they", "their", "what", 
    "when", "where", "which", "your", "will", "more", "some", "other", "than", "then", 
    "also", "just", "only", "into", "over", "such", "very", "about", "would", "could",
    "should", "these", "those", "being", "each", "does", "doing", "during", "before",
    "after", "above", "below", "between", "through", "same", "different", "here", "there",
    // CSS properties and technical terms
    "padding", "margin", "display", "width", "height", "border", "color", "background",
    "position", "center", "flex", "grid", "auto", "none", "block", "inline", "solid",
    "font", "text", "align", "justify", "items", "content", "space", "between", "around",
    "wrap", "nowrap", "column", "columns", "template", "areas", "start", "important",
    "gridtemplatecolumns", "gridtemplaterows", "gridarea", "gridcolumn", "gridrow",
    "flexdirection", "flexwrap", "alignitems", "justifycontent", "boxsizing", "overflow",
    "visibility", "opacity", "transform", "transition", "animation", "cursor", "pointer",
    "relative", "absolute", "fixed", "sticky", "static", "zindex", "rgba", "hsla",
    // Common web terms
    "click", "button", "link", "image", "video", "audio", "form", "input", "submit",
    "loading", "error", "success", "true", "false", "null", "undefined", "function",
  ]);
  
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, "");
    // Filter: min 4 chars, not a stop word, not camelCase-looking (CSS), not all same char
    if (clean.length >= 4 && 
        !stopWords.has(clean) && 
        !/^[a-z]+[A-Z]/.test(w) && // Skip camelCase
        !/(.)\1{2,}/.test(clean) && // Skip repeated chars like "aaaa"
        !/^\d/.test(clean)) { // Skip number-starting
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });
  
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, freq]) => ({
      keyword: word,
      frequency: freq,
      inTitle: titleLower.includes(word),
      inMeta: metaDescLower.includes(word),
      inHeaders: headersText.includes(word),
    }));

  const keywordsWithGoodDistribution = topKeywords.filter(k => k.inTitle || k.inMeta || k.inHeaders).length;
  checks.push({
    id: "keywordConsistency",
    name: "Keyword Consistency",
    status: keywordsWithGoodDistribution >= 3 ? "pass" : keywordsWithGoodDistribution > 0 ? "warning" : "fail",
    score: Math.round((keywordsWithGoodDistribution / Math.max(topKeywords.length, 1)) * 100),
    weight: 8,
    value: { keywords: topKeywords },
    message: keywordsWithGoodDistribution >= 3
      ? "Your page's main keywords are distributed well across important HTML tags"
      : "Keywords are not well distributed across title, meta, and headers",
    recommendation: keywordsWithGoodDistribution < 3
      ? "Ensure your target keywords appear in title, meta description, and headers"
      : undefined,
  });

  // 18. Favicon Check
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr("href") || "";
  const appleTouchIcon = $('link[rel="apple-touch-icon"]').attr("href") || "";
  checks.push({
    id: "favicon",
    name: "Favicon",
    status: favicon || appleTouchIcon ? "pass" : "warning",
    score: favicon ? 100 : 50,
    weight: 2,
    value: { favicon, appleTouchIcon },
    message: favicon
      ? `Favicon found: ${favicon}`
      : "No favicon found",
    recommendation: !favicon
      ? "Add a favicon for better brand recognition"
      : undefined,
  });

  // 19. Voice Search Optimization
  const pageContent = $('body').text().toLowerCase();
  const hasQuestionContent = /\b(what|how|why|when|where|who|which|can|does|is|are)\b.*\?/i.test(pageContent);
  const hasFAQSchema = data.html.includes('"@type":"FAQPage"') || data.html.includes('"@type": "FAQPage"');
  const hasHowToSchema = data.html.includes('"@type":"HowTo"') || data.html.includes('"@type": "HowTo"');
  const hasSpeakableSchema = data.html.includes('"speakable"');
  const faqSections = $('*:contains("FAQ"), *:contains("Frequently Asked"), .faq, #faq').length > 0;
  
  const voiceSearchScore = [
    hasQuestionContent,
    hasFAQSchema,
    hasHowToSchema || faqSections,
    hasSpeakableSchema,
  ].filter(Boolean).length * 25;
  
  checks.push({
    id: "voiceSearch",
    name: "Voice Search Optimization",
    status: voiceSearchScore >= 75 ? "pass" : voiceSearchScore >= 50 ? "warning" : "info",
    score: voiceSearchScore || 25,
    weight: 5,
    value: {
      hasQuestionContent,
      hasFAQSchema,
      hasHowToSchema,
      hasSpeakableSchema,
      faqSections,
    },
    message: voiceSearchScore >= 75
      ? "Good voice search optimization with FAQ/question content"
      : voiceSearchScore >= 50
      ? "Partial voice search optimization detected"
      : "Limited voice search optimization",
    recommendation: voiceSearchScore < 75
      ? "Add FAQ schema, question-based content, and speakable structured data for voice search"
      : undefined,
  });

  // 20. AI Overview / SGE Optimization
  const hasComprehensiveContent = (data.html.match(/<p/gi) || []).length >= 5;
  const hasDefinitions = /\b(is|are|means|refers to|defined as)\b/i.test(pageContent);
  const hasBulletPoints = $('ul li, ol li').length >= 3;
  const hasDataStatistics = /\d+%|\d+\s*(million|billion|thousand)|\$\d+/i.test(pageContent);
  const hasExpertSignals = /expert|professional|certified|years of experience|specialist/i.test(pageContent);
  const hasSourceCitations = $('cite, blockquote, .citation, .reference').length > 0 || 
    /according to|study shows|research|source:/i.test(pageContent);
  
  const aiOverviewScore = [
    hasComprehensiveContent,
    hasDefinitions,
    hasBulletPoints,
    hasDataStatistics,
    hasExpertSignals,
    hasSourceCitations,
  ].filter(Boolean).length * 17;
  
  checks.push({
    id: "aiOverview",
    name: "AI Overview / SGE Optimization",
    status: aiOverviewScore >= 70 ? "pass" : aiOverviewScore >= 50 ? "warning" : "info",
    score: Math.min(100, aiOverviewScore),
    weight: 5,
    value: {
      hasComprehensiveContent,
      hasDefinitions,
      hasBulletPoints,
      hasDataStatistics,
      hasExpertSignals,
      hasSourceCitations,
    },
    message: aiOverviewScore >= 70
      ? "Content is well-structured for AI Overview/SGE citation"
      : aiOverviewScore >= 50
      ? "Some AI Overview optimization signals present"
      : "Content may not be optimized for AI Overview citations",
    recommendation: aiOverviewScore < 70
      ? "Add clear definitions, bullet points, statistics, expert signals, and citations for AI Overview optimization"
      : undefined,
  });

  // 21. Featured Snippet Optimization
  const hasClearAnswer = pageContent.includes('is ') && pageContent.includes('.') && pageContent.length > 100;
  const hasNumberedList = $('ol li').length >= 3;
  const hasTable = $('table').length > 0;
  const hasDefinitionFormat = /^[A-Z][^.]+\s(is|are|refers to)\s[^.]+\./.test(pageContent);
  
  const snippetScore = [
    hasClearAnswer,
    hasNumberedList || hasBulletPoints,
    hasTable,
    hasDefinitionFormat,
  ].filter(Boolean).length * 25;
  
  checks.push({
    id: "featuredSnippet",
    name: "Featured Snippet Potential",
    status: snippetScore >= 75 ? "pass" : snippetScore >= 50 ? "warning" : "info",
    score: snippetScore || 25,
    weight: 4,
    value: {
      hasClearAnswer,
      hasNumberedList,
      hasBulletPoints,
      hasTable,
      hasDefinitionFormat,
    },
    message: snippetScore >= 75
      ? "Content is well-formatted for featured snippets"
      : snippetScore >= 50
      ? "Some featured snippet optimization detected"
      : "Consider formatting content for featured snippets",
    recommendation: snippetScore < 75
      ? "Add clear definitions, numbered lists, tables, or step-by-step content for featured snippet eligibility"
      : undefined,
  });

  // 22. Google Search Preview Data
  const searchPreview = {
    title: title || "No title",
    url: data.url,
    description: metaDesc || "No description available",
  };
  checks.push({
    id: "searchPreview",
    name: "Google Search Preview",
    status: title && metaDesc ? "pass" : "warning",
    score: 100,
    weight: 0,
    value: searchPreview,
    message: "Preview of how your page may appear in search results",
  });

  // Calculate category score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const grade = calculateGrade(score);

  const messages: Record<string, string> = {
    "A+": "Your On-Page SEO is excellent!",
    A: "Your On-Page SEO is very good!",
    "A-": "Your On-Page SEO is very good!",
    "B+": "Your On-Page SEO is good",
    B: "Your On-Page SEO is good",
    "B-": "Your On-Page SEO could be better",
    "C+": "Your On-Page SEO needs improvement",
    C: "Your On-Page SEO needs improvement",
    "C-": "Your On-Page SEO needs improvement",
    D: "Your On-Page SEO needs significant work",
    F: "Your On-Page SEO needs significant work",
  };

  return {
    score,
    grade,
    message: messages[grade] || "On-Page SEO analysis complete",
    checks,
  };
}
