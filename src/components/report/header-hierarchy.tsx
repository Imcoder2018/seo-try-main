"use client";

interface HeaderHierarchyProps {
  h1?: number;
  h2?: number;
  h3?: number;
  h4?: number;
  h5?: number;
  h6?: number;
  skippedLevels?: boolean;
  skippedLevelMessage?: string;
}

export function HeaderHierarchy({ h1 = 0, h2 = 0, h3 = 0, h4 = 0, h5 = 0, h6 = 0, skippedLevels, skippedLevelMessage }: HeaderHierarchyProps) {
  const headers = [
    { tag: "H1", count: h1 },
    { tag: "H2", count: h2 },
    { tag: "H3", count: h3 },
    { tag: "H4", count: h4 },
    { tag: "H5", count: h5 },
    { tag: "H6", count: h6 },
  ];

  const maxCount = Math.max(...headers.map(h => h.count), 1);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm max-w-md">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-medium w-20">Tag</th>
              <th className="text-center py-2 px-3 font-medium w-20">Count</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {headers.map((header) => (
              <tr key={header.tag} className="border-b border-dashed">
                <td className="py-2 px-3 font-mono font-medium">{header.tag}</td>
                <td className="py-2 px-3 text-center">{header.count}</td>
                <td className="py-2 px-3 w-32">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        header.tag === "H1" 
                          ? header.count === 1 ? "bg-green-500" : header.count > 1 ? "bg-yellow-500" : "bg-red-400"
                          : "bg-primary"
                      }`}
                      style={{ width: `${(header.count / maxCount) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {skippedLevels && skippedLevelMessage && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Fix It Tip</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                Your content jumps from a Major Heading (H2) directly to a tiny heading (H4). Change your H4 tags to H3 to maintain a logical outline for screen readers and Google.
              </p>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                <strong>Current:</strong> H1 → H2 → H4 (skipped H3)<br />
                <strong>Correct:</strong> H1 → H2 → H3 → H4
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
