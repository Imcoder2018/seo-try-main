import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { tasks } from "@trigger.dev/sdk/v3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { 
      selectedTopics,
      selectedLocations,
      service,
      brandTone,
      targetAudience,
      aboutSummary,
      generateImages = false,
      singlePage = true, // New parameter to generate only one page
      customPrompt = '',
      scrapedContent = ''
    } = body;

    if (!selectedTopics || selectedTopics.length === 0) {
      return NextResponse.json(
        { error: "At least one topic must be selected" },
        { status: 400 }
      );
    }

    if (!selectedLocations || selectedLocations.length === 0) {
      return NextResponse.json(
        { error: "At least one location must be selected" },
        { status: 400 }
      );
    }

    console.log("[Bulk Generate] Starting content generation:", {
      topics: selectedTopics.length,
      locations: selectedLocations.length,
      service,
      singlePage,
    });

    // If singlePage is true, only generate one combination (first topic + first location)
    let combinations = [];
    if (singlePage) {
      const topic = selectedTopics[0];
      // Use topic's targetLocations if available, otherwise use selectedLocations
      // If topic has targetLocations array, use its first location; otherwise use selectedLocations[0]
      const topicLocations = topic.targetLocations && topic.targetLocations.length > 0 
        ? topic.targetLocations 
        : selectedLocations;
      const location = topicLocations[0] || selectedLocations[0] || '';
      
      combinations = [{
        topic,
        location,
        service,
        brandTone,
        targetAudience,
        aboutSummary,
        generateImages,
        customPrompt,
        scrapedContent,
      }];
      console.log("[Bulk Generate] Single page mode: generating 1 piece of content for location:", location);
    } else {
      // Create all topic-location combinations (original behavior)
      for (const topic of selectedTopics) {
        // Use topic's targetLocations if available, otherwise use selectedLocations
        const topicLocations = topic.targetLocations && topic.targetLocations.length > 0 
          ? topic.targetLocations 
          : selectedLocations;
        
        for (const location of topicLocations) {
          combinations.push({
            topic,
            location,
            service,
            brandTone,
            targetAudience,
            aboutSummary,
            generateImages,
            customPrompt,
            scrapedContent,
          });
        }
      }
      console.log("[Bulk Generate] Bulk mode: generating", combinations.length, "pieces of content");
    }

    // Trigger content generation task
    const handle = await tasks.trigger("content-generator", {
      combinations,
      userId: user.id,
      generateImages,
      singlePage,
    });

    return NextResponse.json({
      success: true,
      taskId: handle.id,
      totalCombinations: combinations.length,
      message: `Started generating ${combinations.length} piece${combinations.length === 1 ? '' : 's'} of content`,
    });
  } catch (error) {
    console.error("[Bulk Generate] Error:", error);
    return NextResponse.json(
      { error: "Failed to start content generation", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    console.log("[Bulk Generate GET] Checking status for task:", taskId);

    // Try to get real task results from Trigger.dev
    const realResults = await getTriggerDevTaskResults(taskId);
    
    if (realResults && realResults.needsClientSideMCP) {
      // Return the response indicating MCP should be used
      console.log("[Bulk Generate GET] MCP needed for task:", taskId);
      return NextResponse.json(realResults);
    } else if (realResults) {
      return NextResponse.json(realResults);
    } else {
      // Don't return fallback results here - let the frontend handle MCP
      console.log("[Bulk Generate GET] No results available, letting frontend handle MCP");
      return NextResponse.json({
        success: false,
        needsClientSideMCP: true,
        taskId,
        status: "PENDING",
        progress: 0,
        results: []
      });
    }
  } catch (error) {
    console.error("[Bulk Generate GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to get generation status", details: String(error) },
      { status: 500 }
    );
  }
}

// Helper function to get Trigger.dev task results
async function getTriggerDevTaskResults(taskId: string) {
  try {
    console.log("[Trigger.dev] Getting run results for:", taskId);
    
    // Use Trigger.dev SDK to retrieve the run
    const { runs } = await import("@trigger.dev/sdk/v3");
    const run = await runs.retrieve(taskId);
    
    console.log("[Trigger.dev] Retrieved run:", {
      id: run.id,
      status: run.status,
      isCompleted: run.status === "COMPLETED"
    });
    
    // If the run is completed, return the actual results
    if (run.status === "COMPLETED" && run.output) {
      return {
        success: true,
        status: "COMPLETED",
        progress: 100,
        total: run.output.results?.length || 1,
        completed: run.output.results?.length || 1,
        failed: 0,
        results: run.output.results || [],
        summary: run.output.summary || {
          total: run.output.results?.length || 1,
          completed: run.output.results?.length || 1,
          failed: 0
        }
      };
    } else if (run.status === "FAILED" || run.status === "CRASHED") {
      return {
        success: false,
        status: "FAILED",
        error: run.error || "Task execution failed",
        progress: 0,
        results: []
      };
    } else {
      // Task is still running
      return {
        success: false,
        needsClientSideMCP: false,
        taskId,
        status: run.status,
        progress: run.status === "EXECUTING" ? 50 : 0,
        results: []
      };
    }
    
  } catch (error) {
    console.error("[Trigger.dev] Failed to get run results:", error);
    // If we can't get results, indicate that client-side MCP should be used
    return {
      success: false,
      needsClientSideMCP: true,
      taskId
    };
  }
}

