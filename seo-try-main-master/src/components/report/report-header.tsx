import { ScoreRing } from "./score-ring";
import { getGradeColor } from "@/lib/utils";

interface ReportHeaderProps {
  domain: string;
  score: number;
  grade: string;
  createdAt: string;
}

export function ReportHeader({ domain, score, grade, createdAt }: ReportHeaderProps) {
  const gradeColor = getGradeColor(grade);
  const message = getScoreMessage(score);

  return (
    <div className="bg-card border rounded-xl p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <ScoreRing score={score} grade={grade} size="lg" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold mb-2">
            Audit Results for {domain}
          </h1>
          <p className={`text-xl font-semibold ${gradeColor}`}>{message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Report Generated: {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function getScoreMessage(score: number): string {
  if (score >= 90) return "Your page is excellent!";
  if (score >= 80) return "Your page is very good!";
  if (score >= 70) return "Your page is good";
  if (score >= 60) return "Your page could be better";
  if (score >= 50) return "Your page needs improvement";
  return "Your page needs significant improvement";
}
