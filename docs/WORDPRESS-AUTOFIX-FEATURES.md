# WordPress Auto-Fix Features for SEO Audit Plugin

This document lists all auto-fix buttons available in the SEO audit report page and their implementation status in the WordPress plugin.

## Overview

The auto-fix system connects the SEO audit report to a WordPress plugin that can automatically fix detected issues. Each fix action is triggered via the `AutoFixButton` component which calls the WordPress REST API.

**Legend:**
- ✅ **Remote Fix** = Can be fixed automatically via API
- ⚠️ **Partial Fix** = Partially fixable, some manual work needed
- ❌ **Manual Only** = Cannot be fixed remotely, requires manual intervention

---

## Auto-Fix Actions Table (with Remote Fix Status)

| # | Action ID | Button Label | Remote Fix | API Endpoint | Category | Notes |
|---|-----------|--------------|------------|--------------|----------|-------|
| 1 | `fix_meta` | Generate Meta | ✅ | `/fix/meta-descriptions` | SEO Basics | Auto-generates from content |
| 2 | `fix_alt_text` | Fix Alt Text | ✅ | `/fix/alt-text` | SEO Basics | Generates from filename or AI |
| 3 | `fix_og_tags` | Enable OG Tags | ✅ | `/fix/og-tags` | SEO Basics | Enables OG + Twitter cards |
| 4 | `fix_sitemap` | Generate Sitemap | ✅ | `/fix/sitemap` | SEO Basics | Generates & pings search engines |
| 5 | `fix_robots` | Optimize Robots.txt | ✅ | `/fix/robots` | SEO Basics | Creates optimized robots.txt |
| 6 | `fix_indexing` | Fix Indexing | ✅ | `/fix/indexing` | Technical SEO | Removes noindex, submits to IndexNow |
| 7 | `fix_performance` | Optimize Speed | ⚠️ | `/fix/cwv` | Technical SEO | Enables optimizations, theme changes needed |
| 8 | `fix_mobile` | Fix Mobile | ❌ | - | Technical SEO | Requires theme/CSS changes |
| 9 | `fix_security` | Enable Security | ✅ | `/fix/security-headers` | Security | Adds security headers via PHP |
| 10 | `fix_links` | Fix Links | ⚠️ | `/audit/issues` | Technical SEO | Detects issues, manual removal needed |
| 11 | `fix_urls` | Fix URLs | ❌ | - | Technical SEO | Requires permalink structure changes |
| 12 | `fix_canonical` | Add Canonical | ✅ | `/fix/canonical` | Technical SEO | Adds canonical tags to all posts |
| 13 | `fix_redirects` | Fix Redirects | ✅ | `/redirects` | Technical SEO | Creates/manages redirects |
| 14 | `fix_cwv` | Optimize CWV | ✅ | `/fix/cwv` | Technical SEO | Lazy load, defer JS, resource hints |
| 15 | `fix_headings` | Fix Headings | ⚠️ | `/fix/headings` | On-Page SEO | Converts H1→H2, detects issues |
| 16 | `fix_keywords` | Optimize Keywords | ❌ | - | On-Page SEO | Requires content rewriting |
| 17 | `fix_internal_links` | Add Internal Links | ⚠️ | `/fix/internal-links` | On-Page SEO | Suggests links, manual insertion |
| 18 | `fix_content` | Fix Content | ❌ | - | On-Page SEO | Requires human content creation |
| 19 | `fix_lazy_loading` | Enable Lazy Loading | ✅ | `/fix/lazy-loading` | Performance | Native WordPress lazy loading |
| 20 | `fix_compress` | Compress Images | ✅ | `/fix/compress-images` | Performance | Compresses existing images |
| 21 | `fix_resource_hints` | Add Resource Hints | ✅ | `/fix/resource-hints` | Performance | Preconnect, prefetch, preload |
| 22 | `fix_js_optimization` | Optimize JS | ✅ | `/fix/js-optimization` | Performance | Defer scripts, remove jQuery migrate |
| 23 | `fix_css_optimization` | Optimize CSS | ✅ | `/fix/css-optimization` | Performance | Critical CSS, defer non-critical |
| 24 | `fix_preload` | Preload LCP Image | ✅ | `/fix/preload` | Performance | Preloads specified resources |
| 25 | `fix_schema` | Add Schema | ✅ | `/fix/schema` | Schema | Enables Organization/Website schema |
| 26 | `fix_local_schema` | Add Local Schema | ✅ | `/fix/local-schema` | Schema | LocalBusiness structured data |
| 27 | `fix_faq_schema` | Add FAQ Schema | ✅ | `/fix/faq-schema` | Schema | FAQ page schema from content |
| 28 | `fix_breadcrumbs` | Add Breadcrumbs | ✅ | `/fix/breadcrumbs` | Schema | Breadcrumb schema output |
| 29 | `fix_contact_info` | Add Contact Info | ⚠️ | `/fix/contact-info` | Local SEO | Requires business data input |
| 30 | `fix_business_hours` | Add Hours | ⚠️ | `/fix/business-hours` | Local SEO | Requires hours data input |
| 31 | `fix_map_embed` | Add Map | ⚠️ | `/fix/map-embed` | Local SEO | Requires coordinates/API key |
| 32 | `fix_service_areas` | Add Service Areas | ⚠️ | `/fix/service-areas` | Local SEO | Requires location data |
| 33 | `fix_testimonials` | Add Reviews | ⚠️ | `/fix/testimonials` | Trust & E-E-A-T | Creates shortcode, needs content |
| 34 | `fix_author_info` | Add Author Info | ✅ | `/fix/author-info` | Trust & E-E-A-T | Enables author box on posts |
| 35 | `fix_trust_badges` | Add Trust Badges | ⚠️ | `/fix/trust-badges` | Trust & E-E-A-T | Creates shortcode, needs images |
| 36 | `fix_review_schema` | Add Review Schema | ✅ | `/fix/review-schema` | Trust & E-E-A-T | Outputs review schema |
| 37 | `fix_skip_link` | Add Skip Link | ✅ | `/fix/skip-link` | Accessibility | Adds skip to content link |
| 38 | `fix_focus_styles` | Add Focus Styles | ✅ | `/fix/focus-styles` | Accessibility | Adds CSS focus indicators |
| 39 | `fix_link_warnings` | Add Link Warnings | ✅ | `/fix/link-warnings` | Accessibility | External link indicators |
| 40 | `fix_analytics` | Add Analytics | ⚠️ | `/fix/analytics` | Advanced | Requires GA4/GTM ID input |
| 41 | `fix_llms_txt` | Generate llms.txt | ✅ | `/fix/llms-txt` | Advanced | Auto-generates from site content |

