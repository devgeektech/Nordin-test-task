"use client";

import type { CompanyStatus } from "@/lib/api/schema";
import { useI18n } from "@/lib/i18n/i18n-provider";

const STATUS_CLASS: Record<CompanyStatus, string> = {
  new: "bg-sky-50 text-sky-800",
  researching: "bg-amber-50 text-amber-800",
  contacted: "bg-violet-50 text-violet-800",
  qualified: "bg-emerald-50 text-emerald-800",
  rejected: "bg-rose-50 text-rose-800",
};

export function StatusBadge({ status }: { status: CompanyStatus }) {
  const { messages } = useI18n();
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[status]}`}>
      {messages.status[status]}
    </span>
  );
}
