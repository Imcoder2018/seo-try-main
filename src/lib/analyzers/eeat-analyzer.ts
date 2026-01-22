import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

// Detect author information
function detectAuthorInfo($: cheerio.CheerioAPI): {
  hasAuthor: boolean;
  authorName: string | null;
  hasAuthorBio: boolean;
  hasAuthorImage: boolean;
  hasAuthorCredentials: boolean;
  authorSchema: boolean;
} {
  // Check for author schema
  const authorSchema = $('[itemtype*="Person"]').length > 0 || 
    $('script[type="application/ld+json"]').text().includes('"author"');
  
  // Check for author elements
  const authorSelectors = [
    '.author', '.post-author', '.entry-author', '[rel="author"]',
    '.byline', '.by-author', '[itemprop="author"]', '.author-name'
  ];
  
  let authorName: string | null = null;
  let hasAuthor = false;
  
  for (const selector of authorSelectors) {
    const element = $(selector).first();
    if (element.length) {
      hasAuthor = true;
      authorName = element.text().trim().substring(0, 100);
      break;
    }
  }
  
  // Check for author bio
  const bioSelectors = ['.author-bio', '.author-description', '.author-info', '.about-author'];
  const hasAuthorBio = bioSelectors.some(sel => $(sel).length > 0);
  
  // Check for author image
  const hasAuthorImage = $('.author img, .author-image, .author-avatar, [itemprop="image"]').length > 0;
  
  // Check for credentials
  const pageText = $('body').text().toLowerCase();
  const credentialPatterns = ['phd', 'md', 'mba', 'certified', 'expert', 'years experience', 'specialist', 'professional'];
  const hasAuthorCredentials = credentialPatterns.some(p => pageText.includes(p));
  
  return {
    hasAuthor,
    authorName,
    hasAuthorBio,
    hasAuthorImage,
    hasAuthorCredentials,
    authorSchema,
  };
}

// Detect trust signals
function detectTrustSignals($: cheerio.CheerioAPI): {
  hasContactPage: boolean;
  hasAboutPage: boolean;
  hasPrivacyPolicy: boolean;
  hasTermsOfService: boolean;
  hasPhoneNumber: boolean;
  hasPhysicalAddress: boolean;
  hasEmail: boolean;
  hasSocialProof: boolean;
  hasTestimonials: boolean;
  hasCertifications: boolean;
} {
  const links = $('a').map((_, el) => $(el).attr('href')?.toLowerCase() || '').get();
  const pageText = $('body').text().toLowerCase();
  const html = $.html().toLowerCase();
  
  return {
    hasContactPage: links.some(l => l.includes('contact')),
    hasAboutPage: links.some(l => l.includes('about')),
    hasPrivacyPolicy: links.some(l => l.includes('privacy')),
    hasTermsOfService: links.some(l => l.includes('terms') || l.includes('tos')),
    hasPhoneNumber: /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(pageText),
    hasPhysicalAddress: /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln)/i.test(pageText),
    hasEmail: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(pageText),
    hasSocialProof: html.includes('review') || html.includes('rating') || html.includes('testimonial'),
    hasTestimonials: $('.testimonial, .review, .customer-review, [itemprop="review"]').length > 0,
    hasCertifications: html.includes('certified') || html.includes('accredited') || html.includes('award'),
  };
}

// Detect expertise signals
function detectExpertiseSignals($: cheerio.CheerioAPI): {
  hasDetailedContent: boolean;
  hasCitations: boolean;
  hasDataSupport: boolean;
  hasOriginalResearch: boolean;
  hasIndustryTerms: boolean;
  hasUpdatedContent: boolean;
} {
  const pageText = $('body').text().toLowerCase();
  const html = $.html();
  
  // Check for citations/references
  const hasCitations = $('cite, .citation, .reference, blockquote[cite], sup a').length > 0 ||
    pageText.includes('according to') || pageText.includes('study shows') || pageText.includes('research');
  
  // Check for data/statistics
  const hasDataSupport = /\d+%|\d+\s*(million|billion|thousand)|\$\d+/i.test(pageText);
  
  // Check for original research indicators
  const hasOriginalResearch = pageText.includes('our research') || pageText.includes('we found') || 
    pageText.includes('our study') || pageText.includes('we analyzed');
  
  // Check for updated content
  const hasUpdatedContent = html.includes('updated') || html.includes('last modified') || 
    $('time[datetime]').length > 0;
  
  // Content depth (more than 1000 words suggests expertise)
  const wordCount = pageText.split(/\s+/).length;
  const hasDetailedContent = wordCount > 1000;
  
  // Industry terminology (check for technical terms)
  const hasIndustryTerms = $('abbr, dfn, .term, .definition').length > 0;
  
  return {
    hasDetailedContent,
    hasCitations,
    hasDataSupport,
    hasOriginalResearch,
    hasIndustryTerms,
    hasUpdatedContent,
  };
}

