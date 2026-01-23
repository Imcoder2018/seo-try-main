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
  passedChecks?: number;
  warningChecks?: number;
  failedChecks?: number;
  recommendations?: Array<{
    title: string;
    category: string;
    priority: string;
    description?: string;
  }>;
}

// Color utilities
const COLORS = {
  primary: [79, 70, 229] as [number, number, number],
  primaryLight: [99, 102, 241] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  darkAlt: [30, 41, 59] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  grayLight: [243, 244, 246] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
};

function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return COLORS.green;
  if (score >= 60) return COLORS.amber;
  return COLORS.red;
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

function getPriorityColor(priority: string): [number, number, number] {
  switch (priority.toLowerCase()) {
    case "high": return COLORS.red;
    case "medium": return COLORS.amber;
    default: return [59, 130, 246];
  }
}

function drawSectionHeader(doc: jsPDF, pageWidth: number, title: string, subtitle: string, sectionNum: number) {
  // Dark header
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  // Accent line
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 40, pageWidth, 3, "F");
  
  // Section badge
  doc.setFillColor(...COLORS.primary);
  doc.circle(25, 20, 10, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(String(sectionNum), 25, 24, { align: "center" });
  
  // Title
  doc.setFontSize(16);
  doc.text(title, 45, 18);
  
  // Subtitle
  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 45, 30);
}

