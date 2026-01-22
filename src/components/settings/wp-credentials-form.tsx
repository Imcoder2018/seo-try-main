"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle, AlertCircle, Globe, Lock } from "lucide-react";

interface WPCredentials {
  siteUrl: string;
  username: string;
  appPassword: string;
}

export default function WPCredentialsSettings() {
  const [credentials, setCredentials] = useState<WPCredentials>({
    siteUrl: "",
    username: "",
    appPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [testConnection, setTestConnection] = useState<"idle" | "testing" | "success" | "error">("idle");

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const response = await fetch("/api/wordpress/credentials");
      const data = await response.json();
      if (data.credentials) {
        setCredentials(data.credentials);
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/wordpress/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("Failed to save credentials");

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving credentials:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestConnection("testing");

    try {
      const response = await fetch("/api/wordpress/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("Connection failed");

      setTestConnection("success");
      setTimeout(() => setTestConnection("idle"), 3000);
    } catch (error) {
      console.error("Connection test failed:", error);
      setTestConnection("error");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              WordPress Credentials
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Configure your WordPress site for publishing
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={credentials.siteUrl}
              onChange={(e) => setCredentials({ ...credentials, siteUrl: e.target.value })}
              placeholder="https://yoursite.com"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your WordPress site URL (without /wp-admin)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="wp-admin username"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Application Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={credentials.appPassword}
                onChange={(e) => setCredentials({ ...credentials, appPassword: e.target.value })}
                placeholder="WordPress Application Password"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate in WP Admin → Users → Profile → Application Passwords
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Credentials"}
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testConnection === "testing" || !credentials.siteUrl}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testConnection === "testing" ? (
                "Testing..."
              ) : (
                "Test Connection"
              )}
            </button>

            {saveStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Saved successfully!</span>
              </div>
            )}

            {saveStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Failed to save</span>
              </div>
            )}

            {testConnection === "success" && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Connection successful!</span>
              </div>
            )}

            {testConnection === "error" && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Connection failed</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How to generate an Application Password
          </h3>
          <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Go to your WordPress admin dashboard</li>
            <li>Navigate to Users → Profile</li>
            <li>Scroll down to "Application Passwords" section</li>
            <li>Enter a name (e.g., "SEO Auto Fix")</li>
            <li>Click "Add New Application Password"</li>
            <li>Copy the generated password and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
