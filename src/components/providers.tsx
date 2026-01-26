"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { useState, type ReactNode } from "react";
import { AuthGate } from "@/components/auth-gate";
import { ContentStrategyProvider } from "@/contexts/ContentStrategyContext";
import { ToastProvider } from "@/components/ui/Toast";
import { OnboardingCheck } from "@/components/auth/OnboardingCheck";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ContentStrategyProvider>
          <ToastProvider>
            <AuthGate>
              <OnboardingCheck>{children}</OnboardingCheck>
            </AuthGate>
          </ToastProvider>
        </ContentStrategyProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
