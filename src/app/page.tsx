import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AuditForm } from "@/components/audit/audit-form";
import { Features } from "@/components/home/features";
import { 
  Search, 
  BarChart3, 
  Zap, 
  Shield, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  Target,
  FileText,
  Calendar,
  Lightbulb,
  Layers
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered SEO Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Content Strategy
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Comprehensive SEO audits, AI-powered content generation, and intelligent strategy planning — all in one platform. Boost your rankings with data-driven insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/content-strategy"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                >
                  <Layers className="w-5 h-5" />
                  Open Content Hub
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/content-strategy?view=history"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold text-slate-900 dark:text-slate-100 shadow-lg"
                >
                  View History
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <AuditForm />
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Your Content Command Center
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Everything you need to create, optimize, and publish winning content
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/content-strategy?view=analysis" className="group">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all h-full">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Strategy Hub</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Analyze your site and discover content opportunities</p>
                </div>
              </Link>

              <Link href="/content-strategy?view=auto-content" className="group relative">
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full z-10">NEW</div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-800/10 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Content Wizard</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">6-step guided content generation wizard</p>
                </div>
              </Link>

              <Link href="/content-strategy?view=drafts" className="group">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all h-full">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Drafts</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage and edit your content drafts</p>
                </div>
              </Link>

              <Link href="/content-strategy?view=calendar" className="group">
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50 hover:shadow-xl hover:shadow-green-500/10 transition-all h-full">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Calendar</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Schedule and track content publishing</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-slate-600 dark:text-slate-400">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-slate-600 dark:text-slate-400">SEO Checks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-slate-600 dark:text-slate-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">AI</div>
                <div className="text-slate-600 dark:text-slate-400">Powered Analysis</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-slate-50 dark:to-slate-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Everything You Need to Rank Higher
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Comprehensive analysis across all critical SEO factors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  On-Page SEO
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Analyze meta tags, headings, content structure, and keyword optimization to ensure your pages are perfectly optimized.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Performance
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Check page speed, Core Web Vitals, and optimization opportunities to improve user experience and rankings.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  E-E-A-T Analysis
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Evaluate expertise, authoritativeness, and trustworthiness signals that Google uses to rank content.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Local SEO
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Optimize for local search with Google Business Profile integration, NAP consistency, and local keywords.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Content Strategy
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  AI-powered content analysis to identify gaps, optimize keywords, and generate content ideas.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Actionable Insights
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Get prioritized recommendations with clear steps to improve your SEO performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WordPress Auto-Fix Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">WordPress Plugin</span>
                </div>
                <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  Auto-Fix SEO Issues with One Click
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                  Install our WordPress plugin to automatically fix SEO issues detected in your audit. No coding required.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Auto-fix meta descriptions, alt text, and schema</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Enable security headers and performance optimizations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Auto-submit new posts to Google and Bing for indexing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">One-click connection with OAuth handshake</span>
                  </li>
                </ul>
                <Link
                  href="/downloads/seo-auto-fix.zip"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg shadow-green-500/25"
                >
                  <Zap className="w-5 h-5" />
                  Download Free Plugin
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="text-red-700 dark:text-red-300">Missing Alt Text (6 images)</span>
                    <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">Fix</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <span className="text-yellow-700 dark:text-yellow-300">No Schema Markup</span>
                    <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">Fix</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <span className="text-yellow-700 dark:text-yellow-300">Security Headers Missing</span>
                    <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">Fix</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-green-700 dark:text-green-300">✓ All issues fixed!</span>
                    <span className="text-green-600 text-sm font-medium">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-600">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Improve Your SEO?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Start analyzing your website today and get actionable insights to boost your rankings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg hover:bg-slate-100 transition-colors font-medium"
              >
                <Search className="w-5 h-5" />
                Start Free Audit
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                View Your History
              </Link>
            </div>
          </div>
        </section>

        <Features />
      </main>
      <Footer />
    </div>
  );
}
