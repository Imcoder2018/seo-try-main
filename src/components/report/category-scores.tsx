import { ScoreRing } from "./score-ring";
import { calculateGrade } from "@/lib/utils";
import { MapPin, Search, Link2, Users, Zap, Share2, FileText, Award, Settings, Shield } from "lucide-react";

interface CategoryScoresProps {
  localSeoScore?: number;
  seoScore: number;
  linksScore: number;
  usabilityScore: number;
  performanceScore: number;
  socialScore: number;
  contentScore?: number;
  eeatScore?: number;
  technicalSeoScore?: number;
}

const categoryIcons: Record<string, typeof Search> = {
  "Local SEO": MapPin,
  "On-Page SEO": Search,
  "Technical SEO": Shield,
  "Links": Link2,
  "Usability": Users,
  "Performance": Zap,
  "Social": Share2,
  "Content": FileText,
  "E-E-A-T": Award,
};

const categoryColors: Record<string, string> = {
  "Local SEO": "from-purple-500 to-indigo-500",
  "On-Page SEO": "from-blue-500 to-cyan-500",
  "Technical SEO": "from-slate-600 to-slate-800",
  "Links": "from-green-500 to-emerald-500",
  "Usability": "from-amber-500 to-orange-500",
  "Performance": "from-yellow-500 to-amber-500",
  "Social": "from-pink-500 to-rose-500",
  "Content": "from-indigo-500 to-purple-500",
  "E-E-A-T": "from-teal-500 to-cyan-500",
};

export function CategoryScores({
  localSeoScore,
  seoScore,
  linksScore,
  usabilityScore,
  performanceScore,
  socialScore,
  contentScore,
  eeatScore,
  technicalSeoScore,
}: CategoryScoresProps) {
  const categories = [
    ...(localSeoScore !== undefined ? [{ label: "Local SEO", score: localSeoScore, href: "#local-seo" }] : []),
    { label: "On-Page SEO", score: seoScore, href: "#seo" },
    ...(technicalSeoScore !== undefined ? [{ label: "Technical SEO", score: technicalSeoScore, href: "#technical-seo" }] : []),
    { label: "Links", score: linksScore, href: "#links" },
    { label: "Usability", score: usabilityScore, href: "#usability" },
    { label: "Performance", score: performanceScore, href: "#performance" },
    { label: "Social", score: socialScore, href: "#social" },
    ...(contentScore !== undefined ? [{ label: "Content", score: contentScore, href: "#content" }] : []),
    ...(eeatScore !== undefined ? [{ label: "E-E-A-T", score: eeatScore, href: "#eeat" }] : []),
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-8 shadow-lg">
      <h2 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
        Category Scores
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.label] || Search;
          const gradient = categoryColors[cat.label] || "from-blue-500 to-cyan-500";
          const grade = calculateGrade(cat.score);
          
          return (
            <a 
              key={cat.label} 
              href={cat.href} 
              className="group relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
            >
              {/* Icon badge */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              
              {/* Score ring */}
              <div className="mt-4 flex justify-center">
                <ScoreRing
                  score={cat.score}
                  grade={grade}
                  size="sm"
                />
              </div>
              
              {/* Label */}
              <p className="mt-3 text-xs font-medium text-center text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                {cat.label}
              </p>
              
              {/* Score badge */}
              <div className="mt-2 text-center">
                <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${
                  cat.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  cat.score >= 60 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  cat.score >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {cat.score}/100
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
