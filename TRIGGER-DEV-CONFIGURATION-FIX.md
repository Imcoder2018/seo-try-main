# Trigger.dev Configuration Fix - Permanent Solution

## Problem

The application was experiencing intermittent `Unauthorized` errors when trying to trigger Trigger.dev tasks:

```
Error: Unauthorized: Public Access Token is missing required permissions. 
Token has the following permissions: 'read:runs:run_xxxxx'
```

## Root Cause

Vercel serverless functions reuse **warm module instances** between requests. The Trigger.dev SDK v3 uses a **global `configure()` function** that persists across requests.

### The Issue Flow:

1. **GET request** runs → Configures SDK with **public token** (read-only for polling)
2. **POST request** runs later in the same warm instance → Inherits the **public token**
3. POST tries to trigger tasks → **Fails** because public token lacks permissions

This caused **intermittent failures**:
- ✅ Cold function → Works (fresh config)
- ❌ Warm function after GET → Fails (public token leaked)
- ✅ Warm function after POST → Works (secret key configured)

## The Fix

### Key Insight from Trigger.dev Documentation

From the Trigger.dev docs:
> "To automatically configure the SDK with your secret key, you can set the TRIGGER_SECRET_KEY environment variable. The SDK will automatically use this value when calling API methods (like trigger)."

**Critical Discovery**: Calling `configure()` inside handlers causes conflicts in warm serverless functions. The SDK must be configured **once at module level**, never inside handlers.

### The Fix Pattern

Configure SDK at module level, never inside handlers:

```typescript
import { configure } from "@trigger.dev/sdk/v3";

// CRITICAL: Configure SDK with secret key at module level
// The SDK will automatically use TRIGGER_SECRET_KEY if set, but we configure explicitly
// Do NOT call configure() inside handlers as it causes conflicts in warm serverless functions
if (process.env.TRIGGER_SECRET_KEY) {
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
}

export async function POST(request: NextRequest) {
  try {
    // SDK is already configured at module level
    // Do NOT call configure() here
    const handle = await tasks.trigger(/* ... */);
    
  } catch (error) {
    // Handle error
  }
}

export async function GET(request: NextRequest) {
  try {
    // SDK is already configured at module level with secret key
    // Use secret key for all operations, including polling
    const run = await runs.retrieve(runId);
    
  } catch (error) {
    // Handle error
  }
}
```

### Files Modified

All API routes now configure SDK at module level:

1. `/src/app/api/crawl/route.ts`
2. `/src/app/api/content/analyze/route.ts`
3. `/src/app/api/ai-strategy/route.ts`
4. `/src/app/api/audit/route.ts`
5. `/src/app/api/site-audit/route.ts`

### What Changed

**Before (WRONG):**
```typescript
export async function POST(request: NextRequest) {
  // ❌ Calling configure() inside handler causes conflicts
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
  const handle = await tasks.trigger(/* ... */);
}

export async function GET(request: NextRequest) {
  // ❌ Calling configure() inside handler causes conflicts
  configure({ accessToken: publicToken });
  const run = await runs.retrieve(runId);
}
```

**After (CORRECT):**
```typescript
// ✅ Configure once at module level
if (process.env.TRIGGER_SECRET_KEY) {
  configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
}

export async function POST(request: NextRequest) {
  // ✅ SDK already configured, no configure() call needed
  const handle = await tasks.trigger(/* ... */);
}

export async function GET(request: NextRequest) {
  // ✅ SDK already configured with secret key
  // Use secret key for all operations (not public token)
  const run = await runs.retrieve(runId);
}
```

## Why This Works

1. **Module-Level Configuration**: SDK is configured once when the module loads, before any requests
2. **No Handler-Level configure()**: Never call `configure()` inside request handlers
3. **Consistent Authentication**: All requests use the same secret key configuration
4. **No Leakage**: Public tokens are only created for frontend polling, never used to configure the SDK

## Required Environment Variables

Ensure these are set in **Vercel → Settings → Environment Variables**:

- `TRIGGER_SECRET_KEY` - Your Trigger.dev secret key (starts with `tr_dev_` or `tr_prod_`)
- `OPENAI_API_KEY` - Your OpenAI API key (starts with `sk-`)

Both must be set for **Production** environment.

## Deployment Checklist

After making changes:

1. ✅ Add and commit changes
2. ✅ Push to Git
3. ✅ Wait for Vercel deployment to complete
4. ✅ Test crawl and analysis features
5. ✅ Check Vercel logs for any errors

## Debug Logging

The fix includes logging to verify correct behavior:

### POST Handler Logs:
```
[Route POST] Starting request
[Route POST] Triggering task...
[Route POST] Task triggered successfully. runId: run_xxxxx
```

### GET Handler Logs:
```
[Route GET] Starting request
[Route GET] Retrieving run...
[Route GET] Run retrieved. Status: COMPLETED
```

If you see these logs, the fix is working correctly.

## Common Issues

### Issue: "TRIGGER_SECRET_KEY is not configured"

**Cause**: Environment variable not set in Vercel

**Fix**: Go to Vercel Dashboard → Settings → Environment Variables → Add `TRIGGER_SECRET_KEY`

### Issue: Still getting Unauthorized errors after deployment

**Cause**: Vercel cached old function instance

**Fix**: 
1. Go to Vercel Dashboard → Deployments
2. Click "⋯" on latest deployment → "Redeploy"
3. Wait 2-3 minutes for deployment
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: Intermittent failures

**Cause**: configure() is still being called inside handlers

**Fix**: Ensure all `configure()` calls are at module level, not inside handlers

## Summary

This fix ensures that the SDK is configured **once at module level** with the secret key, and never reconfigured inside request handlers. This prevents public token leakage from GET requests and ensures all SDK operations use the correct authentication.

The fix is:
- ✅ **Permanent**: Works across all warm/cold function instances
- ✅ **Explicit**: Configure once at module level, never inside handlers
- ✅ **Logged**: Debug logs verify correct behavior
- ✅ **Tested**: Verified to work in production

## Date Implemented

January 20, 2026

## Related Files

- `/src/app/api/crawl/route.ts`
- `/src/app/api/content/analyze/route.ts`
- `/src/app/api/ai-strategy/route.ts`
- `/src/app/api/audit/route.ts`
- `/src/app/api/site-audit/route.ts`
- `/src/lib/trigger-utils.ts`
