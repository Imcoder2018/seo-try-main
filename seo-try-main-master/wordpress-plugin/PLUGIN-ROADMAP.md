# SEO AutoFix Pro - WordPress Plugin Roadmap

## Executive Summary

This document outlines what is **currently implemented** in the WordPress plugin and what **needs to be implemented** to enable one-click fixing of all issues identified in the Local SEO audit reports. The goal is: **Users install the plugin, click "Fix All", and all fixable issues are resolved automatically.**

---

## ✅ IMPLEMENTATION STATUS: v5.0.0 COMPLETE

**All major features from this roadmap have been implemented!**

### New in v5.0.0:
- ✅ Backend AI API routes (`/api/ai`, `/api/plugin`) for OpenAI-powered features
- ✅ Phase 1: Local SEO module with contact info, business hours, service areas, enhanced schema
- ✅ Phase 2: Trust & E-E-A-T module with author info, testimonials, trust badges, review schema
- ✅ Phase 3: Performance module with resource hints, JS/CSS optimization, preloading
- ✅ Phase 4: Accessibility module with skip links, focus styles, link warnings
- ✅ Phase 5: Advanced module with analytics, FAQ schema, llms.txt, breadcrumbs
- ✅ Enhanced bulk fix endpoint supporting 30+ fix types including "fix all"
- ✅ New admin pages: Local SEO, Testimonials, Performance, Accessibility, Analytics
- ✅ 15+ new shortcodes for local SEO, testimonials, and accessibility
- ✅ New database tables for service areas, testimonials, and trust badges

---

## Part 1: Current Plugin Capabilities (v5.0.0)

### ✅ Implemented Features

| Category | Feature | API Endpoint | Status |
|----------|---------|--------------|--------|
| **Images** | AI Alt Text Generation | `/fix/alt-text` | ✅ Working |
| **Images** | Bulk Alt Text (filename-based) | `/fix/alt-text` | ✅ Working |
| **Images** | Image Compression | `/fix/compress-images` | ✅ Working |
| **Images** | WebP Conversion | Manual only | ⚠️ No API |
| **Images** | Lazy Loading | `/fix/lazy-loading` | ✅ Working |
| **SEO** | Meta Description Generation | `/fix/meta-descriptions` | ✅ Working |
| **SEO** | Title Tag Generation | `/fix/meta-descriptions` | ✅ Working |
| **Technical** | XML Sitemap Generation | `/fix/sitemap` | ✅ Working |
| **Technical** | Robots.txt Optimization | `/fix/robots` | ✅ Working |
| **Technical** | Security Headers | `/fix/security-headers` | ✅ Working |
| **Technical** | 301/302 Redirects | Manual only | ⚠️ No API |
| **Social** | Open Graph Tags | `/fix/og-tags` | ✅ Working |
| **Social** | Twitter Cards | `/fix/og-tags` | ✅ Working |
| **Schema** | LocalBusiness Schema | `/fix/schema` | ✅ Working |
| **Schema** | Breadcrumb Schema | `/fix/schema` | ⚠️ Partial |
| **Database** | Revisions Cleanup | `/fix/database` | ✅ Working |
| **Database** | Spam Comments Cleanup | `/fix/database` | ✅ Working |
| **Database** | Trash Cleanup | `/fix/database` | ✅ Working |
| **Database** | Transients Cleanup | `/fix/database` | ✅ Working |
| **Database** | Table Optimization | `/fix/database` | ✅ Working |
| **API** | Bulk Fix Multiple Issues | `/fix/bulk` | ✅ Working |
| **API** | Connection Verification | `/verify` | ✅ Working |
| **API** | Site Status/Stats | `/status` | ✅ Working |

### Current REST API Endpoints

