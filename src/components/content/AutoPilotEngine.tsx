"use client";

import { useState, useEffect } from "react";
import {
  Rocket, Calendar, Clock, MapPin, Tag, FileText, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, Sparkles, RefreshCw, Eye, Check, X, Upload, Target,
  Zap, Settings, Play, ExternalLink, Save, Globe, BarChart3, Image as ImageIcon,
  Download, AlertCircle, Plug,
} from "lucide-react";
import LocationSelector from "./LocationSelector";

interface AnalysisData {
  services: string[];
  locations: string[];
  aboutSummary: string;
  targetAudience: string;
  brandTone: string;
  dominantKeywords: Array<{ term: string; count: number }>;
  pages: Array<{ url: string; type: string; title: string; wordCount: number }>;
}

interface GeneratedTopic {
  id: string;
  title: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  userKeywords: string[];
  scheduledDate: Date;
  scheduledTime: string;
  selected: boolean;
  contentType: "blog post" | "landing page";
  description: string;
}

interface GeneratedContent {
  id: string;
  topicId: string;
  title: string;
  content: string;
  wordCount: number;
  imageUrl?: string;
  status: "pending" | "generating" | "completed" | "failed" | "approved" | "published";
  error?: string;
  scheduledDate: Date;
  scheduledTime: string;
  keywords: string[];
}

const STEPS = [
  { id: 1, title: "Schedule Setup", description: "Configure posting frequency" },
  { id: 2, title: "Keywords & Locations", description: "Add your target keywords" },
  { id: 3, title: "Topic Planning", description: "Review AI-generated topics" },
  { id: 4, title: "Keyword Assignment", description: "AI keywords for each topic" },
  { id: 5, title: "Content Generation", description: "Generate all content" },
  { id: 6, title: "Review & Approve", description: "Approve and schedule" },
];

