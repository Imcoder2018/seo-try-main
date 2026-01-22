# Environment Variables for SEO Audit Tool

## Required for Basic Functionality

### Database
- `DATABASE_URL` - PostgreSQL connection string for Prisma
  - Format: `postgresql://username:password@host:5432/database`

### Google PageSpeed Insights
- `PAGESPEED_API_KEY` - Your Google API key
  - Get from: https://developers.google.com/speed/docs/insights/v5/get-started
  - Used for: Core Web Vitals (LCP, CLS, FCP, TBT, Speed Index)

## Required for Premium Features

### Trigger.dev (Background Jobs)
- `TRIGGER_SECRET_KEY` - Your Trigger.dev secret key (starts with `tr_dev_` or `tr_prod_`)
- `TRIGGER_PROJECT_ID` - Your project ID (starts with `proj_`)
  - Get from: https://cloud.trigger.dev
  - Used for: Site-wide crawling, AI ranking strategies

### OpenAI (AI Features)
- `OPENAI_API_KEY` - Your OpenAI API key (starts with `sk-`)
  - Get from: https://platform.openai.com/api-keys
  - Used for: AI Multi-Agent Ranking Strategy generation, Voice AI Summary (TTS)

## Optional Integrations

### Moz API (Backlink Analysis - Currently Disabled)
- `MOZ_ACCESS_ID` - Moz access ID
- `MOZ_SECRET_KEY` - Moz secret key
  - Get from: https://moz.com/products/api
  - Note: Backlink section is currently hidden from UI

### Supabase (Alternative Database)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
  - Optional if using Supabase instead of direct PostgreSQL

## Vercel Deployment

Add these in Vercel Dashboard - Project - Settings - Environment Variables:

1. `DATABASE_URL` - Required
2. `PAGESPEED_API_KEY` - Required for Core Web Vitals
3. `TRIGGER_SECRET_KEY` - Required for background jobs
4. `OPENAI_API_KEY` - Required for AI features (Voice Summary, AI Strategy)

## Testing Trigger.dev Jobs

### In Browser Console
Open developer tools (F12) and check:

```javascript
// After running an audit, check sessionStorage
console.log(JSON.parse(sessionStorage.getItem('audit_' + auditId)));

// For site-wide audit status
fetch('/api/site-audit?taskId=YOUR_TASK_ID')
  .then(r => r.json())
  .then(console.log);

// For AI strategy status
fetch('/api/ai-strategy?taskId=YOUR_TASK_ID')
  .then(r => r.json())
  .then(console.log);
```

### Via Trigger.dev Dashboard
1. Go to https://cloud.trigger.dev
2. Select your project
3. View "Runs" tab for job status and logs

### Available Trigger.dev Tasks
| Task ID | Description | Endpoint |
|---------|-------------|----------|
| `site-crawler` | Basic site crawling | `/api/crawl` |
| `site-wide-audit` | Full SEO audit of all pages | `/api/site-audit` |
| `generate-ranking-strategy` | AI multi-agent strategy | `/api/ai-strategy` |

## Local Development

Create `.env.local` file with all the above variables.

Run Trigger.dev dev server:
```bash
npm run trigger:dev
```
