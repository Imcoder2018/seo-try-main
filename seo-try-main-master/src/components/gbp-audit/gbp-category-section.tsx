"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckItem {
  id: string;
  name: string;
  status: "pass" | "fail";
  message: string;
  value?: string;
  workHours?: Record<string, string>;
}

interface GBPCategorySectionProps {
  id: string;
  title: string;
  checks: CheckItem[];
}

export function GBPCategorySection({ id, title, checks }: GBPCategorySectionProps) {
  return (
    <div className="mb-8" id={id}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => (
          <div
            key={check.id}
            className={cn(
              "bg-card border rounded-xl p-6 flex gap-4",
              check.status === "pass" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
            )}
          >
            <div className="flex-1">
              <h4 className="font-semibold mb-2">{check.name}</h4>
              <p className="text-sm text-muted-foreground">{check.message}</p>
              {check.value && (
                <p className="text-sm font-medium mt-2 text-primary">{check.value}</p>
              )}
              {check.workHours && (
                <ul className="mt-3 text-sm space-y-1">
                  {Object.entries(check.workHours).map(([day, hours]) => (
                    <li key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex-shrink-0">
              {check.status === "pass" ? (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
