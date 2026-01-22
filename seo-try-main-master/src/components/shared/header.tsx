"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SEO</span>
          </div>
          <span className="font-semibold text-lg">Audit Tool</span>
        </Link>

        <SignedIn>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/history"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              History
            </Link>
            <Link
              href="/content-strategy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Content Strategy
            </Link>
            <Link
              href="/auto-content"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium text-blue-600 dark:text-blue-400"
            >
              Auto-Content
            </Link>
            <Link
              href="/drafts"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Drafts
            </Link>
            <Link
              href="/calendar"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Calendar
            </Link>
            <Link
              href="/editor"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Editor
            </Link>
            <Link
              href="/gbp-audit"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GBP Audit
            </Link>
          </nav>
        </SignedIn>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
