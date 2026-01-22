"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardOverviewProps {
  analysisData?: any;
  recentAnalyses?: any[];
}

export default function DashboardOverview({ analysisData, recentAnalyses }: DashboardOverviewProps) {
  // Calculate SEO Health Score (mock data for now)
  const seoHealthScore = 75;
  const healthScoreColor = seoHealthScore >= 80 ? "text-green-600" : seoHealthScore >= 60 ? "text-yellow-600" : "text-red-600";
  
  const metrics = [
    {
      title: "Traffic Potential",
      value: "2.4K",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Content Gaps",
      value: "8",
      change: "-3",
      trend: "down",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Optimized Pages",
      value: "23",
      change: "+5",
      trend: "up",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Avg. Ranking",
      value: "#15",
      change: "+8",
      trend: "up",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  const recentActivity = recentAnalyses?.slice(0, 3) || [
    {
      id: 1,
      domain: "datatechconsultants.com.au",
      pagesAnalyzed: 5,
      score: 75,
      date: "2 hours ago"
    },
    {
      id: 2,
      domain: "example.com",
      pagesAnalyzed: 12,
      score: 82,
      date: "1 day ago"
    },
    {
      id: 3,
      domain: "test-site.com",
      pagesAnalyzed: 8,
      score: 68,
      date: "3 days ago"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your SEO Roadmap</h1>
        <p className="text-blue-100 mb-6">Enter your domain to generate your comprehensive SEO strategy</p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="https://yourwebsite.com"
            className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Analyze Site
          </button>
        </div>
      </div>

      {/* SEO Health Score */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">SEO Health Score</h2>
          <Activity className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-slate-200 dark:border-slate-700"></div>
            <div 
              className={`absolute inset-0 w-32 h-32 rounded-full border-8 ${healthScoreColor} border-t-transparent border-r-transparent transform -rotate-45`}
              style={{ 
                borderStyle: 'solid',
                borderWidth: '8px',
                borderColor: 'transparent',
                borderTopColor: 'currentColor',
                borderRightColor: 'currentColor',
                transform: `rotate(${(seoHealthScore / 100) * 360 - 45}deg)`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-3xl font-bold ${healthScoreColor}`}>{seoHealthScore}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Good</p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Technical SEO</span>
              <span className="text-sm font-medium text-green-600">85%</span>
            </div>
            <Progress value={85} className="h-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Content Quality</span>
              <span className="text-sm font-medium text-yellow-600">70%</span>
            </div>
            <Progress value={70} className="h-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Backlink Profile</span>
              <span className="text-sm font-medium text-amber-600">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="font-medium">{metric.change}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metric.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{metric.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Analyses</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{activity.domain}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {activity.pagesAnalyzed} pages analyzed • {activity.date}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.score >= 80 ? 'bg-green-100 text-green-700' :
                  activity.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {activity.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900 dark:text-blue-100">Draft New Article</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Create content from scratch</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div className="text-left">
                <p className="font-medium text-amber-900 dark:text-amber-100">Check Content Gaps</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Find missing opportunities</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <Target className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-900 dark:text-purple-100">Keyword Research</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Discover new keywords</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
