"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { clearAccessToken } from "@/lib/auth/token-store";
import { useI18n } from "@/lib/i18n/i18n-provider";
import type { Locale } from "@/lib/i18n/messages";

export function AppHeader({ variant }: { variant: "app" | "public" }) {
  const { locale, messages, setLocale } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();

  function signOut() {
    clearAccessToken();
    queryClient.clear();
    router.replace("/signin");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-tight text-slate-900">{messages.appName}</p>
        <div className="flex items-center gap-3">
          <LanguageToggle locale={locale} onChange={setLocale} />
          {variant === "app" ? (
            <button
              type="button"
              onClick={signOut}
              className="rounded-md px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {messages.auth.signOut}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function LanguageToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  const { messages } = useI18n();

  return (
    <div className="flex rounded-md border border-slate-200 p-0.5" role="group" aria-label="Language">
      {(["en", "nl"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={locale === option}
          aria-label={option === "en" ? messages.language.switchToEnglish : messages.language.switchToDutch}
          onClick={() => onChange(option)}
          className={
            locale === option
              ? "rounded px-2 py-1 text-xs font-semibold text-white bg-slate-900"
              : "rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          }
        >
          {option === "en" ? messages.language.en : messages.language.nl}
        </button>
      ))}
    </div>
  );
}
