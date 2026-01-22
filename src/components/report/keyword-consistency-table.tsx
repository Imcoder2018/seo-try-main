"use client";

import { Check, X } from "lucide-react";

interface Keyword {
  keyword: string;
  frequency: number;
  inTitle: boolean;
  inMeta: boolean;
  inHeaders: boolean;
}

interface KeywordConsistencyTableProps {
  keywords: Keyword[];
}

export function KeywordConsistencyTable({ keywords }: KeywordConsistencyTableProps) {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No keywords detected on this page.
      </div>
    );
  }

  const maxFreq = Math.max(...keywords.map(k => k.frequency));

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-medium">Keyword</th>
              <th className="text-center py-2 px-3 font-medium">Title</th>
              <th className="text-center py-2 px-3 font-medium">Meta Desc</th>
              <th className="text-center py-2 px-3 font-medium">Headers</th>
              <th className="text-center py-2 px-3 font-medium">Frequency</th>
              <th className="py-2 px-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, index) => (
              <tr key={index} className="border-b border-dashed">
                <td className="py-2 px-3 font-medium">{kw.keyword}</td>
                <td className="py-2 px-3 text-center">
                  {kw.inTitle ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  {kw.inMeta ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  {kw.inHeaders ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  )}
                </td>
                <td className="py-2 px-3 text-center">{kw.frequency}</td>
                <td className="py-2 px-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(kw.frequency / maxFreq) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Keywords should appear in your title, meta description, and header tags for better SEO consistency.
      </div>
    </div>
  );
}
