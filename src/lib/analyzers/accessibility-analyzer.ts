import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

// Check color contrast (simplified - would need actual color parsing for full check)
function analyzeColorContrast($: cheerio.CheerioAPI): {
  hasExplicitColors: boolean;
  potentialIssues: number;
} {
  let potentialIssues = 0;
  
  // Check for inline styles with potential low contrast
  $('[style*="color"]').each((_, el) => {
    const style = $(el).attr('style') || '';
    // Very light colors on light backgrounds (simplified check)
    if (style.includes('#fff') || style.includes('#eee') || style.includes('lightgray')) {
      potentialIssues++;
    }
  });
  
  return {
    hasExplicitColors: $('[style*="color"]').length > 0,
    potentialIssues,
  };
}

// Check for proper heading structure
function analyzeHeadingStructure($: cheerio.CheerioAPI): {
  hasH1: boolean;
  h1Count: number;
  hasProperHierarchy: boolean;
  skippedLevels: string[];
} {
  const h1Count = $('h1').length;
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const foundLevels: number[] = [];
  
  headings.forEach((h, index) => {
    if ($(h).length > 0) {
      foundLevels.push(index + 1);
    }
  });
  
  const skippedLevels: string[] = [];
  for (let i = 1; i < foundLevels.length; i++) {
    if (foundLevels[i] - foundLevels[i - 1] > 1) {
      skippedLevels.push(`H${foundLevels[i - 1]} to H${foundLevels[i]}`);
    }
  }
  
  return {
    hasH1: h1Count > 0,
    h1Count,
    hasProperHierarchy: skippedLevels.length === 0,
    skippedLevels,
  };
}

// Check for accessible forms
function analyzeFormAccessibility($: cheerio.CheerioAPI): {
  totalInputs: number;
  labeledInputs: number;
  inputsWithPlaceholderOnly: number;
  hasFieldset: boolean;
  hasLegend: boolean;
} {
  const inputs = $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
  let labeledInputs = 0;
  let inputsWithPlaceholderOnly = 0;
  
  inputs.each((_, el) => {
    const $el = $(el);
    const id = $el.attr('id');
    const ariaLabel = $el.attr('aria-label');
    const ariaLabelledby = $el.attr('aria-labelledby');
    const placeholder = $el.attr('placeholder');
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    
    if (hasLabel || ariaLabel || ariaLabelledby) {
      labeledInputs++;
    } else if (placeholder) {
      inputsWithPlaceholderOnly++;
    }
  });
  
  return {
    totalInputs: inputs.length,
    labeledInputs,
    inputsWithPlaceholderOnly,
    hasFieldset: $('fieldset').length > 0,
    hasLegend: $('legend').length > 0,
  };
}

// Check for keyboard accessibility
function analyzeKeyboardAccessibility($: cheerio.CheerioAPI): {
  hasSkipLink: boolean;
  hasTabIndex: number;
  negativeTabIndex: number;
  hasFocusStyles: boolean;
  interactiveElements: number;
} {
  const hasSkipLink = $('a[href="#main"], a[href="#content"], .skip-link, .skip-to-content').length > 0;
  const tabIndexElements = $('[tabindex]');
  let negativeTabIndex = 0;
  
  tabIndexElements.each((_, el) => {
    const value = parseInt($(el).attr('tabindex') || '0', 10);
    if (value < 0) negativeTabIndex++;
  });
  
  // Check for focus styles in inline styles or presence of :focus in style tags
  const styleContent = $('style').text();
  const hasFocusStyles = styleContent.includes(':focus') || 
    $('[style*="outline"]').length > 0 ||
    $('link[href*="focus"]').length > 0;
  
  const interactiveElements = $('a, button, input, select, textarea, [tabindex], [onclick]').length;
  
  return {
    hasSkipLink,
    hasTabIndex: tabIndexElements.length,
    negativeTabIndex,
    hasFocusStyles,
    interactiveElements,
  };
}

// Check for ARIA usage
function analyzeARIA($: cheerio.CheerioAPI): {
  hasLandmarks: boolean;
  landmarksFound: string[];
  hasAriaLabels: number;
  hasAriaDescribedby: number;
  hasRoles: number;
  hasAriaHidden: number;
  hasAriaLive: boolean;
} {
  const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search', 'form', 'region'];
  const landmarkElements = ['header', 'nav', 'main', 'footer', 'aside', 'section[aria-label]'];
  
  const foundLandmarks: string[] = [];
  
  landmarkRoles.forEach(role => {
    if ($(`[role="${role}"]`).length > 0) {
      foundLandmarks.push(`role="${role}"`);
    }
  });
  
  landmarkElements.forEach(el => {
    if ($(el).length > 0) {
      foundLandmarks.push(`<${el.split('[')[0]}>`);
    }
  });
  
  return {
    hasLandmarks: foundLandmarks.length > 0,
    landmarksFound: [...new Set(foundLandmarks)],
    hasAriaLabels: $('[aria-label]').length,
    hasAriaDescribedby: $('[aria-describedby]').length,
    hasRoles: $('[role]').length,
    hasAriaHidden: $('[aria-hidden="true"]').length,
    hasAriaLive: $('[aria-live]').length > 0,
  };
}

