# SEO Audit Tool - Architecture & Blueprint Document

## Project Overview

Building a comprehensive SEO audit tool similar to SEOptimer that analyzes websites and provides actionable recommendations across multiple categories: On-Page SEO, Links, Usability, Performance, Social, and Technology.

---

## Tech Stack Recommendation

### Frontend
| Technology | Purpose | Why |
|------------|---------|-----|
| **Next.js 14+** | Full-stack React framework | SSR/SSG for SEO, API routes, excellent DX |
| **TypeScript** | Type safety | Better code quality and maintainability |
| **Tailwind CSS** | Styling | Rapid UI development, utility-first |
| **shadcn/ui** | UI Components | Beautiful, accessible components |
| **ApexCharts / Recharts** | Data visualization | Radar charts, progress rings, gauges |
| **React Query (TanStack)** | Data fetching | Caching, real-time updates, optimistic UI |
| **Zustand** | State management | Lightweight, simple global state |

### Backend (Trigger.dev for Background Jobs)
| Technology | Purpose | Why |
|------------|---------|-----|
| **Trigger.dev v3** | Background jobs | Long-running tasks, no timeouts, serverless |
| **Playwright** | Browser automation | Better than Puppeteer for modern sites |
| **Cheerio** | HTML parsing | Fast static HTML parsing |
| **Node.js** | Runtime | JavaScript ecosystem compatibility |

### Database & Storage
| Technology | Purpose | Why |
|------------|---------|-----|
| **PostgreSQL (Supabase/Neon)** | Primary database | Reliable, scalable, free tiers available |
| **Prisma** | ORM | Type-safe database queries |
| **Redis (Upstash)** | Caching & queues | Fast caching, rate limiting |
| **Cloudflare R2/S3** | File storage | Screenshots, PDF reports |

### External APIs & Services
| Service | Purpose |
|---------|---------|
| **Google PageSpeed Insights API** | Core Web Vitals, performance metrics |
| **Moz API / Ahrefs API** | Backlink data, domain authority |
| **BuiltWith API / Wappalyzer** | Technology detection |
| **DNS APIs (Google DNS / Cloudflare)** | DNS records, SPF, DMARC checks |
| **Social Media APIs** | Social presence verification |
| **Screenshot API / Playwright** | Device screenshots |

### Deployment
| Platform | Purpose |
|----------|---------|
| **Vercel** | Frontend hosting (Next.js optimized) |
| **Trigger.dev Cloud** | Background job execution |
| **Supabase** | Database + Auth + Storage |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                           (Next.js + React)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Home    │  │  Audit   │  │  Report  │  │ Dashboard│  │  Pricing │  │
│  │  Page    │  │  Input   │  │  View    │  │  (Auth)  │  │  Page    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS API ROUTES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │ /api/audit   │  │ /api/report  │  │ /api/webhook │                   │
│  │   start      │  │   [id]       │  │  trigger.dev │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        TRIGGER.DEV (Background Jobs)                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      AUDIT ORCHESTRATOR                          │    │
│  │  Coordinates all analysis tasks, aggregates results, scores      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│           │           │           │           │           │              │
│           ▼           ▼           ▼           ▼           ▼              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │On-Page  │  │ Links   │  │Usability│  │ Perform │  │ Social  │       │
│  │SEO Task │  │ Task    │  │ Task    │  │ Task    │  │ Task    │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│       │           │           │           │           │                  │
│       ▼           ▼           ▼           ▼           ▼                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │Playwright│ │Backlink │  │PageSpeed│  │Load Time│  │Social   │       │
│  │Cheerio  │  │API      │  │API      │  │Analysis │  │APIs     │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │   PostgreSQL     │  │      Redis       │  │  Cloud Storage   │       │
│  │   (Supabase)     │  │    (Upstash)     │  │   (R2/S3)        │       │
│  │                  │  │                  │  │                  │       │
│  │ - Audit reports  │  │ - Rate limiting  │  │ - Screenshots    │       │
│  │ - User accounts  │  │ - Job queues     │  │ - PDF reports    │       │
│  │ - Analytics      │  │ - Caching        │  │ - Cached HTML    │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  plan          Plan      @default(FREE)
  audits        Audit[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Plan {
  FREE
  PRO
  AGENCY
  WHITE_LABEL
}

model Audit {
  id              String          @id @default(cuid())
  url             String
  domain          String
  status          AuditStatus     @default(PENDING)
  overallScore    Int?
  overallGrade    String?
  
  // Category Scores
  seoScore        Int?
  linksScore      Int?
  usabilityScore  Int?
  performanceScore Int?
  socialScore     Int?
  
  // Results (JSON for flexibility)
  seoResults      Json?
  linksResults    Json?
  usabilityResults Json?
  performanceResults Json?
  socialResults   Json?
  technologyResults Json?
  
  // Recommendations
  recommendations Recommendation[]
  
  // Screenshots
  desktopScreenshot String?
  mobileScreenshot  String?
  
  // Metadata
  userId          String?
  user            User?           @relation(fields: [userId], references: [id])
  triggerId       String?         // Trigger.dev run ID
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  completedAt     DateTime?

  @@index([domain])
  @@index([status])
  @@index([userId])
}

enum AuditStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}