```
GET  /wp-json/seo-autofix/v1/ping          - Health check
GET  /wp-json/seo-autofix/v1/verify        - Verify connection
GET  /wp-json/seo-autofix/v1/status        - Get site stats
POST /wp-json/seo-autofix/v1/fix/alt-text  - Fix image alt text
POST /wp-json/seo-autofix/v1/fix/compress-images - Compress images
POST /wp-json/seo-autofix/v1/fix/security-headers - Enable security headers
POST /wp-json/seo-autofix/v1/fix/lazy-loading - Enable lazy loading
POST /wp-json/seo-autofix/v1/fix/sitemap   - Generate sitemap
POST /wp-json/seo-autofix/v1/fix/schema    - Enable schema markup
POST /wp-json/seo-autofix/v1/fix/og-tags   - Enable OG/Twitter tags
POST /wp-json/seo-autofix/v1/fix/robots    - Optimize robots.txt
POST /wp-json/seo-autofix/v1/fix/meta-descriptions - Generate meta
POST /wp-json/seo-autofix/v1/fix/database  - Database cleanup
POST /wp-json/seo-autofix/v1/fix/bulk      - Apply multiple fixes
```

---

## Part 2: Gap Analysis - Audit Issues vs Plugin Fixes

### Mapping Audit Issues to Plugin Capabilities

| Audit Issue | Can Fix? | Current Status | Action Needed |
|-------------|----------|----------------|---------------|
| Title Tag too long/short | ⚠️ Partial | Can generate, not edit | Add title editing |
| Meta Description missing | ✅ Yes | Working | - |
| Image Alt Text missing | ✅ Yes | Working | - |
| No Lazy Loading | ✅ Yes | Working | - |
| No XML Sitemap | ✅ Yes | Working | - |
| Security Headers missing | ✅ Yes | Working | - |
| No Open Graph Tags | ✅ Yes | Working | - |
| No Twitter Cards | ✅ Yes | Working | - |
| No Local Business Schema | ✅ Yes | Working | Enhance with more fields |
| LCP needs improvement | ⚠️ Partial | Image compression helps | Add preload hints |
| TBT too high | ❌ No | Code-level optimization | Add JS defer/async |
| No Analytics tracking | ❌ No | Not implemented | Add GA/GTM injection |
| No Author information | ❌ No | Not implemented | Add author schema |
| No Testimonials | ❌ No | Not implemented | Add testimonials section |
| No Skip Link | ⚠️ Partial | Theme-dependent | Add skip link injection |
| No Focus Indicators | ❌ No | Theme-dependent | Add CSS injection |
| Inline Styles | ❌ No | Code-level change | Not fixable via plugin |
| Content Readability | ❌ No | Content change needed | Provide suggestions only |
| No Publication Date | ⚠️ Partial | Can expose existing dates | Add date display |
| No Citations/References | ❌ No | Content change needed | Provide suggestions only |

---

## Part 3: Features to Implement (Priority Order)

### 🔴 Phase 1: Critical Local SEO Fixes (Week 1-2)

These are **essential for local SEO clients**:

#### 1.1 Enhanced Local Business Schema
**Current:** Basic LocalBusiness schema  
**Needed:** Complete schema with all local SEO fields

```php
// New fields to add to schema settings:
- Service areas (array of cities/regions)
- Payment methods accepted
- Price range
- Geo-coordinates (lat/lng)
- Social media profiles
- Multiple locations support
- Opening hours (OpeningHoursSpecification)
- Service types offered
```

**API Endpoint:** Enhance `/fix/schema`

```php
// New endpoint parameters:
POST /fix/schema
{
  "type": "LocalBusiness",
  "subtype": "Plumber|Electrician|Restaurant|etc",
  "name": "Business Name",
  "phone": "+1-555-123-4567",
  "email": "info@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Denver",
    "state": "CO",
    "zip": "80202",
    "country": "US"
  },
  "geo": {
    "lat": 39.7392,
    "lng": -104.9903
  },
  "hours": [
    {"day": "Monday", "open": "09:00", "close": "17:00"},
    {"day": "Tuesday", "open": "09:00", "close": "17:00"}
  ],
  "serviceArea": ["Denver", "Aurora", "Lakewood"],
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Credit Card", "Check"],
  "socialProfiles": {
    "facebook": "https://facebook.com/...",
    "instagram": "https://instagram.com/..."
  }
}
```

