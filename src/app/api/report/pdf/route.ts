import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export const dynamic = "force-dynamic";

interface AuditData {
  domain: string;
  url: string;
  overallScore: number;
  overallGrade: string;
  seoScore: number;
  linksScore: number;
  usabilityScore: number;
  performanceScore: number;
  socialScore: number;
  contentScore?: number;
  eeatScore?: number;
  technologyScore?: number;
  localSeoScore?: number;
  recommendations: Array<{
    title: string;
    category: string;
    priority: string;
    description?: string;
  }>;
  createdAt: string;
  crawlType?: string;
  pagesScanned?: number;
}

function getScoreColor(score: number): [number, number, number] {
  if (score >= 90) return [23, 198, 83]; // Green
  if (score >= 70) return [27, 132, 255]; // Blue
  if (score >= 50) return [246, 192, 0]; // Yellow
  return [248, 40, 90]; // Red
}

function getPriorityColor(priority: string): [number, number, number] {
  switch (priority.toLowerCase()) {
    case "high": return [220, 38, 38];
    case "medium": return [234, 179, 8];
    default: return [59, 130, 246];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auditData: AuditData = body.auditData;

    if (!auditData) {
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header with gradient effect
    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, pageWidth, 55, "F");
    
    // Accent line
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 55, pageWidth, 3, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("SEO Audit Report", pageWidth / 2, 22, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(auditData.domain, pageWidth / 2, 36, { align: "center" });
    
    // Audit metadata
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    const crawlInfo = auditData.crawlType ? `${auditData.crawlType} Crawl` : "Quick Crawl";
    const pagesInfo = auditData.pagesScanned ? ` | ${auditData.pagesScanned} pages analyzed` : "";
    doc.text(`${crawlInfo}${pagesInfo}`, pageWidth / 2, 47, { align: "center" });

    yPos = 72;

    // Overall Score Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Overall Score", 20, yPos);
    
    // Score circle (simplified rectangle)
    const [r, g, b] = getScoreColor(auditData.overallScore);
    doc.setFillColor(r, g, b);
    doc.roundedRect(pageWidth - 60, yPos - 12, 40, 25, 3, 3, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(`${auditData.overallScore}`, pageWidth - 40, yPos + 3, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Grade: ${auditData.overallGrade}`, pageWidth - 40, yPos + 18, { align: "center" });

    yPos += 35;

    // Category Scores
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Category Scores", 20, yPos);
    yPos += 10;

    const categories = [
      { name: "On-Page SEO", score: auditData.seoScore, icon: "🔍" },
      { name: "Links", score: auditData.linksScore, icon: "🔗" },
      { name: "Usability", score: auditData.usabilityScore, icon: "👤" },
      { name: "Performance", score: auditData.performanceScore, icon: "⚡" },
      { name: "Social", score: auditData.socialScore, icon: "📱" },
      ...(auditData.contentScore !== undefined ? [{ name: "Content Quality", score: auditData.contentScore, icon: "📝" }] : []),
      ...(auditData.eeatScore !== undefined ? [{ name: "E-E-A-T", score: auditData.eeatScore, icon: "🏆" }] : []),
      ...(auditData.technologyScore !== undefined ? [{ name: "Technology", score: auditData.technologyScore, icon: "💻" }] : []),
      ...(auditData.localSeoScore !== undefined ? [{ name: "Local SEO", score: auditData.localSeoScore, icon: "📍" }] : []),
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    categories.forEach((cat) => {
      doc.setTextColor(0, 0, 0);
      doc.text(cat.name, 25, yPos);
      
      // Score bar background
      doc.setFillColor(229, 231, 235);
      doc.rect(100, yPos - 4, 80, 6, "F");
      
      // Score bar fill
      const [cr, cg, cb] = getScoreColor(cat.score);
      doc.setFillColor(cr, cg, cb);
      doc.rect(100, yPos - 4, (cat.score / 100) * 80, 6, "F");
      
      // Score text
      doc.text(`${cat.score}`, 185, yPos);
      
      yPos += 10;
    });

    yPos += 10;

    // Recommendations Section
    if (auditData.recommendations && auditData.recommendations.length > 0) {
      // Check if we need a new page
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Recommendations", 20, yPos);
      yPos += 10;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      // Group by priority
      const highPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "high");
      const mediumPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "medium");
      const lowPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "low");

      const printRecommendations = (recs: typeof auditData.recommendations, label: string) => {
        if (recs.length === 0) return;
        
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        const [pr, pg, pb] = getPriorityColor(label);
        doc.setFillColor(pr, pg, pb);
        doc.setTextColor(255, 255, 255);
        doc.roundedRect(20, yPos - 3, 35, 6, 1, 1, "F");
        doc.setFontSize(8);
        doc.text(label.toUpperCase(), 37, yPos + 1, { align: "center" });
        yPos += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);

        recs.slice(0, 10).forEach((rec) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }

          // Wrap text if needed
          const lines = doc.splitTextToSize(`• ${rec.title}`, pageWidth - 45);
          lines.forEach((line: string, index: number) => {
            doc.text(line, index === 0 ? 25 : 28, yPos);
            yPos += 5;
          });
          
          if (rec.description) {
            doc.setTextColor(107, 114, 128);
            const descLines = doc.splitTextToSize(rec.description, pageWidth - 50);
            descLines.slice(0, 2).forEach((line: string) => {
              doc.text(line, 28, yPos);
              yPos += 4;
            });
            doc.setTextColor(0, 0, 0);
          }
          
          yPos += 2;
        });

        yPos += 5;
      };

      printRecommendations(highPriority, "High");
      printRecommendations(mediumPriority, "Medium");
      printRecommendations(lowPriority, "Low");
    }

    // Summary section before footer
    if (yPos < 240) {
      yPos = Math.max(yPos + 15, 200);
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, "F");
      
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 22, yPos + 10);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const summaryText = auditData.overallScore >= 80 
        ? "Great job! Your site has strong SEO foundations. Focus on the recommendations above to reach excellence."
        : auditData.overallScore >= 60
        ? "Your site has a solid base but needs improvements. Address the high priority items first for best results."
        : "Your site needs significant SEO work. Start with high priority recommendations to see quick improvements.";
      
      const summaryLines = doc.splitTextToSize(summaryText, pageWidth - 50);
      summaryLines.forEach((line: string, idx: number) => {
        doc.text(line, 22, yPos + 18 + (idx * 5));
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer background
      doc.setFillColor(249, 250, 251);
      doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, "F");
      
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(
        `Generated on ${new Date(auditData.createdAt).toLocaleDateString()} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 12,
        { align: "center" }
      );
      doc.setTextColor(59, 130, 246);
      doc.text(
        "SEO Audit Tool - Professional SEO Analysis",
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 6,
        { align: "center" }
      );
    }

    // Generate PDF buffer
    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${auditData.domain}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error) },
      { status: 500 }
    );
  }
}
