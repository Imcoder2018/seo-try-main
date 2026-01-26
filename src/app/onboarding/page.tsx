"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  User,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Globe,
  BarChart3,
  Zap,
} from "lucide-react";

type AccountType = "INDIVIDUAL" | "AGENCY";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [agencyName, setAgencyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!selectedType) {
      setError("Please select an account type");
      return;
    }

    if (selectedType === "AGENCY" && !agencyName.trim()) {
      setError("Please enter your agency name");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType: selectedType,
          agencyName: selectedType === "AGENCY" ? agencyName.trim() : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete onboarding");
      }

      // Redirect based on account type
      if (selectedType === "AGENCY") {
        router.push("/agency");
      } else {
        router.push("/content-strategy");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-blue-950/20 dark:to-indigo-950/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-full mb-6 shadow-lg">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">SEO Hub</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Welcome, {user?.firstName || "there"}! 👋
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Let&apos;s set up your account. How will you be using SEO Hub?
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Individual Account */}
          <button
            onClick={() => setSelectedType("INDIVIDUAL")}
            className={`relative p-8 rounded-2xl border-2 text-left transition-all ${
              selectedType === "INDIVIDUAL"
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
            }`}
          >
            {selectedType === "INDIVIDUAL" && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <User className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Individual / Freelancer
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Perfect for solopreneurs, bloggers, and freelancers managing their own websites.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Unlimited SEO audits
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Content strategy tools
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                WordPress integration
              </li>
            </ul>
          </button>

          {/* Agency Account */}
          <button
            onClick={() => setSelectedType("AGENCY")}
            className={`relative p-8 rounded-2xl border-2 text-left transition-all ${
              selectedType === "AGENCY"
                ? "border-purple-600 bg-purple-50/50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/10"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-700"
            }`}
          >
            {selectedType === "AGENCY" && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
            )}
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
              PRO
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Agency / Team
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              For agencies and teams managing multiple clients and websites.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Multi-client dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Team member access
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                White-label reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Client management
              </li>
            </ul>
          </button>
        </div>

        {/* Agency Name Input */}
        {selectedType === "AGENCY" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              What&apos;s your agency name?
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="e.g., Digital Marketing Pro"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedType || isSubmitting}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
              selectedType === "AGENCY"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/25"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-center text-lg font-semibold text-slate-900 dark:text-slate-100 mb-8">
            What you&apos;ll get access to
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">SEO Audits</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comprehensive website analysis
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">AI Content</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate optimized content
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Collaboration</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Work with your team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
