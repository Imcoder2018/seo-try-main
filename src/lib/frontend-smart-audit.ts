// Frontend Smart Audit - Runs in browser with same functionality as trigger/audit/smart-audit.ts
// See trigger/audit/smart-audit.ts for detailed implementation reference

type PageType = 'home' | 'contact' | 'about' | 'blog' | 'product' | 'service' | 'category' | 'tag' | 'archive' | 'legal' | 'other';

interface PageClassification { url: string; type: PageType; title?: string; }
interface CrawlData { pages: Array<{ url: string; title?: string; }>; urlGroups?: { core: string[]; blog: string[]; product: string[]; category: string[]; other: string[]; }; }
interface Check { id: string; name: string; status: "pass" | "warning" | "fail" | "info"; score: number; weight: number; value: Record<string, unknown>; message: string; recommendation?: string; sourcePages?: string[]; }
interface CategoryResult { score: number; grade: string; message: string; checks: Check[]; sourcePages?: string[]; }

export interface SmartAuditOutput {
  overallScore: number; overallGrade: string;
  localSeo: CategoryResult; seo: CategoryResult; links: CategoryResult; usability: CategoryResult;
  performance: CategoryResult; social: CategoryResult; technology: CategoryResult;
  technicalSeo: CategoryResult; content: CategoryResult; eeat: CategoryResult;
  recommendations: Array<{ id: string; title: string; description: string | null; category: string; priority: "HIGH" | "MEDIUM" | "LOW"; checkId: string; sourcePages?: string[]; }>;
  pageClassifications: PageClassification[]; pagesAnalyzed: number; pagesFailed: number;
  auditMapping: { localSeo: string[]; seo: string[]; content: string[]; performance: string[]; eeat: string[]; social: string[]; technology: string[]; technicalSeo: string[]; links: string[]; usability: string[]; };
}

export interface FrontendAuditProgress { progress: number; label: string; pagesTotal: number; pagesAnalyzed: number; }

function classifyPage(url: string, crawlData?: CrawlData): PageType {
  const pathname = new URL(url).pathname.toLowerCase();
  if (crawlData?.urlGroups) {
    if (crawlData.urlGroups.core.includes(url)) { if (pathname === '/' || pathname === '') return 'home'; if (pathname.includes('contact')) return 'contact'; if (pathname.includes('about')) return 'about'; }
    if (crawlData.urlGroups.blog.includes(url)) return 'blog';
    if (crawlData.urlGroups.product.includes(url)) return 'product';
    if (crawlData.urlGroups.category.includes(url)) return 'category';
  }
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.match(/\/(contact|kontakt)/)) return 'contact';
  if (pathname.match(/\/(about|about-us|team)/)) return 'about';
  if (pathname.match(/\/(privacy|terms|legal)/)) return 'legal';
  if (pathname.match(/\/(category|categories)/)) return 'category';
  if (pathname.match(/\/(products?|shop|store)/)) return 'product';
  if (pathname.match(/\/(services?|solutions?)/)) return 'service';
  if (pathname.match(/\/(blog|news|articles?)/)) { if (pathname === '/blog' || pathname === '/blog/') return 'archive'; return 'blog'; }
  return 'other';
}

function getAuditSectionsForPageType(pageType: PageType): string[] {
  const mapping: Record<PageType, string[]> = {
    home: ['performance', 'technology', 'technicalSeo', 'social', 'localSeo', 'usability', 'links', 'seo', 'content'],
    contact: ['localSeo', 'usability', 'technology', 'seo', 'technicalSeo'],
    about: ['eeat', 'content', 'social', 'seo', 'technicalSeo'],
    blog: ['content', 'eeat', 'social', 'seo', 'technicalSeo'],
    product: ['seo', 'performance', 'usability', 'links', 'content', 'technicalSeo'],
    service: ['seo', 'content', 'eeat', 'performance', 'technicalSeo'],
    category: ['seo', 'links', 'usability', 'technicalSeo'], tag: ['seo', 'links', 'usability', 'technicalSeo'],
    archive: ['seo', 'links', 'usability', 'technicalSeo'], legal: ['usability', 'technology', 'technicalSeo'],
    other: ['seo', 'links', 'usability', 'content', 'technicalSeo'],
  };
  return mapping[pageType] || ['seo', 'links', 'usability', 'technicalSeo'];
}

function calculateGrade(score: number): string { if (score >= 90) return "A+"; if (score >= 80) return "A"; if (score >= 70) return "B"; if (score >= 60) return "C"; if (score >= 50) return "D"; return "F"; }

