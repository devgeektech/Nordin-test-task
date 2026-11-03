"use client";

import { DEFAULT_PAGE_SIZE } from "@/lib/api/company-queries";
import { useI18n } from "@/lib/i18n/i18n-provider";

type PaginationBarProps = {
  total: number;
  offset: number;
  onOffsetChange: (offset: number) => void;
};

export function PaginationBar({ total, offset, onOffsetChange }: PaginationBarProps) {
  const { messages } = useI18n();
  const page = Math.floor(offset / DEFAULT_PAGE_SIZE) + 1;
  const pages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + DEFAULT_PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        {messages.companies.range
          .replace("{from}", String(from))
          .replace("{to}", String(to))
          .replace("{total}", String(total))}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-slate-600">
          {messages.companies.page
            .replace("{page}", String(page))
            .replace("{pages}", String(pages))}
        </p>
        <button
          type="button"
          onClick={() => onOffsetChange(Math.max(0, offset - DEFAULT_PAGE_SIZE))}
          disabled={offset === 0}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {messages.companies.previous}
        </button>
        <button
          type="button"
          onClick={() => onOffsetChange(offset + DEFAULT_PAGE_SIZE)}
          disabled={offset + DEFAULT_PAGE_SIZE >= total}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {messages.companies.next}
        </button>
      </div>
    </div>
  );
}
