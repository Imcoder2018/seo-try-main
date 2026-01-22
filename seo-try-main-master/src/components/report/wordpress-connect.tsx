"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Plug, Zap, AlertCircle } from "lucide-react";

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

  // Load saved connection
  useEffect(() => {
    const saved = localStorage.getItem(`wp_connection_${domain}`);
    if (saved) {
      const conn = JSON.parse(saved);
      setConnection(conn);
      onConnectionChange?.(conn.connected);
    }
  }, [domain, onConnectionChange]);

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
    } catch (err) {
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
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
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

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

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
