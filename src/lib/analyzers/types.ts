export interface Check {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail" | "info";
  score: number;
  weight: number;
  value: Record<string, unknown>;
  message: string;
  recommendation?: string;
}

export interface CategoryResult {
  score: number;
  grade: string;
  message: string;
  checks: Check[];
}

export interface AnalysisResult {
  seo: CategoryResult;
  links: CategoryResult;
  usability: CategoryResult;
  performance: CategoryResult;
  social: CategoryResult;
  technology: CategoryResult;
  content: CategoryResult;
  eeat: CategoryResult;
  localSeo: CategoryResult;
  technicalSeo: CategoryResult;
  overallScore: number;
  overallGrade: string;
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  checkId: string;
}

export interface PageData {
  url: string;
  html: string;
  headers: Record<string, string>;
  responseTime: number;
  statusCode: number;
  contentLength: number;
  isHttps: boolean;
}