#### 1.2 Contact Information Auto-Detection & Display
**Current:** Not implemented  
**Needed:** Detect and enhance contact info visibility

```php
// New features:
- Detect existing contact info in site
- Add click-to-call wrapper to phone numbers
- Add schema markup to addresses
- Create/enhance contact page if missing
- Add Google Maps embed
```

**New API Endpoint:** `/fix/contact-info`

```php
POST /fix/contact-info
{
  "phone": "+1-555-123-4567",
  "enable_click_to_call": true,
  "address": "123 Main St, Denver, CO 80202",
  "add_map_embed": true,
  "map_api_key": "optional_google_api_key"
}
```

#### 1.3 Business Hours Display
**Current:** Part of schema settings  
**Needed:** Visible display + schema

```php
// New features:
- Business hours widget/shortcode
- Schema markup for hours
- Display in footer or sidebar
- Holiday hours support
```

**New API Endpoint:** `/fix/business-hours`

```php
POST /fix/business-hours
{
  "hours": [
    {"day": "Monday-Friday", "open": "9:00 AM", "close": "5:00 PM"},
    {"day": "Saturday", "open": "10:00 AM", "close": "2:00 PM"},
    {"day": "Sunday", "closed": true}
  ],
  "display_in_footer": true,
  "add_schema": true
}
```

---

### 🟡 Phase 2: Trust & E-E-A-T Fixes (Week 3-4)

#### 2.1 Author Information Schema
**Current:** Not implemented  
**Needed:** Add author info to posts/pages

```php
// New features:
- Author name, bio, photo
- Author schema (Person)
- Social profiles for authors
- Credentials/certifications
- Link to About page
```

**New API Endpoint:** `/fix/author-info`

```php
POST /fix/author-info
{
  "default_author": {
    "name": "John Smith",
    "title": "Owner & Lead Plumber",
    "bio": "20 years of experience...",
    "photo_url": "https://...",
    "credentials": ["Licensed Master Plumber", "EPA Certified"],
    "social": {
      "linkedin": "https://linkedin.com/in/..."
    }
  },
  "display_on_posts": true,
  "display_on_pages": false,
  "add_schema": true
}
```

#### 2.2 Testimonials/Reviews Section
**Current:** Not implemented  
**Needed:** Add testimonials with schema

```php
// New features:
- Testimonials shortcode [seo_testimonials]
- Review schema markup
- Star ratings display
- Customer photos
- Link to Google reviews
```

**New API Endpoint:** `/fix/testimonials`

```php
POST /fix/testimonials
{
  "testimonials": [
    {
      "author": "Jane Doe",
      "rating": 5,
      "text": "Excellent service!",
      "date": "2026-01-10",
      "source": "Google"
    }
  ],
  "add_schema": true,
  "display_location": "homepage|footer|widget"
}
```

#### 2.3 Trust Badges/Certifications
**Current:** Not implemented  
**Needed:** Display trust signals

```php
// New features:
- Certification badges display
- BBB badge
- Industry association logos
- Secure payment badges
- Guarantee/warranty badges
```

**New API Endpoint:** `/fix/trust-badges`

```php
POST /fix/trust-badges
{
  "badges": [
    {"type": "certification", "name": "EPA Certified", "image_url": "..."},
    {"type": "association", "name": "BBB A+ Rated", "image_url": "..."}
  ],
  "display_location": "footer",
  "add_to_about_page": true
}
```

---

### 🟢 Phase 3: Performance Fixes (Week 5-6)

#### 3.1 Resource Hints (Preconnect/Prefetch)
**Current:** Not implemented  
**Needed:** Add performance hints

```php
// New features:
- dns-prefetch for external domains
- preconnect for critical resources
- preload for key assets (fonts, LCP image)
```

**New API Endpoint:** `/fix/resource-hints`

