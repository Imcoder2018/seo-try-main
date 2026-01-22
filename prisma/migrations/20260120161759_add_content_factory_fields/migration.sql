-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'AGENCY_ADMIN', 'AGENCY_MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'AGENCY', 'WHITE_LABEL');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('PENDING', 'GENERATING', 'READY', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "overallScore" INTEGER,
    "overallGrade" TEXT,
    "localSeoScore" INTEGER,
    "seoScore" INTEGER,
    "linksScore" INTEGER,
    "usabilityScore" INTEGER,
    "performanceScore" INTEGER,
    "socialScore" INTEGER,
    "contentScore" INTEGER,
    "eeatScore" INTEGER,
    "accessibilityScore" INTEGER,
    "localSeoResults" JSONB,
    "seoResults" JSONB,
    "linksResults" JSONB,
    "usabilityResults" JSONB,
    "performanceResults" JSONB,
    "socialResults" JSONB,
    "technologyResults" JSONB,
    "contentResults" JSONB,
    "eeatResults" JSONB,
    "accessibilityResults" JSONB,
    "desktopScreenshot" TEXT,
    "mobileScreenshot" TEXT,
    "userId" TEXT,
    "triggerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainHistory" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overallScore" INTEGER NOT NULL,
    "localSeoScore" INTEGER,
    "seoScore" INTEGER,
    "linksScore" INTEGER,
    "usabilityScore" INTEGER,
    "performanceScore" INTEGER,
    "socialScore" INTEGER,
    "contentScore" INTEGER,
    "eeatScore" INTEGER,
    "accessibilityScore" INTEGER,
    "lcp" DOUBLE PRECISION,
    "fid" DOUBLE PRECISION,
    "cls" DOUBLE PRECISION,
    "fcp" DOUBLE PRECISION,
    "ttfb" DOUBLE PRECISION,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "checkId" TEXT NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CachedResult" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CachedResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressSite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "wpUsername" TEXT,
    "wpAppPassword" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordPressSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "searchVolume" INTEGER,
    "difficulty" INTEGER,
    "cpc" DOUBLE PRECISION,
    "intent" TEXT,
    "location" TEXT,
    "isGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPlan" (
    "id" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "postsPerWeek" INTEGER NOT NULL DEFAULT 3,
    "contentTypes" TEXT[],
    "targetKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledContent" (
    "id" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "contentPlanId" TEXT,
    "keywordId" TEXT,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "metaDescription" TEXT,
    "focusKeyword" TEXT NOT NULL,
    "secondaryKeywords" TEXT[],
    "outline" JSONB,
    "featuredImageUrl" TEXT,
    "featuredImageAlt" TEXT,
    "isAiGeneratedImage" BOOLEAN NOT NULL DEFAULT false,
    "postType" TEXT NOT NULL DEFAULT 'post',
    "postStatus" TEXT NOT NULL DEFAULT 'draft',
    "categories" TEXT[],
    "tags" TEXT[],
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
    "wpPostId" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "publishError" TEXT,
    "seoScore" INTEGER,
    "readabilityScore" INTEGER,
    "contentLength" INTEGER,
    "targetService" TEXT,
    "targetServiceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Audit_domain_idx" ON "Audit"("domain");

-- CreateIndex
CREATE INDEX "Audit_status_idx" ON "Audit"("status");

-- CreateIndex
CREATE INDEX "Audit_userId_idx" ON "Audit"("userId");

-- CreateIndex
CREATE INDEX "Audit_createdAt_idx" ON "Audit"("createdAt");

-- CreateIndex
CREATE INDEX "DomainHistory_domain_idx" ON "DomainHistory"("domain");

-- CreateIndex
CREATE INDEX "DomainHistory_domain_date_idx" ON "DomainHistory"("domain", "date");

-- CreateIndex
CREATE INDEX "DomainHistory_userId_idx" ON "DomainHistory"("userId");

-- CreateIndex
CREATE INDEX "Recommendation_auditId_idx" ON "Recommendation"("auditId");

-- CreateIndex
CREATE UNIQUE INDEX "CachedResult_domain_key" ON "CachedResult"("domain");

-- CreateIndex
CREATE INDEX "CachedResult_domain_idx" ON "CachedResult"("domain");

-- CreateIndex
CREATE INDEX "CachedResult_expiresAt_idx" ON "CachedResult"("expiresAt");

-- CreateIndex
CREATE INDEX "WordPressSite_userId_idx" ON "WordPressSite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressSite_userId_siteUrl_key" ON "WordPressSite"("userId", "siteUrl");

-- CreateIndex
CREATE INDEX "Keyword_wordpressSiteId_idx" ON "Keyword"("wordpressSiteId");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_wordpressSiteId_keyword_key" ON "Keyword"("wordpressSiteId", "keyword");

-- CreateIndex
CREATE INDEX "ContentPlan_wordpressSiteId_idx" ON "ContentPlan"("wordpressSiteId");

-- CreateIndex
CREATE INDEX "ContentPlan_month_year_idx" ON "ContentPlan"("month", "year");

-- CreateIndex
CREATE INDEX "ScheduledContent_wordpressSiteId_idx" ON "ScheduledContent"("wordpressSiteId");

-- CreateIndex
CREATE INDEX "ScheduledContent_userId_idx" ON "ScheduledContent"("userId");

-- CreateIndex
CREATE INDEX "ScheduledContent_scheduledFor_idx" ON "ScheduledContent"("scheduledFor");

-- CreateIndex
CREATE INDEX "ScheduledContent_status_idx" ON "ScheduledContent"("status");

-- CreateIndex
CREATE INDEX "ScheduledContent_contentPlanId_idx" ON "ScheduledContent"("contentPlanId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlan" ADD CONSTRAINT "ContentPlan_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledContent" ADD CONSTRAINT "ScheduledContent_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledContent" ADD CONSTRAINT "ScheduledContent_contentPlanId_fkey" FOREIGN KEY ("contentPlanId") REFERENCES "ContentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledContent" ADD CONSTRAINT "ScheduledContent_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE SET NULL ON UPDATE CASCADE;