---

## Remote Fix Summary

### ✅ Fully Automatable (26 actions)
These can be fixed with one click from the SaaS dashboard:
- `fix_meta`, `fix_alt_text`, `fix_og_tags`, `fix_sitemap`, `fix_robots`
- `fix_indexing`, `fix_security`, `fix_canonical`, `fix_redirects`, `fix_cwv`
- `fix_lazy_loading`, `fix_compress`, `fix_resource_hints`, `fix_js_optimization`
- `fix_css_optimization`, `fix_preload`, `fix_schema`, `fix_local_schema`
- `fix_faq_schema`, `fix_breadcrumbs`, `fix_author_info`, `fix_review_schema`
- `fix_skip_link`, `fix_focus_styles`, `fix_link_warnings`, `fix_llms_txt`

### ⚠️ Partial Fix (11 actions)
These can be initiated remotely but need additional data or manual review:
- `fix_performance` - Enables settings, but theme changes may be needed
- `fix_links` - Detects broken links, manual removal/update required
- `fix_headings` - Converts H1→H2, but some issues need manual fix
- `fix_internal_links` - Provides suggestions, manual insertion needed
- `fix_contact_info` - Needs business phone/email/address
- `fix_business_hours` - Needs actual business hours
- `fix_map_embed` - Needs coordinates or Google Maps API key
- `fix_service_areas` - Needs location list
- `fix_testimonials` - Creates shortcode, needs testimonial content
- `fix_trust_badges` - Creates shortcode, needs badge images
- `fix_analytics` - Needs GA4 or GTM ID

### ❌ Cannot Fix Remotely (4 actions) - REMOVE FROM FRONTEND
These require manual intervention and should NOT show auto-fix buttons:
- `fix_mobile` - Requires theme/CSS responsive design changes
- `fix_urls` - Requires WordPress permalink structure changes
- `fix_keywords` - Requires human content rewriting
- `fix_content` - Requires human content creation/expansion

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