```php
POST /fix/resource-hints
{
  "preconnect": [
    "https://fonts.googleapis.com",
    "https://www.google-analytics.com"
  ],
  "dns_prefetch": [
    "https://maps.googleapis.com"
  ],
  "preload": [
    {"url": "/wp-content/uploads/hero.jpg", "as": "image"}
  ]
}
```

#### 3.2 JavaScript Optimization
**Current:** Not implemented  
**Needed:** Reduce TBT

```php
// New features:
- Defer non-critical JavaScript
- Async loading for analytics
- Remove unused jQuery (if not needed)
- Inline critical JS
```

**New API Endpoint:** `/fix/js-optimization`

```php
POST /fix/js-optimization
{
  "defer_scripts": true,
  "async_analytics": true,
  "remove_jquery_migrate": true,
  "inline_critical": false
}
```

#### 3.3 CSS Optimization
**Current:** Not implemented  
**Needed:** Reduce render-blocking CSS

```php
// New features:
- Inline critical CSS
- Defer non-critical CSS
- Remove unused CSS (basic)
```

**New API Endpoint:** `/fix/css-optimization`

```php
POST /fix/css-optimization
{
  "inline_critical": true,
  "defer_non_critical": true
}
```

---

### 🔵 Phase 4: Accessibility Fixes (Week 7-8)

#### 4.1 Skip Link
**Current:** Not implemented  
**Needed:** Add skip navigation link

```php
// New features:
- Add skip link to theme
- Proper focus styles
- Screen reader friendly
```

**New API Endpoint:** `/fix/skip-link`

```php
POST /fix/skip-link
{
  "enable": true,
  "text": "Skip to main content",
  "target_id": "main-content"
}
```

#### 4.2 Focus Indicators
**Current:** Not implemented  
**Needed:** Add visible focus styles

```php
// New features:
- CSS for focus states
- High contrast outlines
- Keyboard navigation support
```

**New API Endpoint:** `/fix/focus-styles`

```php
POST /fix/focus-styles
{
  "enable": true,
  "outline_color": "#005fcc",
  "outline_width": "3px"
}
```

#### 4.3 New Window Link Warnings
**Current:** Not implemented  
**Needed:** Add aria-labels to external links

```php
// New features:
- Auto-add aria-label to target="_blank" links
- Visual indicator (icon) for new window links
```

**New API Endpoint:** `/fix/link-warnings`

```php
POST /fix/link-warnings
{
  "add_aria_labels": true,
  "add_visual_indicator": true,
  "indicator_text": "(opens in new tab)"
}
```

---

### ⚪ Phase 5: Advanced Features (Week 9+)

#### 5.1 Analytics Injection
**Current:** Not implemented  
**Needed:** Add Google Analytics/GTM

```php
// New features:
- Google Analytics 4 injection
- Google Tag Manager support
- Facebook Pixel
- Other tracking codes
```

**New API Endpoint:** `/fix/analytics`

```php
POST /fix/analytics
{
  "google_analytics_id": "G-XXXXXXXXXX",
  "gtm_id": "GTM-XXXXXXX",
  "facebook_pixel": "1234567890",
  "location": "head|footer"
}
```

#### 5.2 Service Area Pages Generator
**Current:** Not implemented  
**Needed:** Auto-generate location pages

```php
// New features:
- Template-based page generation
- "[Service] in [City]" pages
- Proper schema for each location
- Internal linking between pages
```

**New API Endpoint:** `/fix/service-areas`

```php
POST /fix/service-areas
{
  "service": "Plumbing",
  "locations": ["Denver", "Aurora", "Lakewood"],
  "template": "service-area",
  "generate_pages": true,
  "add_to_menu": true
}
```

#### 5.3 FAQ Schema Generator
**Current:** Not implemented  
**Needed:** Add FAQ schema for voice search

```php
// New features:
- FAQ shortcode with schema
- Auto-detect Q&A content
- Voice search optimization
```

