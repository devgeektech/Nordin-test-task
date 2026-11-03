/**
 * API contract for `/api/v1/companies`.
 *
 * In the real project this file is generated from the backend's OpenAPI schema
 * (e.g. with openapi-typescript) and must not be edited by hand.
 */

export const COMPANY_STATUSES = [
  "new",
  "researching",
  "contacted",
  "qualified",
  "rejected",
] as const;

export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const COMPANY_SORTS = [
  "name",
  "-name",
  "created_at",
  "-created_at",
] as const;

export type CompanySort = (typeof COMPANY_SORTS)[number];

export type Company = {
  id: string;
  name: string;
  domain: string | null;
  status: CompanyStatus;
  version: number;
  /** ISO 8601 */
  created_at: string;
  /** ISO 8601 */
  updated_at: string;
};

export type CompanyList = {
  items: Company[];
  total: number;
  limit: number;
  offset: number;
};

export type ListCompaniesParams = {
  limit?: number;
  offset?: number;
  q?: string;
  status?: CompanyStatus;
  sort?: CompanySort;
};

export type CompanyCreate = {
  name: string;
  domain?: string | null;
  status?: CompanyStatus;
};

export type CompanyUpdate = {
  if_version: number;
  name?: string;
  domain?: string | null;
  status?: CompanyStatus;
};

/** FastAPI's default validation error shape (HTTP 422). */
export type ValidationErrorItem = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

export type HTTPValidationError = {
  detail: ValidationErrorItem[];
};

/** FastAPI's default `HTTPException` shape (401, 404, 409, ...). */
export type HTTPError = {
  detail: string;
};
