export interface CheckResult {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail" | "info";
  score: number;
  weight: number;
  value?: unknown;
  message: string;
  recommendation?: string;
}

export interface CategoryScore {
  score: number;
  grade: string;
  checks: CheckResult[];
  message?: string;
}

export const CATEGORY_WEIGHTS = {
  seo: 0.25,
  links: 0.2,
  usability: 0.2,
  performance: 0.2,
  social: 0.1,
  technology: 0.05,
} as const;

export function calculateCategoryScore(checks: CheckResult[]): number {
  if (checks.length === 0) return 0;

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  return Math.round(weightedScore / totalWeight);
}

export function calculateOverallScore(
  categories: Record<string, CategoryScore>
): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [category, data] of Object.entries(categories)) {
    const weight = CATEGORY_WEIGHTS[category as keyof typeof CATEGORY_WEIGHTS] || 0;
    if (weight > 0 && data) {
      totalWeightedScore += data.score * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round(totalWeightedScore / totalWeight);
}

export function getCategoryMessage(category: string, score: number): string {
  const messages: Record<string, Record<string, string>> = {
    seo: {
      excellent: "Your On-Page SEO is excellent!",
      good: "Your On-Page SEO is very good!",
      average: "Your On-Page SEO could be improved.",
      poor: "Your On-Page SEO needs significant improvement.",
    },
    links: {
      excellent: "Your link profile is excellent!",
      good: "Your link profile is good.",
      average: "Your link profile could be stronger.",
      poor: "You need to build more quality backlinks.",
    },
    usability: {
      excellent: "Your usability is excellent!",
      good: "Your usability is good.",
      average: "Your usability could be better.",
      poor: "Your usability needs improvement.",
    },
    performance: {
      excellent: "Your performance is excellent!",
      good: "Your performance is good.",
      average: "Your performance could be improved.",
      poor: "Your performance needs significant improvement.",
    },
    social: {
      excellent: "Your social presence is excellent!",
      good: "Your social presence is good.",
      average: "Your social presence could be stronger.",
      poor: "Your social needs improvement.",
    },
  };

  const level =
    score >= 90
      ? "excellent"
      : score >= 70
        ? "good"
        : score >= 50
          ? "average"
          : "poor";

  return messages[category]?.[level] || "Analysis complete.";
}

export function generateRecommendations(
  categories: Record<string, CategoryScore>
): Array<{
  title: string;
  description: string | null;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  checkId: string;
}> {
  const recommendations: Array<{
    title: string;
    description: string | null;
    category: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    checkId: string;
  }> = [];

  const categoryNames: Record<string, string> = {
    seo: "On-Page SEO",
    links: "Links",
    usability: "Usability",
    performance: "Performance",
    social: "Social",
    technology: "Other",
  };

  for (const [category, data] of Object.entries(categories)) {
    if (!data?.checks) continue;

    for (const check of data.checks) {
      if (check.recommendation && (check.status === "fail" || check.status === "warning")) {
        const priority =
          check.status === "fail" && check.weight >= 10
            ? "HIGH"
            : check.status === "fail"
              ? "MEDIUM"
              : "LOW";

        recommendations.push({
          title: check.recommendation,
          description: check.message,
          category: categoryNames[category] || category,
          priority,
          checkId: check.id,
        });
      }
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
