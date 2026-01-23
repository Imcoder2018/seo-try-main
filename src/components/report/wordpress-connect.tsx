"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check, Loader2, Plug, Zap, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

interface WordPressConnection {
  siteUrl: string;
  apiKey: string;
  connected: boolean;
  siteName?: string;
}

interface FixResult {
  success: boolean;
  message?: string;
  fixed?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface WordPressConnectProps {
  domain: string;
  onConnectionChange?: (connected: boolean) => void;
}

export function WordPressConnect({ domain, onConnectionChange }: WordPressConnectProps) {
  const [showModal, setShowModal] = useState(false);
  const [connection, setConnection] = useState<WordPressConnection | null>(null);
  const [siteUrl, setSiteUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [connectMode, setConnectMode] = useState<"manual" | "auto">("manual");
  const [handshakeStatus, setHandshakeStatus] = useState<"idle" | "pending" | "approved" | "error">("idle");
  const [connectToken, setConnectToken] = useState("");
  const [authUrl, setAuthUrl] = useState("");

  // Load saved connection - use global key for WordPress connection
  // WordPress site is independent of the audited domain
  useEffect(() => {
    // Try global connection first, then domain-specific for backward compatibility
    const globalSaved = localStorage.getItem('wp_connection_global');
    const domainSaved = localStorage.getItem(`wp_connection_${domain}`);
    const saved = globalSaved || domainSaved;
    
    if (saved) {
      const conn = JSON.parse(saved);
      setConnection(conn);
      onConnectionChange?.(conn.connected);
      
      // Migrate to global key if using domain-specific
      if (!globalSaved && domainSaved) {
        localStorage.setItem('wp_connection_global', domainSaved);
      }
    }
  }, [domain, onConnectionChange]);

  // Poll for handshake approval
  useEffect(() => {
    if (handshakeStatus !== "pending" || !connectToken || !siteUrl) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/wordpress?action=handshake_status&site_url=${encodeURIComponent(siteUrl)}&connect_token=${connectToken}`
        );
        const data = await response.json();

        if (data.status === "approved") {
          setHandshakeStatus("approved");
          // Complete the handshake to get API key
          const completeResponse = await fetch("/api/wordpress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              site_url: siteUrl,
              action: "handshake_complete",
              options: { connect_token: connectToken },
            }),
          });
          const completeData = await completeResponse.json();
          console.log("[WP Connect] Handshake complete response:", completeData);

          // Handle various response formats from the plugin
          const apiKey = completeData.api_key || completeData.apiKey || completeData.key;
          const siteName = completeData.site_name || completeData.siteName || completeData.name;
          const returnedSiteUrl = completeData.site_url || completeData.siteUrl || siteUrl;
          
          if (completeData.success || apiKey) {
            const conn: WordPressConnection = {
              siteUrl: returnedSiteUrl,
              apiKey: apiKey || connectToken, // Use token as fallback
              connected: true,
              siteName: siteName || returnedSiteUrl,
            };
            // Save to global key so it works across all audited domains
            localStorage.setItem('wp_connection_global', JSON.stringify(conn));
            console.log("[WP Connect] Connection saved:", conn);
            setConnection(conn);
            onConnectionChange?.(true);
            setShowModal(false);
            setHandshakeStatus("idle");
          } else {
            console.log("[WP Connect] Missing API key in response, saving with token");
            // Even without API key, save the connection if handshake was approved
            const conn: WordPressConnection = {
              siteUrl: siteUrl,
              apiKey: connectToken,
              connected: true,
              siteName: siteName || siteUrl,
            };
            localStorage.setItem('wp_connection_global', JSON.stringify(conn));
            setConnection(conn);
            onConnectionChange?.(true);
            setShowModal(false);
            setHandshakeStatus("idle");
          }
        }
      } catch {
        // Continue polling
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [handshakeStatus, connectToken, siteUrl, domain, onConnectionChange]);

  const handleAutoConnect = async () => {
    if (!siteUrl) {
      setError("Please enter your WordPress site URL");
      return;
    }

    setConnecting(true);
    setError("");

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          action: "handshake_init",
        }),
      });
      const data = await response.json();

      // Handle both auth_url and approval_url for compatibility
      const authUrlFromResponse = data.auth_url || data.approval_url;
      const tokenFromResponse = data.connect_token || data.token;
      
      if (data.success && authUrlFromResponse) {
        setConnectToken(tokenFromResponse);
        setAuthUrl(authUrlFromResponse);
        setHandshakeStatus("pending");
        // Open WordPress admin in new tab
        window.open(authUrlFromResponse, "_blank");
      } else {
        // Show detailed error message
        const errorMsg = data.error || "Failed to initiate connection";
        const details = data.details ? ` (${data.details.substring(0, 100)})` : "";
        setError(`${errorMsg}${details}`);
      }
    } catch (err) {
      setError(`Connection failed: ${err instanceof Error ? err.message : "Make sure SEO AutoFix Pro plugin is installed and activated on your WordPress site."}`);
    } finally {
      setConnecting(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/wordpress?site_url=${encodeURIComponent(siteUrl)}&api_key=${encodeURIComponent(apiKey)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to connect");
        return;
      }

      const conn: WordPressConnection = {
        siteUrl,
        apiKey,
        connected: true,
        siteName: data.name,
      };

      // Save to global key so it works across all audited domains
      localStorage.setItem('wp_connection_global', JSON.stringify(conn));
      setConnection(conn);
      onConnectionChange?.(true);
      setShowModal(false);
    } catch {
      setError("Connection failed. Check your credentials.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    // Remove both global and domain-specific keys
    localStorage.removeItem('wp_connection_global');
    localStorage.removeItem(`wp_connection_${domain}`);
    setConnection(null);
    onConnectionChange?.(false);
  };

  return (
    <>
      {connection?.connected ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-green-800 dark:text-green-200">
                  ✅ WordPress Connected
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {connection.siteName || connection.siteUrl}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto flex-wrap">
              <span className="px-3 py-1.5 bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full flex items-center gap-1.5 border border-green-200 dark:border-green-700">
                <Zap className="h-4 w-4" />
                Auto-Fix Ready
              </span>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 border border-red-300 dark:border-red-700 rounded-lg transition-all flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Clear Connection
              </button>
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-500 mt-3 bg-green-100/50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
            💡 Auto-fix buttons are now available on each category section and individual issues below.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <Plug className="h-4 w-4" />
          Connect WordPress
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Connect WordPress Site
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setHandshakeStatus("idle");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Connection Mode Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setConnectMode("auto")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  connectMode === "auto"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                🚀 Auto Connect
              </button>
              <button
                onClick={() => setConnectMode("manual")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  connectMode === "manual"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                🔧 Manual Setup
              </button>
            </div>

            <div className="space-y-4">
              {connectMode === "auto" ? (
                <>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      One-Click Connection
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Enter your WordPress URL and click connect. You'll be redirected to approve the connection in your WordPress admin.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      WordPress Site URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {handshakeStatus === "pending" && (
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
                        </div>
                        <div>
                          <span className="font-semibold block">Waiting for Approval</span>
                          <span className="text-sm text-yellow-700 dark:text-yellow-300">Check your WordPress admin panel</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                          A new tab should have opened. If not, click below:
                        </p>
                        <a
                          href={authUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open WordPress Admin
                        </a>
                      </div>
                    </div>
                  )}

                  {handshakeStatus === "approved" && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-green-800 dark:text-green-200">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold block">Connection Successful!</span>
                          <span className="text-sm text-green-700 dark:text-green-300">Your WordPress site is now connected</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAutoConnect}
                    disabled={connecting || !siteUrl || handshakeStatus === "pending"}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : handshakeStatus === "pending" ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Waiting for approval...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Connect Automatically
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Setup Instructions
                    </h3>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                      <li>Install SEO AutoFix Pro plugin on your WordPress site</li>
                      <li>Go to SEO AutoFix → API / Connect</li>
                      <li>Enable Remote API</li>
                      <li>Copy Site URL and API Key below</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      WordPress Site URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Your API key from plugin"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={connecting || !siteUrl || !apiKey}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Connect & Verify
                      </>
                    )}
                  </button>
                </>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Auto-Fix Button Component
interface AutoFixButtonProps {
  domain: string;
  fixType: string;
  label: string;
  checkId?: string;
  onFixed?: (result: FixResult) => void;
}

export function AutoFixButton({ domain, fixType, label, onFixed }: AutoFixButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFix = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setResult(null);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: fixType,
        }),
      });

      const data = await response.json();
      setResult(data);
      onFixed?.(data);
    } catch {
      setResult({ success: false, message: "Fix failed - check plugin connection" });
    } finally {
      setFixing(false);
    }
  };

  if (result) {
    if (result.success) {
      return (
        <div className="relative">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Check className="h-4 w-4" />
            <span className="font-medium">Fixed!</span>
            {(result.fixed || result.message) && (
              <span className="text-xs opacity-75">({result.fixed ? `${result.fixed} items` : 'details'})</span>
            )}
          </button>
          {showDetails && result.message && (
            <div className="absolute top-full right-0 mt-1 z-10 p-3 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-700 rounded-lg shadow-lg text-xs max-w-xs">
              <p className="text-green-700 dark:text-green-300 font-medium mb-1">Plugin Response:</p>
              <p className="text-slate-600 dark:text-slate-400">{result.message}</p>
              {result.details && (
                <p className="text-slate-500 dark:text-slate-500 mt-1 text-[10px]">{JSON.stringify(result.details)}</p>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="relative">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Failed</span>
          </button>
          {showDetails && (
            <div className="absolute top-full right-0 mt-1 z-10 p-3 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 rounded-lg shadow-lg text-xs max-w-xs">
              <p className="text-red-700 dark:text-red-300 font-medium mb-1">Error:</p>
              <p className="text-slate-600 dark:text-slate-400">{result.message || 'Unknown error'}</p>
              <button
                onClick={(e) => { e.stopPropagation(); setResult(null); }}
                className="mt-2 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <button
      onClick={handleFix}
      disabled={fixing}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-sm hover:shadow transition-all font-medium"
    >
      {fixing ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Fixing...
        </>
      ) : (
        <>
          <Zap className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

// Bulk Fix All Button
interface BulkFixButtonProps {
  domain: string;
  fixes: string[];
  onComplete?: () => void;
}

export function BulkFixButton({ domain, fixes, onComplete }: BulkFixButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleBulkFix = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setProgress(0);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: "fix_bulk",
          options: { fixes },
        }),
      });

      await response.json();
      setDone(true);
      onComplete?.();
    } catch {
      // Handle error
    } finally {
      setFixing(false);
      setProgress(100);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Check className="h-5 w-5" />
        All fixes applied! Refresh to see updated results.
      </div>
    );
  }

  return (
    <button
      onClick={handleBulkFix}
      disabled={fixing}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-medium"
    >
      {fixing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Applying {fixes.length} fixes... {progress}%
        </>
      ) : (
        <>
          <Zap className="h-5 w-5" />
          Auto-Fix All Issues ({fixes.length})
        </>
      )}
    </button>
  );
}

// Category Auto-Fix Button Component
interface CategoryFixButtonProps {
  domain: string;
  category: string;
  label: string;
  icon?: React.ReactNode;
  onFixed?: (result: FixResult) => void;
}

export function CategoryFixButton({ domain, category, label, icon, onFixed }: CategoryFixButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);

  const categoryToAction: Record<string, string> = {
    local_seo: "fix_local_seo",
    onpage: "fix_onpage",
    links: "fix_links",
    usability: "fix_usability",
    performance: "fix_performance",
    social: "fix_social",
    technology: "fix_technology",
    content: "fix_content",
    eeat: "fix_eeat",
  };

  const handleFix = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setResult(null);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: categoryToAction[category] || `fix_${category}`,
        }),
      });

      const data = await response.json();
      setResult(data);
      onFixed?.(data);
    } catch {
      setResult({ success: false, message: "Fix failed" });
    } finally {
      setFixing(false);
    }
  };

  if (result?.success) {
    return (
      <span className="flex items-center gap-1 text-green-600 text-sm">
        <Check className="h-4 w-4" />
        Fixed!
      </span>
    );
  }

  return (
    <button
      onClick={handleFix}
      disabled={fixing}
      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
    >
      {fixing ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Fixing...
        </>
      ) : (
        <>
          {icon || <Zap className="h-3 w-3" />}
          {label}
        </>
      )}
    </button>
  );
}

// Comprehensive Auto-Fix All Button
interface AutoFixAllButtonProps {
  domain: string;
  onComplete?: () => void;
}

export function AutoFixAllButton({ domain, onComplete }: AutoFixAllButtonProps) {
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    setConnected(!!saved);
  }, [domain]);

  const handleAutoFixAll = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setFixing(true);
    setResult(null);

    try {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_url: siteUrl,
          api_key: apiKey,
          action: "auto_fix_all",
          options: { categories: ["all"] },
        }),
      });

      const data = await response.json();
      setResult(data);
      onComplete?.();
    } catch {
      setResult({ success: false, message: "Auto-fix failed" });
    } finally {
      setFixing(false);
    }
  };

  if (!connected) {
    return null;
  }

  if (result?.success) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl">
        <Check className="h-6 w-6 text-green-600" />
        <div>
          <p className="font-medium text-green-800 dark:text-green-200">All fixes applied successfully!</p>
          <p className="text-sm text-green-700 dark:text-green-300">
            {result.fixes_applied} fixes were applied. Refresh the page to see updated results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleAutoFixAll}
      disabled={fixing}
      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:opacity-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
    >
      {fixing ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin" />
          Applying All Fixes...
        </>
      ) : (
        <>
          <Zap className="h-6 w-6" />
          🚀 Auto-Fix All SEO Issues
        </>
      )}
    </button>
  );
}

// Issue Detection Component
interface IssueDetectorProps {
  domain: string;
  onIssuesDetected?: (issues: DetectedIssues) => void;
}

interface DetectedIssues {
  total_issues: number;
  total_fixable: number;
  issues: Record<string, Array<{
    id: string;
    message: string;
    severity: string;
    fixable: boolean;
    count?: number;
  }>>;
  fixable_actions: string[];
}

export function IssueDetector({ domain, onIssuesDetected }: IssueDetectorProps) {
  const [detecting, setDetecting] = useState(false);
  const [issues, setIssues] = useState<DetectedIssues | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    setConnected(!!saved);
  }, [domain]);

  const handleDetect = async () => {
    // Use global key for WordPress connection
    const saved = localStorage.getItem('wp_connection_global') || localStorage.getItem(`wp_connection_${domain}`);
    if (!saved) return;

    const { siteUrl, apiKey } = JSON.parse(saved);
    setDetecting(true);

    try {
      const response = await fetch(
        `/api/wordpress?action=detect_issues&site_url=${encodeURIComponent(siteUrl)}&api_key=${encodeURIComponent(apiKey)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setIssues(data);
        onIssuesDetected?.(data);
      }
    } catch {
      // Handle error
    } finally {
      setDetecting(false);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleDetect}
        disabled={detecting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {detecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning WordPress Site...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Detect Issues from Plugin
          </>
        )}
      </button>

      {issues && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Plugin Issues Detected</span>
            <span className="text-sm text-muted-foreground">
              {issues.total_issues} issues, {issues.total_fixable} fixable
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.entries(issues.issues).map(([category, categoryIssues]) => (
              categoryIssues.length > 0 && (
                <div key={category} className="flex items-center justify-between p-2 bg-background rounded">
                  <span className="capitalize">{category.replace(/_/g, " ")}</span>
                  <span className="text-orange-600 font-medium">{categoryIssues.length}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
