"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
interface ContentContext {
  dominantKeywords: string[];
  contentGaps: string[];
  audiencePersona: string;
  tone: string;
}

interface AISuggestion {
  id: string;
  type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
  title: string;
  reason: string;
  targetKeywords: string[];
  relatedServiceUrl?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: "PLANNED" | "GENERATING" | "READY" | "PUBLISHED" | "FAILED";
  content?: string;
  outline?: string;
  tone?: string;
  keywords?: string[];
  targetService?: string;
  targetServiceUrl?: string;
  sourceSuggestionId?: string;
  analysisRunId?: string;
}

interface ActiveDraft {
  id?: string;
  title: string;
  outline?: string;
  content?: string;
  tone?: string;
  keywords?: string[];
  targetService?: string;
  targetServiceUrl?: string;
  sourceSuggestionId?: string;
}

interface ContentStrategyContextType {
  // Analysis Data
  analysisData: ContentContext | null;
  setAnalysisData: (data: ContentContext | null) => void;
  
  // AI Suggestions
  aiSuggestions: AISuggestion[];
  setAiSuggestions: (suggestions: AISuggestion[]) => void;
  
  // Calendar Events
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  
  // Active Draft
  activeDraft: ActiveDraft | null;
  setActiveDraft: (draft: ActiveDraft | null) => void;
  
  // Analysis Run ID
  analysisRunId: string | null;
  setAnalysisRunId: (id: string | null) => void;

  // Current Domain
  currentDomain: string | null;
  setCurrentDomain: (domain: string | null) => void;

  // Reset Strategy - clears all state
  resetStrategy: () => void;

  // Load from history
  loadFromHistory: (data: {
    analysisData: ContentContext;
    aiSuggestions: AISuggestion[];
    events: CalendarEvent[];
    domain: string;
    runId: string;
  }) => void;
}

const ContentStrategyContext = createContext<ContentStrategyContextType | undefined>(undefined);

export function ContentStrategyProvider({ children }: { children: ReactNode }) {
  const [analysisData, setAnalysisData] = useState<ContentContext | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeDraft, setActiveDraft] = useState<ActiveDraft | null>(null);
  const [analysisRunId, setAnalysisRunId] = useState<string | null>(null);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);

  const STORAGE_KEYS = {
    ANALYSIS: 'seo_analysis_output',
    DISCOVERY: 'seo_discovery_data',
    EVENTS: 'seo_calendar_events',
    DOMAIN: 'seo_current_domain',
  };

  const resetStrategy = () => {
    // Clear all state
    setAnalysisData(null);
    setAiSuggestions([]);
    setEvents([]);
    setActiveDraft(null);
    setAnalysisRunId(null);
    setCurrentDomain(null);

    // Clear localStorage
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  };

  const loadFromHistory = (data: {
    analysisData: ContentContext;
    aiSuggestions: AISuggestion[];
    events: CalendarEvent[];
    domain: string;
    runId: string;
  }) => {
    setAnalysisData(data.analysisData);
    setAiSuggestions(data.aiSuggestions);
    setEvents(data.events.map(e => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    })));
    setCurrentDomain(data.domain);
    setAnalysisRunId(data.runId);
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <ContentStrategyContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        aiSuggestions,
        setAiSuggestions,
        events,
        setEvents,
        addEvent,
        updateEvent,
        removeEvent,
        activeDraft,
        setActiveDraft,
        analysisRunId,
        setAnalysisRunId,
        currentDomain,
        setCurrentDomain,
        resetStrategy,
        loadFromHistory,
      }}
    >
      {children}
    </ContentStrategyContext.Provider>
  );
}

export function useContentStrategy() {
  const context = useContext(ContentStrategyContext);
  if (context === undefined) {
    throw new Error("useContentStrategy must be used within a ContentStrategyProvider");
  }
  return context;
}