model Recommendation {
  id          String   @id @default(cuid())
  auditId     String
  audit       Audit    @relation(fields: [auditId], references: [id], onDelete: Cascade)
  title       String
  description String?
  category    String   // On-Page SEO, Links, Usability, Performance, Social, Other
  priority    Priority
  checkId     String   // Reference to specific check
  
  @@index([auditId])
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

model CachedResult {
  id        String   @id @default(cuid())
  domain    String   @unique
  data      Json
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([domain])
  @@index([expiresAt])
}
```

---

## Project Structure

```
seo-audit-tool/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Public pages
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── features/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Protected pages
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── reports/[id]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── [domain]/                 # Public report pages
│   │   │   └── page.tsx              # e.g., /kommentify.com
│   │   ├── api/
│   │   │   ├── audit/
│   │   │   │   ├── route.ts          # Start audit
│   │   │   │   └── [id]/route.ts     # Get audit status
│   │   │   ├── webhook/
│   │   │   │   └── trigger/route.ts  # Trigger.dev webhooks
│   │   │   └── report/
│   │   │       └── [id]/pdf/route.ts # PDF generation
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── audit/
│   │   │   ├── AuditForm.tsx
│   │   │   ├── AuditProgress.tsx
│   │   │   └── ScoreRing.tsx
│   │   ├── report/
│   │   │   ├── ReportHeader.tsx
│   │   │   ├── CategorySection.tsx
│   │   │   ├── RecommendationList.tsx
│   │   │   ├── ScoreRadar.tsx
│   │   │   ├── CheckItem.tsx
│   │   │   └── DevicePreview.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                     # Prisma client
│   │   ├── redis.ts                  # Redis client
│   │   ├── utils.ts                  # Utility functions
│   │   └── scoring.ts                # Score calculation logic
│   │
│   ├── types/
│   │   ├── audit.ts                  # Audit types
│   │   └── checks.ts                 # Check result types
│   │
│   └── hooks/
│       ├── useAudit.ts
│       └── useRealtimeAudit.ts
│
├── trigger/                          # Trigger.dev tasks
│   ├── audit/
│   │   ├── orchestrator.ts           # Main audit coordinator
│   │   ├── on-page-seo.ts            # SEO analysis task
│   │   ├── links-analysis.ts         # Backlinks & links task
│   │   ├── usability.ts              # Usability checks task
│   │   ├── performance.ts            # Performance analysis task
│   │   ├── social.ts                 # Social presence task
│   │   └── technology.ts             # Tech detection task
│   │
│   ├── utils/
│   │   ├── browser.ts                # Playwright utilities
│   │   ├── html-parser.ts            # Cheerio utilities
│   │   ├── dns.ts                    # DNS checking utilities
│   │   └── screenshot.ts             # Screenshot capture
│   │
│   └── index.ts                      # Task exports
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── images/
│
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── trigger.config.ts                 # Trigger.dev config
└── README.md
```

---

## Audit Checks Breakdown

### 1. On-Page SEO (Weight: 25%)

| Check | Type | Criteria |
|-------|------|----------|
| Title Tag | Required | 50-60 characters, contains keywords |
| Meta Description | Required | 120-160 characters |
| H1 Tag | Required | Single H1, contains keywords |
| H2-H6 Tags | Recommended | Proper hierarchy |
| Image Alt Attributes | Required | All images have alt text |
| Canonical URL | Required | Present and valid |
| Robots.txt | Required | Accessible, not blocking |
| XML Sitemap | Required | Present and valid |
| SSL Certificate | Required | Valid HTTPS |
| Hreflang | Optional | For multi-language sites |
| Schema.org Markup | Recommended | JSON-LD structured data |
| Keyword Density | Info | Keyword distribution analysis |
| Word Count | Info | 300+ words recommended |
| Noindex Check | Critical | Should not be noindexed |
| Analytics | Recommended | GA/other tracking present |
| llms.txt | Optional | LLM readability file |

### 2. Links Analysis (Weight: 20%)

| Check | Type | Criteria |
|-------|------|----------|
| Total Backlinks | Info | Count and quality |
| Referring Domains | Info | Unique domains linking |
| Dofollow/Nofollow Ratio | Info | Balance analysis |
| Domain Authority | Info | Overall domain strength |
| Internal Links | Required | Proper structure |
| External Links | Info | Quality of outbound |
| Broken Links | Critical | No 404s |
| Anchor Text Distribution | Info | Natural variation |

### 3. Usability (Weight: 20%)

| Check | Type | Criteria |
|-------|------|----------|
| Mobile Viewport | Required | Responsive meta tag |
| Mobile Friendly | Required | Passes Google test |
| Core Web Vitals | Critical | LCP, FID/INP, CLS |
| PageSpeed Mobile | Required | Score 50+ |
| PageSpeed Desktop | Required | Score 70+ |
| Flash Content | Obsolete | Should not exist |
| iFrames | Warning | Minimize usage |
| Favicon | Required | Present |
| Font Legibility | Required | Readable text |
| Tap Target Size | Required | Min 48px targets |

### 4. Performance (Weight: 20%)

| Check | Type | Criteria |
|-------|------|----------|
| Page Load Time | Critical | Under 3 seconds |
| TTFB | Required | Under 600ms |
| Page Size | Required | Under 3MB |
| HTTP/2 or HTTP/3 | Recommended | Modern protocol |
| Compression (Gzip/Brotli) | Required | 70%+ compression |
| Image Optimization | Required | WebP, proper sizing |
| JS/CSS Minification | Required | Minified files |
| Resource Count | Info | Minimize requests |
| Caching Headers | Required | Proper cache control |
| Inline Styles | Warning | Minimize usage |
| Deprecated HTML | Warning | No deprecated tags |

### 5. Social (Weight: 10%)

| Check | Type | Criteria |
|-------|------|----------|
| Facebook Page | Optional | Linked on site |
| Open Graph Tags | Recommended | og:title, og:description, og:image |
| Twitter/X Profile | Optional | Linked on site |
| Twitter Cards | Recommended | card meta tags |
| Instagram | Optional | Linked on site |
| LinkedIn | Optional | Linked on site |
| YouTube | Optional | Linked on site |
| Facebook Pixel | Info | Tracking present |

### 6. Technology & Other (Weight: 5%)

| Check | Type | Criteria |
|-------|------|----------|
| CMS Detection | Info | WordPress, Shopify, etc. |
| Server Technology | Info | Vercel, AWS, etc. |
| CDN Usage | Recommended | CloudFlare, etc. |
| DNS Records | Info | A, CNAME records |
| SPF Record | Recommended | Email authentication |
| DMARC Record | Recommended | Email security |
| Local Business Schema | Optional | For local businesses |
| Address/Phone | Optional | Contact info |

---

## Scoring Algorithm

```typescript
// lib/scoring.ts

interface CategoryScore {
  score: number;      // 0-100
  weight: number;     // percentage
  grade: string;      // A+, A, A-, B+, B, B-, C+, C, C-, D, F
  checks: CheckResult[];
}

interface CheckResult {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail' | 'info';
  score: number;      // 0-100
  weight: number;     // importance within category
  value?: any;        // actual measured value
  message: string;
  recommendation?: string;
}

const CATEGORY_WEIGHTS = {
  seo: 0.25,
  links: 0.20,
  usability: 0.20,
  performance: 0.20,
  social: 0.10,
  technology: 0.05,
};

function calculateGrade(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
}

function calculateOverallScore(categories: Record<string, CategoryScore>): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  for (const [category, data] of Object.entries(categories)) {
    const weight = CATEGORY_WEIGHTS[category] || 0;
    totalWeightedScore += data.score * weight;
    totalWeight += weight;
  }
  
  return Math.round(totalWeightedScore / totalWeight);
}
```

---

## Trigger.dev Task Implementation

### Audit Orchestrator

```typescript
// trigger/audit/orchestrator.ts

