# WordPress SEO AutoFix Pro - Complete Documentation

## Current Version: 4.0.0

Complete SEO toolkit for WordPress with **remote auto-fix integration** - connect your WordPress site to the SEO Audit Tool and fix issues with one click.

---

## NEW: Remote Auto-Fix Integration

### How It Works

1. **User runs SEO audit** on the website (Next.js audit tool)
2. **Audit report shows issues** (missing alt text, no sitemap, etc.)
3. **User connects WordPress site** using the plugin's API credentials
4. **One-click fixes** apply changes directly to WordPress

### Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   SEO Audit Tool    │     │   Next.js API       │     │   WordPress Site    │
│   (Frontend)        │────▶│   /api/wordpress    │────▶│   REST API          │
│                     │     │                     │     │   /seo-autofix/v1/  │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
         │                           │                           │
         │  User clicks "Fix"        │  Proxy request           │  Apply fix
         └───────────────────────────┴───────────────────────────┘
```

---

## All Implemented Features

### WordPress Plugin Features

| Category | Feature | Status |
|----------|---------|--------|
| **API** | REST API for remote fixes | ✅ Done |
| **API** | API key authentication | ✅ Done |
| **API** | Connection verification | ✅ Done |
| **API** | CORS support | ✅ Done |
| **Images** | AI alt text (OpenAI) | ✅ Done |
| **Images** | Bulk alt text generation | ✅ Done |
| **Images** | Image compression | ✅ Done |
| **Images** | WebP conversion | ✅ Done |
| **Images** | Lazy loading | ✅ Done |
| **SEO** | Meta editor | ✅ Done |
| **SEO** | Auto meta generation | ✅ Done |
| **Technical** | XML sitemap | ✅ Done |
| **Technical** | Robots.txt editor | ✅ Done |
| **Technical** | Security headers | ✅ Done |
| **Technical** | Redirects (301/302) | ✅ Done |
| **Social** | Open Graph tags | ✅ Done |
| **Social** | Twitter Cards | ✅ Done |
| **Schema** | LocalBusiness | ✅ Done |
| **Schema** | Breadcrumbs | ✅ Done |
| **Database** | Cleanup tools | ✅ Done |

### Audit Tool Features

| Feature | Status |
|---------|--------|
| WordPress connection modal | ✅ Done |
| API credentials storage (localStorage) | ✅ Done |
| Individual fix buttons | ✅ Done |
| Bulk fix all button | ✅ Done |
| Fix progress tracking | ✅ Done |
| Connection status display | ✅ Done |

---

## REST API Endpoints

### Authentication

All API requests require the `X-SEO-AutoFix-Key` header:

```bash
curl -H "X-SEO-AutoFix-Key: YOUR_API_KEY" \
  https://yoursite.com/wp-json/seo-autofix/v1/verify
```

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/verify` | GET | Verify connection & get site info |
| `/status` | GET | Get site stats and feature status |
| `/fix/alt-text` | POST | Generate alt text for images |
| `/fix/compress-images` | POST | Compress images |
| `/fix/security-headers` | POST | Enable security headers |
| `/fix/lazy-loading` | POST | Enable lazy loading |
| `/fix/sitemap` | POST | Generate sitemap & ping search engines |
| `/fix/schema` | POST | Enable schema markup |
| `/fix/og-tags` | POST | Enable Open Graph & Twitter Cards |
| `/fix/robots` | POST | Optimize robots.txt |
| `/fix/meta-descriptions` | POST | Auto-generate meta descriptions |
| `/fix/database` | POST | Clean up database |
| `/fix/bulk` | POST | Apply multiple fixes at once |

### Example: Verify Connection

```bash
curl -X GET \
  -H "X-SEO-AutoFix-Key: abc123xyz" \
  "https://yoursite.com/wp-json/seo-autofix/v1/verify"
```

Response:
```json
{
  "success": true,
  "site": "https://yoursite.com",
  "name": "My Site",
  "version": "4.0.0",
  "wordpress": "6.8.1",
  "php": "8.2.28"
}
```

### Example: Get Status

```bash
curl -X GET \
  -H "X-SEO-AutoFix-Key: abc123xyz" \
  "https://yoursite.com/wp-json/seo-autofix/v1/status"
```

