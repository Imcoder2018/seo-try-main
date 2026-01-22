# Deep Crawl Fixes - January 16, 2026

## Problem
When choosing the "Deep Crawl" option, the loading appeared for 10 seconds and then vanished before completing. The crawler was running via trigger.dev but the the frontend polling wasn't working correctly, causing the appear to fail.

## Root Causes

1. **Vercel API Route Timeout**: The `GET /api/crawl` endpoint didn't have `maxDuration` set, causing Vercel to timeout after 10 seconds (default limit on some plans)

2. **Metadata Extraction Issue**: The run metadata wasn't being properly extracted from trigger.dev SDK responses, so frontend couldn't receive progress updates

3. **Public Token Not Being Used**: The polling endpoint wasn't passing the public token to authenticate with trigger.dev, causing `runs.retrieve()` to fail

4. **Frontend Polling Issues**: No error handling for failed API responses, no cache buster for requests, and no safety checks to prevent infinite polling

## Fixes Applied

### 1. Backend (`src/app/api/crawl/route.ts`)

```typescript
// Added to prevent Vercel timeout
export const dynamic = "force-dynamic";
export const maxDuration = 300; // Allow up to 5 minutes for the GET endpoint

// Fixed metadata extraction in GET endpoint
const metadata = run.metadata as any;
const statusData = metadata?.status || {};

// Added public token authentication
if (publicToken) {
  configure({ accessToken: publicToken });
}
```

### 2. Frontend (`src/components/audit/audit-form.tsx`)

```typescript
// Added cache buster to prevent stale responses
const response = await fetch(`/api/crawl?runId=${taskId}&publicToken=${publicToken}`, {
  cache: 'no-cache',
});

// Added error handling for failed responses
if (!response.ok) {
  const errorData = await response.json();
  console.error("Poll error response:", errorData);
  throw new Error(errorData.error || "Failed to fetch status");
}

// Added safety checks to prevent infinite polling
let pollAttempts = 0;
const maxPollAttempts = 150; // 5 minutes at 2 second intervals

if (pollAttempts > maxPollAttempts) {
  setError("Crawl is taking longer than expected. Please check back later.");
  setIsCrawling(false);
  return;
}

// Added handling for TIMED_OUT and EXPIRED status
} else if (data.status === "TIMED_OUT" || data.status === "EXPIRED") {
  setError("Crawl timed out. The website might be too large or blocking crawlers. Try the Quick Audit instead.");
  setIsCrawling(false);
}
```

## Deployments

### Trigger.dev (Production)
- Deployed: ✓
- Version: 20260116.2
- Status: Active
- URL: https://cloud.trigger.dev/orgs/meee-4d3b/projects/seo-audit-tool-_xjq

### Vercel
- Pushed to GitHub: ✓
- Commit: de883c2 ("Fix deep crawl polling and metadata handling")
- Branch: main
- Deployment: In progress (automatic on push)

## How to Test

### 1. Check Vercel Deployment
Wait for Vercel to complete deployment, then visit your Vercel dashboard to confirm latest deployment is successful.

### 2. Test Deep Crawl on Vercel
1. Open your deployed application on Vercel
2. Select "Deep Crawl" mode
3. Enter a website URL (e.g., kommentify.com)
4. Click "Analyze"

### 3. Verify Behavior
- **Loading State**: Should show progress UI with:
  - Progress bar updating periodically
  - Status text like "Crawling page X/50: https://example.com/..."
  - Pages found counter
- **No Timeout**: Should continue polling for up to 5 minutes
- **Completion**: When crawl finishes, should automatically start the comprehensive audit and redirect to results
- **Error Handling**: If crawl fails, should show error message instead of vanishing

### 4. Check Browser Console
Open browser developer console and look for:
- "Poll data:" messages showing the run status
- Any "Poll error response:" messages (would indicate issues)
- Any "Crawl warning:" messages (non-fatal issues)

### 5. Monitor Trigger.dev Dashboard
1. Go to: https://cloud.trigger.dev/orgs/meee-4d3b/projects/seo-audit-tool-_xjq/env/prod/runs
2. Look for `site-crawler` runs with version `20260116.2`
3. Verify:
  - Status progresses from QUEUED → EXECUTING → COMPLETED
  - Metadata shows progress updates during execution
  - Output contains the crawled pages data

## Expected Behavior After Fix

1. User clicks "Deep Crawl" → Frontend triggers `POST /api/crawl` → Returns `runId` and `publicToken`
2. Frontend starts polling `GET /api/crawl?runId=...&publicToken=...` every 2 seconds
3. Polling endpoint authenticates with trigger.dev using public token
4. Polling endpoint retrieves run status and metadata from trigger.dev
5. Frontend updates progress UI based on metadata (progress %, status label, pages found)
6. When run completes, frontend automatically triggers full audit with crawl data
7. Results redirect occurs

## Troubleshooting

### If Still Timing Out After 10 Seconds

1. **Check Vercel Plan Limits**:
   - Free plan: 10 seconds max duration
   - Pro plan: 60 seconds max duration
   - Our fix sets maxDuration to 300 (5 minutes), but Vercel plan may override

2. **Check Logs**:
   - Vercel Function Logs: Look for timeout errors
   - Browser Console: Look for "Poll data:" to see what's being returned

3. **Verify Trigger.dev Connection**:
   - Check that environment variables are set correctly
   - Ensure API keys have proper permissions

### If Progress Updates Don't Show

1. **Check Metadata**:
   - View run in trigger.dev dashboard
   - Look for "Metadata" section
   - Verify it contains `status` field with `progress`, `label`, `pagesFound`

2. **Check Public Token**:
   - Verify public token is being passed in the GET request
   - Check that it's not expired (1h TTL)

### If Crawl Vanishes Without Error

1. **Browser Console**: Check for JavaScript errors
2. **Network Tab**: Look for failed `/api/crawl` requests
3. **Run Status**: Check if trigger.dev run shows CRASHED or FAILED

## Technical Notes

### Vercel Timeout Limits
- Free tier: 10 seconds (can't override)
- Pro tier: Up to 60 seconds (can override with maxDuration config)
- Enterprise: Up to 300 seconds (can override with maxDuration config)

If you're on the free Vercel tier, the deep crawl will still work but you need to rely on trigger.dev for the long-running portion. The fix ensures the API route doesn't timeout while fetching run status.

### Trigger.dev Concurrency
- Production runs are queued and executed when resources are available
- Queue capacity: 10 million (prod)
- Concurrency limit: Based on your plan

## Files Modified

1. `src/app/api/crawl/route.ts` - Backend API endpoint for crawl triggering and polling
2. `src/components/audit/audit-form.tsx` - Frontend form with deep crawl UI and polling logic

## Next Steps

1. Monitor Vercel deployment completion
2. Test deep crawl on the deployed site
3. Monitor trigger.dev dashboard for site-crawler runs
4. Check that progress UI updates correctly
5. Verify comprehensive audit runs after crawl completes

## Contact

If issues persist:
1. Check Vercel deployment logs
2. Check trigger.dev run logs
3. Verify environment variables are correctly set
4. Review browser console for JavaScript errors
