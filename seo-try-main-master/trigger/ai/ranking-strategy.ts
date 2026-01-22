import { task, metadata } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";

interface AuditData {
  domain: string;
  url: string;
  overallScore: number;
  seoResults: Record<string, unknown>;
  linksResults: Record<string, unknown>;
  performanceResults: Record<string, unknown>;
  contentResults: Record<string, unknown>;
  eeatResults: Record<string, unknown>;
  accessibilityResults: Record<string, unknown>;
  recommendations: Array<{ title: string; category: string; priority: string }>;
}

interface BusinessInfo {
  businessName?: string;
  industry?: string;
  targetAudience?: string;
  competitors?: string[];
  goals?: string[];
  location?: string;
}

async function runAgent(
  openai: OpenAI,
  agentType: string,
  auditData: AuditData,
  businessInfo: BusinessInfo,
  systemPrompt: string
): Promise<Record<string, unknown>> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt + "\n\nRespond with valid JSON only." },
      {
        role: "user",
        content: `Analyze this website and provide recommendations:

Website: ${auditData.domain}
URL: ${auditData.url}
Current SEO Score: ${auditData.overallScore}/100

Business Info:
- Name: ${businessInfo.businessName || "Not provided"}
- Industry: ${businessInfo.industry || "Not provided"}
- Target Audience: ${businessInfo.targetAudience || "Not provided"}
- Location: ${businessInfo.location || "Not provided"}
- Competitors: ${businessInfo.competitors?.join(", ") || "Not provided"}
- Goals: ${businessInfo.goals?.join(", ") || "Not provided"}

SEO Analysis Results:
${JSON.stringify(auditData.seoResults, null, 2)}

Performance Results:
${JSON.stringify(auditData.performanceResults, null, 2)}

Content Analysis:
${JSON.stringify(auditData.contentResults, null, 2)}

E-E-A-T Analysis:
${JSON.stringify(auditData.eeatResults, null, 2)}

Current Recommendations:
${auditData.recommendations.map(r => `- [${r.priority}] ${r.title}`).join("\n")}`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 4000,
  });

  const content = completion.choices[0].message.content;
  return content ? JSON.parse(content) : {};
}

