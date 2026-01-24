import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";

// ============================================================================
// PDF REPORT V2.0 - Print-First Professional Design
// ============================================================================

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
  internalLinks?: number;
  externalLinks?: number;
  brokenLinks?: number;
  recommendations?: Array<{
    title: string;
    category: string;
    priority: string;
    description?: string;
    impact?: string;
    howToFix?: string;
  }>;
  includeSections?: {
    technicalDetails?: boolean;
    competitorAnalysis?: boolean;
    linkAnalysis?: boolean;
  };
}

// ============================================================================
// DESIGN SYSTEM - Print-First Color Palette
// ============================================================================
const COLORS = {
  // Base colors - White background for print-friendliness
  white: [255, 255, 255] as [number, number, number],
  background: [250, 251, 252] as [number, number, number],
  
  // Text hierarchy
  textPrimary: [15, 23, 42] as [number, number, number],      // slate-900
  textSecondary: [71, 85, 105] as [number, number, number],   // slate-600
  textMuted: [148, 163, 184] as [number, number, number],     // slate-400
  
  // Brand colors
  primary: [79, 70, 229] as [number, number, number],         // indigo-600
  primaryLight: [99, 102, 241] as [number, number, number],   // indigo-500
  primaryDark: [55, 48, 163] as [number, number, number],     // indigo-800
  
  // Semantic colors
  success: [22, 163, 74] as [number, number, number],         // green-600
  successLight: [220, 252, 231] as [number, number, number],  // green-100
  warning: [217, 119, 6] as [number, number, number],         // amber-600
  warningLight: [254, 243, 199] as [number, number, number],  // amber-100
  error: [220, 38, 38] as [number, number, number],           // red-600
  errorLight: [254, 226, 226] as [number, number, number],    // red-100
  info: [37, 99, 235] as [number, number, number],            // blue-600
  infoLight: [219, 234, 254] as [number, number, number],     // blue-100
  
  // UI colors
  border: [226, 232, 240] as [number, number, number],        // slate-200
  borderLight: [241, 245, 249] as [number, number, number],   // slate-100
  accent: [139, 92, 246] as [number, number, number],         // violet-500
};

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================
const MARGIN = 20; // 20mm margins on all sides
const CONTENT_WIDTH = 170; // A4 width (210) - margins (40)

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return COLORS.success;
  if (score >= 60) return COLORS.warning;
  return COLORS.error;
}

function getScoreBgColor(score: number): [number, number, number] {
  if (score >= 80) return COLORS.successLight;
  if (score >= 60) return COLORS.warningLight;
  return COLORS.errorLight;
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
  return "Needs Improvement";
}

function getPriorityColor(priority: string): [number, number, number] {
  switch (priority.toLowerCase()) {
    case "critical":
    case "high": return COLORS.error;
    case "medium": return COLORS.warning;
    default: return COLORS.info;
  }
}

function getPriorityBgColor(priority: string): [number, number, number] {
  switch (priority.toLowerCase()) {
    case "critical":
    case "high": return COLORS.errorLight;
    case "medium": return COLORS.warningLight;
    default: return COLORS.infoLight;
  }
}

function getPriorityLabel(priority: string): string {
  switch (priority.toLowerCase()) {
    case "critical": return "CRITICAL";
    case "high": return "HIGH";
    case "medium": return "MEDIUM";
    default: return "LOW";
  }
}

// ============================================================================
// PDF DRAWING HELPERS
// ============================================================================
class PDFReportV2 {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private yPos: number = MARGIN;
  private currentPage: number = 1;
  private totalPages: number = 0;
  private auditData: AuditData;
  private domain: string;
  private overallScore: number;
  private grade: string;
  private createdDate: Date;

  constructor(auditData: AuditData) {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.auditData = auditData;
    this.domain = auditData.domain || "Website";
    this.overallScore = auditData.overallScore ?? 0;
    this.grade = auditData.overallGrade || getGrade(this.overallScore);
    this.createdDate = auditData.createdAt ? new Date(auditData.createdAt) : new Date();
  }