// Check for link accessibility
function analyzeLinkAccessibility($: cheerio.CheerioAPI): {
  totalLinks: number;
  emptyLinks: number;
  genericLinkText: number;
  newWindowLinks: number;
  newWindowWithWarning: number;
} {
  const links = $('a');
  let emptyLinks = 0;
  let genericLinkText = 0;
  let newWindowLinks = 0;
  let newWindowWithWarning = 0;
  
  const genericTexts = ['click here', 'read more', 'learn more', 'here', 'more', 'link'];
  
  links.each((_, el) => {
    const $link = $(el);
    const text = $link.text().trim().toLowerCase();
    const ariaLabel = $link.attr('aria-label');
    const title = $link.attr('title');
    const img = $link.find('img');
    const imgAlt = img.attr('alt');
    
    // Check for empty links
    if (!text && !ariaLabel && !title && (!img.length || !imgAlt)) {
      emptyLinks++;
    }
    
    // Check for generic link text
    if (genericTexts.includes(text) && !ariaLabel) {
      genericLinkText++;
    }
    
    // Check for new window links
    const target = $link.attr('target');
    if (target === '_blank') {
      newWindowLinks++;
      if (ariaLabel?.includes('new window') || ariaLabel?.includes('new tab') || 
          title?.includes('new window') || title?.includes('new tab') ||
          $link.find('.sr-only, .screen-reader-text').length > 0) {
        newWindowWithWarning++;
      }
    }
  });
  
  return {
    totalLinks: links.length,
    emptyLinks,
    genericLinkText,
    newWindowLinks,
    newWindowWithWarning,
  };
}

// Check for media accessibility
function analyzeMediaAccessibility($: cheerio.CheerioAPI): {
  totalImages: number;
  imagesWithAlt: number;
  imagesWithEmptyAlt: number;
  decorativeImages: number;
  videos: number;
  videosWithCaptions: number;
  audio: number;
  audioWithTranscript: number;
} {
  const images = $('img');
  let imagesWithAlt = 0;
  let imagesWithEmptyAlt = 0;
  let decorativeImages = 0;
  
  images.each((_, el) => {
    const alt = $(el).attr('alt');
    const role = $(el).attr('role');
    const ariaHidden = $(el).attr('aria-hidden');
    
    if (alt !== undefined) {
      if (alt === '' || role === 'presentation' || ariaHidden === 'true') {
        decorativeImages++;
        imagesWithEmptyAlt++;
      } else {
        imagesWithAlt++;
      }
    }
  });
  
  const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
  let videosWithCaptions = 0;
  
  videos.each((_, el) => {
    const $el = $(el);
    if ($el.find('track[kind="captions"]').length > 0 || 
        $el.attr('src')?.includes('cc_load_policy=1')) {
      videosWithCaptions++;
    }
  });
  
  const audio = $('audio');
  const audioWithTranscript = $('audio').filter((_, el) => {
    const parent = $(el).parent();
    return parent.find('.transcript, [aria-describedby]').length > 0;
  }).length;
  
  return {
    totalImages: images.length,
    imagesWithAlt,
    imagesWithEmptyAlt,
    decorativeImages,
    videos: videos.length,
    videosWithCaptions,
    audio: audio.length,
    audioWithTranscript,
  };
}

// Check for table accessibility
function analyzeTableAccessibility($: cheerio.CheerioAPI): {
  totalTables: number;
  tablesWithCaption: number;
  tablesWithHeaders: number;
  tablesWithScope: number;
} {
  const tables = $('table');
  let tablesWithCaption = 0;
  let tablesWithHeaders = 0;
  let tablesWithScope = 0;
  
  tables.each((_, el) => {
    const $table = $(el);
    if ($table.find('caption').length > 0) tablesWithCaption++;
    if ($table.find('th').length > 0) tablesWithHeaders++;
    if ($table.find('[scope]').length > 0) tablesWithScope++;
  });
  
  return {
    totalTables: tables.length,
    tablesWithCaption,
    tablesWithHeaders,
    tablesWithScope,
  };
}