import { task, runs } from "@trigger.dev/sdk/v3";
import { onPageSeoTask } from "./on-page-seo";
import { linksAnalysisTask } from "./links-analysis";
import { usabilityTask } from "./usability";
import { performanceTask } from "./performance";
import { socialTask } from "./social";
import { technologyTask } from "./technology";
import { prisma } from "@/lib/db";
import { calculateOverallScore, calculateGrade } from "@/lib/scoring";

export const auditOrchestratorTask = task({
  id: "audit-orchestrator",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: { auditId: string; url: string }) => {
    const { auditId, url } = payload;
    
    // Update status to running
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: "RUNNING" },
    });

    try {
      // Run all analysis tasks in parallel
      const [
        seoResults,
        linksResults,
        usabilityResults,
        performanceResults,
        socialResults,
        technologyResults,
      ] = await Promise.all([
        onPageSeoTask.triggerAndWait({ url, auditId }),
        linksAnalysisTask.triggerAndWait({ url, auditId }),
        usabilityTask.triggerAndWait({ url, auditId }),
        performanceTask.triggerAndWait({ url, auditId }),
        socialTask.triggerAndWait({ url, auditId }),
        technologyTask.triggerAndWait({ url, auditId }),
      ]);

      // Calculate scores
      const categories = {
        seo: seoResults.output,
        links: linksResults.output,
        usability: usabilityResults.output,
        performance: performanceResults.output,
        social: socialResults.output,
        technology: technologyResults.output,
      };

      const overallScore = calculateOverallScore(categories);
      const overallGrade = calculateGrade(overallScore);

      // Generate recommendations
      const recommendations = generateRecommendations(categories);

      // Save final results
      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "COMPLETED",
          overallScore,
          overallGrade,
          seoScore: seoResults.output.score,
          linksScore: linksResults.output.score,
          usabilityScore: usabilityResults.output.score,
          performanceScore: performanceResults.output.score,
          socialScore: socialResults.output.score,
          seoResults: seoResults.output,
          linksResults: linksResults.output,
          usabilityResults: usabilityResults.output,
          performanceResults: performanceResults.output,
          socialResults: socialResults.output,
          technologyResults: technologyResults.output,
          completedAt: new Date(),
          recommendations: {
            createMany: {
              data: recommendations,
            },
          },
        },
      });

      return { success: true, overallScore, overallGrade };
    } catch (error) {
      await prisma.audit.update({
        where: { id: auditId },
        data: { status: "FAILED" },
      });
      throw error;
    }
  },
});
```

### On-Page SEO Task Example

```typescript
// trigger/audit/on-page-seo.ts