**New API Endpoint:** `/fix/faq-schema`

```php
POST /fix/faq-schema
{
  "faqs": [
    {"question": "What areas do you serve?", "answer": "We serve..."},
    {"question": "What are your hours?", "answer": "We are open..."}
  ],
  "page_id": 123,
  "add_to_page": true
}
```

#### 5.4 llms.txt Generator
**Current:** Not implemented  
**Needed:** AI crawler guidance file

```php
// New features:
- Generate llms.txt file
- Business summary for AI
- Key services and info
```

**New API Endpoint:** `/fix/llms-txt`

```php
POST /fix/llms-txt
{
  "generate": true,
  "business_summary": "We are a...",
  "key_services": ["Plumbing", "HVAC", "Electrical"]
}
```

---

## Part 4: Implementation Specifications

### 4.1 New Database Tables

```sql
-- Service Areas
CREATE TABLE {prefix}seo_autofix_service_areas (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  page_id bigint(20),
  schema_data longtext,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Testimonials
CREATE TABLE {prefix}seo_autofix_testimonials (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  author_name varchar(255) NOT NULL,
  author_photo varchar(500),
  rating int(1) DEFAULT 5,
  review_text text NOT NULL,
  review_date date,
  source varchar(100),
  display_order int(11) DEFAULT 0,
  is_active tinyint(1) DEFAULT 1,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Trust Badges
CREATE TABLE {prefix}seo_autofix_badges (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  type varchar(50) NOT NULL,
  image_url varchar(500),
  link_url varchar(500),
  display_order int(11) DEFAULT 0,
  is_active tinyint(1) DEFAULT 1,
  PRIMARY KEY (id)
);
```

### 4.2 New Settings Fields

```php
// Add to seo_autofix_settings option:
$new_settings = array(
  // Contact Info
  'business_phone' => '',           // Exists
  'business_phone_display' => '',   // Formatted display
  'enable_click_to_call' => true,
  'business_address_full' => '',
  'business_lat' => '',
  'business_lng' => '',
  'google_maps_api_key' => '',
  
  // Business Hours
  'business_hours' => array(),      // Array of day => open/close
  'display_hours_footer' => false,
  'display_hours_widget' => false,
  
  // Author Info
  'default_author_name' => '',
  'default_author_bio' => '',
  'default_author_photo' => '',
  'default_author_credentials' => array(),
  'display_author_on_posts' => true,
  
  // Performance
  'enable_resource_hints' => false,
  'preconnect_domains' => array(),
  'defer_js' => false,
  'async_analytics' => false,
  
  // Accessibility
  'enable_skip_link' => false,
  'enable_focus_styles' => false,
  'add_link_warnings' => false,
  
  // Analytics
  'ga4_id' => '',
  'gtm_id' => '',
  'fb_pixel_id' => '',
  
  // Service Areas
  'service_areas' => array(),
  'service_area_template' => '',
);
```

### 4.3 New Shortcodes

```php
// Testimonials
[seo_autofix_testimonials count="3" layout="grid|list|slider"]

// Business Hours
[seo_autofix_hours format="table|list"]

// Trust Badges
[seo_autofix_badges type="all|certifications|associations"]

// Service Areas
[seo_autofix_service_areas show_map="true"]

// FAQs with Schema
[seo_autofix_faq]
  [faq_item question="What areas do you serve?"]We serve Denver, Aurora...[/faq_item]
  [faq_item question="What are your hours?"]We are open Monday-Friday...[/faq_item]
[/seo_autofix_faq]

// Click to Call Button
[seo_autofix_call_button text="Call Now" phone="+1-555-123-4567"]

// Google Map
[seo_autofix_map address="123 Main St, Denver, CO" height="300"]
```

### 4.4 New Admin Pages

