import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  checkId: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  const getPriorityBadge = (priority: string) => {
    const styles = {
      HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      LOW: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return styles[priority as keyof typeof styles] || styles.LOW;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      HIGH: "High Priority",
      MEDIUM: "Medium Priority",
      LOW: "Low Priority",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  return (
    <div className="bg-card border rounded-xl p-8 mb-8" id="recommendations">
      <h2 className="text-xl font-bold mb-6">Recommendations</h2>
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <a
            key={rec.id}
            href={`#${rec.checkId}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
          >
            <div className="flex-1">
              <h3 className="font-medium">{rec.title}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded">
                {rec.category}
              </span>
              <span
                className={cn(
                  "text-sm px-2 py-1 rounded font-medium",
                  getPriorityBadge(rec.priority)
                )}
              >
                {getPriorityLabel(rec.priority)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
