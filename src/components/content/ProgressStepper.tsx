"use client";

import React from "react";
import { CheckCircle2, Circle, Loader2, Zap, Search, FileText, Brain, Lightbulb } from "lucide-react";

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  icon: React.ComponentType<any>;
}

interface ProgressStepperProps {
  currentStep: string;
  isAnalyzing: boolean;
}

const seoTips = [
  "Did you know? Pages with a meta description get 5.8% more clicks than those without.",
  "Pro tip: Including your target keyword in the first 100 words can improve rankings by 2x.",
  "SEO fact: Long-form content (2000+ words) ranks higher in 72.3% of cases.",
  "Tip: Pages with internal links have 43.5% more organic traffic than pages without.",
  "Did you know? Mobile-friendly pages rank 5x better in mobile search results.",
  "Pro tip: Images with alt text rank 12% better in image search.",
];

export default function ProgressStepper({ currentStep, isAnalyzing }: ProgressStepperProps) {
  const [randomTip] = React.useState(() => 
    seoTips[Math.floor(Math.random() * seoTips.length)]
  );

  const steps: ProgressStep[] = [
    {
      id: 'discovering',
      label: 'Discovering Sitemap',
      description: 'Finding all pages on your website',
      status: currentStep === 'discovering' ? 'in-progress' : 
             currentStep !== 'start' ? 'completed' : 'pending',
      icon: Search
    },
    {
      id: 'extracting',
      label: 'Extracting Content',
      description: 'Analyzing page content and structure',
      status: currentStep === 'extracting' ? 'in-progress' : 
             currentStep === 'analyzing' || currentStep === 'identifying' ? 'completed' : 'pending',
      icon: FileText
    },
    {
      id: 'analyzing',
      label: 'Analyzing Tone & Style',
      description: 'Understanding your brand voice',
      status: currentStep === 'analyzing' ? 'in-progress' : 
             currentStep === 'identifying' ? 'completed' : 'pending',
      icon: Brain
    },
    {
      id: 'identifying',
      label: 'Identifying Gaps',
      description: 'Finding content opportunities',
      status: currentStep === 'identifying' ? 'in-progress' : 
             currentStep === 'complete' ? 'completed' : 'pending',
      icon: Lightbulb
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            {isAnalyzing ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <Zap className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {isAnalyzing ? 'Analyzing Your Website' : 'Analysis Complete!'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {isAnalyzing ? 'This usually takes 2-3 minutes' : 'Your SEO roadmap is ready'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.status === 'in-progress';
            const isCompleted = step.status === 'completed';
            
            return (
              <div key={step.id} className="flex items-start gap-4">
                <div className="relative">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-100 border-green-500' 
                      : isActive 
                      ? 'bg-blue-100 border-blue-500' 
                      : 'bg-slate-100 border-slate-300 dark:bg-slate-700 dark:border-slate-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-10 left-5 w-0.5 h-8 -translate-x-1/2 transition-colors duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${
                      isCompleted ? 'text-green-600' : 
                      isActive ? 'text-blue-600' : 
                      'text-slate-400'
                    }`} />
                    <p className={`font-medium ${
                      isCompleted ? 'text-green-700 dark:text-green-300' : 
                      isActive ? 'text-blue-700 dark:text-blue-300' : 
                      'text-slate-500 dark:text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* SEO Tip */}
        {isAnalyzing && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                  SEO Tip
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {randomTip}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
