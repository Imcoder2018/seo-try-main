// In-memory store for development/testing without database
// Replace with Prisma in production

interface Audit {
  id: string;
  url: string;
  domain: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  overallScore: number | null;
  overallGrade: string | null;
  seoScore: number | null;
  linksScore: number | null;
  usabilityScore: number | null;
  performanceScore: number | null;
  socialScore: number | null;
  seoResults: Record<string, unknown> | null;
  linksResults: Record<string, unknown> | null;
  usabilityResults: Record<string, unknown> | null;
  performanceResults: Record<string, unknown> | null;
  socialResults: Record<string, unknown> | null;
  technologyResults: Record<string, unknown> | null;
  recommendations: Array<{
    id: string;
    title: string;
    description: string | null;
    category: string;
    priority: string;
    checkId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

class InMemoryStore {
  private audits: Map<string, Audit>;

  constructor() {
    // Use globalThis to persist across hot reloads in development
    const globalStore = globalThis as typeof globalThis & { __auditStore?: Map<string, Audit> };
    if (!globalStore.__auditStore) {
      globalStore.__auditStore = new Map();
    }
    this.audits = globalStore.__auditStore;
  }

  generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async createAudit(data: { url: string; domain: string }): Promise<Audit> {
    const id = this.generateId();
    const audit: Audit = {
      id,
      url: data.url,
      domain: data.domain,
      status: "PENDING",
      overallScore: null,
      overallGrade: null,
      seoScore: null,
      linksScore: null,
      usabilityScore: null,
      performanceScore: null,
      socialScore: null,
      seoResults: null,
      linksResults: null,
      usabilityResults: null,
      performanceResults: null,
      socialResults: null,
      technologyResults: null,
      recommendations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    };
    this.audits.set(id, audit);
    return audit;
  }

  async getAudit(id: string): Promise<Audit | null> {
    return this.audits.get(id) || null;
  }

  async updateAudit(id: string, data: Partial<Audit>): Promise<Audit | null> {
    const audit = this.audits.get(id);
    if (!audit) return null;
    
    const updated = { ...audit, ...data, updatedAt: new Date() };
    this.audits.set(id, updated);
    return updated;
  }

  async findRecentAudit(domain: string): Promise<Audit | null> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const audit of this.audits.values()) {
      if (
        audit.domain === domain &&
        audit.status === "COMPLETED" &&
        audit.createdAt > oneDayAgo
      ) {
        return audit;
      }
    }
    return null;
  }
}

export const store = new InMemoryStore();
