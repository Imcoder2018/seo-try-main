import { task } from "@trigger.dev/sdk";
import { onPageSeoTask } from "./on-page-seo";
import { performanceTask } from "./performance";
import { usabilityTask } from "./usability";
import { linksAnalysisTask } from "./links-analysis";
import { socialTask } from "./social";
import { technologyTask } from "./technology";
import {
  calculateOverallScore,
  generateRecommendations,
  type CategoryScore,
} from "../../src/lib/scoring";
import { calculateGrade } from "../../src/lib/utils";

export const auditOrchestratorTask = task({
  id: "audit-orchestrator",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: { auditId: string; url: string }) => {
    const { auditId, url } = payload;

    console.log(`Starting audit for ${url} (ID: ${auditId})`);

    const [
      seoResult,
      performanceResult,
      usabilityResult,
      linksResult,
      socialResult,
      technologyResult,
    ] = await Promise.all([
      onPageSeoTask.triggerAndWait({ url, auditId }),
      performanceTask.triggerAndWait({ url, auditId }),
      usabilityTask.triggerAndWait({ url, auditId }),
      linksAnalysisTask.triggerAndWait({ url, auditId }),
      socialTask.triggerAndWait({ url, auditId }),
      technologyTask.triggerAndWait({ url, auditId }),
    ]);

    const categories: Record<string, CategoryScore> = {
      seo: seoResult.ok ? seoResult.output : { score: 0, grade: "F", checks: [] },
      performance: performanceResult.ok ? performanceResult.output : { score: 0, grade: "F", checks: [] },
      usability: usabilityResult.ok ? usabilityResult.output : { score: 0, grade: "F", checks: [] },
      links: linksResult.ok ? linksResult.output : { score: 0, grade: "F", checks: [] },
      social: socialResult.ok ? socialResult.output : { score: 0, grade: "F", checks: [] },
      technology: technologyResult.ok ? technologyResult.output : { score: 0, grade: "F", checks: [] },
    };

    const overallScore = calculateOverallScore(categories);
    const overallGrade = calculateGrade(overallScore);
    const recommendations = generateRecommendations(categories);

    console.log(`Audit complete: ${overallGrade} (${overallScore})`);

    return {
      auditId,
      url,
      overallScore,
      overallGrade,
      categories,
      recommendations,
    };
  },
});
