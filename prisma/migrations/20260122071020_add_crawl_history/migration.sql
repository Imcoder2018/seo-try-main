/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Audit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `ScheduledContent` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `clerkUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CrawlStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_userId_fkey";

-- AlterTable
ALTER TABLE "Audit" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScheduledContent" ADD COLUMN     "analysisRunId" TEXT,
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "sourceSuggestionId" TEXT,
ADD COLUMN     "tone" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ContentAnalysis" (
    "id" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "dominantKeywords" JSONB,
    "contentGaps" JSONB,
    "audiencePersona" TEXT,
    "tone" TEXT,
    "aiSuggestions" JSONB,
    "pagesAnalyzed" INTEGER,
    "analysisOutput" JSONB,
    "crawlRequestId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ContentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlRequest" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "maxPages" INTEGER NOT NULL,
    "status" "CrawlStatus" NOT NULL DEFAULT 'PENDING',
    "triggerRunId" TEXT,
    "publicToken" TEXT,
    "pagesFound" INTEGER,
    "pagesData" JSONB,
    "crawlData" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "CrawlRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentAnalysis_domain_idx" ON "ContentAnalysis"("domain");

-- CreateIndex
CREATE INDEX "ContentAnalysis_userId_idx" ON "ContentAnalysis"("userId");

-- CreateIndex
CREATE INDEX "ContentAnalysis_status_idx" ON "ContentAnalysis"("status");

-- CreateIndex
CREATE INDEX "ContentAnalysis_crawlRequestId_idx" ON "ContentAnalysis"("crawlRequestId");

-- CreateIndex
CREATE INDEX "CrawlRequest_domain_idx" ON "CrawlRequest"("domain");

-- CreateIndex
CREATE INDEX "CrawlRequest_userId_idx" ON "CrawlRequest"("userId");

-- CreateIndex
CREATE INDEX "CrawlRequest_status_idx" ON "CrawlRequest"("status");

-- CreateIndex
CREATE INDEX "CrawlRequest_triggerRunId_idx" ON "CrawlRequest"("triggerRunId");

-- CreateIndex
CREATE INDEX "ScheduledContent_sourceSuggestionId_idx" ON "ScheduledContent"("sourceSuggestionId");

-- CreateIndex
CREATE INDEX "ScheduledContent_analysisRunId_idx" ON "ScheduledContent"("analysisRunId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE INDEX "User_clerkUserId_idx" ON "User"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledContent" ADD CONSTRAINT "ScheduledContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_crawlRequestId_fkey" FOREIGN KEY ("crawlRequestId") REFERENCES "CrawlRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlRequest" ADD CONSTRAINT "CrawlRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
