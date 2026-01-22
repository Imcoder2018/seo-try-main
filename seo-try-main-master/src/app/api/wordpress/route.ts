import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Verify WordPress connection
export async function GET(request: NextRequest) {
  const siteUrl = request.nextUrl.searchParams.get("site_url");
  const apiKey = request.nextUrl.searchParams.get("api_key");

  if (!siteUrl || !apiKey) {
    return NextResponse.json(
      { error: "site_url and api_key are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${siteUrl}/wp-json/seo-autofix/v1/verify`, {
      headers: {
        "X-SEO-AutoFix-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Connection failed", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to WordPress site", details: String(error) },
      { status: 500 }
    );
  }
}

// Apply fixes to WordPress site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { site_url, api_key, action, options } = body;

    if (!site_url || !api_key || !action) {
      return NextResponse.json(
        { error: "site_url, api_key, and action are required" },
        { status: 400 }
      );
    }

    // Map actions to WordPress API endpoints
    const actionEndpoints: Record<string, string> = {
      verify: "/wp-json/seo-autofix/v1/verify",
      status: "/wp-json/seo-autofix/v1/status",
      fix_alt_text: "/wp-json/seo-autofix/v1/fix/alt-text",
      fix_compress: "/wp-json/seo-autofix/v1/fix/compress-images",
      fix_security: "/wp-json/seo-autofix/v1/fix/security-headers",
      fix_lazy_loading: "/wp-json/seo-autofix/v1/fix/lazy-loading",
      fix_sitemap: "/wp-json/seo-autofix/v1/fix/sitemap",
      fix_schema: "/wp-json/seo-autofix/v1/fix/schema",
      fix_og_tags: "/wp-json/seo-autofix/v1/fix/og-tags",
      fix_robots: "/wp-json/seo-autofix/v1/fix/robots",
      fix_meta: "/wp-json/seo-autofix/v1/fix/meta-descriptions",
      fix_database: "/wp-json/seo-autofix/v1/fix/database",
      fix_bulk: "/wp-json/seo-autofix/v1/fix/bulk",
    };

    const endpoint = actionEndpoints[action];
    if (!endpoint) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const method = action === "verify" || action === "status" ? "GET" : "POST";
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "X-SEO-AutoFix-Key": api_key,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    };

    if (method === "POST" && options) {
      fetchOptions.body = JSON.stringify(options);
    }

    const response = await fetch(`${site_url}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "WordPress API error", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to communicate with WordPress", details: String(error) },
      { status: 500 }
    );
  }
}