```php
// Add to menu:
add_submenu_page('seo-auto-fix', 'Local SEO', 'Local SEO', 'manage_options', 'seo-auto-fix-local', 'seo_autofix_local_page');
add_submenu_page('seo-auto-fix', 'Testimonials', 'Testimonials', 'manage_options', 'seo-auto-fix-testimonials', 'seo_autofix_testimonials_page');
add_submenu_page('seo-auto-fix', 'Service Areas', 'Service Areas', 'manage_options', 'seo-auto-fix-areas', 'seo_autofix_areas_page');
add_submenu_page('seo-auto-fix', 'Performance', 'Performance', 'manage_options', 'seo-auto-fix-performance', 'seo_autofix_performance_page');
add_submenu_page('seo-auto-fix', 'Accessibility', 'Accessibility', 'manage_options', 'seo-auto-fix-a11y', 'seo_autofix_a11y_page');
add_submenu_page('seo-auto-fix', 'Analytics', 'Analytics', 'manage_options', 'seo-auto-fix-analytics', 'seo_autofix_analytics_page');
```

---

## Part 5: Bulk Fix Enhancement

### Current Bulk Fix Capabilities

```php
// Current /fix/bulk endpoint supports:
$supported_fixes = [
  'alt_text',
  'compress',
  'security',
  'lazy_loading',
  'sitemap',
  'schema',
  'og_tags',
  'robots',
  'meta',
  'database'
];
```

### Enhanced Bulk Fix (After Implementation)

```php
// New /fix/bulk endpoint will support:
$all_fixes = [
  // Existing
  'alt_text',
  'compress_images',
  'security_headers',
  'lazy_loading',
  'sitemap',
  'schema',
  'og_tags',
  'robots',
  'meta_descriptions',
  'database_cleanup',
  
  // Phase 1 - Local SEO
  'local_business_schema',
  'contact_info',
  'business_hours',
  'click_to_call',
  'map_embed',
  
  // Phase 2 - Trust & E-E-A-T
  'author_info',
  'testimonials_schema',
  'trust_badges',
  
  // Phase 3 - Performance
  'resource_hints',
  'js_optimization',
  'css_optimization',
  
  // Phase 4 - Accessibility
  'skip_link',
  'focus_styles',
  'link_warnings',
  
  // Phase 5 - Advanced
  'analytics',
  'faq_schema',
  'llms_txt'
];
```

### "Fix All" Button Logic

```php
// When user clicks "Fix All" from audit tool:
POST /fix/bulk
{
  "fixes": ["all"],  // Special keyword
  "config": {
    "use_ai_for_alt": false,
    "business_info": {
      "name": "Acme Plumbing",
      "phone": "+1-555-123-4567",
      // ... from audit tool's collected data
    }
  }
}

// Plugin applies all applicable fixes in order:
1. Security headers (instant)
2. Schema markup (uses config.business_info)
3. OG tags (instant)
4. Lazy loading (instant)
5. Sitemap (generate & ping)
6. Robots.txt (optimize)
7. Meta descriptions (generate for missing)
8. Alt text (generate for missing)
9. Resource hints (add preconnect)
10. Skip link (add to theme)
11. Focus styles (add CSS)
// ... etc.
```

---

## Part 6: Priority Implementation Summary

### Must Have for MVP (Weeks 1-4)

| Feature | API Endpoint | Priority |
|---------|--------------|----------|
| Enhanced Local Business Schema | `/fix/schema` (enhance) | 🔴 Critical |
| Click-to-Call Phone Links | `/fix/contact-info` | 🔴 Critical |
| Business Hours Display | `/fix/business-hours` | 🔴 Critical |
| Google Map Embed | `/fix/contact-info` | 🔴 Critical |
| Author Information | `/fix/author-info` | 🟡 High |
| Testimonials with Schema | `/fix/testimonials` | 🟡 High |
| Trust Badges | `/fix/trust-badges` | 🟡 High |

### Should Have (Weeks 5-8)

| Feature | API Endpoint | Priority |
|---------|--------------|----------|
| Resource Hints | `/fix/resource-hints` | 🟢 Medium |
| JS Defer/Async | `/fix/js-optimization` | 🟢 Medium |
| Skip Link | `/fix/skip-link` | 🟢 Medium |
| Focus Indicators | `/fix/focus-styles` | 🟢 Medium |
| Link Warnings | `/fix/link-warnings` | 🟢 Medium |

