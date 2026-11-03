import "server-only";

import type {
  Company,
  CompanyList,
  CompanySort,
  CompanyStatus,
} from "@/lib/api/schema";

import { createSeedCompanies } from "./seed";

export type ListQuery = {
  limit: number;
  offset: number;
  q: string | null;
  status: CompanyStatus | null;
  sort: CompanySort;
};

export type CompanyChanges = {
  name?: string;
  domain?: string | null;
  status?: CompanyStatus;
};

export type UpdateResult =
  | { kind: "updated"; company: Company }
  | { kind: "not_found" }
  | { kind: "version_conflict" };

declare global {
  // Route handlers are bundled separately, so a module-level array would give
  // each route its own copy. `globalThis` is shared by the whole server process
  // (and survives dev hot reloads).
  var companiesTable: Company[] | undefined;
}

function table(): Company[] {
  globalThis.companiesTable ??= createSeedCompanies();
  return globalThis.companiesTable;
}

const nameCollator = new Intl.Collator("en", { sensitivity: "base" });

function compareCompanies(sort: CompanySort) {
  const direction = sort.startsWith("-") ? -1 : 1;
  const field = sort.replace(/^-/, "");
  return (a: Company, b: Company): number => {
    const result =
      field === "name"
        ? nameCollator.compare(a.name, b.name)
        : a.created_at.localeCompare(b.created_at);
    // Tie-break on id so pagination is stable.
    return direction * (result !== 0 ? result : a.id.localeCompare(b.id));
  };
}

export function listCompanies(query: ListQuery): CompanyList {
  const needle = query.q?.toLowerCase() ?? null;
  const matches = table()
    .filter((company) => query.status === null || company.status === query.status)
    .filter(
      (company) =>
        needle === null ||
        company.name.toLowerCase().includes(needle) ||
        (company.domain?.includes(needle) ?? false),
    )
    .sort(compareCompanies(query.sort));

  return {
    items: matches
      .slice(query.offset, query.offset + query.limit)
      .map((company) => ({ ...company })),
    total: matches.length,
    limit: query.limit,
    offset: query.offset,
  };
}

export function getCompany(id: string): Company | null {
  const company = table().find((candidate) => candidate.id === id);
  return company ? { ...company } : null;
}

export function createCompany(input: {
  name: string;
  domain: string | null;
  status: CompanyStatus;
}): Company {
  const now = new Date().toISOString();
  const company: Company = {
    id: crypto.randomUUID(),
    ...input,
    version: 1,
    created_at: now,
    updated_at: now,
  };
  table().push(company);
  return { ...company };
}

/**
 * Compare-and-set on `version`. This runs synchronously, so no other request
 * can interleave between the version check and the write.
 */
export function updateCompany(
  id: string,
  ifVersion: number,
  changes: CompanyChanges,
): UpdateResult {
  const companies = table();
  const index = companies.findIndex((candidate) => candidate.id === id);
  const current = companies[index];
  if (!current) return { kind: "not_found" };
  if (current.version !== ifVersion) return { kind: "version_conflict" };

  const updated: Company = {
    ...current,
    ...changes,
    version: current.version + 1,
    updated_at: new Date().toISOString(),
  };
  companies[index] = updated;
  return { kind: "updated", company: { ...updated } };
}