import { task } from "@trigger.dev/sdk/v3";
import { chromium } from "playwright";
import * as cheerio from "cheerio";

export const onPageSeoTask = task({
  id: "on-page-seo-analysis",
  retry: { maxAttempts: 2 },
  run: async (payload: { url: string; auditId: string }) => {
    const { url } = payload;
    const checks: CheckResult[] = [];
    
    // Fetch HTML with Playwright for JS-rendered content
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const html = await page.content();
    await browser.close();
    
    const $ = cheerio.load(html);

    // Title Tag Check
    const title = $("title").text().trim();
    checks.push({
      id: "title",
      name: "Title Tag",
      status: title.length >= 50 && title.length <= 60 ? "pass" : 
              title.length > 0 ? "warning" : "fail",
      score: title.length >= 50 && title.length <= 60 ? 100 : 
             title.length > 0 ? 60 : 0,
      weight: 15,
      value: { title, length: title.length },
      message: title.length >= 50 && title.length <= 60 
        ? "Your Title Tag is optimal length."
        : `Title Tag length is ${title.length} characters. Ideal: 50-60.`,
      recommendation: title.length > 60 
        ? "Reduce length of Title Tag" 
        : title.length < 50 
        ? "Expand your Title Tag" 
        : undefined,
    });

    // Meta Description Check
    const metaDesc = $('meta[name="description"]').attr("content") || "";
    checks.push({
      id: "metaDescription",
      name: "Meta Description",
      status: metaDesc.length >= 120 && metaDesc.length <= 160 ? "pass" : 
              metaDesc.length > 0 ? "warning" : "fail",
      score: metaDesc.length >= 120 && metaDesc.length <= 160 ? 100 : 
             metaDesc.length > 0 ? 60 : 0,
      weight: 12,
      value: { description: metaDesc, length: metaDesc.length },
      message: `Meta Description is ${metaDesc.length} characters.`,
    });

    // H1 Tag Check
    const h1Tags = $("h1");
    checks.push({
      id: "h1Tag",
      name: "H1 Header Tag",
      status: h1Tags.length === 1 ? "pass" : 
              h1Tags.length > 1 ? "warning" : "fail",
      score: h1Tags.length === 1 ? 100 : h1Tags.length > 1 ? 70 : 0,
      weight: 10,
      value: { count: h1Tags.length, text: h1Tags.first().text() },
      message: h1Tags.length === 1 
        ? "Your page has a single H1 Tag."
        : `Found ${h1Tags.length} H1 tags.`,
    });

    // ... more checks (canonical, schema, images, etc.)

    // Calculate category score
    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
    const weightedScore = checks.reduce((sum, c) => sum + (c.score * c.weight), 0);
    const score = Math.round(weightedScore / totalWeight);

    return {
      score,
      grade: calculateGrade(score),
      checks,
    };
  },
});
```

---

## API Routes

### Start Audit

```typescript
// app/api/audit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auditOrchestratorTask } from "@/trigger/audit/orchestrator";
import { tasks } from "@trigger.dev/sdk/v3";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // Validate URL
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    // Check for recent audit (cache)
    const recentAudit = await prisma.audit.findFirst({
      where: {
        domain,
        status: "COMPLETED",
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (recentAudit) {
      return NextResponse.json({ 
        id: recentAudit.id, 
        cached: true,
        status: "COMPLETED",
      });
    }

    // Create new audit
    const audit = await prisma.audit.create({
      data: {
        url: parsedUrl.toString(),
        domain,
        status: "PENDING",
      },
    });

    // Trigger background job
    const handle = await tasks.trigger("audit-orchestrator", {
      auditId: audit.id,
      url: parsedUrl.toString(),
    });

    // Update with trigger ID
    await prisma.audit.update({
      where: { id: audit.id },
      data: { triggerId: handle.id },
    });

    return NextResponse.json({ 
      id: audit.id, 
      status: "PENDING",
      triggerId: handle.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start audit" },
      { status: 500 }
    );
  }
}
```

---

## Environment Variables

```env
# .env.example

# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."

# Trigger.dev
TRIGGER_API_KEY="tr_dev_..."
TRIGGER_SECRET_KEY="tr_secret_..."

# External APIs
GOOGLE_PAGESPEED_API_KEY="..."
MOZ_API_KEY="..."
MOZ_ACCESS_ID="..."

# Storage
CLOUDFLARE_R2_ACCESS_KEY="..."
CLOUDFLARE_R2_SECRET_KEY="..."
CLOUDFLARE_R2_BUCKET="..."

# Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (Next.js, Prisma, Trigger.dev)
- [ ] Database schema and migrations
- [ ] Basic UI components (score rings, check items)
- [ ] Home page with URL input form
- [ ] Basic audit API route

### Phase 2: Core Analysis (Week 3-4)
- [ ] On-Page SEO task implementation
- [ ] Performance analysis task (PageSpeed API)
- [ ] Usability checks task
- [ ] Screenshot capture (mobile/desktop)
- [ ] Basic report page UI

### Phase 3: Extended Analysis (Week 5-6)
- [ ] Links analysis task
- [ ] Social presence task
- [ ] Technology detection task
- [ ] DNS and email security checks
- [ ] Recommendation engine

### Phase 4: Polish & Features (Week 7-8)
- [ ] User authentication
- [ ] Dashboard for saved reports
- [ ] PDF export functionality
- [ ] Caching layer optimization
- [ ] Rate limiting
- [ ] Error handling improvements

### Phase 5: Advanced Features (Week 9+)
- [ ] White-label customization
- [ ] Webhook notifications
- [ ] API access for external use
- [ ] Competitor comparison
- [ ] Historical tracking
- [ ] Keyword ranking integration

---

## Cost Estimates (Monthly)

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Vercel | 100GB bandwidth | $0 - $20 |
| Trigger.dev | 50K runs | $0 - $25 |
| Supabase | 500MB DB, 1GB storage | $0 - $25 |
| Upstash Redis | 10K commands/day | $0 |
| Google PageSpeed API | 25K queries/day | $0 |
| Total (Starting) | | $0 - $70/month |

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "@trigger.dev/sdk": "^3.0.0",
    "playwright": "^1.40.0",
    "cheerio": "^1.0.0-rc.12",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "@supabase/supabase-js": "^2.38.0",
    "apexcharts": "^3.44.0",
    "react-apexcharts": "^1.4.1",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0"
  }
}
```

---

## Next Steps

1. **Initialize Project**: Create Next.js app with TypeScript
2. **Setup Trigger.dev**: Install and configure Trigger.dev
3. **Database Setup**: Configure Prisma with PostgreSQL
4. **Build Core Components**: Score rings, check items, report layout
5. **Implement First Task**: Start with On-Page SEO analysis
6. **Iterate**: Add remaining analysis tasks one by one

---

*Document Version: 1.0*
*Created: January 2026*