// Detect authority signals
function detectAuthoritySignals($: cheerio.CheerioAPI, url: string): {
  hasBrandMention: boolean;
  hasAwards: boolean;
  hasMediaMentions: boolean;
  hasPartnerLogos: boolean;
  hasIndustryAffiliations: boolean;
  domainAge: string;
} {
  const html = $.html().toLowerCase();
  const domain = new URL(url).hostname;
  
  return {
    hasBrandMention: html.includes(domain.split('.')[0]),
    hasAwards: html.includes('award') || html.includes('winner') || html.includes('best'),
    hasMediaMentions: html.includes('featured in') || html.includes('as seen on') || html.includes('mentioned'),
    hasPartnerLogos: $('.partner, .client, .trusted-by, .as-seen-on').length > 0 || 
      $('img[alt*="partner"], img[alt*="client"], img[alt*="logo"]').length > 3,
    hasIndustryAffiliations: html.includes('member of') || html.includes('affiliated') || html.includes('association'),
    domainAge: "Check via WHOIS", // Would need external API
  };
}

// Detect experience signals (the new E in E-E-A-T)
function detectExperienceSignals($: cheerio.CheerioAPI): {
  hasFirstPersonNarrative: boolean;
  hasOriginalPhotos: boolean;
  hasProductReviews: boolean;
  hasCaseStudies: boolean;
  hasHowToContent: boolean;
  hasPersonalStories: boolean;
} {
  const pageText = $('body').text().toLowerCase();
  const html = $.html().toLowerCase();
  
  return {
    hasFirstPersonNarrative: /\bi\s+(tried|tested|used|bought|experienced|found|discovered|learned)/i.test(pageText),
    hasOriginalPhotos: $('img[src*="original"], img[src*="photo"], .gallery img').length > 0 ||
      $('figure img').length > 0,
    hasProductReviews: html.includes('review') && (html.includes('pros') || html.includes('cons')),
    hasCaseStudies: html.includes('case study') || html.includes('success story') || html.includes('client story'),
    hasHowToContent: html.includes('how to') || html.includes('step by step') || html.includes('guide'),
    hasPersonalStories: /my\s+(experience|journey|story)/i.test(pageText),
  };
}

