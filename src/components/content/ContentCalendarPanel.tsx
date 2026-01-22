"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Calendar as CalendarIcon,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  type: string;
}

export default function ContentCalendarPanel() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/posts/update");
      const data = await response.json();
      
      const calendarEvents = (data.posts || []).map((post: any) => ({
        id: post.id,
        title: post.title || "Untitled",
        start: new Date(post.scheduledFor),
        end: new Date(new Date(post.scheduledFor).getTime() + 60 * 60 * 1000),
        status: post.status,
        type: post.postType || "post",
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (statusFilter === "all") return true;
    return event.status === statusFilter;
  });

  const eventStyleGetter = (event: CalendarEvent) => {
    const colors: Record<string, string> = {
      PUBLISHED: "#22c55e",
      PUBLISHING: "#3b82f6",
      READY: "#a855f7",
      GENERATING: "#f59e0b",
      FAILED: "#ef4444",
      PENDING: "#64748b",
    };

    return {
      style: {
        backgroundColor: colors[event.status] || "#64748b",
        borderRadius: "6px",
        opacity: 0.95,
        border: "none",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      },
    };
  };

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setCurrentDate(moment(currentDate).subtract(1, view === Views.MONTH ? "month" : "week").toDate());
    } else if (action === "NEXT") {
      setCurrentDate(moment(currentDate).add(1, view === Views.MONTH ? "month" : "week").toDate());
    } else {
      setCurrentDate(new Date());
    }
  };

  const statusCounts = {
    total: events.length,
    published: events.filter(e => e.status === "PUBLISHED").length,
    ready: events.filter(e => e.status === "READY").length,
    pending: events.filter(e => e.status === "PENDING").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</span>
            <CalendarIcon className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{statusCounts.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Published</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{statusCounts.published}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ready</span>
            <AlertCircle className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{statusCounts.ready}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-600">{statusCounts.pending}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status:</span>
          {[
            { status: "PUBLISHED", color: "bg-green-500", label: "Published" },
            { status: "PUBLISHING", color: "bg-blue-500", label: "Publishing" },
            { status: "READY", color: "bg-purple-500", label: "Ready" },
            { status: "GENERATING", color: "bg-amber-500", label: "Generating" },
            { status: "FAILED", color: "bg-red-500", label: "Failed" },
            { status: "PENDING", color: "bg-slate-500", label: "Pending" },
          ].map(({ status, color, label }) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                statusFilter === status ? "bg-slate-100 dark:bg-slate-700 ring-2 ring-blue-500" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
            </button>
          ))}
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        {/* Custom Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate("TODAY")}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => handleNavigate("PREV")}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleNavigate("NEXT")}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 ml-2">
              {moment(currentDate).format("MMMM YYYY")}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {["month", "week", "day"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as View)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === v
                      ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Component */}
        <div className="min-h-[600px] calendar-dark-mode">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={eventStyleGetter}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            view={view}
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            onView={(newView) => setView(newView)}
            toolbar={false}
            components={{
              event: ({ event }: { event: CalendarEvent }) => (
                <div className="text-xs font-medium text-white p-1 truncate">
                  {event.title}
                </div>
              ),
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .calendar-dark-mode .rbc-calendar {
          background: transparent;
        }
        .dark .rbc-calendar {
          color: #e2e8f0;
        }
        .dark .rbc-header {
          background: #1e293b;
          border-color: #334155;
        }
        .dark .rbc-month-view,
        .dark .rbc-time-view,
        .dark .rbc-agenda-view {
          border-color: #334155;
        }
        .dark .rbc-day-bg,
        .dark .rbc-time-content,
        .dark .rbc-time-header {
          border-color: #334155;
        }
        .dark .rbc-off-range-bg {
          background: #0f172a;
        }
        .dark .rbc-today {
          background: rgba(59, 130, 246, 0.1);
        }
        .dark .rbc-btn-group button {
          color: #e2e8f0;
        }
        .rbc-event {
          padding: 2px 5px;
        }
      `}</style>
    </div>
  );
}