// Fallback function for when real results aren't available
function getFallbackResults() {
  return {
    success: true,
    status: "COMPLETED",
    progress: 100,
    total: 1,
    completed: 1,
    failed: 0,
    results: [
      {
        id: `content_${Date.now()}_0`,
        title: "Advanced Business Automation Solutions for Digital Transformation",
        location: "Lahore",
        contentType: "blog post",
        content: `Title: Advanced Business Automation Solutions for Digital Transformation in Lahore

Introduction:
In the heart of Pakistan's technological revolution, Lahore businesses are embracing advanced automation solutions to drive digital transformation. The convergence of artificial intelligence, machine learning, and robotic process automation is creating unprecedented opportunities for businesses to optimize operations and achieve sustainable growth.

The Automation Revolution:
Business automation has evolved from simple task automation to intelligent, AI-driven systems that can learn, adapt, and make decisions. This transformation is enabling Lahore businesses to compete on a global scale while maintaining operational excellence.

Key Automation Technologies:

1. Artificial Intelligence & Machine Learning:
AI-powered systems can analyze vast amounts of data, predict trends, and automate complex decision-making processes. Machine learning algorithms continuously improve performance based on historical data and user interactions.

2. Robotic Process Automation (RPA):
RPA bots handle repetitive, rule-based tasks with precision and speed, freeing human workers to focus on strategic initiatives that require creativity and critical thinking.

3. Intelligent Document Processing:
Advanced OCR and NLP technologies automatically extract, classify, and process documents, reducing manual data entry by up to 95%.

4. Workflow Automation:
Sophisticated workflow engines orchestrate complex business processes across multiple departments and systems, ensuring seamless operations and real-time visibility.

Benefits for Lahore Businesses:

Operational Excellence:
Automation reduces errors, improves consistency, and ensures compliance with industry standards. Businesses report 60-80% reduction in processing times for automated workflows.

Cost Optimization:
While initial investment varies, businesses typically achieve 30-50% reduction in operational costs within the first year of automation implementation.

Scalability:
Automated systems can handle increased workload without proportional increases in resources, enabling businesses to scale operations efficiently.

Customer Experience:
Automation enables 24/7 service availability, faster response times, and personalized interactions that enhance customer satisfaction.

Implementation Strategy:

Phase 1: Assessment and Planning
- Identify automation opportunities
- Calculate ROI and prioritize initiatives
- Develop comprehensive implementation roadmap

Phase 2: Technology Selection
- Evaluate automation platforms
- Choose appropriate tools and technologies
- Ensure integration capabilities with existing systems

Phase 3: Implementation and Testing
- Deploy automation solutions incrementally
- Conduct thorough testing and validation
- Train staff on new processes and tools

Phase 4: Optimization and Scaling
- Monitor performance and gather feedback
- Refine processes and expand automation scope
- Continuously improve based on analytics and insights

Success Metrics:
- Processing time reduction
- Error rate improvement
- Cost savings achieved
- Customer satisfaction scores
- Employee productivity gains

Future Trends:
The future of business automation in Lahore includes:
- Hyperautomation initiatives
- AI-driven decision automation
- Integration with IoT devices
- Cloud-native automation platforms
- Low-code/no-code automation tools

Conclusion:
Business automation is no longer optional for Lahore businesses seeking competitive advantage. By embracing advanced automation technologies, organizations can achieve operational excellence, drive innovation, and position themselves for long-term success in the digital economy.

Call to Action:
Transform your business with cutting-edge automation solutions. Contact our team today for a comprehensive automation assessment and discover how we can help you achieve digital transformation excellence.`,
        imageUrl: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-qi2NpQOcFSkA7YMqZvCe4RhG/user-6prhmEqvySDclLWU8fqTeqM2/img-business-automation-lahore.png?st=2026-01-23T02%3A30%3A00Z&se=2026-01-23T04%3A30%3A00Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=77e5a8ec-6bd1-4477-8afc-16703a64f029&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-01-23T02%3A30%3A00Z&ske=2026-01-24T02%3A30%3A00Z&sks=b&skv=2024-08-04&sig=LahoreAutomation2026%3D",
        wordCount: 3850,
        keywords: [
          "business automation solutions",
          "digital transformation",
          "AI automation",
          "process optimization",
          "operational excellence",
          "workflow automation",
          "intelligent systems",
          "scalable operations"
        ],
        status: "completed"
      }
    ]
  };
}
