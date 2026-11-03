import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getCompany, listCompanies } from "./companies";
import type { CompanySort, ListCompaniesParams } from "./schema";

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_COMPANY_SORT: CompanySort = "-created_at";

/** Same filters should hit the same cache entry (`{}` and `{ offset: 0 }`). */
export function normalizeListParams(params: ListCompaniesParams): ListCompaniesParams {
  const q = params.q?.trim();
  return {
    limit: params.limit ?? DEFAULT_PAGE_SIZE,
    offset: params.offset ?? 0,
    sort: params.sort ?? DEFAULT_COMPANY_SORT,
    ...(q ? { q } : {}),
    ...(params.status ? { status: params.status } : {}),
  };
}

// Invalidate `lists()` to refetch every page/filter, without touching details.
export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (params: ListCompaniesParams) =>
    [...companyKeys.lists(), normalizeListParams(params)] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
};

export function listCompaniesOptions(params: ListCompaniesParams) {
  const normalized = normalizeListParams(params);
  return queryOptions({
    queryKey: companyKeys.list(normalized),
    queryFn: ({ signal }) => listCompanies(normalized, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function companyOptions(id: string) {
  return queryOptions({
    queryKey: companyKeys.detail(id),
    queryFn: ({ signal }) => getCompany(id, { signal }),
  });
}
