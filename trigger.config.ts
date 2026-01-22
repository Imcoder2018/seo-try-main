import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_sohcjhizonykwufjyryn",
  maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./trigger"],
  build: {
    external: ["cheerio", "playwright"],
  },
});
