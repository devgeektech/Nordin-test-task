"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { safeInternalPath } from "@/lib/auth/safe-redirect";
import { setAccessToken } from "@/lib/auth/token-store";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function SignInForm() {
  const { messages } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("demo-access-token");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = token.trim();
    if (value === "") {
      setError(messages.auth.tokenRequired);
      return;
    }
    setAccessToken(value);
    router.replace(safeInternalPath(searchParams.get("from")));
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{messages.auth.title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{messages.auth.description}</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="access-token" className="block text-sm font-medium text-slate-700">
              {messages.auth.tokenLabel}
            </label>
            <input
              id="access-token"
              name="token"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setError(null);
              }}
              autoComplete="off"
              aria-invalid={error !== null}
              aria-describedby={error ? "token-error" : undefined}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            />
            {error ? (
              <p id="token-error" role="alert" className="text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {messages.auth.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