async function fetchPage(url: string) {
  const startTime = Date.now();
  const response = await fetch('/api/proxy-fetch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
  const responseTime = Date.now() - startTime;
  if (!response.ok) throw new Error(`Failed to fetch page: ${response.statusText}`);
  const data = await response.json();
  const html = data.html || '';
  return {
    url: data.finalUrl || url, html, headers: data.headers || {}, responseTime: data.responseTime || responseTime,
    statusCode: data.statusCode || 200, contentLength: html.length, isHttps: url.startsWith("https://"),
    parsedData: { h1Count: (html.match(/<h1[^>]*>/gi) || []).length, h2Count: (html.match(/<h2[^>]*>/gi) || []).length, h3Count: (html.match(/<h3[^>]*>/gi) || []).length, h4Count: (html.match(/<h4[^>]*>/gi) || []).length, h5Count: 0, h6Count: 0 },
  };
}

function stemWord(word: string): string { word = word.toLowerCase(); const suffixes = ['ing', 'tion', 'ment', 'ness', 'able', 'er', 'ed', 'es', 's']; for (const s of suffixes) { if (word.length > s.length + 3 && word.endsWith(s)) return word.slice(0, -s.length); } return word; }
function wordsMatch(w1: string, w2: string): boolean { const a = w1.toLowerCase(), b = w2.toLowerCase(); return a === b || stemWord(a) === stemWord(b) || (a.length > 4 && b.length > 4 && (a.includes(b) || b.includes(a))); }

// Analyzers - simplified versions matching trigger/audit/smart-audit.ts functionality
function analyzeSEO(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html; const url = pageData.url;
  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i); const title = titleMatch ? titleMatch[1].trim() : ''; const tLen = title.length;
  checks.push({ id: 'title-tag', name: 'Title Tag Optimization', status: tLen >= 30 && tLen <= 60 ? 'pass' : tLen > 0 ? 'warning' : 'fail', score: tLen >= 30 && tLen <= 60 ? 100 : tLen > 0 ? 50 : 0, weight: 12, value: { title, length: tLen }, message: tLen > 0 ? `Title (${tLen} chars): "${title.substring(0, 50)}"` : 'No title tag', recommendation: tLen === 0 ? 'Add title tag (30-60 chars)' : tLen < 30 || tLen > 60 ? 'Optimize title length' : undefined });
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i); const metaDesc = metaMatch ? metaMatch[1].trim() : ''; const mLen = metaDesc.length;
  checks.push({ id: 'meta-description', name: 'Meta Description', status: mLen >= 120 && mLen <= 160 ? 'pass' : mLen > 0 ? 'warning' : 'fail', score: mLen >= 120 && mLen <= 160 ? 100 : mLen > 0 ? 50 : 0, weight: 10, value: { length: mLen }, message: mLen > 0 ? `Meta description (${mLen} chars)` : 'No meta description', recommendation: mLen === 0 ? 'Add meta description (120-160 chars)' : undefined });
  const h1 = pageData.parsedData?.h1Count || (html.match(/<h1[^>]*>/gi) || []).length; const h2 = pageData.parsedData?.h2Count || (html.match(/<h2[^>]*>/gi) || []).length; const h3 = pageData.parsedData?.h3Count || 0;
  const h1TextMatch = html.match(/<h1[^>]*>([^<]*)<\/h1>/i); const h1Text = h1TextMatch ? h1TextMatch[1].trim() : '';
  checks.push({ id: 'heading-structure', name: 'H1-H3 Heading Structure', status: h1 === 1 && h2 >= 1 ? 'pass' : h1 === 1 ? 'warning' : 'fail', score: (h1 === 1 ? 50 : 0) + (h2 >= 1 ? 30 : 0) + (h3 >= 1 ? 20 : 0), weight: 10, value: { h1, h2, h3, h1Text: h1Text.substring(0, 60) }, message: `${h1} H1, ${h2} H2, ${h3} H3 tags${h1Text ? `. H1: "${h1Text.substring(0, 40)}..."` : ''}` });
  const titleWords = title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3); const h1Words = h1Text.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const titleH1Match = titleWords.filter((tw: string) => h1Words.some((hw: string) => wordsMatch(tw, hw))).length;
  const keywordConsistency = titleWords.length > 0 ? Math.round((titleH1Match / titleWords.length) * 100) : 0;
  checks.push({ id: 'keyword-placement', name: 'Keyword Placement', status: keywordConsistency >= 50 ? 'pass' : 'warning', score: keywordConsistency, weight: 8, value: { consistency: keywordConsistency + '%', note: 'Uses stemming' }, message: `Keyword consistency: ${keywordConsistency}%` });
  let urlScore = 100; try { const p = new URL(url).pathname; if (p.includes('_')) urlScore -= 15; if (/[A-Z]/.test(p)) urlScore -= 10; } catch { urlScore = 50; }
  checks.push({ id: 'url-optimization', name: 'URL Optimization', status: urlScore >= 85 ? 'pass' : 'warning', score: Math.max(0, urlScore), weight: 6, value: { url }, message: urlScore >= 85 ? 'URL well-optimized' : 'URL has issues' });
  const intLinks = (html.match(/href=["']\/[^"']*["']/gi) || []).length + (html.match(new RegExp(`href=["']https?://[^"']*${new URL(url).hostname}[^"']*["']`, 'gi')) || []).length;
  checks.push({ id: 'internal-linking', name: 'Internal Linking', status: intLinks >= 5 ? 'pass' : 'warning', score: intLinks >= 10 ? 100 : intLinks >= 5 ? 80 : 50, weight: 8, value: { count: intLinks }, message: `${intLinks} internal links` });
  const imgs = html.match(/<img[^>]*>/gi) || []; const withAlt = imgs.filter((i: string) => /alt=["'][^"']+["']/i.test(i)).length; const altPct = imgs.length > 0 ? Math.round((withAlt / imgs.length) * 100) : 100;
  checks.push({ id: 'image-alt-tags', name: 'Image Alt Tags', status: altPct >= 90 ? 'pass' : 'warning', score: altPct, weight: 8, value: { total: imgs.length, withAlt, percentage: altPct }, message: `${withAlt}/${imgs.length} images have alt (${altPct}%)`, recommendation: altPct < 90 ? 'Add alt text to images' : undefined });
  let mainHtml = html.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '').replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '').replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  const mainWords = mainHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter((w: string) => w.length > 2).length;
  checks.push({ id: 'thin-content', name: 'Thin Content Detection', status: mainWords >= 300 ? 'pass' : 'warning', score: mainWords >= 300 ? 100 : mainWords >= 100 ? 50 : 10, weight: 8, value: { mainContentWordCount: mainWords }, message: mainWords >= 300 ? `Good content: ${mainWords} words` : `Thin content: ${mainWords} words`, recommendation: mainWords < 300 ? 'Expand to 300+ words' : undefined });
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  checks.push({ id: 'canonical-url', name: 'Canonical URL', status: canonical ? 'pass' : 'warning', score: canonical ? 100 : 50, weight: 6, value: { canonical: canonical?.[1] || null }, message: canonical ? `Canonical: ${canonical[1]}` : 'No canonical URL' });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'SEO analysis complete', checks };
}

