# WordPress Auto-Fix Features for SEO Audit Plugin

This document lists all auto-fix buttons available in the SEO audit report page that need to be implemented in the WordPress plugin.

## Overview

The auto-fix system connects the SEO audit report to a WordPress plugin that can automatically fix detected issues. Each fix action is triggered via the `AutoFixButton` component which calls the WordPress REST API.

---

## Auto-Fix Actions Table

| # | Action ID | Button Label | Check IDs | Category | Description |
|---|-----------|--------------|-----------|----------|-------------|
| 1 | `fix_meta` | Generate Meta | `meta-description`, `metaDescription`, `title-tag`, `title` | SEO Basics | Generate/optimize meta title and description tags |
| 2 | `fix_alt_text` | Fix Alt Text | `image-alt`, `imageAlt`, `image-alt-tags` | SEO Basics | Add missing alt text to images |
| 3 | `fix_og_tags` | Enable OG Tags | `og-tags`, `openGraph`, `open-graph`, `twitter-card` | SEO Basics | Add Open Graph and Twitter Card meta tags |
| 4 | `fix_sitemap` | Generate Sitemap | `xml-sitemap`, `xmlSitemap`, `sitemap-reference` | SEO Basics | Generate XML sitemap and add reference to robots.txt |
| 5 | `fix_robots` | Optimize Robots.txt | `robots-txt`, `robotsTxt` | SEO Basics | Create/optimize robots.txt file |
| 6 | `fix_indexing` | Fix Indexing | `indexing-status` | Technical SEO | Fix indexing issues (remove noindex if needed) |
| 7 | `fix_performance` | Optimize Speed | `page-speed-indicators` | Technical SEO | Apply performance optimizations |
| 8 | `fix_mobile` | Fix Mobile | `mobile-friendliness` | Technical SEO | Fix mobile responsiveness issues |
| 9 | `fix_security` | Enable Security | `https-security`, `security-headers`, `securityHeaders`, `hsts` | Technical SEO / Security | Add security headers, enable HSTS |
| 10 | `fix_links` | Fix Links | `broken-links` | Technical SEO | Fix or remove broken links |
| 11 | `fix_urls` | Fix URLs | `url-structure`, `url-optimization` | Technical SEO | Optimize URL structure |
| 12 | `fix_canonical` | Add Canonical | `canonical-tag`, `canonical-url` | Technical SEO | Add canonical URL tags |
| 13 | `fix_redirects` | Fix Redirects | `redirect-issues` | Technical SEO | Fix redirect chains/loops |
| 14 | `fix_cwv` | Optimize CWV | `core-web-vitals-indicators` | Technical SEO | Optimize Core Web Vitals |
| 15 | `fix_headings` | Fix Headings | `heading-structure` | On-Page SEO | Fix H1-H6 heading structure |
| 16 | `fix_keywords` | Optimize Keywords | `keyword-placement` | On-Page SEO | Optimize keyword placement |
| 17 | `fix_internal_links` | Add Internal Links | `internal-linking` | On-Page SEO | Add relevant internal links |
| 18 | `fix_content` | Fix Content | `content-duplication`, `thin-content` | On-Page SEO | Fix duplicate/thin content issues |
| 19 | `fix_lazy_loading` | Enable Lazy Loading | `lazy-loading`, `imageLazyLoading` | Performance | Enable lazy loading for images |
| 20 | `fix_compress` | Compress Images | `image-compression` | Performance | Compress images to reduce file size |
| 21 | `fix_resource_hints` | Add Resource Hints | `resourceHints`, `preconnect` | Performance | Add preconnect/prefetch hints |
| 22 | `fix_js_optimization` | Optimize JS | `jsOptimization`, `deferJs` | Performance | Defer/optimize JavaScript loading |
| 23 | `fix_css_optimization` | Optimize CSS | `cssOptimization` | Performance | Optimize CSS delivery |
| 24 | `fix_preload` | Preload LCP Image | `lcpImage` | Performance | Preload LCP (Largest Contentful Paint) image |
| 25 | `fix_schema` | Add Schema | `schema-markup`, `schemaMarkup` | Schema & Structured Data | Add general schema markup |
| 26 | `fix_local_schema` | Add Local Schema | `local-business-schema`, `localBusinessSchema` | Schema & Structured Data | Add LocalBusiness schema |
| 27 | `fix_faq_schema` | Add FAQ Schema | `faqSchema` | Schema & Structured Data | Add FAQ schema markup |
| 28 | `fix_breadcrumbs` | Add Breadcrumbs | `breadcrumbSchema` | Schema & Structured Data | Add breadcrumb schema |
| 29 | `fix_contact_info` | Add Contact Info | `contactPage`, `clickToCall`, `phoneNumber`, `physicalAddress` | Local SEO | Add/fix contact information |
| 30 | `fix_business_hours` | Add Hours | `businessHours` | Local SEO | Add business hours information |
| 31 | `fix_map_embed` | Add Map | `googleMap` | Local SEO | Embed Google Map |
| 32 | `fix_service_areas` | Add Service Areas | `serviceAreas` | Local SEO | Add service area information |
| 33 | `fix_testimonials` | Add Reviews | `reviews`, `testimonials` | Trust & E-E-A-T | Add reviews/testimonials section |
| 34 | `fix_author_info` | Add Author Info | `authorInfo` | Trust & E-E-A-T | Add author information to posts |
| 35 | `fix_trust_badges` | Add Trust Badges | `trustBadges` | Trust & E-E-A-T | Add trust badges/certifications |
| 36 | `fix_review_schema` | Add Review Schema | `reviewSchema` | Trust & E-E-A-T | Add review schema markup |
| 37 | `fix_skip_link` | Add Skip Link | `skipLink` | Accessibility | Add skip to content link |
| 38 | `fix_focus_styles` | Add Focus Styles | `focusIndicators` | Accessibility | Add visible focus indicators |
| 39 | `fix_link_warnings` | Add Link Warnings | `linkWarnings` | Accessibility | Add warnings for external/download links |
| 40 | `fix_analytics` | Add Analytics | `analytics` | Advanced | Set up Google Analytics |
| 41 | `fix_llms_txt` | Generate llms.txt | `llmsTxt` | Advanced | Generate llms.txt for AI crawlers |

