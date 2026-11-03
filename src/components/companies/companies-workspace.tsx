"use client";

import { useQuery } from "@tanstack/react-query";

import { listCompaniesOptions } from "@/lib/api/company-queries";
import type { CompaniesUrlState } from "@/lib/companies/url-state";
import { toListParams } from "@/lib/companies/url-state";
import { useI18n } from "@/lib/i18n/i18n-provider";

import { CompanyDrawer } from "./company-drawer";
import { CompanyTable } from "./company-table";
import { CompanyToolbar } from "./company-toolbar";
import { PaginationBar } from "./pagination-bar";

type CompaniesWorkspaceProps = {
  state: CompaniesUrlState;
  onStateChange: (state: CompaniesUrlState) => void;
};

export function CompaniesWorkspace({ state, onStateChange }: CompaniesWorkspaceProps) {
  const { messages } = useI18n();
  const listQuery = useQuery(listCompaniesOptions(toListParams(state)));
  const selectedId = state.drawer.kind === "edit" ? state.drawer.id : null;
  const hasFilters = state.q !== "" || state.status !== undefined;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {messages.companies.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{messages.companies.description}</p>
        </div>
        <button
          type="button"
          onClick={() => onStateChange({ ...state, drawer: { kind: "create" } })}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {messages.companies.create}
        </button>
      </div>

      <CompanyToolbar state={state} onChange={onStateChange} />

      {listQuery.isPending ? (
        <div
          className="overflow-hidden rounded-lg border border-slate-200 bg-white"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">{messages.companies.loading}</span>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="h-12 animate-pulse border-b border-slate-100 bg-slate-50 last:border-b-0" />
          ))}
        </div>
      ) : listQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center">
          <p className="text-sm text-red-800">{messages.companies.error}</p>
          <button
            type="button"
            onClick={() => void listQuery.refetch()}
            className="mt-3 rounded-md bg-red-900 px-3 py-1.5 text-sm text-white"
          >
            {messages.companies.retry}
          </button>
        </div>
      ) : listQuery.data.items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-600">
          {hasFilters ? messages.companies.emptyFiltered : messages.companies.empty}
        </div>
      ) : (
        <>
          <CompanyTable
            companies={listQuery.data.items}
            sort={state.sort}
            selectedId={selectedId}
            isFetching={listQuery.isFetching}
            onSort={(sort) => onStateChange({ ...state, sort, offset: 0 })}
            onOpen={(id) => onStateChange({ ...state, drawer: { kind: "edit", id } })}
          />
          <PaginationBar
            total={listQuery.data.total}
            offset={state.offset}
            onOffsetChange={(offset) => onStateChange({ ...state, offset })}
          />
        </>
      )}

      <CompanyDrawer
        drawer={state.drawer}
        onClose={() => onStateChange({ ...state, drawer: { kind: "closed" } })}
        onCreated={(company) =>
          onStateChange({ ...state, drawer: { kind: "edit", id: company.id } })
        }
      />
    </div>
  );
}
