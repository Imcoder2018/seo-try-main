"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Zap,
  Calendar,
  History,
  ChevronLeft,
  ChevronRight,
  Globe,
  Menu,
  X,
  Home,
  Target,
  Settings,
  Archive,
  FileText,
  Plus,
  RefreshCw,
  Download,
  Share2,
  Wand2,
  CalendarDays,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/content-strategy?view=dashboard" },
  { id: "strategy", label: "Strategy Hub", icon: BarChart3, href: "/content-strategy?view=analysis" },
  { id: "auto-content", label: "Content Wizard", icon: Wand2, href: "/content-strategy?view=auto-content", badge: "New" },
  { id: "production", label: "Quick Writer", icon: Zap, href: "/content-strategy?view=production" },
  { id: "planner", label: "Planner", icon: Calendar, href: "/content-strategy?view=planner" },
  { id: "drafts", label: "Drafts", icon: FileText, href: "/content-strategy?view=drafts" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, href: "/content-strategy?view=calendar" },
  { id: "archives", label: "History", icon: Archive, href: "/content-strategy?view=history" },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
  activeView?: string;
  onViewChange?: (view: string) => void;
  onNewStrategy?: () => void;
  currentDomain?: string;
  healthScore?: number;
  contentGapsCount?: number;
}

export default function SidebarLayout({ 
  children, 
  activeView, 
  onViewChange,
  onNewStrategy,
  currentDomain,
  healthScore,
  contentGapsCount 
}: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNewStrategy = () => {
    if (onNewStrategy) {
      onNewStrategy();
    } else {
      router.push('/content-strategy?view=analysis');
    }
  };

  const handleNavClick = (item: NavItem) => {
    if (onViewChange && item.href.includes("view=")) {
      const view = new URL(item.href, "http://localhost").searchParams.get("view");
      if (view) {
        onViewChange(view);
      }
    }
    setIsMobileOpen(false);
  };

  const isActive = (item: NavItem) => {
    if (activeView) {
      const view = new URL(item.href, "http://localhost").searchParams.get("view");
      return view === activeView;
    }
    return pathname === item.href.split("?")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">SEO Hub</span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Globe className="w-7 h-7 text-blue-600" />
              <span className="font-bold text-xl text-slate-900 dark:text-slate-100">SEO Hub</span>
            </div>
          )}
          {isCollapsed && <Globe className="w-7 h-7 text-blue-600 mx-auto" />}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* New Strategy CTA Button */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={handleNewStrategy}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
              isCollapsed ? "px-2" : ""
            }`}
            title={isCollapsed ? "New Strategy" : undefined}
          >
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span>New Strategy</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats (Only when expanded) */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Quick Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Health Score</p>
                  <p className="font-bold text-blue-600">{healthScore ?? '--'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Content Gaps</p>
                  <p className="font-bold text-amber-600">{contentGapsCount ?? '--'}</p>
                </div>
              </div>
              {currentDomain && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 text-xs truncate" title={currentDomain}>
                    {currentDomain}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        } pt-16 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}