Response:
```json
{
  "success": true,
  "stats": {
    "total_images": 61,
    "images_without_alt": 20,
    "posts_without_meta": 15,
    "total_posts": 30
  },
  "features": {
    "https": true,
    "security_headers": true,
    "lazy_loading": true,
    "schema": false,
    "sitemap": true
  }
}
```

### Example: Fix Alt Text

```bash
curl -X POST \
  -H "X-SEO-AutoFix-Key: abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{"use_ai": false, "limit": 10}' \
  "https://yoursite.com/wp-json/seo-autofix/v1/fix/alt-text"
```

Response:
```json
{
  "success": true,
  "fixed": 10,
  "remaining": 10,
  "results": [
    {"id": 123, "alt": "Office building exterior"},
    {"id": 124, "alt": "Team meeting room"}
  ]
}
```

### Example: Bulk Fix

```bash
curl -X POST \
  -H "X-SEO-AutoFix-Key: abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{"fixes": ["alt_text", "security", "sitemap", "schema"]}' \
  "https://yoursite.com/wp-json/seo-autofix/v1/fix/bulk"
```

---

## Installation & Setup

### 1. Install WordPress Plugin

1. Download `seo-auto-fix.zip` from the audit tool
2. WordPress Admin → Plugins → Add New → Upload
3. Activate the plugin

### 2. Enable Remote API

1. Go to **SEO AutoFix → API / Connect**
2. Check "Enable Remote API"
3. Click "Save API Settings"
4. Copy your **Site URL** and **API Key**

### 3. Connect from Audit Tool

1. Run an audit on your website
2. Click "Connect WordPress" on the report page
3. Paste your Site URL and API Key
4. Click "Connect & Verify"

### 4. Fix Issues

- Click individual "Fix" buttons next to each issue
- Or click "Auto-Fix All Issues" to fix everything at once

---

## Check ID to Fix Action Mapping

| Check ID | Fix Action | Description |
|----------|------------|-------------|
| `meta-description` | `fix_meta` | Generate meta descriptions |
| `title-tag` | `fix_meta` | Generate SEO titles |
| `image-alt` | `fix_alt_text` | Generate image alt text |
| `og-tags` | `fix_og_tags` | Enable Open Graph |
| `twitter-card` | `fix_og_tags` | Enable Twitter Cards |
| `lazy-loading` | `fix_lazy_loading` | Enable lazy loading |
| `image-compression` | `fix_compress` | Compress images |
| `xml-sitemap` | `fix_sitemap` | Generate sitemap |
| `robots-txt` | `fix_robots` | Optimize robots.txt |
| `security-headers` | `fix_security` | Enable security headers |
| `hsts` | `fix_security` | Enable HSTS |
| `schema-markup` | `fix_schema` | Add schema markup |
| `local-business-schema` | `fix_schema` | Add LocalBusiness schema |

---

## Security

### API Key

- Generated on plugin activation
- 32-character alphanumeric string
- Can be regenerated anytime
- Stored in WordPress options table

### CORS

- All origins allowed for API endpoints
- Only authenticated requests processed
- Rate limiting via WordPress

### Data Privacy

- No data sent to external servers (except OpenAI for AI alt text)
- API key stored locally in browser (localStorage)
- Connection can be disconnected anytime

---

## Files

### WordPress Plugin
- **Location:** `wordpress-plugin/seo-auto-fix/seo-auto-fix.php`
- **ZIP:** `wordpress-plugin/seo-auto-fix.zip`
- **Public Download:** `public/downloads/seo-auto-fix.zip`

### Next.js Integration
- **API Route:** `src/app/api/wordpress/route.ts`
- **Components:** `src/components/report/wordpress-connect.tsx`
- **Report Page:** `src/app/[domain]/page.tsx`

---

## Changelog

### Version 4.0.0 (Current)
**Major Update: Remote Auto-Fix Integration**

- Added REST API with 12 endpoints for remote fixes
- API key authentication system
- CORS support for cross-origin requests
- New "API / Connect" admin page
- Connection verification endpoint
- Bulk fix endpoint
- Next.js API proxy route
- WordPress connection modal
- Individual fix buttons on report
- Bulk fix all button
- Fix progress tracking
- LocalStorage for credentials

### Version 3.0.0
- AI alt text with OpenAI
- Meta editor
- Broken link checker
- Redirects manager
- Sitemap generator
- Database cleanup

### Version 2.0.0
- Image compression
- WebP conversion
- Security headers
- Schema markup

### Version 1.0.0
- Initial release