export function analyzeEEAT(data: PageData): CategoryResult {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];

  // Get all signals
  const author = detectAuthorInfo($);
  const trust = detectTrustSignals($);
  const expertise = detectExpertiseSignals($);
  const authority = detectAuthoritySignals($, data.url);
  const experience = detectExperienceSignals($);

  // 1. Author Information
  const authorScore = [author.hasAuthor, author.hasAuthorBio, author.hasAuthorImage, author.hasAuthorCredentials, author.authorSchema]
    .filter(Boolean).length * 20;
  checks.push({
    id: "authorInfo",
    name: "Author Information",
    status: authorScore >= 60 ? "pass" : authorScore >= 40 ? "warning" : "fail",
    score: authorScore,
    weight: 15,
    value: author,
    message: author.hasAuthor
      ? `Author "${author.authorName}" identified${author.hasAuthorBio ? ' with bio' : ''}${author.hasAuthorCredentials ? ' and credentials' : ''}`
      : "No author information found",
    recommendation: authorScore < 60
      ? "Add clear author information with bio, photo, and credentials to build trust"
      : undefined,
  });

  // 2. Contact & Business Information
  const contactScore = [trust.hasContactPage, trust.hasPhoneNumber, trust.hasPhysicalAddress, trust.hasEmail]
    .filter(Boolean).length * 25;
  checks.push({
    id: "contactInfo",
    name: "Contact Information",
    status: contactScore >= 75 ? "pass" : contactScore >= 50 ? "warning" : "fail",
    score: contactScore,
    weight: 12,
    value: {
      hasContactPage: trust.hasContactPage,
      hasPhone: trust.hasPhoneNumber,
      hasAddress: trust.hasPhysicalAddress,
      hasEmail: trust.hasEmail,
    },
    message: `Contact signals: ${contactScore}% complete`,
    recommendation: contactScore < 75
      ? "Add complete contact information including phone, address, and email"
      : undefined,
  });

  // 3. Trust Signals
  const trustScore = [trust.hasAboutPage, trust.hasPrivacyPolicy, trust.hasTermsOfService, trust.hasSocialProof]
    .filter(Boolean).length * 25;
  checks.push({
    id: "trustSignals",
    name: "Trust Signals",
    status: trustScore >= 75 ? "pass" : trustScore >= 50 ? "warning" : "fail",
    score: trustScore,
    weight: 12,
    value: {
      hasAbout: trust.hasAboutPage,
      hasPrivacy: trust.hasPrivacyPolicy,
      hasTerms: trust.hasTermsOfService,
      hasSocialProof: trust.hasSocialProof,
    },
    message: `Trust signals: ${trustScore}% present`,
    recommendation: trustScore < 75
      ? "Add About page, Privacy Policy, Terms of Service, and social proof"
      : undefined,
  });

  // 4. Testimonials & Reviews
  checks.push({
    id: "testimonials",
    name: "Testimonials & Reviews",
    status: trust.hasTestimonials ? "pass" : "warning",
    score: trust.hasTestimonials ? 100 : 40,
    weight: 10,
    value: { hasTestimonials: trust.hasTestimonials },
    message: trust.hasTestimonials
      ? "Customer testimonials or reviews found"
      : "No testimonials or reviews detected",
    recommendation: !trust.hasTestimonials
      ? "Add customer testimonials or reviews to build social proof"
      : undefined,
  });

  // 5. Citations & References
  checks.push({
    id: "citations",
    name: "Citations & References",
    status: expertise.hasCitations ? "pass" : "warning",
    score: expertise.hasCitations ? 100 : 50,
    weight: 10,
    value: { hasCitations: expertise.hasCitations },
    message: expertise.hasCitations
      ? "Content includes citations or references to sources"
      : "No citations or external references found",
    recommendation: !expertise.hasCitations
      ? "Add citations and references to authoritative sources"
      : undefined,
  });

  // 6. Data & Statistics
  checks.push({
    id: "dataSupport",
    name: "Data & Statistics",
    status: expertise.hasDataSupport ? "pass" : "info",
    score: expertise.hasDataSupport ? 100 : 60,
    weight: 8,
    value: { hasDataSupport: expertise.hasDataSupport },
    message: expertise.hasDataSupport
      ? "Content supported by data and statistics"
      : "Consider adding data to support claims",
  });

  // 7. Content Freshness
  checks.push({
    id: "contentFreshness",
    name: "Content Freshness",
    status: expertise.hasUpdatedContent ? "pass" : "warning",
    score: expertise.hasUpdatedContent ? 100 : 50,
    weight: 8,
    value: { hasUpdatedContent: expertise.hasUpdatedContent },
    message: expertise.hasUpdatedContent
      ? "Content shows update/publish date"
      : "No content date indicators found",
    recommendation: !expertise.hasUpdatedContent
      ? "Display publication and last updated dates"
      : undefined,
  });

  // 8. First-Hand Experience
  const experienceScore = [experience.hasFirstPersonNarrative, experience.hasOriginalPhotos, 
    experience.hasCaseStudies, experience.hasPersonalStories].filter(Boolean).length * 25;
  checks.push({
    id: "firstHandExperience",
    name: "First-Hand Experience Signals",
    status: experienceScore >= 50 ? "pass" : experienceScore >= 25 ? "warning" : "info",
    score: experienceScore || 50,
    weight: 10,
    value: experience,
    message: experienceScore >= 50
      ? "Content shows first-hand experience signals"
      : "Limited first-hand experience signals detected",
    recommendation: experienceScore < 50
      ? "Add personal experience, case studies, or original photos to demonstrate expertise"
      : undefined,
  });

  // 9. Industry Authority
  const authorityScore = [authority.hasAwards, authority.hasMediaMentions, 
    authority.hasPartnerLogos, authority.hasIndustryAffiliations].filter(Boolean).length * 25;
  checks.push({
    id: "industryAuthority",
    name: "Industry Authority Signals",
    status: authorityScore >= 50 ? "pass" : authorityScore >= 25 ? "warning" : "info",
    score: authorityScore || 40,
    weight: 8,
    value: authority,
    message: authorityScore >= 50
      ? "Strong authority signals present"
      : "Limited authority indicators found",
    recommendation: authorityScore < 50
      ? "Showcase awards, media mentions, partnerships, and industry affiliations"
      : undefined,
  });

  // 10. Certifications & Credentials
  checks.push({
    id: "certifications",
    name: "Certifications & Credentials",
    status: trust.hasCertifications ? "pass" : "info",
    score: trust.hasCertifications ? 100 : 60,
    weight: 7,
    value: { hasCertifications: trust.hasCertifications },
    message: trust.hasCertifications
      ? "Certifications or credentials mentioned"
      : "No certifications or credentials found",
    recommendation: !trust.hasCertifications
      ? "Display relevant certifications, awards, or professional credentials"
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
      ? "Excellent E-E-A-T signals - Your site demonstrates strong trust and authority!"
      : score >= 60
      ? "Good E-E-A-T signals with room for improvement"
      : "E-E-A-T signals need significant improvement for better rankings",
    checks,
  };
}
