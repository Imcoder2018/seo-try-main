# Handling Offloaded Outputs in Trigger.dev

## Overview

When task outputs exceed 512KB, Trigger.dev automatically offloads them to object storage and provides a presigned URL for downloading. This document explains how the website handles these offloaded outputs.

## The Problem

Previously, API routes were directly accessing `run.output` from Trigger.dev, which would fail for large outputs that were offloaded to object storage.

## The Solution

### Utility Function

Created `@/lib/trigger-utils.ts` with two helper functions:

```typescript
import { runs } from "@trigger.dev/sdk/v3";

/**
 * Downloads data from a presigned URL if the output is offloaded
 */
export async function getRunOutput(runId: string): Promise<any> {
  const run = await runs.retrieve(runId);

  // If output is offloaded, download it from the presigned URL
  if ((run as any).outputPresignedUrl) {
    const response = await fetch((run as any).outputPresignedUrl);
    if (!response.ok) {
      throw new Error(`Failed to download offloaded output: ${response.statusText}`);
    }
    return await response.json();
  }

  // Otherwise return the output directly
  return run.output;
}

/**
 * Downloads data from a presigned URL if the payload is offloaded
 */
export async function getRunPayload(runId: string): Promise<any> {
  const run = await runs.retrieve(runId);

  // If payload is offloaded, download it from the presigned URL
  if ((run as any).payloadPresignedUrl) {
    const response = await fetch((run as any).payloadPresignedUrl);
    if (!response.ok) {
      throw new Error(`Failed to download offloaded payload: ${response.statusText}`);
    }
    return await response.json();
  }

  // Otherwise return the payload directly
  return run.payload;
}
```

### Updated API Routes

All API routes that retrieve run outputs have been updated to use `getRunOutput()`:

1. **`/api/content/analyze`** - Content extraction and analysis results
2. **`/api/crawl/status`** - Site crawl status and results
3. **`/api/crawl`** - Crawl task results
4. **`/api/site-audit`** - Site-wide audit results
5. **`/api/ai-strategy`** - AI strategy generation results
6. **`/api/audit`** - Smart audit results

### Example Usage

Before:
```typescript
const run = await runs.retrieve(taskId);
const output = run.output; // ❌ Fails for large outputs
```

After:
```typescript
import { getRunOutput } from "@/lib/trigger-utils";

const output = await getRunOutput(taskId); // ✅ Handles both small and large outputs
```

## How It Works

1. **Small Outputs (< 512KB):** The function retrieves the run and returns the output directly from the database.

2. **Large Outputs (≥ 512KB):** The function checks for `outputPresignedUrl` in the run object. If present, it downloads the data from the presigned URL and returns the parsed JSON.

3. **Error Handling:** If the download fails, the function throws an error with details about the failure.

## Benefits

- **Transparent Handling:** The API routes don't need to know whether the output is offloaded or not.
- **Automatic Fallback:** Works seamlessly for both small and large outputs.
- **Error Handling:** Provides clear error messages if download fails.
- **No Code Changes Required:** Frontend code continues to work without modifications.

## Trigger.dev Limits

- **Single trigger payload:** Must not exceed 3MB
- **Batch trigger payload:** Each item can be up to 3MB
- **Task outputs:** Must not exceed 10MB
- **Offload threshold:** 512KB (payloads and outputs exceeding this are offloaded)

## Testing

To test the implementation:

1. Trigger a task that produces a large output (> 512KB)
2. Poll the API endpoint for results
3. The output should be returned correctly regardless of size

Example:
```bash
# Trigger content extraction with many pages
curl -X POST http://localhost:3000/api/content/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://example.com",
    "pages": [...], # Many pages to generate large output
    "maxPages": 50
  }'

# Poll for results
curl http://localhost:3000/api/content/analyze?extractionRunId=xxx&analysisRunId=yyy
```

## Future Improvements

- Add caching for frequently accessed offloaded outputs
- Implement retry logic for failed downloads
- Add logging for monitoring offloaded output usage
- Consider streaming very large outputs instead of loading into memory