export default function AutoPilotEngine() {
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  
  const [postsPerDay, setPostsPerDay] = useState(1);
  const [postingTime, setPostingTime] = useState("09:00");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPosts, setTotalPosts] = useState(30);
  
  const [userKeywords, setUserKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  const [generatedTopics, setGeneratedTopics] = useState<GeneratedTopic[]>([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [currentKeywordTopicIndex, setCurrentKeywordTopicIndex] = useState(0);
  
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showWpConnectModal, setShowWpConnectModal] = useState(false);
  const [wpConnectMode, setWpConnectMode] = useState<"auto" | "manual">("auto");
  const [wpUrl, setWpUrl] = useState("");
  const [wpApiKey, setWpApiKey] = useState("");
  const [isConnectingWp, setIsConnectingWp] = useState(false);
  const [wpConnectError, setWpConnectError] = useState("");
  const [handshakeStatus, setHandshakeStatus] = useState<"idle" | "pending" | "approved" | "error">("idle");
  const [connectToken, setConnectToken] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [scrapedContent, setScrapedContent] = useState("");
  const [showPromptTemplates, setShowPromptTemplates] = useState(false);
  
  // Pre-written prompt templates
  const promptTemplates = [
    { id: 1, name: "SEO-Optimized Blog Post", prompt: "Write a comprehensive, SEO-optimized blog post that includes relevant statistics, expert insights, and actionable tips. Structure with clear headings, bullet points, and a compelling call-to-action." },
    { id: 2, name: "Local Business Focus", prompt: "Create content that emphasizes local expertise and community involvement. Include location-specific details, local landmarks references, and address common local customer pain points." },
    { id: 3, name: "Technical Authority", prompt: "Write in-depth technical content that demonstrates industry expertise. Include technical specifications, detailed explanations, and cite authoritative sources to build E-E-A-T." },
    { id: 4, name: "Problem-Solution Format", prompt: "Structure the content around identifying customer problems and presenting clear solutions. Use real-world examples and case studies to illustrate effectiveness." },
    { id: 5, name: "Comparison Guide", prompt: "Create a detailed comparison guide that helps readers make informed decisions. Include pros and cons, feature comparisons, and clear recommendations." },
    { id: 6, name: "How-To Tutorial", prompt: "Write a step-by-step tutorial with numbered instructions, helpful tips, common mistakes to avoid, and visual descriptions for each step." },
  ];

  useEffect(() => {
    loadAnalysisData();
  }, []);

  // Poll for handshake approval
  useEffect(() => {
    if (handshakeStatus !== "pending" || !connectToken || !wpUrl) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/wordpress?action=handshake_status&site_url=${encodeURIComponent(wpUrl)}&connect_token=${connectToken}`
        );
        const data = await response.json();

        if (data.status === "approved") {
          setHandshakeStatus("approved");
          
          let apiKey = data.api_key || data.apiKey;
          let siteName = data.site_name || data.siteName;
          let returnedSiteUrl = data.site_url || data.siteUrl || wpUrl;
          
          if (!apiKey) {
            const completeResponse = await fetch("/api/wordpress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                site_url: wpUrl,
                action: "handshake_complete",
                options: { connect_token: connectToken },
              }),
            });
            const completeData = await completeResponse.json();
            apiKey = completeData.api_key || completeData.apiKey || completeData.key;
            siteName = completeData.site_name || completeData.siteName || completeData.name || siteName;
            returnedSiteUrl = completeData.site_url || completeData.siteUrl || returnedSiteUrl;
          }
          
          if (apiKey && apiKey.length >= 20) {
            const conn = {
              siteUrl: returnedSiteUrl,
              apiKey: apiKey,
              connected: true,
              siteName: siteName || returnedSiteUrl,
            };
            localStorage.setItem('wp_connection_global', JSON.stringify(conn));
            setShowWpConnectModal(false);
            setHandshakeStatus("idle");
            window.location.reload();
          } else {
            setHandshakeStatus("error");
            setWpConnectError("Connection approved but failed to retrieve API key. Please use Manual Setup.");
          }
        }
      } catch {
        // Continue polling
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [handshakeStatus, connectToken, wpUrl]);

  const handleAutoConnect = async () => {
    if (!wpUrl) {
      setWpConnectError("Please enter your WordPress site URL");
      return;
    }

    setIsConnectingWp(true);
    setWpConnectError("");

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: wpUrl,
          action: "handshake_init",
        }),
      });
      const data = await response.json();

      const authUrlFromResponse = data.auth_url || data.approval_url;
      const tokenFromResponse = data.connect_token || data.token;
      
      if (data.success && authUrlFromResponse) {
        setConnectToken(tokenFromResponse);
        setHandshakeStatus("pending");
        window.open(authUrlFromResponse, "_blank");
      } else {
        const errorMsg = data.error || "Failed to initiate connection";
        setWpConnectError(`${errorMsg}. Make sure SEO AutoFix Pro plugin is installed and activated.`);
      }
    } catch (err) {
      setWpConnectError(`Connection failed: ${err instanceof Error ? err.message : "Please check your WordPress URL."}`);
    } finally {
      setIsConnectingWp(false);
    }
  };

  const handleAddLocation = () => {
    if (locationInput.trim() && !selectedLocations.includes(locationInput.trim())) {
      setSelectedLocations([...selectedLocations, locationInput.trim()]);
      setLocationInput("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== location));
  };

  const loadAnalysisData = async () => {
    setIsLoadingAnalysis(true);
    try {
      const response = await fetch("/api/content/auto-discovery?crawlRequestId=latest");
      const data = await response.json();
      if (data.success && data.data) {
        setAnalysisData(data.data);
        if (data.data.locations?.length > 0) {
          setSelectedLocations(data.data.locations.slice(0, 3));
        }
        
        // Use scraped content from the API response (fetched from database)
        if (data.data.scrapedContent) {
          setScrapedContent(data.data.scrapedContent);
          console.log("[Auto Pilot] Scraped content loaded, length:", data.data.scrapedContent.length);
        }
      }
      
      const historyResponse = await fetch("/api/content/history?limit=1");
      const historyData = await historyResponse.json();
      if (historyData.analyses?.[0]?.analysisOutput) {
        let outputData = historyData.analyses[0].analysisOutput;
        if (outputData.json) outputData = outputData.json;
        const contentContext = outputData.contentContext || {};
        setAnalysisData(prev => ({
          ...prev,
          services: prev?.services || [],
          locations: prev?.locations || [],
          aboutSummary: contentContext.businessSummary || prev?.aboutSummary || "",
          targetAudience: contentContext.audiencePersona || prev?.targetAudience || "",
          brandTone: contentContext.tone || prev?.brandTone || "professional",
          dominantKeywords: contentContext.dominantKeywords || [],
          pages: outputData.pages || [],
        }));
      }
    } catch (err) {
      console.error("Failed to load analysis data:", err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !userKeywords.includes(keywordInput.trim())) {
      setUserKeywords([...userKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setUserKeywords(userKeywords.filter(k => k !== keyword));
  };

  const handleKeywordFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const keywords = text.split(/[\n,]/).map(k => k.trim()).filter(k => k.length > 0);
        setUserKeywords(prev => [...new Set([...prev, ...keywords])]);
      };
      reader.readAsText(file);
    }
  };

  const generateScheduledDates = (count: number): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    let postsThisDay = 0;
    for (let i = 0; i < count; i++) {
      dates.push(new Date(currentDate));
      postsThisDay++;
      if (postsThisDay >= postsPerDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        postsThisDay = 0;
      }
    }
    return dates;
  };

  const handleGenerateTopics = async () => {
    setIsGeneratingTopics(true);
    setTopicsError(null);
    try {
      const selectedTopicsCount = Math.min(totalPosts, 30);
      const scheduledDates = generateScheduledDates(selectedTopicsCount);
      
      const response = await fetch("/api/content/ai-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedService: analysisData?.services?.[0] || "Technology Services",
          locations: selectedLocations,
          brandTone: analysisData?.brandTone || "professional",
          targetAudience: analysisData?.targetAudience || "Business professionals",
          aboutSummary: analysisData?.aboutSummary || "",
          count: selectedTopicsCount,
          userKeywords: userKeywords,
        }),
      });

      const result = await response.json();
      if (result.success && result.topics) {
        const topics: GeneratedTopic[] = result.topics.map((topic: any, index: number) => ({
          id: `topic_${Date.now()}_${index}`,
          title: topic.title,
          primaryKeywords: topic.primaryKeywords || [],
          secondaryKeywords: topic.secondaryKeywords || [],
          userKeywords: userKeywords.slice(0, 3),
          scheduledDate: scheduledDates[index] || new Date(),
          scheduledTime: postingTime,
          selected: index < totalPosts, // Only auto-select up to totalPosts
          contentType: topic.contentType || "blog post",
          description: topic.description || "",
        }));
        setGeneratedTopics(topics);
      } else {
        throw new Error(result.error || "No topics generated");
      }
    } catch (err) {
      setTopicsError(err instanceof Error ? err.message : "Failed to generate topics");
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  const handleToggleTopic = (topicId: string) => {
    setGeneratedTopics(prev => prev.map(t => t.id === topicId ? { ...t, selected: !t.selected } : t));
  };

  const handleGenerateKeywordsForTopics = async () => {
    setIsGeneratingKeywords(true);
    const selectedTopics = generatedTopics.filter(t => t.selected);
    
    for (let i = 0; i < selectedTopics.length; i++) {
      setCurrentKeywordTopicIndex(i);
      try {
        const response = await fetch("/api/content/ai-topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedService: selectedTopics[i].title,
            locations: selectedLocations,
            brandTone: analysisData?.brandTone || "professional",
            count: 1,
          }),
        });
        const result = await response.json();
        if (result.success && result.topics?.[0]) {
          const topicKeywords = result.topics[0];
          setGeneratedTopics(prev => prev.map(t => {
            if (t.id === selectedTopics[i].id) {
              return {
                ...t,
                primaryKeywords: [...topicKeywords.primaryKeywords.filter((k: string) => k.split(' ').length >= 2), ...t.userKeywords].slice(0, 5),
                secondaryKeywords: topicKeywords.secondaryKeywords.filter((k: string) => k.split(' ').length >= 2).slice(0, 5),
              };
            }
            return t;
          }));
        }
      } catch (err) {
        console.error(`Failed to generate keywords for topic ${i}:`, err);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsGeneratingKeywords(false);
  };

  const handleGenerateAllContent = async () => {
    setIsGeneratingContent(true);
    const selectedTopics = generatedTopics.filter(t => t.selected);
    
    const initialContents: GeneratedContent[] = selectedTopics.map(topic => ({
      id: `content_${topic.id}`,
      topicId: topic.id,
      title: topic.title,
      content: "",
      wordCount: 0,
      status: "pending",
      scheduledDate: topic.scheduledDate,
      scheduledTime: topic.scheduledTime,
      keywords: [...topic.primaryKeywords, ...topic.userKeywords],
    }));
    setGeneratedContents(initialContents);
    
    for (let i = 0; i < selectedTopics.length; i++) {
      setCurrentContentIndex(i);
      const topic = selectedTopics[i];
      setGeneratedContents(prev => prev.map(c => c.topicId === topic.id ? { ...c, status: "generating" } : c));
      
      try {
        const response = await fetch("/api/content/bulk-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedTopics: [{ title: topic.title, primaryKeywords: topic.primaryKeywords, secondaryKeywords: topic.secondaryKeywords, contentType: topic.contentType, description: topic.description, searchIntent: "informational" }],
            selectedLocations: selectedLocations,
            service: analysisData?.services?.[0] || topic.title,
            brandTone: analysisData?.brandTone || "professional",
            targetAudience: analysisData?.targetAudience || "Business professionals",
            aboutSummary: analysisData?.aboutSummary || "",
            generateImages: true,
            singlePage: true,
            customPrompt: customPrompt,
            scrapedContent: scrapedContent,
          }),
        });
        const result = await response.json();
        const taskId = result.taskId;
        
        let attempts = 0;
        while (attempts < 60) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
          const pollResponse = await fetch(`/api/content/bulk-generate?taskId=${taskId}`);
          const pollData = await pollResponse.json();
          if (pollData.success && pollData.results?.[0]) {
            const content = pollData.results[0];
            setGeneratedContents(prev => prev.map(c => c.topicId === topic.id ? { ...c, title: content.title || topic.title, content: content.content, wordCount: content.wordCount || 0, imageUrl: content.imageUrl, status: "completed" } : c));
            break;
          } else if (pollData.status === "FAILED" || pollData.status === "CRASHED") {
            throw new Error(pollData.error || "Generation failed");
          }
        }
      } catch (err) {
        setGeneratedContents(prev => prev.map(c => c.topicId === topic.id ? { ...c, status: "failed", error: err instanceof Error ? err.message : "Failed to generate" } : c));
      }
    }
    setIsGeneratingContent(false);
  };

  const handleApproveContent = (contentId: string) => {
    setGeneratedContents(prev => prev.map(c => c.id === contentId ? { ...c, status: "approved" } : c));
  };

  const handlePublishNow = async (contentId: string) => {
    const content = generatedContents.find(c => c.id === contentId);
    if (!content) return;
    
    // Get WordPress connection from localStorage
    const wpConnection = localStorage.getItem('wp_connection_global');
    if (!wpConnection) {
      alert('WordPress not connected. Please connect WordPress from the Audit Report page first.');
      return;
    }

    const { siteUrl, apiKey } = JSON.parse(wpConnection);
    if (!siteUrl || !apiKey) {
      alert('WordPress connection incomplete. Please reconnect from the Audit Report page.');
      return;
    }

    try {
      // Use WordPress plugin API directly
      const response = await fetch(`${siteUrl}/wp-json/seo-autofix/v1/content/publish`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-SEO-AutoFix-Key": apiKey,
        },
        body: JSON.stringify({ 
          title: content.title, 
          content: content.content, 
          location: selectedLocations[0] || "Pakistan", 
          contentType: "blog post", 
          imageUrl: content.imageUrl,
          featured_image: content.imageUrl,
          primaryKeywords: content.keywords, 
          status: "publish" 
        }),
      });
      
      const data = await response.json();
      const postId = data.post?.id || data.postId;
      
      if (postId) {
        setGeneratedContents(prev => prev.map(c => c.id === contentId ? { ...c, status: "published" } : c));
        alert(`✅ Published successfully! Post ID: ${postId}`);
      } else {
        alert(`Failed to publish: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("[WordPress Publish] Error:", err);
      alert('Failed to publish to WordPress. Check your connection.');
    }
  };

  // Check WordPress connection status
  const isWordPressConnected = () => {
    const wpConnection = localStorage.getItem('wp_connection_global');
    if (!wpConnection) return false;
    const { siteUrl, apiKey } = JSON.parse(wpConnection);
    return !!(siteUrl && apiKey);
  };

  const handleSaveAllScheduled = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const approvedContent = generatedContents.filter(c => c.status === "approved" || c.status === "completed");
      const response = await fetch("/api/scheduled-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posts: approvedContent.map(c => ({ title: c.title, content: c.content, wordCount: c.wordCount, featuredImageUrl: c.imageUrl, scheduledFor: new Date(c.scheduledDate).toISOString(), scheduledTime: c.scheduledTime, focusKeyword: c.keywords[0] || "", secondaryKeywords: c.keywords.slice(1), postStatus: "scheduled" })),
        }),
      });
      if (!response.ok) throw new Error("Failed to save scheduled posts");
      setGeneratedContents(prev => prev.map(c => (c.status === "approved" || c.status === "completed") ? { ...c, status: "approved" } : c));
      alert(`Successfully saved ${approvedContent.length} posts to schedule!`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return postsPerDay > 0 && totalPosts > 0 && startDate;
      case 2: return selectedLocations.length > 0;
      case 3: return generatedTopics.filter(t => t.selected).length > 0;
      case 4: return generatedTopics.filter(t => t.selected && t.primaryKeywords.length > 0).length > 0;
      case 5: return generatedContents.filter(c => c.status === "completed" || c.status === "approved").length > 0;
      default: return true;
    }
  };

  if (isLoadingAnalysis) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading website context...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* WordPress Connection Warning */}
      {!isWordPressConnected() && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 dark:text-amber-200">WordPress Not Connected</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Connect your WordPress site to publish content directly. Download the SEO AutoFix plugin and connect.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href="/downloads/seo-auto-fix.zip"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Plugin
                </a>
                <button
                  onClick={() => setShowWpConnectModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-sm font-medium"
                >
                  <Plug className="w-4 h-4" />
                  Connect WordPress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WordPress Connection Modal */}
      {showWpConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Connect WordPress Site</h3>
              <button onClick={() => setShowWpConnectModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><X className="w-5 h-5" /></button>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setWpConnectMode("auto")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${wpConnectMode === "auto" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
              >
                🚀 Auto Connect
              </button>
              <button
                onClick={() => setWpConnectMode("manual")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${wpConnectMode === "manual" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
              >
                🔧 Manual Setup
              </button>
            </div>

            {wpConnectError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{wpConnectError}</p>
              </div>
            )}

            {handshakeStatus === "pending" && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">Waiting for approval in WordPress admin... Please approve the connection in the opened tab.</p>
                </div>
              </div>
            )}

            {wpConnectMode === "auto" ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">One-Click Connection</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Enter your WordPress URL and click connect. You'll be redirected to approve the connection in your WordPress admin.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">WordPress Site URL</label>
                  <input
                    type="url"
                    value={wpUrl}
                    onChange={(e) => setWpUrl(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
                <button
                  onClick={handleAutoConnect}
                  disabled={!wpUrl || isConnectingWp || handshakeStatus === "pending"}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isConnectingWp ? "Initiating..." : handshakeStatus === "pending" ? "Waiting for approval..." : "Connect Automatically"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Manual Connection</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Enter your WordPress URL and API key from the SEO AutoFix plugin settings.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">WordPress Site URL</label>
                  <input
                    type="url"
                    value={wpUrl}
                    onChange={(e) => setWpUrl(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">API Key</label>
                  <input
                    type="text"
                    value={wpApiKey}
                    onChange={(e) => setWpApiKey(e.target.value)}
                    placeholder="Enter API key from plugin settings"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
                <button
                  onClick={() => {
                    if (wpUrl && wpApiKey) {
                      localStorage.setItem('wp_connection_global', JSON.stringify({ siteUrl: wpUrl.replace(/\/$/, ''), apiKey: wpApiKey }));
                      setShowWpConnectModal(false);
                      window.location.reload();
                    }
                  }}
                  disabled={!wpUrl || !wpApiKey}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Save Connection
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all ${currentStep > step.id ? "bg-green-600 text-white" : currentStep === step.id ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              {index < STEPS.length - 1 && <div className={`w-12 md:w-20 h-1 mx-2 rounded transition-colors ${currentStep > step.id ? "bg-green-600" : "bg-slate-200 dark:bg-slate-700"}`} />}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{STEPS[currentStep - 1].title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{STEPS[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
                <div><h3 className="font-semibold text-slate-900 dark:text-slate-100">Schedule Configuration</h3><p className="text-sm text-slate-600 dark:text-slate-400">Set up your monthly content schedule</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Posts Per Day</label><input type="number" min="1" max="5" value={postsPerDay} onChange={(e) => setPostsPerDay(parseInt(e.target.value) || 1)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Posting Time</label><input type="time" value={postingTime} onChange={(e) => setPostingTime(e.target.value)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Total Posts for Month</label><input type="number" min="1" max="60" value={totalPosts} onChange={(e) => setTotalPosts(parseInt(e.target.value) || 30)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100" /></div>
              </div>
              <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><BarChart3 className="w-4 h-4" /><span>{totalPosts} posts over {Math.ceil(totalPosts / postsPerDay)} days, starting {new Date(startDate).toLocaleDateString()}</span></div>
              </div>
            </div>
            {analysisData && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-4"><Globe className="w-5 h-5 text-blue-600" /><h3 className="font-semibold text-slate-900 dark:text-slate-100">Website Context (Auto-loaded)</h3></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><p className="text-xs text-slate-500 dark:text-slate-400">Pages Analyzed</p><p className="text-xl font-bold text-slate-900 dark:text-slate-100">{analysisData.pages?.length || 0}</p></div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><p className="text-xs text-slate-500 dark:text-slate-400">Services</p><p className="text-xl font-bold text-slate-900 dark:text-slate-100">{analysisData.services?.length || 0}</p></div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><p className="text-xs text-slate-500 dark:text-slate-400">Brand Tone</p><p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">{analysisData.brandTone || "Professional"}</p></div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><p className="text-xs text-slate-500 dark:text-slate-400">Keywords</p><p className="text-xl font-bold text-slate-900 dark:text-slate-100">{analysisData.dominantKeywords?.length || 0}</p></div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4"><Tag className="w-5 h-5 text-blue-600" /><h3 className="font-semibold text-slate-900 dark:text-slate-100">Your Target Keywords</h3></div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Add your own keywords to rank on Google.</p>
              <div className="flex gap-2 mb-4">
                <input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()} placeholder="Enter keyword (e.g., AI consulting services)" className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100" />
                <button onClick={handleAddKeyword} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add</button>
              </div>
              <label className="flex items-center gap-2 px-4 py-2 mb-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors w-fit">
                <Upload className="w-4 h-4 text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-400">Upload Keywords File (.txt, .csv)</span>
                <input type="file" accept=".txt,.csv" onChange={handleKeywordFileUpload} className="hidden" />
              </label>
              {userKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {userKeywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                      {keyword}<button onClick={() => handleRemoveKeyword(keyword)} className="ml-1 hover:text-green-900 dark:hover:text-green-100"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-blue-600" /><h3 className="font-semibold text-slate-900 dark:text-slate-100">Target Locations</h3></div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Add cities or regions where you want to target your content.</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                  placeholder="Enter location (e.g., New York, London)"
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                />
                <button onClick={handleAddLocation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add</button>
              </div>
              {selectedLocations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedLocations.map((location, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      <MapPin className="w-3 h-3" />
                      {location}
                      <button onClick={() => handleRemoveLocation(location)} className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No locations added yet. Content will be generated without location targeting.</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold text-slate-900 dark:text-slate-100">AI-Generated Topics</h3><p className="text-sm text-slate-600 dark:text-slate-400">Review and select topics for your monthly content plan</p></div>
              <button onClick={handleGenerateTopics} disabled={isGeneratingTopics} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isGeneratingTopics ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Topics</>}
              </button>
            </div>
            {topicsError && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-sm text-red-700 dark:text-red-300">{topicsError}</p></div>}
            {generatedTopics.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {generatedTopics.map((topic, index) => (
                  <div key={topic.id} className={`p-4 rounded-xl border-2 transition-all ${topic.selected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-60"}`}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => handleToggleTopic(topic.id)} className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${topic.selected ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600"}`}>{topic.selected && <Check className="w-3 h-3 text-white" />}</button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium text-blue-600 dark:text-blue-400">#{index + 1}</span><span className="text-xs text-slate-500 dark:text-slate-400">{topic.scheduledDate.toLocaleDateString()} at {topic.scheduledTime}</span></div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">{topic.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{topic.description}</p>
                        <div className="flex flex-wrap gap-1">{topic.primaryKeywords.slice(0, 3).map((kw, i) => (<span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">{kw}</span>))}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700"><Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" /><p className="text-slate-600 dark:text-slate-400">Click "Generate Topics" to create your monthly content plan</p></div>
            )}
            {generatedTopics.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">{generatedTopics.filter(t => t.selected).length} of {generatedTopics.length} topics selected</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setGeneratedTopics(prev => prev.map(t => ({ ...t, selected: true })))} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">Select All</button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button onClick={() => setGeneratedTopics(prev => prev.map(t => ({ ...t, selected: false })))} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">Deselect All</button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Keyword Assignment</h3><p className="text-sm text-slate-600 dark:text-slate-400">Generating optimized keywords for each topic (2+ words for better SEO)</p></div>
              {!isGeneratingKeywords && <button onClick={handleGenerateKeywordsForTopics} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Zap className="w-4 h-4" />Generate Keywords</button>}
            </div>
            {isGeneratingKeywords && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /><span className="text-sm text-blue-700 dark:text-blue-300">Generating keywords for topic {currentKeywordTopicIndex + 1} of {generatedTopics.filter(t => t.selected).length}...</span></div>
                <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${((currentKeywordTopicIndex + 1) / generatedTopics.filter(t => t.selected).length) * 100}%` }} /></div>
              </div>
            )}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {generatedTopics.filter(t => t.selected).map((topic, index) => (
                <div key={topic.id} className={`p-4 rounded-xl border transition-all ${index < currentKeywordTopicIndex || (topic.primaryKeywords.length > 0 && !isGeneratingKeywords) ? "border-green-500 bg-green-50 dark:bg-green-900/20" : index === currentKeywordTopicIndex && isGeneratingKeywords ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-pulse" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {index < currentKeywordTopicIndex || (topic.primaryKeywords.length > 0 && !isGeneratingKeywords) ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : index === currentKeywordTopicIndex && isGeneratingKeywords ? <Loader2 className="w-5 h-5 text-blue-600 animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />}
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{topic.title}</h4>
                  </div>
                  <div className="ml-7 space-y-2">
                    {topic.primaryKeywords.length > 0 && (<div><p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Primary Keywords:</p><div className="flex flex-wrap gap-1">{topic.primaryKeywords.map((kw, i) => (<span key={i} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">{kw}</span>))}</div></div>)}
                    {topic.userKeywords.length > 0 && (<div><p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Your Keywords:</p><div className="flex flex-wrap gap-1">{topic.userKeywords.map((kw, i) => (<span key={i} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">{kw}</span>))}</div></div>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Prompt Section */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custom Writing Instructions (Optional)</h4>
                <button
                  onClick={() => setShowPromptTemplates(!showPromptTemplates)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  {showPromptTemplates ? "Hide Templates" : "Choose Template"}
                </button>
              </div>
              
              {showPromptTemplates && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {promptTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setCustomPrompt(template.prompt);
                        setShowPromptTemplates(false);
                      }}
                      className="p-3 text-left bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{template.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{template.prompt.substring(0, 80)}...</p>
                    </button>
                  ))}
                </div>
              )}
              
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add specific instructions for content generation (e.g., 'Include statistics about industry trends', 'Focus on beginner-friendly explanations', 'Add comparison tables')..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 text-sm resize-none"
                rows={3}
              />
              {customPrompt && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Custom instructions will be included in content generation</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold text-slate-900 dark:text-slate-100">Content Generation</h3><p className="text-sm text-slate-600 dark:text-slate-400">Generating full content with featured images</p></div>
              {!isGeneratingContent && generatedContents.length === 0 && <button onClick={handleGenerateAllContent} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Play className="w-4 h-4" />Start Generation</button>}
            </div>
            {isGeneratingContent && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /><span className="text-sm text-blue-700 dark:text-blue-300">Generating content {currentContentIndex + 1} of {generatedTopics.filter(t => t.selected).length}...</span></div>
                <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${((currentContentIndex + 1) / generatedTopics.filter(t => t.selected).length) * 100}%` }} /></div>
              </div>
            )}
            <div className="space-y-6">
              {generatedContents.map((content, index) => (
                <div key={content.id} className={`rounded-xl border overflow-hidden transition-all ${content.status === "completed" || content.status === "approved" ? "border-green-500" : content.status === "generating" ? "border-blue-500" : content.status === "failed" ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`}>
                  {/* Header with image */}
                  <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                    {content.status === "generating" ? <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" /><p className="text-sm text-slate-600 dark:text-slate-400">Generating...</p></div></div> : content.status === "pending" ? <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-sm text-slate-500">Waiting...</p></div></div> : content.imageUrl ? <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://picsum.photos/400/200?random=${index}`; }} /> : <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-slate-400" /></div>}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${content.status === "completed" ? "bg-green-600 text-white" : content.status === "approved" ? "bg-blue-600 text-white" : content.status === "published" ? "bg-purple-600 text-white" : content.status === "generating" ? "bg-amber-600 text-white" : content.status === "failed" ? "bg-red-600 text-white" : "bg-slate-600 text-white"}`}>{content.status.charAt(0).toUpperCase() + content.status.slice(1)}</div>
                  </div>
                  {/* Content details */}
                  <div className="p-6 bg-white dark:bg-slate-800">
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{content.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><FileText className="w-4 h-4" />{content.wordCount.toLocaleString()} words</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{content.scheduledDate.toLocaleDateString()}</span>
                    </div>
                    {/* Full Content Preview - No truncation */}
                    {content.content && content.status !== "pending" && content.status !== "generating" && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg max-h-[400px] overflow-y-auto border border-slate-200 dark:border-slate-600">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{content.content}</div>
                        </div>
                      </div>
                    )}
                    {content.status === "completed" && (
                      <div className="flex items-center gap-3 mt-4">
                        <button onClick={() => handleApproveContent(content.id)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">Approve</button>
                        <button onClick={() => handlePublishNow(content.id)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Publish Now</button>
                      </div>
                    )}
                    {content.status === "failed" && <p className="text-sm text-red-600 dark:text-red-400 mt-4">{content.error || "Generation failed"}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-white" /></div><div><h3 className="font-semibold text-slate-900 dark:text-slate-100">Review & Save</h3><p className="text-sm text-slate-600 dark:text-slate-400">Save all approved content to your schedule</p></div></div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center"><p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{generatedContents.length}</p><p className="text-xs text-slate-500">Total</p></div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center"><p className="text-2xl font-bold text-green-600">{generatedContents.filter(c => c.status === "completed" || c.status === "approved").length}</p><p className="text-xs text-slate-500">Ready</p></div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center"><p className="text-2xl font-bold text-purple-600">{generatedContents.filter(c => c.status === "published").length}</p><p className="text-xs text-slate-500">Published</p></div>
              </div>
              <button onClick={handleSaveAllScheduled} disabled={isSaving || generatedContents.filter(c => c.status === "completed" || c.status === "approved").length === 0} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">{isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />Save All to Schedule ({generatedContents.filter(c => c.status === "completed" || c.status === "approved").length} posts)</>}</button>
              {saveError && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{saveError}</p>}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Scheduled Posts Summary</h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {generatedContents.map((content, index) => (
                  <div key={content.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-8">#{index + 1}</span>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{content.title}</p><p className="text-xs text-slate-500 dark:text-slate-400">{content.scheduledDate.toLocaleDateString()} at {content.scheduledTime}</p></div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${content.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : content.status === "published" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" : content.status === "completed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300"}`}>{content.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto mt-8 flex items-center justify-between">
        <button onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} disabled={currentStep === 1} className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
        <button onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))} disabled={!canProceed() || currentStep === 6} className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">Continue<ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
