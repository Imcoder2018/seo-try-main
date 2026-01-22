"use client";

import { getScoreColor } from "@/lib/utils";
import { ExternalLink, Globe, Phone, Copy, Share2 } from "lucide-react";
import { useState } from "react";

interface GBPReportHeaderProps {
  businessName: string;
  address: string;
  score: number;
  keyword: string;
  recommendationsCount: number;
  generatedAt: string;
  googleUrl?: string;
  website?: string | null;
  phone?: string | null;
  photoUrl?: string;
}

export function GBPReportHeader({
  businessName,
  address,
  score,
  keyword,
  recommendationsCount,
  generatedAt,
  googleUrl,
  website,
  phone,
  photoUrl,
}: GBPReportHeaderProps) {
  const [copied, setCopied] = useState(false);
  const scoreColor = getScoreColor(score);
  const scoreMessage = score >= 80 
    ? "Your business profile is very good!" 
    : score >= 65 
    ? "Your business profile is good" 
    : score >= 30 
    ? "Your business profile could be better" 
    : "Your business profile needs improvement";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out the GBP audit for ${businessName}`)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  return (
    <div className="bg-card border rounded-xl p-8 mb-8" id="results">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{businessName}</h2>
          <p className="text-muted-foreground mb-4">{address}</p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {googleUrl && (
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View on Google Maps
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            )}
          </div>

          {keyword && (
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Category: </span>
              <span className="font-medium text-primary capitalize">{keyword}</span>
            </div>
          )}

          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-muted/20"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 440} 440`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: scoreColor }}>
                  {score}%
                </span>
              </div>
            </div>
            <p className="font-semibold text-center md:text-left">{scoreMessage}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center lg:items-end">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={businessName}
              className="w-48 h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}
          
          {recommendationsCount > 0 && (
            <a
              href="#recommendations"
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              You have {recommendationsCount} Recommendation{recommendationsCount !== 1 ? "s" : ""}
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t flex flex-wrap justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Generated: <span className="font-medium">{generatedAt}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyUrl}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Report URL"}
          </button>
          <button
            onClick={handleShareFacebook}
            className="px-4 py-2 bg-[#1877f2] text-white rounded-lg text-sm hover:bg-[#1877f2]/90 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Facebook
          </button>
          <button
            onClick={handleShareTwitter}
            className="px-4 py-2 bg-[#1da1f2] text-white rounded-lg text-sm hover:bg-[#1da1f2]/90 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Twitter
          </button>
        </div>
      </div>
    </div>
  );
}
