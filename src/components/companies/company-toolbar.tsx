"use client";

import { useEffect, useState } from "react";

import { COMPANY_STATUSES, type CompanyStatus } from "@/lib/api/schema";
import type { CompaniesUrlState } from "@/lib/companies/url-state";
import { useI18n } from "@/lib/i18n/i18n-provider";

type CompanyToolbarProps = {
  state: CompaniesUrlState;
  onChange: (state: CompaniesUrlState) => void;
};

export function CompanyToolbar({ state, onChange }: CompanyToolbarProps) {
  const { messages } = useI18n();
  const [search, setSearch] = useState(state.q);
  const [urlQuery, setUrlQuery] = useState(state.q);

  if (state.q !== urlQuery) {
    setUrlQuery(state.q);
    setSearch(state.q);
  }

  // Debounce search so we do not hit the API on every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const q = search.trim();
      if (q === state.q) return;
      onChange({ ...state, q, offset: 0 });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [onChange, search, state]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="min-w-0 flex-1">
        <label htmlFor="company-search" className="mb-1 block text-sm font-medium text-slate-700">
          {messages.companies.search}
        </label>
        <input
          id="company-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={messages.companies.searchPlaceholder}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        />
      </div>
      <div className="sm:w-52">
        <label htmlFor="company-status" className="mb-1 block text-sm font-medium text-slate-700">
          {messages.companies.status}
        </label>
        <select
          id="company-status"
          value={state.status ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            onChange({
              ...state,
              status: value === "" ? undefined : (value as CompanyStatus),
              offset: 0,
            });
          }}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <option value="">{messages.companies.allStatuses}</option>
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {messages.status[status]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