export async function POST(request: NextRequest) {
  try {
    console.log("[PDF API] Starting PDF generation");
    const body = await request.json();
    const auditData: AuditData = body.auditData;
    
    console.log("[PDF API] Audit data received:", JSON.stringify(auditData, null, 2).substring(0, 500));

    if (!auditData) {
      console.error("[PDF API] No audit data provided");
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Extract domain properly
    const domain = auditData.domain || "Website";
    const overallScore = auditData.overallScore ?? 0;
    const [r, g, b] = getScoreColor(overallScore);
    const grade = auditData.overallGrade || (overallScore >= 80 ? "A" : overallScore >= 60 ? "B" : overallScore >= 40 ? "C" : "D");
    const createdDate = auditData.createdAt ? new Date(auditData.createdAt) : new Date();
    
    // Calculate stats from recommendations or use provided
    const passedCount = auditData.passedChecks ?? Math.round(overallScore / 10);
    const warningCount = auditData.warningChecks ?? Math.round((100 - overallScore) / 25);
    const failedCount = auditData.failedChecks ?? (auditData.recommendations?.filter(r => r.priority === 'high').length ?? 0);

    // ==================== COVER PAGE ====================
    // Dark gradient background
    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    
    // Top accent bar
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 5, "F");
    
    // Bottom accent bar  
    doc.setFillColor(79, 70, 229);
    doc.rect(0, pageHeight - 5, pageWidth, 5, "F");

    // Logo circle
    doc.setFillColor(79, 70, 229);
    doc.circle(pageWidth / 2, 50, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SEO", pageWidth / 2, 47, { align: "center" });
    doc.setFontSize(10);
    doc.text("AUDIT", pageWidth / 2, 58, { align: "center" });

    // Main title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Website SEO", pageWidth / 2, 100, { align: "center" });
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241);
    doc.text("Health Report", pageWidth / 2, 115, { align: "center" });

    // Domain box
    doc.setFillColor(31, 41, 55);
    doc.roundedRect(30, 130, pageWidth - 60, 20, 4, 4, "F");
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(domain, pageWidth / 2, 143, { align: "center" });

    // Score circle - outer ring
    doc.setFillColor(r, g, b);
    doc.circle(pageWidth / 2, 195, 40, "F");
    // Inner dark circle
    doc.setFillColor(17, 24, 39);
    doc.circle(pageWidth / 2, 195, 32, "F");
    // Score text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(String(overallScore), pageWidth / 2, 200, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text("out of 100", pageWidth / 2, 212, { align: "center" });

    // Grade badge
    doc.setFillColor(r, g, b);
    doc.roundedRect(pageWidth / 2 - 20, 230, 40, 18, 9, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grade ${grade}`, pageWidth / 2, 242, { align: "center" });

    // Stats boxes
    const boxWidth = 50;
    const boxGap = 10;
    const totalWidth = boxWidth * 3 + boxGap * 2;
    const startX = (pageWidth - totalWidth) / 2;
    const statsY = 265;

    // Passed box
    doc.setFillColor(22, 163, 74);
    doc.roundedRect(startX, statsY, boxWidth, 40, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(String(passedCount), startX + boxWidth / 2, statsY + 18, { align: "center" });
    doc.setFontSize(8);
    doc.text("PASSED", startX + boxWidth / 2, statsY + 32, { align: "center" });

    // Warnings box
    doc.setFillColor(217, 119, 6);
    doc.roundedRect(startX + boxWidth + boxGap, statsY, boxWidth, 40, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(String(warningCount), startX + boxWidth + boxGap + boxWidth / 2, statsY + 18, { align: "center" });
    doc.setFontSize(8);
    doc.text("WARNINGS", startX + boxWidth + boxGap + boxWidth / 2, statsY + 32, { align: "center" });

    // Issues box
    doc.setFillColor(220, 38, 38);
    doc.roundedRect(startX + (boxWidth + boxGap) * 2, statsY, boxWidth, 40, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(String(failedCount), startX + (boxWidth + boxGap) * 2 + boxWidth / 2, statsY + 18, { align: "center" });
    doc.setFontSize(8);
    doc.text("ISSUES", startX + (boxWidth + boxGap) * 2 + boxWidth / 2, statsY + 32, { align: "center" });

    // Metadata
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const crawlText = auditData.crawlType ? `${auditData.crawlType} Audit` : "SEO Audit";
    const pagesText = auditData.pagesScanned ? ` | ${auditData.pagesScanned} pages` : "";
    doc.text(`${crawlText}${pagesText}`, pageWidth / 2, 325, { align: "center" });
    doc.text(`Generated: ${createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 338, { align: "center" });

    // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
    doc.addPage();
    drawSectionHeader(doc, pageWidth, "Executive Summary", `Performance analysis for ${domain}`, 1);
    
    let yPos = 58;

    // Score overview card
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(15, yPos, pageWidth - 30, 50, 4, 4, "F");
    
    // Score circle in card
    doc.setFillColor(r, g, b);
    doc.circle(45, yPos + 25, 18, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(45, yPos + 25, 14, "F");
    doc.setTextColor(r, g, b);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(String(overallScore), 45, yPos + 29, { align: "center" });

    // Grade box
    doc.setFillColor(r, g, b);
    doc.roundedRect(75, yPos + 12, 30, 18, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(grade, 90, yPos + 24, { align: "center" });
    
    // Label
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(getScoreLabel(overallScore), 90, yPos + 38, { align: "center" });

    // Metrics row
    const metricsData = [
      { label: "Pages", value: auditData.pagesScanned ? String(auditData.pagesScanned) : "N/A" },
      { label: "Type", value: auditData.crawlType || "Quick" },
      { label: "Date", value: createdDate.toLocaleDateString() },
    ];
    
    let metricX = 120;
    metricsData.forEach(m => {
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.text(m.label, metricX, yPos + 15);
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(m.value, metricX, yPos + 26);
      doc.setFont("helvetica", "normal");
      metricX += 30;
    });

    yPos += 60;

    // Key insights box
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(15, yPos, pageWidth - 30, 35, 4, 4, "F");
    doc.setFillColor(59, 130, 246);
    doc.circle(30, yPos + 17, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("i", 30, yPos + 21, { align: "center" });
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(11);
    doc.text("Key Insights", 45, yPos + 12);
    
    const insightText = overallScore >= 80 
      ? "Excellent SEO health! Focus on maintaining current practices and addressing minor improvements."
      : overallScore >= 60 
      ? "Good foundation with room for growth. Address high-priority issues for best results."
      : "Significant improvements needed. Start with critical issues to boost visibility.";
    
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const insightLines = doc.splitTextToSize(insightText, pageWidth - 60);
    doc.text(insightLines, 45, yPos + 24);

    yPos += 45;

    // Category performance header
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(15, yPos, pageWidth - 30, 12, 2, 2, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Performance by Category", 20, yPos + 8);
    
    yPos += 18;

    // Categories list
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

    // ==================== PAGE 3: RECOMMENDATIONS ====================
    if (auditData.recommendations && auditData.recommendations.length > 0) {
      doc.addPage();
      drawSectionHeader(doc, pageWidth, "Actionable Recommendations", `${auditData.recommendations.length} prioritized improvements for ${domain}`, 2);
      
      yPos = 58;

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

    // ==================== FOOTER ON ALL PAGES ====================
    const pageCount = doc.getNumberOfPages();
    const footerDate = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer background
      doc.setFillColor(17, 24, 39);
      doc.rect(0, pageHeight - 25, pageWidth, 25, "F");
      
      // Accent line
      doc.setFillColor(79, 70, 229);
      doc.rect(0, pageHeight - 25, pageWidth, 2, "F");

      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(domain, 15, pageHeight - 10);
      
      doc.text(
        `Generated ${footerDate} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
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
