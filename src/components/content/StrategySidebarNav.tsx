"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", shortLabel: "Overview", icon: "📊" },
  { id: "persona", label: "Target Persona", shortLabel: "Persona", icon: "👤" },
  { id: "keywords", label: "Keywords", shortLabel: "Keywords", icon: "🔑" },
  { id: "gaps", label: "Content Gaps", shortLabel: "Gaps", icon: "📝" },
  { id: "suggestions", label: "AI Suggestions", shortLabel: "AI", icon: "✨" },
  { id: "pages", label: "Analyzed Pages", shortLabel: "Pages", icon: "📄" },
];

export function StrategySidebarNav() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl shadow-lg py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-all duration-300 block",
                    "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400",
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm"
                      : "text-slate-600 dark:text-slate-400 font-medium text-xs"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span
                      className={cn(
                        "transition-all duration-300 whitespace-nowrap",
                        isActive ? "text-sm" : "text-xs"
                      )}
                    >
                      {isActive ? item.label : item.shortLabel}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
