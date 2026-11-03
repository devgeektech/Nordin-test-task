import { DEFAULT_COMPANY_SORT, DEFAULT_PAGE_SIZE } from "@/lib/api/company-queries";
import type { CompanySort, CompanyStatus, ListCompaniesParams } from "@/lib/api/schema";
import { isCompanySort, isCompanyStatus } from "@/lib/company-rules";

export type DrawerState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; id: string };

export type CompaniesUrlState = {
  q: string;
  status: CompanyStatus | undefined;
  sort: CompanySort;
  offset: number;
  drawer: DrawerState;
};

export function parseCompaniesSearchParams(params: {
  get: (name: string) => string | null;
}): CompaniesUrlState {
  const q = params.get("q")?.trim() ?? "";
  const rawStatus = params.get("status");
  const rawSort = params.get("sort");
  const rawOffset = params.get("offset");
  const company = params.get("company");

  const parsedOffset = rawOffset === null ? 0 : Number(rawOffset);
  const offset = Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

  let drawer: DrawerState = { kind: "closed" };
  if (company === "new") drawer = { kind: "create" };
  else if (company) drawer = { kind: "edit", id: company };

  return {
    q,
    status: isCompanyStatus(rawStatus) ? rawStatus : undefined,
    sort: isCompanySort(rawSort) ? rawSort : DEFAULT_COMPANY_SORT,
    offset,
    drawer,
  };
}

export function serializeCompaniesSearchParams(state: CompaniesUrlState): string {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.status) params.set("status", state.status);
  if (state.sort !== DEFAULT_COMPANY_SORT) params.set("sort", state.sort);
  if (state.offset > 0) params.set("offset", String(state.offset));
  if (state.drawer.kind === "create") params.set("company", "new");
  if (state.drawer.kind === "edit") params.set("company", state.drawer.id);
  return params.toString();
}

export function toListParams(state: CompaniesUrlState): ListCompaniesParams {
  return {
    limit: DEFAULT_PAGE_SIZE,
    offset: state.offset,
    sort: state.sort,
    ...(state.q ? { q: state.q } : {}),
    ...(state.status ? { status: state.status } : {}),
  };
}

export function toggleSort(current: CompanySort, column: "name" | "created_at"): CompanySort {
  const field = current.replace(/^-/, "");
  if (field === column) return current.startsWith("-") ? column : `-${column}`;
  return column === "created_at" ? "-created_at" : "name";
}

export function sortDirection(sort: CompanySort, column: "name" | "created_at"): "asc" | "desc" | "none" {
  const field = sort.replace(/^-/, "");
  if (field !== column) return "none";
  return sort.startsWith("-") ? "desc" : "asc";
}