export const generateRankingStrategy = task({
  id: "generate-ranking-strategy",
  retry: { maxAttempts: 2 },
  run: async (payload: { auditData: AuditData; businessInfo: BusinessInfo }) => {
    const { auditData, businessInfo } = payload;
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    metadata.set("status", "Starting AI analysis...");
    metadata.set("progress", 5);

    // Step 1: Analysis Agent
    metadata.set("status", "Running Analysis Agent...");
    metadata.set("progress", 10);
    
    const analysisResult = await runAgent(
      openai,
      "analysis",
      auditData,
      businessInfo,
      `You are an expert SEO analyst. Analyze the provided audit data and return JSON with:
{
  "currentScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "opportunities": [{ "category": string, "priority": "critical|high|medium|low", "description": string, "potentialImpact": string }],
  "competitorInsights": string[]
}

Be specific and actionable in your analysis.`
    );

    // Step 2: Content Strategy Agent
    metadata.set("status", "Running Content Strategy Agent...");
    metadata.set("progress", 25);
    
    const contentStrategy = await runAgent(
      openai,
      "content_strategy",
      auditData,
      businessInfo,
      `You are a content strategy expert. Based on the audit data, return JSON with:
{
  "contentPillars": [{ "topic": string, "targetKeywords": string[], "contentType": "blog|service-page|landing-page|faq|guide", "estimatedImpact": string, "difficulty": "easy|medium|hard" }],
  "contentCalendar": [{ "week": number, "title": string, "targetKeyword": string, "wordCount": number, "outline": string[] }],
  "existingContentOptimizations": [{ "page": string, "currentIssue": string, "suggestedFix": string, "priority": "high|medium|low" }]
}

Focus on topics that will drive organic traffic.`
    );

    // Step 3: Technical SEO Agent
    metadata.set("status", "Running Technical SEO Agent...");
    metadata.set("progress", 40);
    
    const technicalStrategy = await runAgent(
      openai,
      "technical_seo",
      auditData,
      businessInfo,
      `You are a technical SEO expert. Based on the audit data, return JSON with:
{
  "criticalFixes": [{ "issue": string, "currentState": string, "fixAction": string, "codeSnippet": string, "priority": "critical|high|medium", "estimatedTime": string }],
  "schemaRecommendations": [{ "schemaType": string, "description": string, "jsonLdExample": string }],
  "performanceImprovements": [{ "metric": string, "currentValue": string, "targetValue": string, "fixes": string[] }]
}

Prioritize fixes with biggest ranking impact.`
    );

    // Step 4: Local SEO Agent
    metadata.set("status", "Running Local SEO Agent...");
    metadata.set("progress", 55);
    
    const localStrategy = await runAgent(
      openai,
      "local_seo",
      auditData,
      businessInfo,
      `You are a local SEO expert. Based on the audit data, return JSON with:
{
  "gbpOptimizations": [{ "field": string, "recommendation": string, "impact": "high|medium|low" }],
  "citationOpportunities": [{ "directory": string, "category": string, "priority": number }],
  "reviewStrategy": { "recommendations": string[], "reviewRequestTemplate": string, "reviewResponseTemplates": { "positive": string, "negative": string } },
  "localContentIdeas": [{ "title": string, "localKeyword": string, "description": string }]
}

Focus on local pack ranking strategies.`
    );

    // Step 5: E-E-A-T Agent
    metadata.set("status", "Running E-E-A-T Agent...");
    metadata.set("progress", 70);
    
    const eeatStrategy = await runAgent(
      openai,
      "eeat",
      auditData,
      businessInfo,
      `You are an E-E-A-T expert. Based on the audit data, return JSON with:
{
  "experienceSignals": [{ "signal": string, "status": "present|missing|weak", "implementation": string }],
  "expertiseSignals": [{ "signal": string, "status": "present|missing|weak", "implementation": string }],
  "authorityBuilding": [{ "action": string, "timeline": string, "expectedOutcome": string }],
  "trustEnhancements": [{ "element": string, "implementation": string, "priority": "critical|high|medium" }]
}

Focus on Google's ranking signals.`
    );

    // Step 6: Orchestrator - Combine all strategies
    metadata.set("status", "Generating final strategy...");
    metadata.set("progress", 85);

    const finalStrategyResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a senior SEO strategist. Combine insights from specialist agents into a comprehensive ranking strategy.

Return JSON with:
{
  "executiveSummary": string,
  "overallScore": number,
  "rankingPotential": "high|medium|low",
  "estimatedTimeToResults": string,
  "phases": [{ "phase": number, "name": string, "duration": string, "tasks": [{ "task": string, "category": string, "priority": number, "assignee": "developer|content-writer|seo-specialist|business-owner", "estimatedHours": number }], "expectedOutcome": string }],
  "keyMetricsToTrack": [{ "metric": string, "currentValue": string, "targetValue": string, "trackingMethod": string }],
  "monthlyMilestones": [{ "month": number, "goals": string[] }]
}

Create a practical phased plan for small business.`,
        },
        {
          role: "user",
          content: `Based on these specialist analyses, create a comprehensive ranking strategy:

ANALYSIS RESULTS:
${JSON.stringify(analysisResult, null, 2)}

CONTENT STRATEGY:
${JSON.stringify(contentStrategy, null, 2)}

TECHNICAL SEO:
${JSON.stringify(technicalStrategy, null, 2)}

LOCAL SEO:
${JSON.stringify(localStrategy, null, 2)}

E-E-A-T STRATEGY:
${JSON.stringify(eeatStrategy, null, 2)}

Website: ${auditData.domain}
Current Score: ${auditData.overallScore}/100
Business: ${businessInfo.businessName || "Local Business"}
Industry: ${businessInfo.industry || "General"}
Location: ${businessInfo.location || "Not specified"}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const finalContent = finalStrategyResponse.choices[0].message.content;
    const finalStrategy = finalContent ? JSON.parse(finalContent) : {};

    metadata.set("status", "Strategy complete!");
    metadata.set("progress", 100);

    return {
      analysis: analysisResult,
      contentStrategy,
      technicalStrategy,
      localStrategy,
      eeatStrategy,
      finalStrategy,
      generatedAt: new Date().toISOString(),
    };
  },
});
