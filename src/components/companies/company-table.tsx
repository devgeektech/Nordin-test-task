"use client";

import type { Company, CompanySort } from "@/lib/api/schema";
import { sortDirection, toggleSort } from "@/lib/companies/url-state";
import { useI18n } from "@/lib/i18n/i18n-provider";

import { StatusBadge } from "./status-badge";

type CompanyTableProps = {
  companies: Company[];
  sort: CompanySort;
  selectedId: string | null;
  isFetching: boolean;
  onSort: (sort: CompanySort) => void;
  onOpen: (id: string) => void;
};

export function CompanyTable({
  companies,
  sort,
  selectedId,
  isFetching,
  onSort,
  onOpen,
}: CompanyTableProps) {
  const { messages, formatDate } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isFetching ? (
        <div
          className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-slate-100"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">{messages.companies.fetching}</span>
          <div className="h-full w-1/3 animate-pulse bg-slate-900" />
        </div>
      ) : null}
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">{messages.companies.caption}</caption>
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <SortableHeader
              label={messages.companies.name}
              ariaLabel={messages.companies.sortByName}
              direction={sortDirection(sort, "name")}
              onClick={() => onSort(toggleSort(sort, "name"))}
            />
            <th scope="col" className="px-4 py-3">
              {messages.companies.domain}
            </th>
            <th scope="col" className="px-4 py-3">
              {messages.companies.status}
            </th>
            <SortableHeader
              label={messages.companies.created}
              ariaLabel={messages.companies.sortByCreated}
              direction={sortDirection(sort, "created_at")}
              onClick={() => onSort(toggleSort(sort, "created_at"))}
            />
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => {
            const selected = company.id === selectedId;
            return (
              <tr
                key={company.id}
                tabIndex={0}
                aria-selected={selected}
                aria-label={messages.companies.openCompany.replace("{name}", company.name)}
                onClick={() => onOpen(company.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen(company.id);
                  }
                }}
                className={
                  selected
                    ? "cursor-pointer bg-slate-100 outline-none"
                    : "cursor-pointer border-t border-slate-100 outline-none hover:bg-slate-50 focus-visible:bg-slate-50"
                }
              >
                <td className="px-4 py-3 font-medium text-slate-900">{company.name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {company.domain ?? (
                    <span className="text-slate-400">{messages.companies.noDomain}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={company.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(company.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({
  label,
  ariaLabel,
  direction,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  direction: "asc" | "desc" | "none";
  onClick: () => void;
}) {
  return (
    <th scope="col" aria-sort={direction === "none" ? "none" : direction === "asc" ? "ascending" : "descending"} className="px-4 py-3">
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="inline-flex items-center gap-1 rounded text-left hover:text-slate-900"
      >
        {label}
        <span aria-hidden="true" className="text-slate-400">
          {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
        </span>
      </button>
    </th>
  );
}
