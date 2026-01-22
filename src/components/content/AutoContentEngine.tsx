"use client";

import { useState, useEffect } from "react";
import { 
  Wand2, 
  Globe, 
  MapPin, 
  FileText, 
  Image, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2, 
  Search,
  Target,
  Settings,
  Eye,
  Upload,
  Clock,
  Zap,
  Tag,
  User,
  ImageIcon,
} from "lucide-react";

interface DiscoveryData {
  services: string[];
  locations: string[];
  aboutSummary: string;
  targetAudience: string;
  brandTone: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  existingPages: Array<{
    url: string;
    type: string;
    title: string;
  }>;
}

interface Topic {
  title: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  targetLocations: string[];
  contentType: "blog post" | "landing page";
  description: string;
  searchIntent: "informational" | "commercial" | "local";
  estimatedWordCount?: number;
  difficulty?: "easy" | "medium" | "hard";
}

interface GeneratedContent {
  id: string;
  title: string;
  location: string;
  contentType: string;
  content: string;
  imageUrl?: string;
  featuredImage?: string;
  imagePrompt?: string;
  status: "generating" | "completed" | "failed";
  wordCount: number;
  createdAt: string;
  metadata?: {
    keywords: string[];
    targetLocation: string;
    tone: string;
    contentType: string;
  };
}

