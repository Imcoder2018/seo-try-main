import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 60) return "D";
  return "F";
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-score-excellent";
  if (grade.startsWith("B")) return "text-score-good";
  if (grade.startsWith("C")) return "text-score-average";
  return "text-score-poor";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "#17c653";
  if (score >= 70) return "#1b84ff";
  if (score >= 50) return "#f6c000";
  return "#f8285a";
}

export function formatDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
