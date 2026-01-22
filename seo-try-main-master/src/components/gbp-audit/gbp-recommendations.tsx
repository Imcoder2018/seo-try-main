"use client";

import { AlertCircle } from "lucide-react";

interface GBPRecommendationsProps {
  id: string;
  recommendations: string[];
}

export function GBPRecommendations({ id, recommendations }: GBPRecommendationsProps) {
  return (
    <div className="bg-muted/50 rounded-xl p-8 mb-8" id={id}>
      <h2 className="text-2xl font-bold mb-6 text-center">Recommendations</h2>
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="bg-card border rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