function analyzeLocalSEO(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html;
  const telMatch = html.match(/tel:\s*([+0-9().\s-]+)/i); const phoneMatch = telMatch || html.match(/(\+?[1-9]\d{0,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
  checks.push({ id: 'phone-number', name: 'Phone Number', status: phoneMatch ? 'pass' : 'warning', score: phoneMatch ? 100 : 30, weight: 15, value: { phone: phoneMatch?.[1] || phoneMatch?.[0] || null }, message: phoneMatch ? `Phone: ${phoneMatch[1] || phoneMatch[0]}` : 'No phone detected' });
  const hasAddress = /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr)/i.test(html) || /"streetAddress"/i.test(html);
  checks.push({ id: 'address', name: 'Address Schema', status: hasAddress ? 'pass' : 'warning', score: hasAddress ? 100 : 40, weight: 15, value: { hasAddress }, message: hasAddress ? 'Address detected' : 'No structured address' });
  const hasSchema = html.includes('LocalBusiness') || html.includes('Organization'); let schemaValid = false;
  const jsonLd = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLd) { for (const m of jsonLd) { try { JSON.parse(m.replace(/<script[^>]*>/, '').replace(/<\/script>/i, '')); schemaValid = true; } catch {} } }
  checks.push({ id: 'local-schema', name: 'Local Business Schema', status: schemaValid && hasSchema ? 'pass' : hasSchema ? 'warning' : 'fail', score: schemaValid && hasSchema ? 100 : hasSchema ? 50 : 0, weight: 20, value: { hasSchema, isValidJson: schemaValid }, message: schemaValid && hasSchema ? 'Valid schema found' : hasSchema ? 'Schema may be invalid' : 'No schema' });
  const hasMap = /<iframe[^>]*google\.com\/maps/i.test(html) || html.includes('maps.googleapis.com');
  checks.push({ id: 'google-map', name: 'Google Map', status: hasMap ? 'pass' : 'info', score: hasMap ? 100 : 50, weight: 10, value: { hasMap }, message: hasMap ? 'Google Maps detected' : 'No Google Maps' });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Local SEO complete', checks };
}

function analyzeContent(pageData: any, pageType: PageType = 'other'): CategoryResult {
  const checks: Check[] = []; const html = pageData.html;
  const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).length;
  checks.push({ id: 'word-count', name: 'Content Length', status: wordCount >= 300 ? 'pass' : 'warning', score: wordCount >= 300 ? 80 : 50, weight: 15, value: { wordCount }, message: `${wordCount} words` });
  const h1 = pageData.parsedData?.h1Count || 0, h2 = pageData.parsedData?.h2Count || 0, h3 = pageData.parsedData?.h3Count || 0;
  checks.push({ id: 'heading-structure', name: 'Heading Structure', status: h1 === 1 ? 'pass' : 'fail', score: h1 === 1 ? 100 : 0, weight: 10, value: { h1Count: h1, h2Count: h2, h3Count: h3 }, message: `${h1} H1, ${h2} H2, ${h3} H3` });
  const intLinks = (html.match(/href=["']\/[^"']*["']/gi) || []).length;
  checks.push({ id: 'contextual-internal-links', name: 'Internal Links', status: intLinks >= 3 ? 'pass' : 'warning', score: intLinks >= 3 ? 80 : 50, weight: 10, value: { count: intLinks }, message: `${intLinks} internal links` });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Content analysis complete', checks };
}