export default function AutoContentEngine() {
  const [currentStep, setCurrentStep] = useState(1);
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [generatedTopics, setGeneratedTopics] = useState<Topic[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  const steps = [
    { id: 1, title: "Auto-Discovery", icon: Search, description: "Analyze your website" },
    { id: 2, title: "Service Selection", icon: Target, description: "Choose a service to grow" },
    { id: 3, title: "AI Topics", icon: FileText, description: "Review AI-generated topics" },
    { id: 4, title: "AI Keywords", icon: Tag, description: "Select keywords for targeting" },
    { id: 5, title: "Location Mapping", icon: MapPin, description: "Select target locations" },
    { id: 6, title: "Generation", icon: Wand2, description: "Generate content & images" },
    { id: 7, title: "Review & Publish", icon: Eye, description: "Review and publish content" },
  ];

  useEffect(() => {
    // Auto-start discovery if we have a recent crawl
    loadDiscoveryData();
  }, []);

  const loadDiscoveryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/auto-discovery?crawlRequestId=latest');
      const data = await response.json();
      
      if (data.success) {
        setDiscoveryData(data.data);
        setDataSource(data.source || 'unknown');
        console.log('[Auto-Content] Discovery data loaded from:', data.source);
        console.log('[Auto-Content] Discovery data:', data.data);
      } else {
        throw new Error(data.error || 'Failed to load discovery data');
      }
    } catch (error) {
      console.error('[Auto-Content] Error loading discovery data:', error);
      setError('Failed to load discovery data');
    } finally {
      setLoading(false);
    }
  };

  const generateTopics = async () => {
    if (!selectedService || !discoveryData) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/content/ai-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedService,
          locations: selectedLocations,
          existingContent: discoveryData.existingPages,
          brandTone: discoveryData.brandTone,
          targetAudience: discoveryData.targetAudience,
          aboutSummary: discoveryData.aboutSummary,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('[Auto-Content] Generated topics:', data.topics);
        // Store generated topics separately
        setGeneratedTopics(data.topics);
        // Start with empty selection - user must choose topics
        setSelectedTopics([]);
        setCurrentStep(3); // Go to AI Topics step
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to generate topics');
      console.error('[Auto-Content] Topic generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startBulkGeneration = async () => {
    if (selectedTopics.length === 0 || selectedLocations.length === 0 || !discoveryData) return;

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/content/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedTopics,
          selectedLocations,
          service: selectedService,
          brandTone: discoveryData.brandTone,
          targetAudience: discoveryData.targetAudience,
          aboutSummary: discoveryData.aboutSummary,
          generateImages: true,
          singlePage: true, // Generate only one page instead of multiple
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('[Auto-Content] Content generation started:', data);
        setCurrentStep(6); // Move to review step
        
        // Simulate progress updates for single page
        simulateProgress(data.taskId, 1);
      } else {
        setError(data.error);
        setIsGenerating(false);
      }
    } catch (err) {
      setError('Failed to start content generation');
      setIsGenerating(false);
      console.error('[Auto-Content] Content generation error:', err);
    }
  };

  const generateRealisticContent = (topic: Topic, location: string): string => {
    const sections = [
      `# ${topic.title}`,
      '',
      '## Introduction',
      `In today's digital landscape, businesses in ${location} are increasingly recognizing the importance of ${topic.primaryKeywords[0]}. This comprehensive guide explores how organizations can leverage these strategies to drive growth and achieve their objectives.`,
      '',
      '## Understanding the Landscape',
      `The market in ${location} presents unique opportunities and challenges for businesses looking to implement ${topic.primaryKeywords.join(' and ')}. With the right approach, companies can establish a strong presence and build lasting relationships with their target audience.`,
      '',
      '## Key Benefits',
      `### 1. Enhanced Visibility`,
      `Implementing effective ${topic.primaryKeywords[0]} strategies helps businesses in ${location} improve their online presence and reach potential customers more effectively.`,
      '',
      `### 2. Increased Engagement`,
      `By focusing on ${topic.secondaryKeywords[0]} and ${topic.secondaryKeywords[1]}, organizations can create meaningful connections with their audience and foster long-term loyalty.`,
      '',
      '## Implementation Strategy',
      `To successfully implement ${topic.primaryKeywords[0]} in ${location}, businesses should consider the following approaches:`,
      '',
      '- **Comprehensive Analysis**: Understand your current position and identify opportunities',
      '- **Strategic Planning**: Develop a roadmap that aligns with your business goals',
      '- **Execution**: Implement strategies with precision and consistency',
      '- **Monitoring**: Track performance and make data-driven adjustments',
      '',
      '## Case Studies',
      `Several businesses in ${location} have successfully implemented ${topic.primaryKeywords[0]} strategies and achieved remarkable results. These success stories demonstrate the potential when approaches are tailored to local market conditions.`,
      '',
      '## Best Practices',
      `When implementing ${topic.primaryKeywords.join(' and ')} in ${location}, consider these best practices:`,
      '',
      `1. **Local Market Understanding**: Tailor your approach to the unique characteristics of ${location}`,
      `2. **Quality Focus**: Prioritize value and relevance over quantity`,
      `3. **Continuous Improvement**: Regularly assess and refine your strategies`,
      `4. **Integration**: Ensure all efforts work together cohesively`,
      '',
      '## Measuring Success',
      `Track key performance indicators to measure the effectiveness of your ${topic.primaryKeywords[0]} initiatives:`,
      '',
      '- Engagement metrics and conversion rates',
      '- Return on investment analysis',
      '- Customer satisfaction scores',
      '- Market share growth',
      '',
      '## Future Trends',
      `The landscape of ${topic.primaryKeywords[0]} in ${location} continues to evolve. Stay ahead by monitoring emerging trends and adapting your strategies accordingly.`,
      '',
      '## Conclusion',
      `Successfully implementing ${topic.primaryKeywords[0]} strategies in ${location} requires careful planning, execution, and ongoing optimization. By following the approaches outlined in this guide, businesses can achieve sustainable growth and build a strong market presence.`,
      '',
      `## Call to Action`,
      `Ready to transform your business with ${topic.primaryKeywords[0]}? Contact our expert team today to learn how we can help you achieve your goals in ${location}.`,
      '',
      `---`,
      '',
      `*This content was generated by AI and optimized for businesses in ${location}. For personalized strategies tailored to your specific needs, reach out to our team of experts.*`
    ];
    
    return sections.join('\n');
  };

  const simulateProgress = async (taskId: string, total: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10; // Slower progress for realism
      if (progress >= 99) {
        progress = 99; // Stop at 99% until actual completion
      }
      setGenerationProgress(progress);
    }, 2000); // Update every 2 seconds

    // Poll for actual task results from Trigger.dev
    try {
      const maxAttempts = 60; // 2 minutes max wait (60 * 2 seconds)
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
        
        console.log(`[Auto-Content] Polling for task results, attempt ${attempts}/${maxAttempts}`);
        
        // First try the bulk-generate API
        const response = await fetch(`/api/content/bulk-generate?taskId=${taskId}`);
        const data = await response.json();
        
        // Check if we need to use MCP server (indicated by needsClientSideMCP flag)
        if (data.needsClientSideMCP) {
          console.log("[Auto-Content] Using MCP server for real results");
          
          // Use the MCP server to get real results
          try {
            const mcpResult = await fetch('/api/trigger-mcp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'getRunDetails', runId: taskId })
            });
            
            const mcpData = await mcpResult.json();
            
            if (mcpData.success && mcpData.run && mcpData.run.status === 'COMPLETED') {
              console.log("[Auto-Content] MCP found completed run");
              clearInterval(interval);
              setGenerationProgress(100);
              setIsGenerating(false);
              
              // Extract content from MCP run output
              if (mcpData.run.output && mcpData.run.output.results) {
                setGeneratedContent(mcpData.run.output.results);
                console.log("[Auto-Content] Set MCP content:", mcpData.run.output.results.length, "items");
              }
              
              // Auto-advance to review step
              setTimeout(() => {
                setCurrentStep(7); // Review & Publish step
              }, 1000);
              
              return;
            } else if (mcpData.run && (mcpData.run.status === 'FAILED' || mcpData.run.status === 'CRASHED')) {
              console.error("[Auto-Content] MCP run failed:", mcpData.run.error);
              clearInterval(interval);
              setGenerationProgress(0);
              setIsGenerating(false);
              setError("Content generation failed. Please try again.");
              return;
            }
          } catch (mcpError) {
            console.error("[Auto-Content] MCP call failed:", mcpError);
            // Continue with regular polling
          }
        }
        
        // Regular API polling
        if (data.success && data.status === "COMPLETED") {
          console.log("[Auto-Content] Task completed successfully!");
          clearInterval(interval);
          setGenerationProgress(100);
          setIsGenerating(false);
          
          // Set the real generated content
          if (data.results && data.results.length > 0) {
            setGeneratedContent(data.results);
            console.log("[Auto-Content] Set real content:", data.results.length, "items");
          }
          
          // Auto-advance to review step
          setTimeout(() => {
            setCurrentStep(7); // Review & Publish step
          }, 1000);
          
          return; // Exit polling loop
        } else if (data.status === "FAILED") {
          console.error("[Auto-Content] Task failed:", data.error);
          clearInterval(interval);
          setGenerationProgress(0);
          setIsGenerating(false);
          setError("Content generation failed. Please try again.");
          return;
        }
        
        // Update progress based on actual task progress if available
        if (data.progress !== undefined) {
          setGenerationProgress(data.progress);
        }
      }
      
      // Timeout reached
      console.warn("[Auto-Content] Task polling timeout after 2 minutes");
      clearInterval(interval);
      setGenerationProgress(0);
      setIsGenerating(false);
      setError("Content generation timed out. Please check your Trigger.dev configuration.");
      
    } catch (error) {
      console.error("[Auto-Content] Error polling for results:", error);
      clearInterval(interval);
      setGenerationProgress(0);
      setIsGenerating(false);
      setError("Failed to get content generation results.");
    }
  };

  const toggleTopicSelection = (topic: Topic) => {
    setSelectedTopics(prev => 
      prev.some(t => t.title === topic.title)
        ? prev.filter(t => t.title !== topic.title)
        : [...prev, topic]
    );
  };

  const toggleLocationSelection = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return discoveryData !== null;
      case 2: return selectedService !== "";
      case 3: return selectedTopics.length > 0;
      case 4: return selectedTopics.length > 0; // Keywords step - just need topics selected
      case 5: return selectedLocations.length > 0;
      case 6: return !isGenerating;
      case 7: return generatedContent.length > 0;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DiscoveryStep discoveryData={discoveryData} loading={loading} dataSource={dataSource} />;
      case 2:
        return <ServiceSelectionStep 
          services={discoveryData?.services || []}
          selectedService={selectedService}
          onSelectService={setSelectedService}
        />;
      case 3:
        return <TopicsStep 
          topics={generatedTopics}
          selectedTopics={selectedTopics}
          onToggleTopic={toggleTopicSelection}
          loading={loading}
        />;
      case 4:
        return <KeywordsStep 
          selectedTopics={selectedTopics}
          onContinue={() => setCurrentStep(5)}
        />;
      case 5:
        return <LocationMappingStep 
          locations={discoveryData?.locations || []}
          selectedLocations={selectedLocations}
          onToggleLocation={toggleLocationSelection}
        />;
      case 6:
        return <GenerationStep 
          isGenerating={isGenerating}
          progress={generationProgress}
          totalCombinations={selectedTopics.length * selectedLocations.length}
          onStartGeneration={startBulkGeneration}
        />;
      case 7:
        return <ReviewStep 
          generatedContent={generatedContent}
          selectedTopics={selectedTopics}
          selectedLocations={selectedLocations}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Content Wizard
              </h1>
              <p className="text-white/80 mt-1">
                6-step guided content generation • AI-powered • Location-specific
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep === step.id
                      ? 'bg-white text-indigo-600 border-white shadow-lg ring-4 ring-white/30'
                      : currentStep > step.id
                      ? 'bg-white text-indigo-600 border-white shadow-lg'
                      : 'border-white/40 text-white/60'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden lg:block">
                    <p className={`text-sm font-semibold ${
                      currentStep === step.id
                        ? 'text-white'
                        : currentStep > step.id
                        ? 'text-white'
                        : 'text-white/60'
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-xs ${
                      currentStep === step.id
                        ? 'text-white/80'
                        : 'text-white/50'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all ${
                    currentStep > step.id ? 'bg-white' : currentStep === step.id ? 'bg-white/60' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentStep === 2 && (
                <button
                  onClick={generateTopics}
                  disabled={!selectedService || loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Topics...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate AI Topics
                    </>
                  )}
                </button>
              )}
              
              {currentStep === 3 && (
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={selectedTopics.length === 0 || loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4" />
                      Select Keywords
                    </>
                  )}
                </button>
              )}
              {currentStep === 4 && (
                <button
                  onClick={() => setCurrentStep(5)}
                  disabled={selectedTopics.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  Select Locations
                </button>
              )}
              {currentStep === 5 && (
                <button
                  onClick={startBulkGeneration}
                  disabled={selectedTopics.length === 0 || selectedLocations.length === 0 || isGenerating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all font-medium"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Content
                    </>
                  )}
                </button>
              )}

              {currentStep !== 2 && currentStep !== 3 && currentStep !== 4 && currentStep !== 5 && (
                <button
                  onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
                  disabled={!canProceed() || loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 transition-all font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function DiscoveryStep({ discoveryData, loading, dataSource }: { discoveryData: DiscoveryData | null; loading: boolean; dataSource: string }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Search className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Website Auto-Discovery
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Analyzing your website to extract services, locations, and brand context...
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-slate-600 dark:text-slate-400">Discovering your website context...</span>
        </div>
      ) : discoveryData ? (
        <div>
          {/* Data Source Indicator */}
          {dataSource && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {dataSource === 'content-analysis' 
                    ? '✅ Using data from your latest Content Analysis' 
                    : '⚡ Using auto-discovered data'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Services Found</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{discoveryData.services.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Services identified</p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Locations</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{discoveryData.locations.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Target areas found</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Existing Pages</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{discoveryData.existingPages.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pages analyzed</p>
            </div>
          </div>

          {/* Brand Context Summary */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Brand Context</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Target Audience:</span>
                <p className="text-slate-600 dark:text-slate-400">{discoveryData.targetAudience}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Brand Tone:</span>
                <p className="text-slate-600 dark:text-slate-400">{discoveryData.brandTone}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">About:</span>
                <p className="text-slate-600 dark:text-slate-400">{discoveryData.aboutSummary}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ServiceSelectionStep({ 
  services, 
  selectedService, 
  onSelectService 
}: { 
  services: string[]; 
  selectedService: string; 
  onSelectService: (service: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Select Service to Grow
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose which service you want to generate content for
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <button
            key={service}
            onClick={() => onSelectService(service)}
            className={`p-4 border rounded-lg transition-all ${
              selectedService === service
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedService === service
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-slate-300 dark:border-slate-600'
              }`}>
                {selectedService === service && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {service}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopicsStep({ 
  topics, 
  selectedTopics, 
  onToggleTopic, 
  loading 
}: { 
  topics: Topic[]; 
  selectedTopics: Topic[]; 
  onToggleTopic: (topic: Topic) => void; 
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-600 dark:text-slate-400">Generating AI topics...</span>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            No topics available
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Please go back and select a service to generate topics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          AI-Generated Topics
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Review and select topics for content generation
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
            {topics.length} Available
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
            {selectedTopics.length} Selected
          </span>
        </div>
      </div>

      {selectedTopics.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Please select at least one topic</strong> to continue to the keywords selection step.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {topics.map((topic) => {
          const isSelected = selectedTopics.some(t => t.title === topic.title);
          return (
            <div
              key={topic.title}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              onClick={() => onToggleTopic(topic)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {topic.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      topic.contentType === 'landing page'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}>
                      {topic.contentType}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {topic.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                      <span className="font-medium">Primary:</span> {topic.primaryKeywords.join(', ')}
                    </div>
                    <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                      <span className="font-medium">Intent:</span> {topic.searchIntent}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KeywordsStep({ 
  selectedTopics, 
  onContinue 
}: { 
  selectedTopics: Topic[]; 
  onContinue: () => void;
}) {
  // Collect all keywords from selected topics
  const allPrimaryKeywords = selectedTopics.flatMap(topic => topic.primaryKeywords);
  const allSecondaryKeywords = selectedTopics.flatMap(topic => topic.secondaryKeywords);
  
  // Remove duplicates and sort by length (longer phrases first for SEO importance)
  const uniquePrimaryKeywords = [...new Set(allPrimaryKeywords)].sort((a, b) => b.length - a.length);
  const uniqueSecondaryKeywords = [...new Set(allSecondaryKeywords)].sort((a, b) => b.length - a.length);
  
  // Categorize keywords by type for better SEO organization
  const getKeywordType = (keyword: string) => {
    const wordCount = keyword.trim().split(' ').length;
    if (wordCount >= 3) return 'long-phrase';
    if (wordCount === 2) return 'phrase';
    return 'invalid'; // Should not happen with validation
  };
  
  // Validate all keywords are multi-word
  const validateMultiWordKeywords = (keywords: string[]) => {
    return keywords.filter(keyword => keyword.trim().split(' ').length >= 2);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Tag className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          AI Keywords Selection
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Review the SEO keywords that will be used for content generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Keywords */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Primary Keywords ({uniquePrimaryKeywords.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uniquePrimaryKeywords.map((keyword, index) => {
              const keywordType = getKeywordType(keyword);
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100 block">{keyword}</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 capitalize">{keywordType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {keyword.split(' ').length} words
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">Primary</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Keywords */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            Secondary Keywords ({uniqueSecondaryKeywords.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uniqueSecondaryKeywords.map((keyword, index) => {
              const keywordType = getKeywordType(keyword);
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100 block">{keyword}</span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 capitalize">{keywordType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      {keyword.split(' ').length} words
                    </span>
                    <span className="text-xs text-purple-600 dark:text-purple-400">Secondary</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO Analysis Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">SEO Keyword Analysis</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-slate-600 dark:text-slate-400">{selectedTopics.length} Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              <span className="text-slate-600 dark:text-slate-400">{uniquePrimaryKeywords.length + uniqueSecondaryKeywords.length} Keywords</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Long Phrases</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {[...uniquePrimaryKeywords, ...uniqueSecondaryKeywords].filter(k => getKeywordType(k) === 'long-phrase').length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">3+ words</p>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Short Phrases</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {[...uniquePrimaryKeywords, ...uniqueSecondaryKeywords].filter(k => getKeywordType(k) === 'phrase').length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">2 words</p>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Total Keywords</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {uniquePrimaryKeywords.length + uniqueSecondaryKeywords.length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Multi-word only</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-slate-800 dark:text-slate-200">Selected Topics:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTopics.map((topic, index) => (
              <span key={index} className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full text-sm">
                {topic.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all font-medium"
        >
          Continue to Location Selection
          <MapPin className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function LocationMappingStep({ 
  locations, 
  selectedLocations, 
  onToggleLocation 
}: { 
  locations: string[]; 
  selectedLocations: string[]; 
  onToggleLocation: (location: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Select Target Locations
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose locations for your content targeting
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {locations.map((location) => {
          const isSelected = selectedLocations.includes(location);
          return (
            <button
              key={location}
              onClick={() => onToggleLocation(location)}
              className={`p-3 border rounded-lg transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {location}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GenerationStep({ 
  isGenerating, 
  progress, 
  totalCombinations, 
  onStartGeneration 
}: { 
  isGenerating: boolean; 
  progress: number; 
  totalCombinations: number; 
  onStartGeneration: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Wand2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Content Generation
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Generating {totalCombinations} pieces of content with AI
        </p>
      </div>

      {!isGenerating ? (
        <div className="text-center">
          <button
            onClick={onStartGeneration}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Wand2 className="w-5 h-5" />
            Start Bulk Generation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Generating content and images...
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Progress</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {Math.round(totalCombinations * progress / 100)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalCombinations - Math.round(totalCombinations * progress / 100)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Remaining</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalCombinations}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewStep({ 
  generatedContent, 
  selectedTopics, 
  selectedLocations 
}: { 
  generatedContent: GeneratedContent[]; 
  selectedTopics: Topic[]; 
  selectedLocations: string[]; 
}) {
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewFullContent = (contentId: string) => {
    setExpandedContent(expandedContent === contentId ? null : contentId);
  };

  const handleEdit = (content: GeneratedContent) => {
    setEditingContent(content.id);
    setEditedText(content.content);
  };

  const handleSaveEdit = (contentId: string) => {
    // Update the content in the generatedContent array
    const updatedContent = generatedContent.map(content => 
      content.id === contentId 
        ? { ...content, content: editedText }
        : content
    );
    // This would normally update state, but for now we'll just close the editor
    setEditingContent(null);
    setEditedText("");
  };

  const handlePublishToWordPress = async (content: GeneratedContent) => {
    try {
      setPublishing(content.id);
      
      const response = await fetch('/api/wordpress/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: content.title,
          content: content.content,
          imageUrl: content.imageUrl || content.featuredImage, // Use real image URL from content generator
          location: content.metadata?.targetLocation || content.location || '',
          contentType: content.metadata?.contentType || content.contentType || 'blog post',
          primaryKeywords: content.metadata?.keywords || selectedTopics[0]?.primaryKeywords || [],
          status: 'draft', // Default to draft for review
        }),
      });

      const data = await response.json();
      
      if (data.success && data.post) {
        // Check image status
        const imageStatus = data.imageStatus || {};
        const imageMessage = imageStatus.setAsFeatured 
          ? `Image set as featured (ID: ${imageStatus.featuredMediaId})`
          : imageStatus.sent 
          ? 'Image sent but not set as featured'
          : 'No image included';
        
        alert(`Content "${content.title}" published successfully to WordPress! Post ID: ${data.post.id}\n\nImage Status: ${imageMessage}`);
      } else if (data.success && !data.post) {
        alert(`Content "${content.title}" published successfully, but no post data returned.`);
      } else {
        alert(`Failed to publish: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish to WordPress. Check your WordPress configuration.');
    } finally {
      setPublishing(null);
    }
  };

  // Show loading state while content is being prepared
  if (loading || generatedContent.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-600 dark:text-slate-400">Preparing your content for review...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Review & Publish
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Review your generated content and publish to WordPress
        </p>
      </div>

      <div className="space-y-6">
        {generatedContent.map((content) => (
          <div key={content.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            {/* Header with image */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-start gap-6">
                {(content.featuredImage || content.imageUrl) && (
                  <div className="flex-shrink-0">
                    <img 
                      src={content.featuredImage || content.imageUrl} 
                      alt={content.title}
                      className="w-32 h-32 object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        // Fallback to a reliable placeholder image
                        e.currentTarget.src = `https://picsum.photos/800/600?random=${Date.now()}`;
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {content.title}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
                      {content.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{content.location}</span>
                    </div>
                    <span>•</span>
                    <span>{content.wordCount.toLocaleString()} words</span>
                    <span>•</span>
                    <span className="capitalize">{content.contentType}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewFullContent(content.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {expandedContent === content.id ? 'Show Less' : 'View Full Content'}
                    </button>
                    <button 
                      onClick={() => handleEdit(content)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handlePublishToWordPress(content)}
                      disabled={publishing === content.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      {publishing === content.id ? 'Publishing...' : 'Publish to WordPress'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="p-6">
              {editingContent === content.id ? (
                <div>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none min-h-[400px]"
                    rows={12}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleSaveEdit(content.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingContent(null)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Featured Image in the middle of content */}
                  {(content.featuredImage || content.imageUrl) && (
                    <div className="mb-6">
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <img 
                          src={content.featuredImage || content.imageUrl} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to a reliable placeholder image
                            e.currentTarget.src = `https://picsum.photos/1200/600?random=${Date.now()}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-3 text-white/90 text-sm">
                            {content.metadata?.targetLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {content.metadata.targetLocation}
                              </div>
                            )}
                            {content.metadata?.contentType && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {content.metadata.contentType}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {content.wordCount.toLocaleString()} words
                            </div>
                          </div>
                        </div>
                        {content.imagePrompt && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-white" />
                              <span className="text-xs text-white">AI Generated</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Keywords */}
                  {content.metadata?.keywords && content.metadata.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {content.metadata.keywords.slice(0, 5).map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {expandedContent === content.id ? (
                      <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6">
                        <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                          {content.content}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {content.content.substring(0, 500)}...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Prompt Display */}
                  {content.imagePrompt && (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <h4 className="font-medium text-amber-900 dark:text-amber-100">AI Image Prompt</h4>
                      </div>
                      <p className="text-sm text-amber-800 dark:text-amber-200 italic">
                        "{content.imagePrompt}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
