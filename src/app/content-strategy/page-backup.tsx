// Backup of the page component
"use client";

import { useState } from "react";

export default function ContentStrategyPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <nav className="p-4 space-y-2">
            {["dashboard", "strategy", "production", "planner", "history"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-2 rounded-lg capitalize ${
                  activeSection === section 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                    : "hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 capitalize">
            {activeSection}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {activeSection} section content goes here...
          </p>
        </div>
      </div>
    </div>
  );
}
