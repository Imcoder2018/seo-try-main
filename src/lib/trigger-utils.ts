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
