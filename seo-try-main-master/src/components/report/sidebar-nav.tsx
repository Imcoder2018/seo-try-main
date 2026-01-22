"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
}

const navItems: NavItem[] = [
  { id: "local-seo", label: "Local SEO", shortLabel: "Local" },
  { id: "seo", label: "On-Page SEO", shortLabel: "SEO" },
  { id: "links", label: "Links Analysis", shortLabel: "Links" },
  { id: "usability", label: "Usability", shortLabel: "Usability" },
  { id: "performance", label: "Performance", shortLabel: "Perf" },
  { id: "social", label: "Social", shortLabel: "Social" },
  { id: "technology", label: "Technology", shortLabel: "Tech" },
  { id: "content", label: "Content Quality", shortLabel: "Content" },
  { id: "eeat", label: "E-E-A-T Signals", shortLabel: "E-E-A-T" },
];

export function SidebarNav() {
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
