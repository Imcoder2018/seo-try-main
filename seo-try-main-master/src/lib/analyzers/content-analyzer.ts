import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

// Flesch-Kincaid Reading Ease calculation
function calculateReadability(text: string): { score: number; grade: string; level: string } {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
  
  if (sentences.length === 0 || words.length === 0) {
    return { score: 0, grade: "N/A", level: "Unable to calculate" };
  }
  
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  const clampedScore = Math.max(0, Math.min(100, score));
  
  let grade: string;
  let level: string;
  
  if (clampedScore >= 90) { grade = "A+"; level = "Very Easy (5th grade)"; }
  else if (clampedScore >= 80) { grade = "A"; level = "Easy (6th grade)"; }
  else if (clampedScore >= 70) { grade = "B"; level = "Fairly Easy (7th grade)"; }
  else if (clampedScore >= 60) { grade = "C"; level = "Standard (8th-9th grade)"; }
  else if (clampedScore >= 50) { grade = "D"; level = "Fairly Difficult (10th-12th grade)"; }
  else if (clampedScore >= 30) { grade = "E"; level = "Difficult (College)"; }
  else { grade = "F"; level = "Very Difficult (College Graduate)"; }
  
  return { score: Math.round(clampedScore), grade, level };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Detect thin content
function detectThinContent(text: string, wordCount: number): { isThin: boolean; reason: string } {
  if (wordCount < 300) {
    return { isThin: true, reason: "Less than 300 words" };
  }
  
  // Check for boilerplate ratio
  const uniqueWords = new Set(text.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const uniqueRatio = uniqueWords.size / wordCount;
  
  if (uniqueRatio < 0.3) {
    return { isThin: true, reason: "High repetition detected" };
  }
  
  return { isThin: false, reason: "Content depth is adequate" };
}

// Detect content freshness signals
function detectFreshnessSignals($: cheerio.CheerioAPI): { hasDate: boolean; dateFound: string | null } {
  // Look for common date patterns
  const dateSelectors = [
    'time[datetime]',
    'meta[property="article:published_time"]',
    'meta[property="article:modified_time"]',
    '.date', '.post-date', '.published', '.updated',
    '[itemprop="datePublished"]', '[itemprop="dateModified"]'
  ];
  
  for (const selector of dateSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const date = element.attr('datetime') || element.attr('content') || element.text().trim();
      if (date) return { hasDate: true, dateFound: date };
    }
  }
  
  return { hasDate: false, dateFound: null };
}

// Check for duplicate content signals
function checkDuplicateSignals($: cheerio.CheerioAPI): { canonical: string | null; hasDuplicateRisk: boolean } {
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  const ogUrl = $('meta[property="og:url"]').attr('content') || null;
  
  // If canonical differs significantly from current URL, might indicate duplicate
  const hasDuplicateRisk = canonical !== null && ogUrl !== null && canonical !== ogUrl;
  
  return { canonical, hasDuplicateRisk };
}

// Analyze content structure
function analyzeContentStructure($: cheerio.CheerioAPI): {
  hasIntro: boolean;
  hasConclusion: boolean;
  hasBulletPoints: boolean;
  hasNumberedLists: boolean;
  hasTables: boolean;
  hasImages: boolean;
  hasVideos: boolean;
} {
  const bodyText = $('body').text().toLowerCase();
  const paragraphs = $('p').length;
  
  return {
    hasIntro: paragraphs > 0 && $('p').first().text().length > 50,
    hasConclusion: bodyText.includes('conclusion') || bodyText.includes('summary') || bodyText.includes('in conclusion'),
    hasBulletPoints: $('ul li').length > 0,
    hasNumberedLists: $('ol li').length > 0,
    hasTables: $('table').length > 0,
    hasImages: $('img').length > 0,
    hasVideos: $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0,
  };
}

// Check for call-to-action
function detectCTA($: cheerio.CheerioAPI): { hasCTA: boolean; ctaCount: number } {
  const ctaPatterns = [
    'a[href*="contact"]', 'a[href*="signup"]', 'a[href*="register"]',
    'a[href*="buy"]', 'a[href*="order"]', 'a[href*="subscribe"]',
    'button', 'input[type="submit"]', '.cta', '.call-to-action',
    'a:contains("Get Started")', 'a:contains("Learn More")', 'a:contains("Contact Us")'
  ];
  
  let ctaCount = 0;
  for (const pattern of ctaPatterns) {
    ctaCount += $(pattern).length;
  }
  
  return { hasCTA: ctaCount > 0, ctaCount: Math.min(ctaCount, 20) };
}

export function analyzeContent(data: PageData): CategoryResult {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];
  
  // Get main content text (exclude nav, footer, sidebar)
  const mainContent = $('main, article, .content, .post, #content').first();
  const contentArea = mainContent.length > 0 ? mainContent : $('body');
  const text = contentArea.clone().find('script, style, nav, footer, aside, header').remove().end().text();
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 1. Readability Score
  const readability = calculateReadability(cleanText);
  checks.push({
    id: "readability",
    name: "Content Readability",
    status: readability.score >= 60 ? "pass" : readability.score >= 40 ? "warning" : "fail",
    score: readability.score,
    weight: 15,
    value: { score: readability.score, grade: readability.grade, level: readability.level },
    message: `Flesch Reading Ease: ${readability.score}/100 - ${readability.level}`,
    recommendation: readability.score < 60
      ? "Simplify your content with shorter sentences and simpler words for better readability"
      : undefined,
  });

  // 2. Content Depth (Word Count)
  checks.push({
    id: "contentDepth",
    name: "Content Depth",
    status: wordCount >= 1000 ? "pass" : wordCount >= 500 ? "warning" : "fail",
    score: wordCount >= 1500 ? 100 : wordCount >= 1000 ? 85 : wordCount >= 500 ? 60 : 30,
    weight: 12,
    value: { wordCount, recommended: 1000 },
    message: `${wordCount} words (recommended: 1000+ for comprehensive coverage)`,
    recommendation: wordCount < 1000
      ? "Add more comprehensive content to thoroughly cover the topic"
      : undefined,
  });

  // 3. Thin Content Check
  const thinContent = detectThinContent(cleanText, wordCount);
  checks.push({
    id: "thinContent",
    name: "Thin Content Check",
    status: thinContent.isThin ? "fail" : "pass",
    score: thinContent.isThin ? 30 : 100,
    weight: 10,
    value: { isThin: thinContent.isThin, reason: thinContent.reason },
    message: thinContent.isThin ? `Thin content detected: ${thinContent.reason}` : "Content depth is adequate",
    recommendation: thinContent.isThin
      ? "Expand your content with more detailed, valuable information"
      : undefined,
  });

  // 4. Content Freshness
  const freshness = detectFreshnessSignals($);
  checks.push({
    id: "contentFreshness",
    name: "Content Freshness Signals",
    status: freshness.hasDate ? "pass" : "warning",
    score: freshness.hasDate ? 100 : 60,
    weight: 8,
    value: { hasDate: freshness.hasDate, dateFound: freshness.dateFound },
    message: freshness.hasDate
      ? `Publication date found: ${freshness.dateFound}`
      : "No publication date detected",
    recommendation: !freshness.hasDate
      ? "Add a visible publication or last updated date to show content freshness"
      : undefined,
  });

  // 5. Content Structure
  const structure = analyzeContentStructure($);
  const structureScore = [
    structure.hasIntro,
    structure.hasConclusion,
    structure.hasBulletPoints || structure.hasNumberedLists,
    structure.hasImages,
  ].filter(Boolean).length * 25;
  
  checks.push({
    id: "contentStructure",
    name: "Content Structure",
    status: structureScore >= 75 ? "pass" : structureScore >= 50 ? "warning" : "fail",
    score: structureScore,
    weight: 10,
    value: structure,
    message: `Content structure score: ${structureScore}/100`,
    recommendation: structureScore < 75
      ? "Improve structure with clear intro, bullet points, images, and conclusion"
      : undefined,
  });

  // 6. Call-to-Action
  const cta = detectCTA($);
  checks.push({
    id: "callToAction",
    name: "Call-to-Action Presence",
    status: cta.hasCTA ? "pass" : "warning",
    score: cta.hasCTA ? 100 : 50,
    weight: 8,
    value: { hasCTA: cta.hasCTA, count: cta.ctaCount },
    message: cta.hasCTA ? `${cta.ctaCount} call-to-action element(s) found` : "No clear call-to-action detected",
    recommendation: !cta.hasCTA
      ? "Add clear call-to-action buttons or links to guide visitors"
      : undefined,
  });

  // 7. Paragraph Length
  const paragraphs = $('p');
  let longParagraphs = 0;
  paragraphs.each((_, el) => {
    const pWords = $(el).text().split(/\s+/).length;
    if (pWords > 150) longParagraphs++;
  });
  
  checks.push({
    id: "paragraphLength",
    name: "Paragraph Length",
    status: longParagraphs === 0 ? "pass" : longParagraphs <= 2 ? "warning" : "fail",
    score: longParagraphs === 0 ? 100 : longParagraphs <= 2 ? 70 : 40,
    weight: 5,
    value: { totalParagraphs: paragraphs.length, longParagraphs },
    message: longParagraphs === 0
      ? "All paragraphs are well-sized for readability"
      : `${longParagraphs} paragraph(s) are too long (150+ words)`,
    recommendation: longParagraphs > 0
      ? "Break up long paragraphs into smaller, more digestible chunks"
      : undefined,
  });

  // 8. Sentence Variety
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length || 0;
  
  checks.push({
    id: "sentenceLength",
    name: "Average Sentence Length",
    status: avgSentenceLength <= 20 ? "pass" : avgSentenceLength <= 25 ? "warning" : "fail",
    score: avgSentenceLength <= 15 ? 100 : avgSentenceLength <= 20 ? 85 : avgSentenceLength <= 25 ? 60 : 40,
    weight: 5,
    value: { average: Math.round(avgSentenceLength), totalSentences: sentences.length },
    message: `Average sentence length: ${Math.round(avgSentenceLength)} words`,
    recommendation: avgSentenceLength > 20
      ? "Use shorter sentences for better readability (aim for 15-20 words)"
      : undefined,
  });

  // 9. Multimedia Content
  const images = $('img').length;
  const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  const hasMultimedia = images > 0 || videos > 0;
  
  checks.push({
    id: "multimedia",
    name: "Multimedia Content",
    status: hasMultimedia ? "pass" : "warning",
    score: hasMultimedia ? 100 : 50,
    weight: 8,
    value: { images, videos },
    message: hasMultimedia
      ? `Found ${images} image(s) and ${videos} video(s)`
      : "No multimedia content detected",
    recommendation: !hasMultimedia
      ? "Add images or videos to make content more engaging"
      : undefined,
  });

  // 10. Internal Linking in Content
  const internalLinks = $('a[href^="/"], a[href^="' + new URL(data.url).origin + '"]').length;
  checks.push({
    id: "internalLinking",
    name: "Internal Linking",
    status: internalLinks >= 3 ? "pass" : internalLinks > 0 ? "warning" : "fail",
    score: internalLinks >= 5 ? 100 : internalLinks >= 3 ? 80 : internalLinks > 0 ? 50 : 20,
    weight: 8,
    value: { count: internalLinks },
    message: `${internalLinks} internal link(s) in content`,
    recommendation: internalLinks < 3
      ? "Add more internal links to help users and search engines navigate your site"
      : undefined,
  });

  // 11. External Authority Links
  const origin = new URL(data.url).origin;
  const externalLinks = $('a[href^="http"]').filter((_, el) => {
    const href = $(el).attr('href') || '';
    return !href.startsWith(origin);
  }).length;
  
  checks.push({
    id: "externalLinks",
    name: "External Authority Links",
    status: externalLinks >= 1 ? "pass" : "info",
    score: externalLinks >= 2 ? 100 : externalLinks >= 1 ? 80 : 60,
    weight: 5,
    value: { count: externalLinks },
    message: externalLinks > 0
      ? `${externalLinks} external link(s) to authority sources`
      : "No external links to authority sources",
    recommendation: externalLinks === 0
      ? "Consider linking to authoritative external sources to build trust"
      : undefined,
  });

  // 12. Duplicate Content Risk
  const duplicateCheck = checkDuplicateSignals($);
  checks.push({
    id: "duplicateRisk",
    name: "Duplicate Content Risk",
    status: duplicateCheck.hasDuplicateRisk ? "warning" : "pass",
    score: duplicateCheck.hasDuplicateRisk ? 60 : 100,
    weight: 6,
    value: { canonical: duplicateCheck.canonical, hasDuplicateRisk: duplicateCheck.hasDuplicateRisk },
    message: duplicateCheck.hasDuplicateRisk
      ? "Potential duplicate content signals detected"
      : "No duplicate content signals detected",
    recommendation: duplicateCheck.hasDuplicateRisk
      ? "Ensure canonical URL matches the page URL to avoid duplicate content issues"
      : undefined,
  });

  // Calculate category score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const grade = calculateGrade(score);

  return {
    score,
    grade,
    message: score >= 80
      ? "Your content quality is excellent!"
      : score >= 60
      ? "Your content quality is good but could be improved"
      : "Your content needs significant improvements",
    checks,
  };
}
