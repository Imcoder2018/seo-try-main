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

export interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  checkId: string;
}

export interface Audit {
  id: string;
  url: string;
  domain: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  overallScore: number | null;
  overallGrade: string | null;
  seoScore: number | null;
  linksScore: number | null;
  usabilityScore: number | null;
  performanceScore: number | null;
  socialScore: number | null;
  seoResults: CategoryScore | null;
  linksResults: CategoryScore | null;
  usabilityResults: CategoryScore | null;
  performanceResults: CategoryScore | null;
  socialResults: CategoryScore | null;
  technologyResults: CategoryScore | null;
  recommendations: Recommendation[];
  desktopScreenshot: string | null;
  mobileScreenshot: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export type AuditStatus = Audit["status"];
export type Priority = Recommendation["priority"];