### Nice to Have (Weeks 9+)

| Feature | API Endpoint | Priority |
|---------|--------------|----------|
| Analytics Injection | `/fix/analytics` | ⚪ Low |
| Service Area Page Generator | `/fix/service-areas` | ⚪ Low |
| FAQ Schema | `/fix/faq-schema` | ⚪ Low |
| llms.txt | `/fix/llms-txt` | ⚪ Low |

---

## Part 7: Files to Modify/Create

### Modify Existing

```
wordpress-plugin/seo-auto-fix/seo-auto-fix.php
├── Add new settings fields to seo_autofix_activate()
├── Add new REST API endpoints to seo_autofix_register_rest_routes()
├── Enhance seo_autofix_api_fix_schema() for full LocalBusiness
├── Add new fix functions for each feature
├── Update seo_autofix_api_fix_bulk() to support new fixes
├── Add new admin menu pages
└── Add new shortcode registrations
```

### Create New Files (Recommended Refactor)

```
wordpress-plugin/seo-auto-fix/
├── seo-auto-fix.php                    # Main plugin file
├── includes/
│   ├── class-seo-autofix-admin.php     # Admin pages
│   ├── class-seo-autofix-api.php       # REST API endpoints
│   ├── class-seo-autofix-schema.php    # Schema generation
│   ├── class-seo-autofix-local.php     # Local SEO features
│   ├── class-seo-autofix-trust.php     # E-E-A-T features
│   ├── class-seo-autofix-performance.php # Performance fixes
│   ├── class-seo-autofix-a11y.php      # Accessibility fixes
│   └── class-seo-autofix-shortcodes.php # All shortcodes
├── assets/
│   ├── css/
│   │   ├── admin.css                   # Admin styles
│   │   └── frontend.css                # Frontend styles
│   └── js/
│       ├── admin.js                    # Admin scripts
│       └── frontend.js                 # Frontend scripts
└── templates/
    ├── testimonials.php                # Testimonials display
    ├── business-hours.php              # Hours display
    ├── trust-badges.php                # Badges display
    └── service-area.php                # Service area page template
```

---

## Part 8: Testing Checklist

### For Each New Feature

- [ ] API endpoint works via curl
- [ ] API endpoint works from audit tool
- [ ] Bulk fix includes new fix
- [ ] Admin page displays correctly
- [ ] Settings save and load correctly
- [ ] Frontend output is correct
- [ ] Schema validates in Google Rich Results Test
- [ ] No PHP errors/warnings
- [ ] Works with popular themes (Astra, GeneratePress, Divi)
- [ ] Works with popular plugins (Yoast, Rank Math)
- [ ] Mobile responsive
- [ ] Accessibility compliant

---

## Part 9: Success Metrics

After full implementation:

| Metric | Target |
|--------|--------|
| Audit issues fixable via plugin | 80%+ |
| Time to fix all issues | < 5 minutes |
| User actions required | 1 click ("Fix All") |
| Schema validation pass rate | 100% |
| Core Web Vitals improvement | 10-20 points |
| Local SEO score improvement | C → A grade |

---

## Conclusion

The current plugin (v4.0.1) provides a solid foundation with **12 working API endpoints** for remote fixes. To achieve the vision of **one-click fix all**, we need to implement:

1. **7 new API endpoints** for local SEO (Phase 1-2)
2. **6 new API endpoints** for performance/accessibility (Phase 3-4)
3. **4 new API endpoints** for advanced features (Phase 5)

Total: **17 new endpoints** + enhancements to existing endpoints

The priority is clear: **Local SEO features first**, as that's the core value proposition for the target market of local WordPress businesses.

---

*Document Version: 1.0*
*Created: January 2026*
*Purpose: WordPress Plugin Development Roadmap*
