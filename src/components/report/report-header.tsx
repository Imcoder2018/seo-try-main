import { ScoreRing } from "./score-ring";
import { getGradeColor } from "@/lib/utils";
import { Globe, Calendar, TrendingUp, TrendingDown, Minus, Award, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ReportHeaderProps {
  domain: string;
  score: number;
  grade: string;
  createdAt: string;
  pagesScanned?: number;
  crawlType?: string;
}

export function ReportHeader({ domain, score, grade, createdAt, pagesScanned, crawlType }: ReportHeaderProps) {
  const gradeColor = getGradeColor(grade);
  const { message, icon: StatusIcon, bgClass, borderClass } = getScoreInfo(score);

  return (
    <div className={`relative overflow-hidden rounded-2xl mb-8 ${bgClass} ${borderClass} border-2`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-24 -mb-24" />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Ring */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
            <ScoreRing score={score} grade={grade} size="lg" />
          </div>
          
          {/* Info Section */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">SEO Audit Report</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-slate-100">
              {domain}
            </h1>
            
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <StatusIcon className={`w-6 h-6 ${gradeColor}`} />
              <p className={`text-xl font-semibold ${gradeColor}`}>{message}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>{new Date(createdAt).toLocaleString()}</span>
              </div>
              {crawlType && (
                <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span>{crawlType} Audit</span>
                </div>
              )}
              {pagesScanned && pagesScanned > 1 && (
                <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                  <Award className="w-4 h-4" />
                  <span>{pagesScanned} pages analyzed</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex-shrink-0 hidden xl:block">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
                  {score}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Overall Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function getScoreInfo(score: number): { message: string; icon: typeof CheckCircle2; bgClass: string; borderClass: string } {
  if (score >= 90) return { 
    message: "Excellent! Your site is well optimized", 
    icon: CheckCircle2,
    bgClass: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    borderClass: "border-green-200 dark:border-green-800"
  };
  if (score >= 80) return { 
    message: "Very good! Minor improvements possible", 
    icon: CheckCircle2,
    bgClass: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    borderClass: "border-blue-200 dark:border-blue-800"
  };
  if (score >= 70) return { 
    message: "Good foundation with room to improve", 
    icon: TrendingUp,
    bgClass: "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30",
    borderClass: "border-sky-200 dark:border-sky-800"
  };
  if (score >= 60) return { 
    message: "Needs improvement in several areas", 
    icon: Minus,
    bgClass: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
    borderClass: "border-amber-200 dark:border-amber-800"
  };
  if (score >= 50) return { 
    message: "Significant work needed", 
    icon: TrendingDown,
    bgClass: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
    borderClass: "border-orange-200 dark:border-orange-800"
  };
  return { 
    message: "Critical issues require immediate attention", 
    icon: AlertTriangle,
    bgClass: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
    borderClass: "border-red-200 dark:border-red-800"
  };
}
