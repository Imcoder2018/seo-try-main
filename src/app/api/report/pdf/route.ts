import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";

interface AuditData {
  domain?: string;
  overallScore?: number;
  overallGrade?: string;
  crawlType?: string;
  pagesScanned?: number;
  createdAt?: string;
  localSeoScore?: number;
  seoScore?: number;
  linksScore?: number;
  usabilityScore?: number;
  performanceScore?: number;
  socialScore?: number;
  contentScore?: number;
  eeatScore?: number;
  technologyScore?: number;
  recommendations?: Array<{
    title: string;
    category: string;
    priority: string;
  }>;
}

function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return [34, 197, 94];
  if (score >= 60) return [245, 158, 11];
  if (score >= 40) return [249, 115, 22];
  return [239, 68, 68];
}

function getPriorityColor(priority: string): [number, number, number] {
  switch (priority.toLowerCase()) {
    case "high": return [220, 38, 38];
    case "medium": return [234, 179, 8];
    default: return [59, 130, 246];
  }
}

function getGradeEmoji(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export async function POST(request: NextRequest) {
  try {
    console.log("[PDF API] Starting PDF generation");
    const body = await request.json();
    const auditData: AuditData = body.auditData;

    if (!auditData) {
      console.error("[PDF API] No audit data provided");
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ========== COVER PAGE ==========
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 4, "F");
    doc.setFillColor(99, 102, 241);
    doc.rect(0, pageHeight - 4, pageWidth, 4, "F");

    // Logo
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(pageWidth / 2 - 35, 35, 70, 70, 10, 10, "F");
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SEO", pageWidth / 2, 55, { align: "center" });
    doc.setFontSize(16);
    doc.text("AUDIT", pageWidth / 2, 80, { align: "center" });

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("SEO Audit Report", pageWidth / 2, 130, { align: "center" });

    // Domain
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text(auditData.domain || "Unknown Domain", pageWidth / 2, 160, { align: "center" });

    // Score
    const overallScore = auditData.overallScore ?? 0;
    const [r, g, b] = getScoreColor(overallScore);
    const coverGrade = auditData.overallGrade ?? "N/A";
    
    doc.setFillColor(r, g, b, 0.3);
    doc.circle(pageWidth / 2, 205, 48, "F");
    doc.setFillColor(r, g, b);
    doc.circle(pageWidth / 2, 205, 42, "F");
    doc.setFillColor(15, 23, 42);
    doc.circle(pageWidth / 2, 205, 36, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(`${overallScore}`, pageWidth / 2, 213, { align: "center" });
    doc.setFontSize(12);
    doc.text("/100", pageWidth / 2, 226, { align: "center" });

    // Grade
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth / 2 - 25, 240, 50, 16, 3, 3, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Grade: ${coverGrade}`, pageWidth / 2, 250, { align: "center" });

    // Metadata
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    const createdDate = auditData.createdAt ? new Date(auditData.createdAt) : new Date();
    doc.text(`Generated on ${createdDate.toLocaleDateString()}`, pageWidth / 2, 275, { align: "center" });
    const crawlInfo = auditData.crawlType ? `${auditData.crawlType} Audit` : "Quick Audit";
    const pagesInfo = auditData.pagesScanned ? ` • ${auditData.pagesScanned} pages analyzed` : "";
    doc.text(`${crawlInfo}${pagesInfo}`, pageWidth / 2, 290, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("SEO Audit Tool - Professional SEO Analysis", pageWidth / 2, pageHeight - 30, { align: "center" });

    // ========== EXECUTIVE SUMMARY ==========
    doc.addPage();
    let yPos = 20;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 55, "F");
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 55, pageWidth, 3, "F");

    doc.setFillColor(59, 130, 246);
    doc.circle(pageWidth / 2, 20, 12, "F");
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("✓", pageWidth / 2, 24, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(auditData.domain || "Unknown Domain", pageWidth / 2, 40, { align: "center" });

    yPos = 65;

    // Score card
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, yPos - 5, pageWidth - 30, 55, 4, 4, "F");
    
    doc.setFillColor(r, g, b);
    doc.circle(40, yPos + 27, 20, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(40, yPos + 27, 16, "F");
    doc.setTextColor(r, g, b);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${overallScore}`, 40, yPos + 33, { align: "center" });
    doc.setFontSize(7);
    doc.text("/100", 40, yPos + 42, { align: "center" });

    const execGrade = auditData.overallGrade ?? "N/A";
    doc.setFillColor(r, g, b);
    doc.roundedRect(70, yPos + 10, 35, 22, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(execGrade, 87, yPos + 23, { align: "center" });
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(getGradeEmoji(overallScore), 87, yPos + 38, { align: "center" });

    // Metrics
    const metrics = [
      { label: "Pages", value: auditData.pagesScanned ? String(auditData.pagesScanned) : "N/A" },
      { label: "Type", value: auditData.crawlType || "Quick" },
      { label: "Date", value: createdDate.toLocaleDateString() },
    ];

    doc.setFontSize(9);
    let metricX = 120;
    metrics.forEach((metric) => {
      doc.setTextColor(100, 116, 139);
      doc.text(metric.label + ":", metricX, yPos + 10);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(metric.value, metricX + 35, yPos + 10);
      doc.setFont("helvetica", "normal");
      metricX += 75;
    });

    yPos += 55;

    // Overview
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, yPos - 3, pageWidth - 30, 40, 3, 3, "F");
    
    doc.setFillColor(59, 130, 246);
    doc.circle(25, yPos + 18, 8, "F");
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("✓", 25, yPos + 22, { align: "center" });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Key Insights", 40, yPos + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    let summaryText = "";
    if (overallScore >= 80) {
      summaryText = "Excellent! Your website demonstrates strong SEO fundamentals. The high score indicates good technical implementation, content quality, and user experience. Focus on the high-priority recommendations to achieve SEO excellence.";
    } else if (overallScore >= 60) {
      summaryText = "Good foundation! Your site has solid SEO basics. There are opportunities to improve technical performance, content optimization, and local visibility. Addressing high-priority items will yield the best ROI.";
    } else {
      summaryText = "Growth opportunity! Your site needs significant SEO improvements. Start with technical fixes, content optimization, and local SEO enhancements. The recommendations are prioritized for quick results.";
    }

    const lines = doc.splitTextToSize(summaryText, pageWidth - 55);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, 40, yPos + 15 + (idx * 5));
    });

    yPos += 50;

    // Category Performance
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, yPos - 3, pageWidth - 30, 12, 2, 2, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Performance by Category", 20, yPos + 3);

    yPos += 18;

    const categories = [
      ...(auditData.localSeoScore !== null && auditData.localSeoScore !== undefined ? [{ name: "Local SEO", score: auditData.localSeoScore }] : []),
      { name: "On-Page SEO", score: auditData.seoScore ?? 0 },
      { name: "Links", score: auditData.linksScore ?? 0 },
      { name: "Usability", score: auditData.usabilityScore ?? 0 },
      { name: "Performance", score: auditData.performanceScore ?? 0 },
      { name: "Social", score: auditData.socialScore ?? 0 },
      ...(auditData.contentScore !== null && auditData.contentScore !== undefined ? [{ name: "Content Quality", score: auditData.contentScore }] : []),
      ...(auditData.eeatScore !== null && auditData.eeatScore !== undefined ? [{ name: "E-E-A-T", score: auditData.eeatScore }] : []),
      ...(auditData.technologyScore !== null && auditData.technologyScore !== undefined ? [{ name: "Technology", score: auditData.technologyScore }] : []),
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    categories.forEach((cat, index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, yPos - 2, pageWidth - 30, 14, "F");
      } else {
        doc.setFillColor(241, 245, 249);
        doc.rect(15, yPos - 2, pageWidth - 30, 14, "F");
      }

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(cat.name, 25, yPos + 6);

      doc.setFillColor(226, 232, 240);
      doc.roundedRect(100, yPos + 1, 80, 6, 2, 2, "F");
      const [cr, cg, cb] = getScoreColor(cat.score);
      doc.setFillColor(cr, cg, cb);
      const barWidth = Math.max((cat.score / 100) * 80, 4);
      doc.roundedRect(100, yPos + 1, barWidth, 6, 2, 2, "F");

      doc.setFillColor(cr, cg, cb);
      doc.circle(193, yPos + 5, 7, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${cat.score}`, 193, yPos + 8, { align: "center" });

      yPos += 14;
    });

    // Recommendations
    if (auditData.recommendations && auditData.recommendations.length > 0) {
      doc.addPage();
      yPos = 20;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 60, "F");
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 60, pageWidth, 4, "F");

      doc.setFillColor(59, 130, 246);
      doc.circle(pageWidth / 2, 25, 15, "F");
      doc.setFillColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("✓", pageWidth / 2, 30, { align: "center" });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Actionable Recommendations", pageWidth / 2, 38, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`${auditData.recommendations.length} prioritized improvements`, pageWidth / 2, 50, { align: "center" });

      yPos = 75;

      const highPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "high");
      const mediumPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "medium");
      const lowPriority = auditData.recommendations.filter(r => r.priority.toLowerCase() === "low");

      const printRecommendations = (recs: typeof auditData.recommendations, label: string) => {
        if (recs.length === 0) return;

        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 20;
        }

        const [pr, pg, pb] = getPriorityColor(label);
        doc.setFillColor(pr, pg, pb);
        doc.roundedRect(15, yPos - 5, pageWidth - 30, 16, 3, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${label.toUpperCase()} PRIORITY`, 25, yPos + 7);

        doc.setFillColor(255, 255, 255, 0.25);
        doc.roundedRect(pageWidth - 55, yPos - 2, 30, 12, 2, 2, "F");
        doc.setFontSize(10);
        doc.text(`${recs.length} items`, pageWidth - 40, yPos + 5, { align: "center" });

        yPos += 22;

        recs.slice(0, 6).forEach((rec, idx) => {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFillColor(0, 0, 0, 0.04);
          doc.roundedRect(22, yPos, pageWidth - 44, 26, 3, 3, "F");

          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(20, yPos - 2, pageWidth - 40, 26, 3, 3, "FD");

          doc.setFillColor(pr, pg, pb, 0.3);
          doc.circle(40, yPos + 11, 10, "F");
          doc.setFillColor(pr, pg, pb);
          doc.circle(40, yPos + 11, 8, "F");
          doc.setFillColor(255, 255, 255, 0.2);
          doc.circle(40, yPos + 11, 6, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`${idx + 1}`, 40, yPos + 15, { align: "center" });

          doc.setTextColor(15, 23, 42);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          const titleLines = doc.splitTextToSize(rec.title, pageWidth - 85);
          doc.text(titleLines[0], 58, yPos + 6);

          doc.setFillColor(241, 245, 249);
          doc.roundedRect(58, yPos + 13, 38, 7, 2, 2, "F");
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.text(rec.category.toUpperCase(), 77, yPos + 18, { align: "center" });

          doc.setFillColor(pr, pg, pb);
          doc.circle(pageWidth - 45, yPos + 11, 5, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(6);
          doc.text("!", pageWidth - 45, yPos + 13, { align: "center" });

          yPos += 30;
        });

        yPos += 12;
      };

      printRecommendations(highPriority, "High");
      printRecommendations(mediumPriority, "Medium");
      printRecommendations(lowPriority, "Low");
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    const footerDate = auditData.createdAt ? new Date(auditData.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFillColor(15, 23, 42);
      doc.rect(0, pageHeight - 30, pageWidth, 30, "F");
      doc.setFillColor(59, 130, 246);
      doc.rect(0, pageHeight - 30, pageWidth, 2, "F");

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Generated on ${footerDate} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 18,
        { align: "center" }
      );
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(
        "SEO Audit Tool - Professional SEO Analysis",
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    }

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${auditData.domain || "report"}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[PDF API] PDF generation error:", error);
    console.error("[PDF API] Error stack:", error instanceof Error ? error.stack : "No stack available");
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error) },
      { status: 500 }
    );
  }
}
