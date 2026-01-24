import { runs, configure } from "@trigger.dev/sdk/v3";

/**
 * Downloads data from a presigned URL if the output is offloaded.
 * IMPORTANT: Must use secret key, not public token, to access output/payload.
 * Public tokens omit these fields for security.
 */
export async function getRunOutput(runId: string): Promise<any> {
  // Always use secret key for retrieving output (public tokens don't include output)
  if (process.env.TRIGGER_SECRET_KEY) {
    configure({ secretKey: process.env.TRIGGER_SECRET_KEY });
  }
  
  console.log(`[getRunOutput] Retrieving run ${runId}`);
  const run = await runs.retrieve(runId);
  
  console.log(`[getRunOutput] Run status: ${run.status}`);
  console.log(`[getRunOutput] Has output: ${!!run.output}`);
  console.log(`[getRunOutput] Has outputPresignedUrl: ${!!(run as any).outputPresignedUrl}`);

  // If output is offloaded to object storage, download it from the presigned URL
  if ((run as any).outputPresignedUrl) {
    console.log(`[getRunOutput] Downloading offloaded output from presigned URL...`);
    const response = await fetch((run as any).outputPresignedUrl);
    if (!response.ok) {
      console.error(`[getRunOutput] Failed to download: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to download offloaded output: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`[getRunOutput] Successfully downloaded offloaded output`);
    return data;
  }

  // Otherwise return the output directly
  if (!run.output) {
    console.warn(`[getRunOutput] No output found for run ${runId}. This may happen if using a public token.`);
  }
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
