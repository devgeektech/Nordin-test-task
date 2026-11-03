"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { clearAccessToken } from "@/lib/auth/token-store";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { makeQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() =>
    makeQueryClient({
      onUnauthorized: () => {
        clearAccessToken();
        router.replace("/signin");
      },
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{children}</I18nProvider>
    </QueryClientProvider>
  );
}