export function analyzeAccessibility(data: PageData): CategoryResult {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];

  // Get all analysis results
  const headings = analyzeHeadingStructure($);
  const forms = analyzeFormAccessibility($);
  const keyboard = analyzeKeyboardAccessibility($);
  const aria = analyzeARIA($);
  const links = analyzeLinkAccessibility($);
  const media = analyzeMediaAccessibility($);
  const tables = analyzeTableAccessibility($);
  const contrast = analyzeColorContrast($);

  // 1. Image Alt Text (WCAG 1.1.1)
  const altTextScore = media.totalImages === 0 ? 100 : 
    Math.round((media.imagesWithAlt + media.decorativeImages) / media.totalImages * 100);
  checks.push({
    id: "imageAltText",
    name: "Image Alt Text (WCAG 1.1.1)",
    status: altTextScore >= 100 ? "pass" : altTextScore >= 80 ? "warning" : "fail",
    score: altTextScore,
    weight: 15,
    value: {
      total: media.totalImages,
      withAlt: media.imagesWithAlt,
      decorative: media.decorativeImages,
      missing: media.totalImages - media.imagesWithAlt - media.decorativeImages,
    },
    message: media.totalImages === 0
      ? "No images found on page"
      : `${media.imagesWithAlt}/${media.totalImages} images have descriptive alt text`,
    recommendation: altTextScore < 100
      ? "Add descriptive alt text to all images, or mark decorative images with empty alt=\"\""
      : undefined,
  });

  // 2. Heading Structure (WCAG 1.3.1)
  const headingScore = headings.hasH1 && headings.h1Count === 1 && headings.hasProperHierarchy ? 100 :
    headings.hasH1 && headings.h1Count === 1 ? 70 :
    headings.hasH1 ? 50 : 20;
  checks.push({
    id: "headingStructure",
    name: "Heading Structure (WCAG 1.3.1)",
    status: headingScore >= 100 ? "pass" : headingScore >= 70 ? "warning" : "fail",
    score: headingScore,
    weight: 12,
    value: headings,
    message: headings.hasProperHierarchy
      ? `Proper heading hierarchy with ${headings.h1Count} H1`
      : `Heading issues: ${headings.skippedLevels.join(', ')}`,
    recommendation: headingScore < 100
      ? "Use one H1 per page and maintain proper heading hierarchy (don't skip levels)"
      : undefined,
  });

  // 3. Form Labels (WCAG 1.3.1, 3.3.2)
  const formScore = forms.totalInputs === 0 ? 100 :
    Math.round(forms.labeledInputs / forms.totalInputs * 100);
  checks.push({
    id: "formLabels",
    name: "Form Labels (WCAG 1.3.1)",
    status: formScore >= 100 ? "pass" : formScore >= 80 ? "warning" : "fail",
    score: formScore,
    weight: 12,
    value: forms,
    message: forms.totalInputs === 0
      ? "No form inputs found"
      : `${forms.labeledInputs}/${forms.totalInputs} inputs have proper labels`,
    recommendation: formScore < 100
      ? "Add proper <label> elements or aria-label to all form inputs"
      : undefined,
  });

  // 4. Keyboard Navigation (WCAG 2.1.1)
  const keyboardScore = keyboard.hasSkipLink ? 
    (keyboard.negativeTabIndex === 0 ? 100 : 70) :
    (keyboard.negativeTabIndex === 0 ? 60 : 40);
  checks.push({
    id: "keyboardNav",
    name: "Keyboard Navigation (WCAG 2.1.1)",
    status: keyboardScore >= 80 ? "pass" : keyboardScore >= 60 ? "warning" : "fail",
    score: keyboardScore,
    weight: 10,
    value: keyboard,
    message: keyboard.hasSkipLink
      ? "Skip link present for keyboard navigation"
      : "No skip link found",
    recommendation: !keyboard.hasSkipLink
      ? "Add a skip link to allow keyboard users to bypass navigation"
      : undefined,
  });

  // 5. ARIA Landmarks (WCAG 1.3.1)
  checks.push({
    id: "ariaLandmarks",
    name: "ARIA Landmarks (WCAG 1.3.1)",
    status: aria.hasLandmarks ? "pass" : "warning",
    score: aria.hasLandmarks ? 100 : 50,
    weight: 8,
    value: { landmarks: aria.landmarksFound },
    message: aria.hasLandmarks
      ? `ARIA landmarks found: ${aria.landmarksFound.slice(0, 5).join(', ')}`
      : "No ARIA landmarks detected",
    recommendation: !aria.hasLandmarks
      ? "Add ARIA landmarks (main, nav, header, footer) or use HTML5 semantic elements"
      : undefined,
  });

  // 6. Link Accessibility (WCAG 2.4.4)
  const linkIssues = links.emptyLinks + links.genericLinkText;
  const linkScore = links.totalLinks === 0 ? 100 :
    Math.max(0, 100 - (linkIssues / links.totalLinks * 100));
  checks.push({
    id: "linkAccessibility",
    name: "Link Accessibility (WCAG 2.4.4)",
    status: linkIssues === 0 ? "pass" : linkIssues <= 3 ? "warning" : "fail",
    score: Math.round(linkScore),
    weight: 10,
    value: links,
    message: linkIssues === 0
      ? "All links have descriptive text"
      : `${linkIssues} link(s) have accessibility issues`,
    recommendation: linkIssues > 0
      ? `Fix ${links.emptyLinks} empty links and ${links.genericLinkText} generic link texts`
      : undefined,
  });

  // 7. New Window Warnings (WCAG 3.2.5)
  const newWindowScore = links.newWindowLinks === 0 ? 100 :
    Math.round(links.newWindowWithWarning / links.newWindowLinks * 100);
  checks.push({
    id: "newWindowWarning",
    name: "New Window Warnings (WCAG 3.2.5)",
    status: newWindowScore >= 100 ? "pass" : newWindowScore >= 50 ? "warning" : "info",
    score: newWindowScore,
    weight: 5,
    value: {
      newWindowLinks: links.newWindowLinks,
      withWarning: links.newWindowWithWarning,
    },
    message: links.newWindowLinks === 0
      ? "No links open in new windows"
      : `${links.newWindowWithWarning}/${links.newWindowLinks} new-window links have warnings`,
    recommendation: links.newWindowLinks > links.newWindowWithWarning
      ? "Warn users when links open in new windows using aria-label or visible text"
      : undefined,
  });

  // 8. Video Captions (WCAG 1.2.2)
  const captionScore = media.videos === 0 ? 100 :
    Math.round(media.videosWithCaptions / media.videos * 100);
  checks.push({
    id: "videoCaptions",
    name: "Video Captions (WCAG 1.2.2)",
    status: media.videos === 0 ? "pass" : captionScore >= 100 ? "pass" : "warning",
    score: captionScore,
    weight: 8,
    value: {
      videos: media.videos,
      withCaptions: media.videosWithCaptions,
    },
    message: media.videos === 0
      ? "No videos found"
      : `${media.videosWithCaptions}/${media.videos} videos have captions`,
    recommendation: media.videos > media.videosWithCaptions
      ? "Add captions to all videos for deaf and hard-of-hearing users"
      : undefined,
  });

  // 9. Table Accessibility (WCAG 1.3.1)
  const tableScore = tables.totalTables === 0 ? 100 :
    tables.tablesWithHeaders === tables.totalTables ? 100 :
    tables.tablesWithHeaders > 0 ? 60 : 30;
  checks.push({
    id: "tableAccessibility",
    name: "Table Accessibility (WCAG 1.3.1)",
    status: tables.totalTables === 0 ? "pass" : tableScore >= 100 ? "pass" : "warning",
    score: tableScore,
    weight: 5,
    value: tables,
    message: tables.totalTables === 0
      ? "No data tables found"
      : `${tables.tablesWithHeaders}/${tables.totalTables} tables have proper headers`,
    recommendation: tables.totalTables > tables.tablesWithHeaders
      ? "Add <th> elements with scope attributes to data tables"
      : undefined,
  });

  // 10. Language Attribute (WCAG 3.1.1)
  const htmlLang = $('html').attr('lang');
  checks.push({
    id: "languageAttribute",
    name: "Language Attribute (WCAG 3.1.1)",
    status: htmlLang ? "pass" : "fail",
    score: htmlLang ? 100 : 0,
    weight: 8,
    value: { lang: htmlLang || null },
    message: htmlLang
      ? `Page language set to: ${htmlLang}`
      : "No language attribute found on <html>",
    recommendation: !htmlLang
      ? "Add lang attribute to <html> element (e.g., lang=\"en\")"
      : undefined,
  });

  // 11. Focus Indicators (WCAG 2.4.7)
  checks.push({
    id: "focusIndicators",
    name: "Focus Indicators (WCAG 2.4.7)",
    status: keyboard.hasFocusStyles ? "pass" : "warning",
    score: keyboard.hasFocusStyles ? 100 : 50,
    weight: 7,
    value: { hasFocusStyles: keyboard.hasFocusStyles },
    message: keyboard.hasFocusStyles
      ? "Focus styles appear to be defined"
      : "No explicit focus styles detected",
    recommendation: !keyboard.hasFocusStyles
      ? "Ensure all interactive elements have visible focus indicators"
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
      ? "Good accessibility! Your site follows WCAG guidelines well."
      : score >= 60
      ? "Moderate accessibility. Some improvements needed for WCAG compliance."
      : "Significant accessibility issues. Address WCAG violations to improve usability.",
    checks,
  };
}
