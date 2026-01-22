"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
}

const navItems: NavItem[] = [
  { id: "results", label: "Results", shortLabel: "Results" },
  { id: "profile-completeness", label: "Profile Completeness", shortLabel: "Profile" },
  { id: "keyword", label: "Keyword", shortLabel: "Keyword" },
  { id: "reviews", label: "Reviews", shortLabel: "Reviews" },
  { id: "recent-reviews", label: "Recent Reviews", shortLabel: "Recent" },
  { id: "recommendations", label: "Recommendations", shortLabel: "Tips" },
];

export function GBPSidebarNav() {
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
    <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-card/95 backdrop-blur-sm border border-l-0 rounded-r-xl shadow-lg py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-all duration-300 block",
                    "hover:bg-primary/10 hover:text-primary",
                    isActive
                      ? "bg-primary/15 text-primary font-bold text-base"
                      : "text-muted-foreground font-medium text-sm"
                  )}
                >
                  <span
                    className={cn(
                      "transition-all duration-300 whitespace-nowrap",
                      isActive ? "text-base" : "text-xs"
                    )}
                  >
                    {isActive ? item.label : item.shortLabel}
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