function analyzePerformance(pageData: any): CategoryResult {
  const checks: Check[] = []; const rt = pageData.responseTime;
  checks.push({ id: 'response-time', name: 'Server Response Time', status: rt < 500 ? 'pass' : 'warning', score: rt < 200 ? 100 : rt < 500 ? 85 : 60, weight: 15, value: { responseTime: rt, disclaimer: 'Server-side measurement' }, message: `${rt}ms (server-side)` });
  checks.push({ id: 'performance-disclaimer', name: 'Note', status: 'info', score: 100, weight: 5, value: { note: 'Server-side only' }, message: 'ℹ️ For real CWV, use PageSpeed API' });
  const sizeMB = Math.round((pageData.contentLength / 1024 / 1024) * 100) / 100;
  checks.push({ id: 'page-size', name: 'Page Size', status: sizeMB < 1 ? 'pass' : 'warning', score: sizeMB < 1 ? 85 : 50, weight: 20, value: { megabytes: sizeMB }, message: `${sizeMB}MB` });
  checks.push({ id: 'https', name: 'HTTPS', status: pageData.isHttps ? 'pass' : 'fail', score: pageData.isHttps ? 100 : 0, weight: 15, value: { isHttps: pageData.isHttps }, message: pageData.isHttps ? 'HTTPS enabled' : 'No HTTPS' });
  const hasComp = pageData.headers['content-encoding']?.includes('gzip') || pageData.headers['content-encoding']?.includes('br');
  checks.push({ id: 'compression', name: 'Compression', status: hasComp ? 'pass' : 'warning', score: hasComp ? 100 : 50, weight: 10, value: { encoding: pageData.headers['content-encoding'] || 'none' }, message: hasComp ? `Compression: ${pageData.headers['content-encoding']}` : 'No compression' });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Performance complete', checks };
}

function analyzeEEAT(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html;
  const hasAuthor = html.includes('author') || html.includes('Author');
  checks.push({ id: 'author-info', name: 'Author Info', status: hasAuthor ? 'pass' : 'warning', score: hasAuthor ? 100 : 40, weight: 15, value: { hasAuthor }, message: hasAuthor ? 'Author detected' : 'No author' });
  const hasTrust = html.includes('certified') || html.includes('award') || html.includes('experience');
  checks.push({ id: 'trust-signals', name: 'Trust Signals', status: hasTrust ? 'pass' : 'warning', score: hasTrust ? 100 : 50, weight: 15, value: { hasTrustSignals: hasTrust }, message: hasTrust ? 'Trust signals found' : 'Limited trust signals' });
  const hasAbout = html.includes('about') || html.includes('team');
  checks.push({ id: 'about-link', name: 'About Link', status: hasAbout ? 'pass' : 'warning', score: hasAbout ? 100 : 50, weight: 10, value: { hasAboutLink: hasAbout }, message: hasAbout ? 'About link found' : 'No about link' });
  const hasContact = html.includes('contact') || html.includes('email');
  checks.push({ id: 'contact-info', name: 'Contact Info', status: hasContact ? 'pass' : 'warning', score: hasContact ? 100 : 40, weight: 15, value: { hasContactInfo: hasContact }, message: hasContact ? 'Contact available' : 'Limited contact' });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'E-E-A-T complete', checks };
}

