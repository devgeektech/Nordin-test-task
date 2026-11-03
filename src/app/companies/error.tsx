"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";

export default function CompaniesError({ retry }: { error: unknown; retry: () => void }) {
  const { messages } = useI18n();

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-lg font-semibold text-slate-900">{messages.routeError.title}</h1>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
      >
        {messages.routeError.retry}
      </button>
    </div>
  );
}