---

## Implementation Priority

### High Priority (Core SEO)
1. `fix_meta` - Most common SEO issue
2. `fix_alt_text` - Accessibility + SEO
3. `fix_sitemap` - Essential for crawling
4. `fix_robots` - Controls crawling
5. `fix_canonical` - Prevents duplicate content
6. `fix_schema` - Rich snippets

### Medium Priority (Performance & Technical)
7. `fix_lazy_loading` - Easy performance win
8. `fix_compress` - Image optimization
9. `fix_security` - Security headers
10. `fix_og_tags` - Social sharing
11. `fix_headings` - Content structure
12. `fix_internal_links` - Site architecture

### Lower Priority (Advanced)
13. `fix_local_schema` - Local businesses only
14. `fix_faq_schema` - Specific content types
15. `fix_breadcrumbs` - Navigation enhancement
16. `fix_author_info` - Blog/content sites
17. `fix_testimonials` - E-commerce/services
18. `fix_llms_txt` - AI optimization

---

## API Endpoint Structure

The WordPress plugin should expose a REST API endpoint:

```
POST /wp-json/seo-autofix/v1/fix
```

### Request Body
```json
{
  "action": "fix_meta",
  "page_url": "https://example.com/page",
  "options": {
    // Action-specific options
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Meta tags updated successfully",
  "changes": [
    {
      "type": "meta_description",
      "before": "",
      "after": "New optimized meta description"
    }
  ]
}
```

---

## Categories Summary

| Category | Actions Count | Action IDs |
|----------|---------------|------------|
| SEO Basics | 5 | `fix_meta`, `fix_alt_text`, `fix_og_tags`, `fix_sitemap`, `fix_robots` |
| Technical SEO | 9 | `fix_indexing`, `fix_performance`, `fix_mobile`, `fix_security`, `fix_links`, `fix_urls`, `fix_canonical`, `fix_redirects`, `fix_cwv` |
| On-Page SEO | 4 | `fix_headings`, `fix_keywords`, `fix_internal_links`, `fix_content` |
| Performance | 6 | `fix_lazy_loading`, `fix_compress`, `fix_resource_hints`, `fix_js_optimization`, `fix_css_optimization`, `fix_preload` |
| Schema & Structured Data | 4 | `fix_schema`, `fix_local_schema`, `fix_faq_schema`, `fix_breadcrumbs` |
| Local SEO | 4 | `fix_contact_info`, `fix_business_hours`, `fix_map_embed`, `fix_service_areas` |
| Trust & E-E-A-T | 4 | `fix_testimonials`, `fix_author_info`, `fix_trust_badges`, `fix_review_schema` |
| Accessibility | 3 | `fix_skip_link`, `fix_focus_styles`, `fix_link_warnings` |
| Advanced | 2 | `fix_analytics`, `fix_llms_txt` |

**Total: 41 unique action types**

---

## Notes for WordPress Plugin Development

1. **Authentication**: Use WordPress REST API authentication (nonce or application passwords)
2. **Permissions**: Require `edit_posts` or `manage_options` capability
3. **Logging**: Log all changes for audit trail
4. **Rollback**: Store original values for potential rollback
5. **Batch Processing**: Support bulk fixes for multiple issues
6. **AI Integration**: Use AI (OpenAI/Claude) for generating meta descriptions, alt text, and content suggestions
