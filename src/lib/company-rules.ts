import {
  COMPANY_SORTS,
  COMPANY_STATUSES,
  type CompanySort,
  type CompanyStatus,
} from "@/lib/api/schema";

/**
 * Validation rules for company input. The mock API enforces them and the form
 * mirrors them, so the client can reject bad input before a round trip while
 * the API stays the authority (422).
 */

export const COMPANY_NAME_MAX_LENGTH = 120;

const DOMAIN_PATTERN =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export type CompanyField = "name" | "domain" | "status";

export type CompanyFieldIssue =
  | "required"
  | "too_long"
  | "invalid_domain"
  | "invalid_status";

export function isCompanyStatus(value: unknown): value is CompanyStatus {
  return COMPANY_STATUSES.some((status) => status === value);
}

export function isCompanySort(value: unknown): value is CompanySort {
  return COMPANY_SORTS.some((sort) => sort === value);
}

export function normalizeName(name: string): string {
  return name.trim();
}

/** Empty input means "no domain". Domains are stored lower-case. */
export function normalizeDomain(domain: string | null): string | null {
  const normalized = domain?.trim().toLowerCase() ?? "";
  return normalized === "" ? null : normalized;
}

export function validateName(name: string): CompanyFieldIssue | null {
  const normalized = normalizeName(name);
  if (normalized === "") return "required";
  if (normalized.length > COMPANY_NAME_MAX_LENGTH) return "too_long";
  return null;
}

export function validateDomain(domain: string | null): CompanyFieldIssue | null {
  const normalized = normalizeDomain(domain);
  if (normalized !== null && !DOMAIN_PATTERN.test(normalized)) {
    return "invalid_domain";
  }
  return null;
}
