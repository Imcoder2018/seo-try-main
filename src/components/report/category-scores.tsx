import { calculateGrade } from "@/lib/utils";

interface CategoryScoresProps {
  // Legacy props (for backward compatibility)
  localSeoScore?: number;
  seoScore?: number;
  linksScore?: number;
  usabilityScore?: number;
  performanceScore?: number;
  socialScore?: number;
  contentScore?: number;
  eeatScore?: number;
  technicalSeoScore?: number;
  // New Big 5 merged categories
  mergedCategories?: {
    localSeo?: { score: number };
    onPageContent?: { score: number };
    technicalHealth?: { score: number };
    performanceSpeed?: { score: number };
    authorityTrust?: { score: number };
  };
}

// Grade color mapping for the circular rings
const getGradeColors = (grade: string): { ring: string; text: string; bg: string } => {
  if (grade.startsWith('A')) return { ring: '#ec4899', text: '#be185d', bg: 'rgba(236, 72, 153, 0.1)' }; // Pink
  if (grade.startsWith('B')) return { ring: '#22c55e', text: '#15803d', bg: 'rgba(34, 197, 94, 0.1)' }; // Green
  if (grade.startsWith('C')) return { ring: '#eab308', text: '#a16207', bg: 'rgba(234, 179, 8, 0.1)' }; // Yellow
  if (grade.startsWith('D')) return { ring: '#8b5cf6', text: '#6d28d9', bg: 'rgba(139, 92, 246, 0.1)' }; // Purple
  return { ring: '#22c55e', text: '#15803d', bg: 'rgba(34, 197, 94, 0.1)' }; // Default green for F
};

// Simple circular score ring component matching the screenshot style
function CategoryRing({ score, grade, label }: { score: number; grade: string; label: string }) {
  const colors = getGradeColors(grade);
  const size = 100;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.bg}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: colors.text }}>
            {grade}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
        {label}
      </p>
    </div>
  );
}

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
  mergedCategories,
}: CategoryScoresProps) {
  // Use Big 5 merged categories if available, otherwise fall back to legacy
  const useBig5 = mergedCategories && (
    mergedCategories.localSeo || 
    mergedCategories.onPageContent || 
    mergedCategories.technicalHealth || 
    mergedCategories.performanceSpeed || 
    mergedCategories.authorityTrust
  );

  const categories = useBig5 ? [
    // Big 5 Categories
    ...(mergedCategories?.localSeo ? [{ label: "Local SEO", score: mergedCategories.localSeo.score, href: "#local-seo" }] : []),
    ...(mergedCategories?.onPageContent ? [{ label: "On-Page & Content", score: mergedCategories.onPageContent.score, href: "#on-page-content" }] : []),
    ...(mergedCategories?.technicalHealth ? [{ label: "Technical Health", score: mergedCategories.technicalHealth.score, href: "#technical-health" }] : []),
    ...(mergedCategories?.performanceSpeed ? [{ label: "Performance", score: mergedCategories.performanceSpeed.score, href: "#performance" }] : []),
    ...(mergedCategories?.authorityTrust ? [{ label: "Authority & Trust", score: mergedCategories.authorityTrust.score, href: "#authority-trust" }] : []),
  ] : [
    // Legacy categories fallback
    ...(localSeoScore !== undefined ? [{ label: "Local SEO", score: localSeoScore, href: "#local-seo" }] : []),
    ...(seoScore !== undefined ? [{ label: "On-Page SEO", score: seoScore, href: "#seo" }] : []),
    ...(technicalSeoScore !== undefined ? [{ label: "Technical SEO", score: technicalSeoScore, href: "#technical-seo" }] : []),
    ...(linksScore !== undefined ? [{ label: "Links", score: linksScore, href: "#links" }] : []),
    ...(usabilityScore !== undefined ? [{ label: "Usability", score: usabilityScore, href: "#usability" }] : []),
    ...(performanceScore !== undefined ? [{ label: "Performance", score: performanceScore, href: "#performance" }] : []),
    ...(socialScore !== undefined ? [{ label: "Social", score: socialScore, href: "#social" }] : []),
    ...(contentScore !== undefined ? [{ label: "Content", score: contentScore, href: "#content" }] : []),
    ...(eeatScore !== undefined ? [{ label: "E-E-A-T", score: eeatScore, href: "#eeat" }] : []),
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-8">
      <h2 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100">
        Category Scores
      </h2>
      <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
        {categories.map((cat) => {
          const grade = calculateGrade(cat.score);
          
          return (
            <a 
              key={cat.label} 
              href={cat.href} 
              className="group transition-transform duration-200 hover:-translate-y-1"
            >
              <CategoryRing
                score={cat.score}
                grade={grade}
                label={cat.label}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
