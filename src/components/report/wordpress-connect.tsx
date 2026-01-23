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

  // Load saved connection
  useEffect(() => {
    const saved = localStorage.getItem(`wp_connection_${domain}`);
    if (saved) {
      const conn = JSON.parse(saved);
      setConnection(conn);
      onConnectionChange?.(conn.connected);
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

          if (completeData.success && completeData.api_key) {
            const conn: WordPressConnection = {
              siteUrl: completeData.site_url,
              apiKey: completeData.api_key,
              connected: true,
              siteName: completeData.site_name,
            };
            localStorage.setItem(`wp_connection_${domain}`, JSON.stringify(conn));
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

      localStorage.setItem(`wp_connection_${domain}`, JSON.stringify(conn));
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
    localStorage.removeItem(`wp_connection_${domain}`);
    setConnection(null);
    onConnectionChange?.(false);
  };

  return (
    <>
      {connection?.connected ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1 text-green-600">
            <Check className="h-4 w-4" />
            Connected to {connection.siteName || connection.siteUrl}
          </span>
          <button
            onClick={handleDisconnect}
            className="text-muted-foreground hover:text-foreground underline"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="font-medium">Waiting for approval...</span>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                        Please approve the connection in your WordPress admin panel.
                      </p>
                      <a
                        href={authUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-yellow-800 dark:text-yellow-200 underline mt-2"
                      >
                        Open WordPress Admin <ExternalLink className="h-3 w-3" />
                      </a>
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

  const handleFix = async () => {
    const saved = localStorage.getItem(`wp_connection_${domain}`);
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
      className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
    >
      {fixing ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Fixing...
        </>
      ) : (
        <>
          <Zap className="h-3 w-3" />
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
    const saved = localStorage.getItem(`wp_connection_${domain}`);
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
    const saved = localStorage.getItem(`wp_connection_${domain}`);
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
    const saved = localStorage.getItem(`wp_connection_${domain}`);
    setConnected(!!saved);
  }, [domain]);

  const handleAutoFixAll = async () => {
    const saved = localStorage.getItem(`wp_connection_${domain}`);
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
    const saved = localStorage.getItem(`wp_connection_${domain}`);
    setConnected(!!saved);
  }, [domain]);

  const handleDetect = async () => {
    const saved = localStorage.getItem(`wp_connection_${domain}`);
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