  // Draw page header with branding
  private drawPageHeader(showDomain: boolean = true) {
    // Client URL on left
    if (showDomain) {
      this.doc.setFontSize(9);
      this.doc.setTextColor(...COLORS.textSecondary);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(this.domain, MARGIN, 12);
    }

    // SaaS branding on right (small, gray)
    this.doc.setFontSize(8);
    this.doc.setTextColor(...COLORS.textMuted);
    this.doc.text("SEO Audit Tool", this.pageWidth - MARGIN, 12, { align: "right" });

    // Subtle horizontal separator line
    this.doc.setDrawColor(...COLORS.border);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN, 16, this.pageWidth - MARGIN, 16);
  }

  // Draw page footer
  private drawPageFooter(pageNum: number, totalPages: number) {
    const footerY = this.pageHeight - 12;

    // Separator line
    this.doc.setDrawColor(...COLORS.border);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN, footerY - 5, this.pageWidth - MARGIN, footerY - 5);

    // Page number centered
    this.doc.setFontSize(8);
    this.doc.setTextColor(...COLORS.textMuted);
    this.doc.text(`Page ${pageNum} of ${totalPages}`, this.pageWidth / 2, footerY, { align: "center" });

    // Disclaimer
    this.doc.setFontSize(7);
    this.doc.text(
      "Generated by SEO Audit Tool. Automated results should be verified by an expert.",
      this.pageWidth / 2,
      footerY + 4,
      { align: "center" }
    );
  }

  // Check if we need a new page
  private checkPageBreak(neededHeight: number) {
    if (this.yPos + neededHeight > this.pageHeight - 25) {
      this.doc.addPage();
      this.currentPage++;
      this.yPos = 25;
      this.drawPageHeader();
    }
  }

  // Draw section title
  private drawSectionTitle(title: string, icon?: string) {
    this.checkPageBreak(20);
    
    // Section title with accent bar
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(MARGIN, this.yPos, 3, 12, "F");
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(...COLORS.textPrimary);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, MARGIN + 8, this.yPos + 9);
    
    this.yPos += 18;
  }

  // Draw semi-circle gauge (speedometer style)
  private drawHealthGauge(x: number, y: number, radius: number, score: number) {
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    const scoreAngle = startAngle + (score / 100) * Math.PI;
    
    // Background arc (gray)
    this.doc.setDrawColor(...COLORS.border);
    this.doc.setLineWidth(8);
    const segments = 50;
    for (let i = 0; i < segments; i++) {
      const angle1 = startAngle + (i / segments) * Math.PI;
      const angle2 = startAngle + ((i + 1) / segments) * Math.PI;
      const x1 = x + radius * Math.cos(angle1);
      const y1 = y + radius * Math.sin(angle1);
      const x2 = x + radius * Math.cos(angle2);
      const y2 = y + radius * Math.sin(angle2);
      
      if (angle1 < scoreAngle) {
        const [r, g, b] = getScoreColor(score);
        this.doc.setDrawColor(r, g, b);
      } else {
        this.doc.setDrawColor(...COLORS.borderLight);
      }
      this.doc.line(x1, y1, x2, y2);
    }
    
    // Score text in center
    this.doc.setFontSize(28);
    this.doc.setTextColor(...getScoreColor(score));
    this.doc.setFont("helvetica", "bold");
    this.doc.text(String(score), x, y + 5, { align: "center" });
    
    // Label
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLORS.textSecondary);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("out of 100", x, y + 14, { align: "center" });
  }

  // Draw elegant grade stamp
  private drawGradeStamp(x: number, y: number, grade: string, score: number) {
    const [r, g, b] = getScoreColor(score);
    
    // Outer circle (thin elegant border)
    this.doc.setDrawColor(r, g, b);
    this.doc.setLineWidth(2);
    this.doc.circle(x, y, 25, "S");
    
    // Inner circle
    this.doc.setDrawColor(r, g, b);
    this.doc.setLineWidth(0.5);
    this.doc.circle(x, y, 21, "S");
    
    // Grade letter
    this.doc.setFontSize(24);
    this.doc.setTextColor(r, g, b);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(grade, x, y + 8, { align: "center" });
  }

  // Draw traffic light indicator
  private drawTrafficLight(x: number, y: number, count: number, label: string, type: "passed" | "warning" | "error") {
    const colors = {
      passed: { bg: COLORS.successLight, text: COLORS.success, icon: "✓" },
      warning: { bg: COLORS.warningLight, text: COLORS.warning, icon: "!" },
      error: { bg: COLORS.errorLight, text: COLORS.error, icon: "✗" },
    };
    const c = colors[type];
    
    // Background pill
    this.doc.setFillColor(...c.bg);
    this.doc.roundedRect(x, y, 50, 45, 4, 4, "F");
    
    // Icon circle
    this.doc.setFillColor(...c.text);
    this.doc.circle(x + 25, y + 14, 8, "F");
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(c.icon, x + 25, y + 18, { align: "center" });
    
    // Count
    this.doc.setTextColor(...c.text);
    this.doc.setFontSize(18);
    this.doc.text(String(count), x + 25, y + 35, { align: "center" });
    
    // Label
    this.doc.setFontSize(7);
    this.doc.setTextColor(...COLORS.textSecondary);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(label, x + 25, y + 42, { align: "center" });
  }

  // Draw donut chart
  private drawDonutChart(x: number, y: number, radius: number, data: { value: number; color: [number, number, number]; label: string }[]) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return;
    
    let currentAngle = -Math.PI / 2; // Start from top
    const innerRadius = radius * 0.6;
    
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle;
      
      // Draw arc segments
      this.doc.setFillColor(...item.color);
      const segments = Math.max(Math.ceil(sliceAngle * 20), 2);
      
      for (let i = 0; i < segments; i++) {
        const a1 = currentAngle + (i / segments) * sliceAngle;
        const a2 = currentAngle + ((i + 1) / segments) * sliceAngle;
        
        const x1 = x + radius * Math.cos(a1);
        const y1 = y + radius * Math.sin(a1);
        const x2 = x + radius * Math.cos(a2);
        const y2 = y + radius * Math.sin(a2);
        const x3 = x + innerRadius * Math.cos(a2);
        const y3 = y + innerRadius * Math.sin(a2);
        const x4 = x + innerRadius * Math.cos(a1);
        const y4 = y + innerRadius * Math.sin(a1);
        
        // Draw as filled polygon
        this.doc.setFillColor(...item.color);
        // Using lines to approximate the arc
        this.doc.line(x1, y1, x2, y2);
      }
      
      currentAngle = endAngle;
    });
    
    // Draw center circle (white)
    this.doc.setFillColor(...COLORS.white);
    this.doc.circle(x, y, innerRadius, "F");
  }

  // Draw category scorecard
  private drawScorecard(x: number, y: number, width: number, name: string, score: number, icon?: string) {
    const [r, g, b] = getScoreColor(score);
    const [br, bg, bb] = getScoreBgColor(score);
    
    // Card background
    this.doc.setFillColor(...COLORS.white);
    this.doc.setDrawColor(...COLORS.border);
    this.doc.roundedRect(x, y, width, 50, 3, 3, "FD");
    
    // Score circle
    this.doc.setFillColor(br, bg, bb);
    this.doc.circle(x + width / 2, y + 20, 14, "F");
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(r, g, b);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(String(score), x + width / 2, y + 24, { align: "center" });
    
    // Category name
    this.doc.setFontSize(8);
    this.doc.setTextColor(...COLORS.textSecondary);
    this.doc.setFont("helvetica", "normal");
    const lines = this.doc.splitTextToSize(name, width - 8);
    this.doc.text(lines, x + width / 2, y + 40, { align: "center" });
  }

  // Draw recommendation card
  private drawRecommendationCard(rec: NonNullable<AuditData["recommendations"]>[0], index: number) {
    const cardHeight = rec.description || rec.howToFix ? 65 : 45;
    this.checkPageBreak(cardHeight + 5);
    
    const [pr, pg, pb] = getPriorityColor(rec.priority);
    const [pbr, pbg, pbb] = getPriorityBgColor(rec.priority);
    
    // Card background
    this.doc.setFillColor(...COLORS.white);
    this.doc.setDrawColor(...COLORS.border);
    this.doc.roundedRect(MARGIN, this.yPos, CONTENT_WIDTH, cardHeight, 3, 3, "FD");
    
    // Priority indicator bar on left
    this.doc.setFillColor(pr, pg, pb);
    this.doc.rect(MARGIN, this.yPos, 3, cardHeight, "F");
    
    // Priority pill
    this.doc.setFillColor(pbr, pbg, pbb);
    this.doc.roundedRect(MARGIN + 8, this.yPos + 5, 35, 10, 2, 2, "F");
    this.doc.setFontSize(6);
    this.doc.setTextColor(pr, pg, pb);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(getPriorityLabel(rec.priority), MARGIN + 25.5, this.yPos + 11.5, { align: "center" });
    
    // Category badge
    this.doc.setFillColor(...COLORS.borderLight);
    this.doc.roundedRect(MARGIN + 46, this.yPos + 5, 35, 10, 2, 2, "F");
    this.doc.setFontSize(6);
    this.doc.setTextColor(...COLORS.textSecondary);
    this.doc.setFont("helvetica", "normal");
    const catText = rec.category.length > 10 ? rec.category.substring(0, 10) + "..." : rec.category;
    this.doc.text(catText.toUpperCase(), MARGIN + 63.5, this.yPos + 11.5, { align: "center" });
    
    // Title
    this.doc.setFontSize(11);
    this.doc.setTextColor(...COLORS.textPrimary);
    this.doc.setFont("helvetica", "bold");
    const titleLines = this.doc.splitTextToSize(rec.title, CONTENT_WIDTH - 20);
    this.doc.text(titleLines[0], MARGIN + 8, this.yPos + 26);
    
    // Description (Why it matters)
    if (rec.description || rec.impact) {
      const desc = rec.description || rec.impact || "";
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLORS.textSecondary);
      this.doc.setFont("helvetica", "italic");
      const descLines = this.doc.splitTextToSize(`Why it matters: ${desc}`, CONTENT_WIDTH - 20);
      this.doc.text(descLines.slice(0, 2), MARGIN + 8, this.yPos + 35);
    }
    
    // How to fix
    if (rec.howToFix) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLORS.textPrimary);
      this.doc.setFont("helvetica", "normal");
      const fixLines = this.doc.splitTextToSize(`Fix: ${rec.howToFix}`, CONTENT_WIDTH - 20);
      this.doc.text(fixLines.slice(0, 2), MARGIN + 8, this.yPos + 50);
    }
    
    this.yPos += cardHeight + 5;
  }

  // Draw zebra-striped table
  private drawTable(headers: string[], rows: string[][], colWidths: number[]) {
    const rowHeight = 10;
    const headerHeight = 12;
    
    this.checkPageBreak(headerHeight + rowHeight * Math.min(rows.length, 5));
    
    // Header row
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(MARGIN, this.yPos, CONTENT_WIDTH, headerHeight, "F");
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFont("helvetica", "bold");
    
    let xOffset = MARGIN + 5;
    headers.forEach((header, i) => {
      this.doc.text(header, xOffset, this.yPos + 8);
      xOffset += colWidths[i];
    });
    
    this.yPos += headerHeight;
    
    // Data rows with zebra striping
    rows.forEach((row, rowIndex) => {
      this.checkPageBreak(rowHeight);
      
      // Zebra stripe
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(...COLORS.borderLight);
        this.doc.rect(MARGIN, this.yPos, CONTENT_WIDTH, rowHeight, "F");
      }
      
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLORS.textPrimary);
      this.doc.setFont("helvetica", "normal");
      
      xOffset = MARGIN + 5;
      row.forEach((cell, i) => {
        // Right-align numbers
        const isNumber = !isNaN(Number(cell));
        if (isNumber) {
          this.doc.text(cell, xOffset + colWidths[i] - 10, this.yPos + 7, { align: "right" });
        } else {
          const truncated = cell.length > 30 ? cell.substring(0, 30) + "..." : cell;
          this.doc.text(truncated, xOffset, this.yPos + 7);
        }
        xOffset += colWidths[i];
      });
      
      this.yPos += rowHeight;
    });
  }

  // ============================================================================
  // COVER PAGE
  // ============================================================================
  private drawCoverPage() {
    // Clean white background (no dark fills)
    this.doc.setFillColor(...COLORS.white);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F");
    
    // Subtle accent line at top
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(0, 0, this.pageWidth, 4, "F");
    
    // Hero Section - Center Aligned
    let y = 45;
    
    // Main Title
    this.doc.setFontSize(32);
    this.doc.setTextColor(...COLORS.textPrimary);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("SEO Health Report", this.pageWidth / 2, y, { align: "center" });
    
    y += 15;
    
    // Subtitle
    this.doc.setFontSize(14);
    this.doc.setTextColor(...COLORS.textSecondary);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Comprehensive Website Analysis", this.pageWidth / 2, y, { align: "center" });
    
    y += 25;
    
    // Domain box with border
    this.doc.setFillColor(...COLORS.borderLight);
    this.doc.setDrawColor(...COLORS.border);
    this.doc.roundedRect(40, y, this.pageWidth - 80, 20, 4, 4, "FD");
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(this.domain, this.pageWidth / 2, y + 13, { align: "center" });
    
    y += 40;
    
    // Grade Stamp (elegant circle design)
    this.drawGradeStamp(this.pageWidth / 2, y + 25, this.grade, this.overallScore);
    
    y += 65;
    
    // Health Gauge (semi-circle speedometer)
    this.drawHealthGauge(this.pageWidth / 2, y + 30, 40, this.overallScore);
    
    y += 70;
    
    // Score label
    this.doc.setFontSize(12);
    this.doc.setTextColor(...getScoreColor(this.overallScore));
    this.doc.setFont("helvetica", "bold");
    this.doc.text(getScoreLabel(this.overallScore), this.pageWidth / 2, y, { align: "center" });
    
    y += 25;
    
    // Metadata Grid (3 columns with vertical dividers)
    const metaY = y;
    const colWidth = (this.pageWidth - 80) / 3;
    const startX = 40;
    
    // Background for metadata
    this.doc.setFillColor(...COLORS.borderLight);
    this.doc.roundedRect(startX, metaY, this.pageWidth - 80, 35, 4, 4, "F");
    
    const metaItems = [
      { icon: "📅", label: "Date", value: this.createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
      { icon: "📄", label: "Pages Crawled", value: this.auditData.pagesScanned ? String(this.auditData.pagesScanned) : "N/A" },
      { icon: "🔍", label: "Crawl Type", value: this.auditData.crawlType || "Quick Scan" },
    ];
    
    metaItems.forEach((item, i) => {
      const x = startX + colWidth * i + colWidth / 2;
      
      // Vertical divider (except first)
      if (i > 0) {
        this.doc.setDrawColor(...COLORS.border);
        this.doc.setLineWidth(0.3);
        this.doc.line(startX + colWidth * i, metaY + 5, startX + colWidth * i, metaY + 30);
      }
      
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLORS.textMuted);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(item.label, x, metaY + 12, { align: "center" });
      
      this.doc.setFontSize(11);
      this.doc.setTextColor(...COLORS.textPrimary);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(item.value, x, metaY + 25, { align: "center" });
    });
    
    // Footer branding
    this.doc.setFontSize(8);
    this.doc.setTextColor(...COLORS.textMuted);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Powered by SEO Audit Tool", this.pageWidth / 2, this.pageHeight - 15, { align: "center" });
  }

  // ============================================================================
  // EXECUTIVE SUMMARY PAGE
  // ============================================================================
  private drawExecutiveSummary() {
    this.doc.addPage();
    this.currentPage++;
    this.yPos = 25;
    this.drawPageHeader();
    
    this.drawSectionTitle("Executive Summary");
    
    // Traffic Light System
    const passedCount = this.auditData.passedChecks ?? Math.round(this.overallScore / 10);
    const warningCount = this.auditData.warningChecks ?? Math.round((100 - this.overallScore) / 25);
    const failedCount = this.auditData.failedChecks ?? Math.round((100 - this.overallScore) / 15);
    
    const trafficStartX = MARGIN + (CONTENT_WIDTH - 170) / 2;
    this.drawTrafficLight(trafficStartX, this.yPos, passedCount, "Passed", "passed");
    this.drawTrafficLight(trafficStartX + 60, this.yPos, warningCount, "Warnings", "warning");
    this.drawTrafficLight(trafficStartX + 120, this.yPos, failedCount, "Critical Issues", "error");
    
    this.yPos += 55;
    
    // Quick Wins Section
    this.drawSectionTitle("Priority Actions (Quick Wins)");
    
    const highPriorityRecs = (this.auditData.recommendations || [])
      .filter(r => r.priority.toLowerCase() === "high" || r.priority.toLowerCase() === "critical")
      .slice(0, 3);
    
    if (highPriorityRecs.length > 0) {
      highPriorityRecs.forEach((rec, i) => {
        this.checkPageBreak(25);
        
        // Numbered box
        this.doc.setFillColor(...COLORS.errorLight);
        this.doc.roundedRect(MARGIN, this.yPos, CONTENT_WIDTH, 22, 3, 3, "F");
        
        // Number circle
        this.doc.setFillColor(...COLORS.error);
        this.doc.circle(MARGIN + 12, this.yPos + 11, 7, "F");
        this.doc.setFontSize(10);
        this.doc.setTextColor(...COLORS.white);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(String(i + 1), MARGIN + 12, this.yPos + 14.5, { align: "center" });
        
        // Title
        this.doc.setFontSize(10);
        this.doc.setTextColor(...COLORS.textPrimary);
        this.doc.setFont("helvetica", "bold");
        const titleText = this.doc.splitTextToSize(rec.title, CONTENT_WIDTH - 35);
        this.doc.text(titleText[0], MARGIN + 25, this.yPos + 14);
        
        this.yPos += 26;
      });
    } else {
      this.doc.setFontSize(10);
      this.doc.setTextColor(...COLORS.success);
      this.doc.setFont("helvetica", "normal");
      this.doc.text("✓ No critical issues found! Your site is performing well.", MARGIN, this.yPos + 10);
      this.yPos += 20;
    }
    
    this.yPos += 10;
    
    // Key Insight Box
    this.doc.setFillColor(...COLORS.infoLight);
    this.doc.roundedRect(MARGIN, this.yPos, CONTENT_WIDTH, 30, 4, 4, "F");
    
    // Info icon
    this.doc.setFillColor(...COLORS.info);
    this.doc.circle(MARGIN + 12, this.yPos + 15, 6, "F");
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("i", MARGIN + 12, this.yPos + 18, { align: "center" });
    
    // Insight text
    const insightText = this.overallScore >= 80 
      ? "Excellent SEO health! Focus on maintaining current practices and addressing minor optimizations."
      : this.overallScore >= 60 
      ? "Good foundation with room for growth. Address high-priority issues first for best results."
      : "Significant improvements needed. Start with the critical issues listed above to boost visibility.";
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(...COLORS.info);
    this.doc.setFont("helvetica", "normal");
    const insightLines = this.doc.splitTextToSize(insightText, CONTENT_WIDTH - 30);
    this.doc.text(insightLines, MARGIN + 22, this.yPos + 12);
    
    this.yPos += 40;
  }

  // ============================================================================
  // CATEGORY PERFORMANCE PAGE
  // ============================================================================
  private drawCategoryPerformance() {
    this.checkPageBreak(120);
    
    this.drawSectionTitle("Performance by Category");
    
    // Build categories array
    const categories = [
      { name: "On-Page SEO", score: this.auditData.seoScore ?? 0 },
      { name: "Links", score: this.auditData.linksScore ?? 0 },
      { name: "Usability", score: this.auditData.usabilityScore ?? 0 },
      { name: "Performance", score: this.auditData.performanceScore ?? 0 },
      { name: "Social", score: this.auditData.socialScore ?? 0 },
    ];
    
    if (this.auditData.localSeoScore !== undefined && this.auditData.localSeoScore !== null) {
      categories.unshift({ name: "Local SEO", score: this.auditData.localSeoScore });
    }
    if (this.auditData.contentScore !== undefined && this.auditData.contentScore !== null) {
      categories.push({ name: "Content", score: this.auditData.contentScore });
    }
    if (this.auditData.eeatScore !== undefined && this.auditData.eeatScore !== null) {
      categories.push({ name: "E-E-A-T", score: this.auditData.eeatScore });
    }
    if (this.auditData.technologyScore !== undefined && this.auditData.technologyScore !== null) {
      categories.push({ name: "Technology", score: this.auditData.technologyScore });
    }
    
    // 2x3 Grid of Scorecards
    const cardWidth = (CONTENT_WIDTH - 10) / 3; // 3 cards per row with gaps
    const cardGap = 5;
    
    categories.forEach((cat, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      
      if (col === 0 && i > 0) {
        this.yPos += 55;
        this.checkPageBreak(55);
      }
      
      const x = MARGIN + col * (cardWidth + cardGap);
      const y = this.yPos;
      
      this.drawScorecard(x, y, cardWidth, cat.name, cat.score);
    });
    
    this.yPos += 60;
  }

  // ============================================================================
  // DETAILED RECOMMENDATIONS PAGE
  // ============================================================================
  private drawDetailedRecommendations() {
    const recs = this.auditData.recommendations || [];
    if (recs.length === 0) return;
    
    this.doc.addPage();
    this.currentPage++;
    this.yPos = 25;
    this.drawPageHeader();
    
    this.drawSectionTitle("Detailed Recommendations");
    
    // Group by priority
    const critical = recs.filter(r => r.priority.toLowerCase() === "critical");
    const high = recs.filter(r => r.priority.toLowerCase() === "high");
    const medium = recs.filter(r => r.priority.toLowerCase() === "medium");
    const low = recs.filter(r => r.priority.toLowerCase() === "low" || (!["critical", "high", "medium"].includes(r.priority.toLowerCase())));
    
    const printGroup = (items: typeof recs, label: string) => {
      if (items.length === 0) return;
      
      this.checkPageBreak(20);
      
      // Group header
      this.doc.setFontSize(11);
      this.doc.setTextColor(...COLORS.textPrimary);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(`${label} (${items.length})`, MARGIN, this.yPos + 5);
      this.yPos += 12;
      
      items.slice(0, 10).forEach((rec, i) => {
        this.drawRecommendationCard(rec, i);
      });
      
      if (items.length > 10) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(...COLORS.textMuted);
        this.doc.text(`+ ${items.length - 10} more ${label.toLowerCase()} items...`, MARGIN, this.yPos);
        this.yPos += 10;
      }
      
      this.yPos += 5;
    };
    
    printGroup(critical, "Critical Priority");
    printGroup(high, "High Priority");
    printGroup(medium, "Medium Priority");
    printGroup(low, "Low Priority");
  }

  // ============================================================================
  // LINK ANALYSIS PAGE
  // ============================================================================
  private drawLinkAnalysis() {
    if (!this.auditData.includeSections?.linkAnalysis) return;
    
    const internal = this.auditData.internalLinks ?? 0;
    const external = this.auditData.externalLinks ?? 0;
    const broken = this.auditData.brokenLinks ?? 0;
    const total = internal + external + broken;
    
    if (total === 0) return;
    
    this.checkPageBreak(80);
    
    this.drawSectionTitle("Link Analysis");
    
    // Table for link data
    const headers = ["Link Type", "Count", "Percentage"];
    const rows = [
      ["Internal Links", String(internal), `${total > 0 ? Math.round((internal / total) * 100) : 0}%`],
      ["External Links", String(external), `${total > 0 ? Math.round((external / total) * 100) : 0}%`],
      ["Broken Links", String(broken), `${total > 0 ? Math.round((broken / total) * 100) : 0}%`],
    ];
    
    this.drawTable(headers, rows, [80, 45, 45]);
    
    this.yPos += 15;
  }

  // ============================================================================
  // CALL TO ACTION PAGE
  // ============================================================================
  private drawCallToAction() {
    this.doc.addPage();
    this.currentPage++;
    this.yPos = 60;
    this.drawPageHeader(false);
    
    // What's Next? Header
    this.doc.setFontSize(24);
    this.doc.setTextColor(...COLORS.textPrimary);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("What's Next?", this.pageWidth / 2, this.yPos, { align: "center" });
    
    this.yPos += 25;
    
    // CTA Box
    this.doc.setFillColor(...COLORS.primaryLight);
    this.doc.roundedRect(30, this.yPos, this.pageWidth - 60, 80, 6, 6, "F");
    
    this.yPos += 20;
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Need Help Fixing These Issues?", this.pageWidth / 2, this.yPos, { align: "center" });
    
    this.yPos += 15;
    
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    const ctaText = "Our team of SEO experts can help you implement these recommendations and improve your search rankings.";
    const ctaLines = this.doc.splitTextToSize(ctaText, this.pageWidth - 80);
    this.doc.text(ctaLines, this.pageWidth / 2, this.yPos, { align: "center" });
    
    this.yPos += 30;
    
    // Contact info
    this.doc.setFillColor(...COLORS.white);
    this.doc.roundedRect(this.pageWidth / 2 - 60, this.yPos - 5, 120, 25, 4, 4, "F");
    
    this.doc.setFontSize(11);
    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Upgrade to Pro for Automatic Fixes", this.pageWidth / 2, this.yPos + 10, { align: "center" });
    
    this.yPos += 50;
    
    // Summary stats
    this.doc.setFillColor(...COLORS.borderLight);
    this.doc.roundedRect(30, this.yPos, this.pageWidth - 60, 50, 4, 4, "F");
    
    this.yPos += 15;
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(...COLORS.textPrimary);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Audit Summary", this.pageWidth / 2, this.yPos, { align: "center" });
    
    this.yPos += 15;
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLORS.textSecondary);
    this.doc.setFont("helvetica", "normal");
    
    const summaryItems = [
      `Overall Score: ${this.overallScore}/100 (Grade ${this.grade})`,
      `Total Recommendations: ${this.auditData.recommendations?.length || 0}`,
      `Report Generated: ${this.createdDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    ];
    
    summaryItems.forEach((item, i) => {
      this.doc.text(item, this.pageWidth / 2, this.yPos + i * 8, { align: "center" });
    });
  }

  // ============================================================================
  // GENERATE FULL REPORT
  // ============================================================================
  public generate(): ArrayBuffer {
    // Page 1: Cover
    this.drawCoverPage();
    
    // Page 2: Executive Summary
    this.drawExecutiveSummary();
    
    // Category Performance (continues on same page if space)
    this.drawCategoryPerformance();
    
    // Link Analysis (if enabled)
    this.drawLinkAnalysis();
    
    // Detailed Recommendations
    this.drawDetailedRecommendations();
    
    // Final Page: CTA
    this.drawCallToAction();
    
    // Add footers to all pages
    this.totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= this.totalPages; i++) {
      this.doc.setPage(i);
      if (i > 1) { // Skip cover page footer
        this.drawPageFooter(i, this.totalPages);
      }
    }
    
    return this.doc.output("arraybuffer");
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[PDF API V2] Starting PDF generation");
    const body = await request.json();
    const auditData: AuditData = body.auditData;
    
    console.log("[PDF API V2] Audit data received:", JSON.stringify(auditData, null, 2).substring(0, 500));

    if (!auditData) {
      console.error("[PDF API V2] No audit data provided");
      return NextResponse.json({ error: "Audit data is required" }, { status: 400 });
    }

    // Use the new PDFReportV2 class for clean, print-first design
    const report = new PDFReportV2(auditData);
    const pdfBuffer = report.generate();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${auditData.domain || "report"}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[PDF API V2] PDF generation error:", error);
    console.error("[PDF API V2] Error stack:", error instanceof Error ? error.stack : "No stack available");
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error) },
      { status: 500 }
    );
  }
}
