import { ScoreRing } from "./score-ring";
import { calculateGrade } from "@/lib/utils";

interface CategoryScoresProps {
  localSeoScore?: number;
  seoScore: number;
  linksScore: number;
  usabilityScore: number;
  performanceScore: number;
  socialScore: number;
  contentScore?: number;
  eeatScore?: number;
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
}: CategoryScoresProps) {
  const categories = [
    ...(localSeoScore !== undefined ? [{ label: "Local SEO", score: localSeoScore, href: "#local-seo" }] : []),
    { label: "On-Page SEO", score: seoScore, href: "#seo" },
    { label: "Links", score: linksScore, href: "#links" },
    { label: "Usability", score: usabilityScore, href: "#usability" },
    { label: "Performance", score: performanceScore, href: "#performance" },
    { label: "Social", score: socialScore, href: "#social" },
    ...(contentScore !== undefined ? [{ label: "Content", score: contentScore, href: "#content" }] : []),
    ...(eeatScore !== undefined ? [{ label: "E-E-A-T", score: eeatScore, href: "#eeat" }] : []),
  ];

  return (
    <div className="bg-card border rounded-xl p-8 mb-8">
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {categories.map((cat) => (
          <a key={cat.label} href={cat.href} className="hover:opacity-80 transition-opacity">
            <ScoreRing
              score={cat.score}
              grade={calculateGrade(cat.score)}
              size="sm"
              label={cat.label}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