function analyzeSocial(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html;
  const hasOG = [/<meta[^>]*property=["']og:title/i, /<meta[^>]*property=["']og:description/i, /<meta[^>]*property=["']og:image/i].filter(r => r.test(html)).length;
  checks.push({ id: 'open-graph', name: 'Open Graph', status: hasOG === 3 ? 'pass' : 'warning', score: Math.round((hasOG / 3) * 100), weight: 20, value: { count: hasOG }, message: `${hasOG}/3 OG tags found` });
  const hasTwitter = /<meta[^>]*name=["']twitter:card["']/i.test(html);
  checks.push({ id: 'twitter-card', name: 'Twitter Card', status: hasTwitter ? 'pass' : 'warning', score: hasTwitter ? 100 : 30, weight: 15, value: { hasCard: hasTwitter }, message: hasTwitter ? 'Twitter Card found' : 'No Twitter Card' });
  const socials = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'].filter(p => html.toLowerCase().includes(p)).length;
  checks.push({ id: 'social-links', name: 'Social Links', status: socials >= 3 ? 'pass' : 'warning', score: Math.min(100, socials * 25), weight: 10, value: { count: socials }, message: `${socials} social links` });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Social complete', checks };
}

function analyzeTechnology(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html;
  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
  checks.push({ id: 'viewport', name: 'Viewport', status: hasViewport ? 'pass' : 'fail', score: hasViewport ? 100 : 0, weight: 15, value: { hasViewport }, message: hasViewport ? 'Viewport set' : 'No viewport' });
  const hasDoctype = /<!doctype\s+html/i.test(html);
  checks.push({ id: 'doctype', name: 'HTML5 Doctype', status: hasDoctype ? 'pass' : 'fail', score: hasDoctype ? 100 : 0, weight: 20, value: { hasDoctype }, message: hasDoctype ? 'HTML5 doctype' : 'No doctype' });
  const hasLang = /<html[^>]*lang=["']/i.test(html);
  checks.push({ id: 'lang-attribute', name: 'Language', status: hasLang ? 'pass' : 'warning', score: hasLang ? 100 : 60, weight: 8, value: { hasLang }, message: hasLang ? 'Lang attribute set' : 'No lang' });
  const hasSchema = html.includes('application/ld+json');
  checks.push({ id: 'structured-data', name: 'Structured Data', status: hasSchema ? 'pass' : 'warning', score: hasSchema ? 100 : 40, weight: 15, value: { hasStructuredData: hasSchema }, message: hasSchema ? 'Schema.org found' : 'No structured data' });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Technology complete', checks };
}

function analyzeLinks(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html;
  const allLinks = html.match(/href=["']([^"']+)["']/gi) || [];
  const internal = allLinks.filter((l: string) => l.includes(new URL(pageData.url).hostname) || l.startsWith('href="/')).length;
  const external = allLinks.length - internal;
  checks.push({ id: 'internal-links', name: 'Internal Links', status: internal >= 5 ? 'pass' : 'warning', score: internal >= 10 ? 100 : 80, weight: 15, value: { count: internal }, message: `${internal} internal links` });
  checks.push({ id: 'external-links', name: 'External Links', status: 'pass', score: 80, weight: 10, value: { count: external }, message: `${external} external links` });
  const empty = (html.match(/href=["']\s*["']/gi) || []).length;
  checks.push({ id: 'empty-links', name: 'Empty Links', status: empty === 0 ? 'pass' : 'warning', score: empty === 0 ? 100 : 60, weight: 10, value: { count: empty }, message: empty === 0 ? 'No empty links' : `${empty} empty links` });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Links complete', checks };
}

function analyzeUsability(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html;
  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);
  checks.push({ id: 'mobile-friendly', name: 'Mobile Friendly', status: hasViewport ? 'pass' : 'fail', score: hasViewport ? 100 : 20, weight: 20, value: { hasViewport }, message: hasViewport ? 'Mobile-friendly' : 'Not mobile-friendly' });
  const hasFavicon = /<link[^>]*rel=["'](?:shortcut )?icon["']/i.test(html);
  checks.push({ id: 'favicon', name: 'Favicon', status: hasFavicon ? 'pass' : 'warning', score: hasFavicon ? 100 : 60, weight: 5, value: { hasFavicon }, message: hasFavicon ? 'Favicon found' : 'No favicon' });
  const inputs = (html.match(/<input[^>]*>/gi) || []).length; const labels = (html.match(/<label[^>]*>/gi) || []).length;
  checks.push({ id: 'form-labels', name: 'Form Labels', status: inputs === 0 || labels >= inputs * 0.8 ? 'pass' : 'warning', score: inputs === 0 || labels >= inputs * 0.8 ? 100 : 50, weight: 8, value: { inputs, labels }, message: `${labels} labels for ${inputs} inputs` });
  checks.push({ id: 'readability', name: 'Readability', status: 'pass', score: 80, weight: 10, value: {}, message: 'Readability check passed' });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Usability complete', checks };
}

function analyzeTechnicalSEO(pageData: any): CategoryResult {
  const checks: Check[] = []; const html = pageData.html; const url = pageData.url;
  const robotsMeta = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["\']/i);
  const isNoIndex = robotsMeta?.[1]?.toLowerCase().includes('noindex') || false;
  checks.push({ id: 'indexing-status', name: 'Indexing Status', status: isNoIndex ? 'fail' : 'pass', score: isNoIndex ? 0 : 100, weight: 15, value: { isIndexable: !isNoIndex }, message: isNoIndex ? 'Page blocked (noindex)' : 'Page indexable' });
  checks.push({ id: 'sitemap-reference', name: 'Sitemap', status: 'info', score: 70, weight: 10, value: { hasSitemapReference: html.includes('sitemap') }, message: 'Check sitemap.xml' });
  const scripts = (html.match(/<script[^>]*>/gi) || []).length; const styles = (html.match(/<link[^>]*rel=["']stylesheet["']/gi) || []).length;
  checks.push({ id: 'page-speed-indicators', name: 'Resources', status: scripts + styles <= 20 ? 'pass' : 'warning', score: scripts + styles <= 10 ? 100 : 70, weight: 12, value: { scripts, stylesheets: styles, totalResources: scripts + styles }, message: `${scripts} scripts, ${styles} stylesheets` });
  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);
  checks.push({ id: 'mobile-friendliness', name: 'Mobile Friendliness', status: hasViewport ? 'pass' : 'warning', score: hasViewport ? 90 : 50, weight: 12, value: { hasProperViewport: hasViewport }, message: hasViewport ? 'Mobile-friendly' : 'Check mobile' });
  checks.push({ id: 'https-security', name: 'HTTPS Security', status: pageData.isHttps ? 'pass' : 'fail', score: pageData.isHttps ? 65 : 0, weight: 12, value: { isHttps: pageData.isHttps }, message: pageData.isHttps ? 'HTTPS enabled' : 'No HTTPS' });
  const emptyLinks = (html.match(/href=["']\s*["']|href=["']#["']/gi) || []).length;
  checks.push({ id: 'broken-links', name: 'Empty Links', status: emptyLinks === 0 ? 'pass' : 'warning', score: emptyLinks === 0 ? 100 : 70, weight: 10, value: { emptyLinks }, message: emptyLinks === 0 ? 'No empty links' : `${emptyLinks} empty links` });
  let pathname = '/'; try { pathname = new URL(url).pathname; } catch {}
  checks.push({ id: 'url-structure', name: 'URL Structure', status: !pathname.includes('_') && !/[A-Z]/.test(pathname) ? 'pass' : 'warning', score: !pathname.includes('_') ? 100 : 70, weight: 8, value: { url: pathname }, message: `URL: ${pathname}` });
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  checks.push({ id: 'canonical-tag', name: 'Canonical', status: canonical ? 'pass' : 'warning', score: canonical ? 100 : 40, weight: 10, value: { hasCanonical: !!canonical, canonicalUrl: canonical?.[1] || null }, message: canonical ? `Canonical: ${canonical[1]}` : 'No canonical' });
  const hasMetaRedirect = /<meta[^>]*http-equiv=["']refresh["']/i.test(html);
  checks.push({ id: 'redirect-issues', name: 'Redirects', status: !hasMetaRedirect ? 'pass' : 'warning', score: !hasMetaRedirect ? 100 : 60, weight: 8, value: { hasMetaRedirect }, message: !hasMetaRedirect ? 'No redirects' : 'Meta redirect detected' });
  const hasLazy = html.includes('loading="lazy"'); const hasAsync = /<script[^>]*async/i.test(html);
  checks.push({ id: 'core-web-vitals-indicators', name: 'CWV Indicators', status: hasLazy || hasAsync ? 'pass' : 'warning', score: (hasLazy ? 40 : 0) + (hasAsync ? 40 : 0) + 20, weight: 10, value: { hasLazyLoading: hasLazy, hasAsyncScripts: hasAsync }, message: `CWV: ${[hasLazy && 'lazy loading', hasAsync && 'async'].filter(Boolean).join(', ') || 'none'}` });
  const totalScore = Math.round(checks.reduce((s, c) => s + c.score * c.weight, 0) / checks.reduce((s, c) => s + c.weight, 0));
  return { score: totalScore, grade: calculateGrade(totalScore), message: 'Technical SEO complete', checks };
}

const CATEGORY_WEIGHTS = { localSeo: 25, seo: 15, links: 10, usability: 10, performance: 10, social: 5, technology: 5, technicalSeo: 8, content: 6, eeat: 6 };

export async function runFrontendSmartAudit(baseUrl: string, selectedUrls: string[], crawlData: CrawlData | undefined, onProgress: (progress: FrontendAuditProgress) => void): Promise<SmartAuditOutput> {
  const normalizeUrl = (u: string) => { try { const url = new URL(u); url.pathname = url.pathname.replace(/\/$/, ''); return url.toString().toLowerCase(); } catch { return u.toLowerCase().replace(/\/$/, ''); } };
  const urls = Array.from(new Set(selectedUrls.map(normalizeUrl)));
  onProgress({ progress: 0, label: 'Starting frontend audit...', pagesTotal: urls.length, pagesAnalyzed: 0 });
  
  const pageClassifications: PageClassification[] = urls.map(url => ({ url, type: classifyPage(url, crawlData), title: crawlData?.pages?.find(p => normalizeUrl(p.url) === url)?.title }));
  const homePage = pageClassifications.find(p => p.type === 'home'); const contactPage = pageClassifications.find(p => p.type === 'contact');
  const aboutPage = pageClassifications.find(p => p.type === 'about'); const blogPages = pageClassifications.filter(p => p.type === 'blog');
  const productPages = pageClassifications.filter(p => p.type === 'product'); const servicePages = pageClassifications.filter(p => p.type === 'service');
  
  const auditMapping: SmartAuditOutput['auditMapping'] = { localSeo: [], seo: [], content: [], performance: [], eeat: [], social: [], technology: [], technicalSeo: [], links: [], usability: [] };
  const selectPages = (section: string): string[] => {
    switch (section) {
      case 'performance': return [homePage?.url, productPages[0]?.url || servicePages[0]?.url].filter(Boolean) as string[];
      case 'localSeo': return [homePage?.url, contactPage?.url].filter(Boolean) as string[];
      case 'seo': return [...servicePages, ...productPages, ...blogPages].slice(0, 5).map(p => p.url);
      case 'content': return [...blogPages, ...servicePages].slice(0, 3).map(p => p.url);
      case 'eeat': return [aboutPage?.url, ...blogPages.slice(0, 2).map(p => p.url)].filter(Boolean) as string[];
      case 'technology': case 'usability': return [homePage?.url, contactPage?.url].filter(Boolean) as string[];
      case 'social': return [homePage?.url, ...blogPages.slice(0, 2).map(p => p.url)].filter(Boolean) as string[];
      case 'links': return [homePage?.url, ...productPages.slice(0, 2).map(p => p.url)].filter(Boolean) as string[];
      case 'technicalSeo': return [homePage?.url, productPages[0]?.url, blogPages[0]?.url].filter(Boolean) as string[];
      default: return [homePage?.url || pageClassifications[0]?.url].filter(Boolean) as string[];
    }
  };
  Object.keys(auditMapping).forEach(section => { (auditMapping as any)[section] = selectPages(section); });
  
  const pageResults = new Map<string, { pageData: any; results: Partial<Record<string, CategoryResult>> }>();
  let pagesAnalyzed = 0, pagesFailed = 0;
  
  for (const url of urls) {
    try {
      onProgress({ progress: Math.round((pagesAnalyzed / urls.length) * 80), label: `Analyzing: ${url.slice(0, 50)}...`, pagesTotal: urls.length, pagesAnalyzed });
      const pageData = await fetchPage(url);
      const pageType = pageClassifications.find(p => p.url === url)?.type || 'other';
      const sectionsToRun = getAuditSectionsForPageType(pageType);
      const results: Partial<Record<string, CategoryResult>> = {};
      if (sectionsToRun.includes('localSeo')) results.localSeo = analyzeLocalSEO(pageData);
      if (sectionsToRun.includes('seo')) results.seo = analyzeSEO(pageData);
      if (sectionsToRun.includes('content')) results.content = analyzeContent(pageData, pageType);
      if (sectionsToRun.includes('performance')) results.performance = analyzePerformance(pageData);
      if (sectionsToRun.includes('eeat')) results.eeat = analyzeEEAT(pageData);
      if (sectionsToRun.includes('social')) results.social = analyzeSocial(pageData);
      if (sectionsToRun.includes('technology')) results.technology = analyzeTechnology(pageData);
      if (sectionsToRun.includes('links')) results.links = analyzeLinks(pageData);
      if (sectionsToRun.includes('usability')) results.usability = analyzeUsability(pageData);
      if (sectionsToRun.includes('technicalSeo')) results.technicalSeo = analyzeTechnicalSEO(pageData);
      pageResults.set(url, { pageData, results });
      pagesAnalyzed++;
    } catch (e) { console.error(`[Frontend Audit] Error analyzing ${url}:`, e); pagesFailed++; pagesAnalyzed++; }
  }
  
  onProgress({ progress: 85, label: 'Aggregating results...', pagesTotal: urls.length, pagesAnalyzed });
  
  // Aggregate results
  const aggregateSection = (section: string): CategoryResult => {
    const pagesForSection = (auditMapping as any)[section] as string[];
    const results = pagesForSection.map(url => pageResults.get(url)?.results?.[section]).filter(Boolean) as CategoryResult[];
    if (results.length === 0) return { score: 0, grade: 'F', message: 'No data', checks: [], sourcePages: pagesForSection };
    const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
    const mergedChecks: Check[] = [];
    const checkMap = new Map<string, { check: Check; count: number; totalScore: number }>();
    for (const r of results) {
      for (const c of r.checks) {
        const existing = checkMap.get(c.id);
        if (existing) { existing.count++; existing.totalScore += c.score; existing.check.sourcePages = [...(existing.check.sourcePages || []), ...pagesForSection]; }
        else checkMap.set(c.id, { check: { ...c, sourcePages: pagesForSection }, count: 1, totalScore: c.score });
      }
    }
    checkMap.forEach(({ check, count, totalScore }) => { check.score = Math.round(totalScore / count); mergedChecks.push(check); });
    return { score: avgScore, grade: calculateGrade(avgScore), message: `Based on ${pagesForSection.length} page(s)`, checks: mergedChecks, sourcePages: pagesForSection };
  };
  
  const finalResults: Partial<SmartAuditOutput> = {};
  ['localSeo', 'seo', 'content', 'performance', 'eeat', 'social', 'technology', 'technicalSeo', 'links', 'usability'].forEach(section => { (finalResults as any)[section] = aggregateSection(section); });
  
  // Calculate overall score
  let weightedSum = 0, totalWeight = 0;
  Object.entries(CATEGORY_WEIGHTS).forEach(([cat, weight]) => {
    const result = (finalResults as any)[cat] as CategoryResult;
    if (result && result.score > 0) { weightedSum += result.score * weight; totalWeight += weight; }
  });
  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  
  // Generate recommendations
  const recommendations: SmartAuditOutput['recommendations'] = [];
  const categoryNames: Record<string, string> = { localSeo: 'Local SEO', seo: 'On-Page SEO', content: 'Content Quality', performance: 'Performance', eeat: 'E-E-A-T', social: 'Social', technology: 'Technology', technicalSeo: 'Technical SEO', links: 'Links', usability: 'Usability' };
  let recId = 0;
  Object.entries(finalResults).forEach(([cat, result]) => {
    if (result && typeof result === 'object' && 'checks' in result) {
      for (const check of (result as CategoryResult).checks) {
        if (check.recommendation) {
          recommendations.push({ id: `rec_${recId++}`, title: check.recommendation, description: check.message, category: categoryNames[cat] || cat, priority: check.score < 50 ? 'HIGH' : check.score < 70 ? 'MEDIUM' : 'LOW', checkId: check.id, sourcePages: check.sourcePages });
        }
      }
    }
  });
  recommendations.sort((a, b) => { const prio: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }; return prio[a.priority] - prio[b.priority]; });
  
  onProgress({ progress: 100, label: 'Audit complete!', pagesTotal: urls.length, pagesAnalyzed });
  
  return { overallScore, overallGrade: calculateGrade(overallScore), ...finalResults as any, recommendations, pageClassifications, pagesAnalyzed, pagesFailed, auditMapping };
}
