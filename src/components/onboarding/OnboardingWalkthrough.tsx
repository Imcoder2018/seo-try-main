"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface WalkthroughStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  action?: string;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "welcome",
    targetSelector: "[data-onboarding='new-strategy']",
    title: "Welcome to SEO Hub! 🎉",
    description: "Let's take a quick tour to help you get started. Click 'New Strategy' to begin analyzing your website.",
    position: "right",
    action: "Click 'New Strategy' to start",
  },
  {
    id: "deep-crawl",
    targetSelector: "[data-onboarding='strategy-hub']",
    title: "🔍 Deep Crawl",
    description: "Start by entering your website URL here. We'll crawl your site to discover all pages, analyze content structure, identify SEO issues, and extract key information for your content strategy.",
    position: "right",
    action: "Enter your website URL and click 'Start Crawl'",
  },
  {
    id: "quick-writer",
    targetSelector: "[data-onboarding='quick-writer']",
    title: "⚡ Quick Writer",
    description: "Generate SEO-optimized content quickly! Select topics, keywords, and locations to create targeted articles. Perfect for filling content gaps identified in your analysis.",
    position: "right",
    action: "Click to explore Quick Writer",
  },
  {
    id: "auto-pilot",
    targetSelector: "[data-onboarding='auto-pilot']",
    title: "🚀 Auto Pilot",
    description: "Let AI generate a full month of content automatically! Based on your website analysis, Auto Pilot creates a complete content calendar with optimized articles for all your target keywords and locations.",
    position: "right",
    action: "Click to try Auto Pilot",
  },
  {
    id: "calendar",
    targetSelector: "[data-onboarding='calendar']",
    title: "📅 Content Calendar",
    description: "View and manage all your scheduled content in one place. Drag and drop to reschedule, edit drafts, and track your publishing progress.",
    position: "right",
    action: "Click to view your Calendar",
  },
  {
    id: "history",
    targetSelector: "[data-onboarding='history']",
    title: "📚 History",
    description: "Access all your previous analyses, generated content, and published articles. Track your progress and revisit past strategies anytime.",
    position: "right",
    action: "Click to view History",
  },
];

const ONBOARDING_STORAGE_KEY = "seo_hub_onboarding_completed";

interface OnboardingWalkthroughProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export default function OnboardingWalkthrough({ forceShow = false, onComplete }: OnboardingWalkthroughProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsActive(true);
      setIsVisible(true);
      return;
    }

    // Check if onboarding was already completed
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!completed) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setIsActive(true);
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const updateTargetPosition = useCallback(() => {
    if (!isActive || currentStep >= walkthroughSteps.length) return;

    const step = walkthroughSteps[currentStep];
    const target = document.querySelector(step.targetSelector);
    
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    updateTargetPosition();
    
    // Update position on scroll/resize
    window.addEventListener("scroll", updateTargetPosition, true);
    window.addEventListener("resize", updateTargetPosition);
    
    return () => {
      window.removeEventListener("scroll", updateTargetPosition, true);
      window.removeEventListener("resize", updateTargetPosition);
    };
  }, [updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsActive(false);
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      onComplete?.();
    }, 300);
  };

  if (!isActive) return null;

  const step = walkthroughSteps[currentStep];
  
  // Calculate popup position based on target element
  const getPopupStyle = (): React.CSSProperties => {
    if (!targetRect) {
      // Center on screen if no target found
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 16;
    const popupWidth = 360;
    const popupHeight = 200;

    switch (step.position) {
      case "right":
        return {
          top: Math.max(padding, Math.min(targetRect.top, window.innerHeight - popupHeight - padding)),
          left: targetRect.right + padding,
        };
      case "left":
        return {
          top: Math.max(padding, Math.min(targetRect.top, window.innerHeight - popupHeight - padding)),
          right: window.innerWidth - targetRect.left + padding,
        };
      case "bottom":
        return {
          top: targetRect.bottom + padding,
          left: Math.max(padding, Math.min(targetRect.left, window.innerWidth - popupWidth - padding)),
        };
      case "top":
        return {
          bottom: window.innerHeight - targetRect.top + padding,
          left: Math.max(padding, Math.min(targetRect.left, window.innerWidth - popupWidth - padding)),
        };
      default:
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left,
        };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      />

      {/* Highlight cutout for target element */}
      {targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
            borderRadius: "12px",
            border: "3px solid #3b82f6",
            animation: "pulse-border 2s infinite",
          }}
        />
      )}

      {/* Popup */}
      <div
        className={`fixed z-[10000] w-[360px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={getPopupStyle()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {walkthroughSteps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Skip tutorial"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {step.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            {step.description}
          </p>
          {step.action && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
              <ChevronRight className="w-4 h-4" />
              {step.action}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
          <button
            onClick={handleSkip}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Skip tutorial
          </button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {currentStep === walkthroughSteps.length - 1 ? "Get Started" : "Next"}
              {currentStep < walkthroughSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {walkthroughSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-blue-600"
                  : index < currentStep
                  ? "bg-blue-300"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CSS for pulse animation */}
      <style jsx global>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 0 8px rgba(59, 130, 246, 0.1);
          }
        }
      `}</style>
    </>
  );
}
