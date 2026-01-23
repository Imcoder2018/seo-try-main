import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Verify WordPress connection or check handshake status
export async function GET(request: NextRequest) {
  const siteUrl = request.nextUrl.searchParams.get("site_url");
  const apiKey = request.nextUrl.searchParams.get("api_key");
  const action = request.nextUrl.searchParams.get("action");
  const connectToken = request.nextUrl.searchParams.get("connect_token");

  // Handle handshake status check
  if (action === "handshake_status" && siteUrl && connectToken) {
    try {
      const response = await fetch(
        `${siteUrl}/wp-json/seo-autofix/v1/handshake/status?connect_token=${connectToken}`,
        { cache: "no-store" }
      );
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to check handshake status", details: String(error) },
        { status: 500 }
      );
    }
  }

  // Handle issue detection
  if (action === "detect_issues" && siteUrl && apiKey) {
    try {
      const response = await fetch(
        `${siteUrl}/wp-json/seo-autofix/v1/audit/issues`,
        {
          headers: {
            "X-SEO-AutoFix-Key": apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          cache: "no-store",
        }
      );
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to detect issues", details: String(error) },
        { status: 500 }
      );
    }
  }

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
        Authorization: `Bearer ${apiKey}`,
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

    // Handle handshake initiation (no API key needed)
    if (action === "handshake_init" && site_url) {
      const saasUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const callbackUrl = `${saasUrl}/api/wordpress/callback`;
      const nonce = crypto.randomUUID();

      try {
        // Normalize site URL
        let normalizedUrl = site_url.trim();
        if (!normalizedUrl.startsWith('http')) {
          normalizedUrl = 'https://' + normalizedUrl;
        }
        normalizedUrl = normalizedUrl.replace(/\/$/, ''); // Remove trailing slash

        const response = await fetch(
          `${normalizedUrl}/wp-json/seo-autofix/v1/handshake/init`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              saas_url: saasUrl,
              callback_url: callbackUrl,
              nonce: nonce,
            }),
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          return NextResponse.json({
            success: false,
            error: "WordPress plugin not responding. Make sure SEO AutoFix Pro plugin is installed and activated.",
            details: errorText,
            status: response.status,
          }, { status: 200 }); // Return 200 so frontend can show error message
        }

        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "Could not connect to WordPress site. Please check the URL and ensure the SEO AutoFix Pro plugin is installed.",
          details: String(error),
        }, { status: 200 }); // Return 200 so frontend can show error message
      }
    }

    // Handle handshake completion
    if (action === "handshake_complete" && site_url && options?.connect_token) {
      const response = await fetch(
        `${site_url}/wp-json/seo-autofix/v1/handshake/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connect_token: options.connect_token }),
          cache: "no-store",
        }
      );

      const data = await response.json();
      return NextResponse.json(data);
    }

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
      // New category-specific fix endpoints
      fix_local_seo: "/wp-json/seo-autofix/v1/fix/local-seo",
      fix_eeat: "/wp-json/seo-autofix/v1/fix/eeat",
      fix_content: "/wp-json/seo-autofix/v1/fix/content",
      fix_usability: "/wp-json/seo-autofix/v1/fix/usability",
      fix_performance: "/wp-json/seo-autofix/v1/fix/performance",
      fix_social: "/wp-json/seo-autofix/v1/fix/social",
      fix_technology: "/wp-json/seo-autofix/v1/fix/technology",
      fix_links: "/wp-json/seo-autofix/v1/fix/links",
      fix_onpage: "/wp-json/seo-autofix/v1/fix/onpage",
      // Comprehensive auto-fix
      auto_fix_all: "/wp-json/seo-autofix/v1/audit/auto-fix",
      detect_issues: "/wp-json/seo-autofix/v1/audit/issues",
    };

    const endpoint = actionEndpoints[action];
    if (!endpoint) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const method = action === "verify" || action === "status" || action === "detect_issues" ? "GET" : "POST";
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "X-SEO-AutoFix-Key": api_key,
        Authorization: `Bearer ${api_key}`,
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
