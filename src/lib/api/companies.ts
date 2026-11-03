import { apiRequest } from "./http";
import type {
  Company,
  CompanyCreate,
  CompanyList,
  CompanyUpdate,
  ListCompaniesParams,
} from "./schema";

type CallOptions = { signal?: AbortSignal };

export function listCompanies(
  params: ListCompaniesParams,
  { signal }: CallOptions = {},
): Promise<CompanyList> {
  return apiRequest<CompanyList>("/companies", { query: params, signal });
}

export function getCompany(id: string, { signal }: CallOptions = {}): Promise<Company> {
  return apiRequest<Company>(`/companies/${encodeURIComponent(id)}`, { signal });
}

export function createCompany(body: CompanyCreate): Promise<Company> {
  return apiRequest<Company>("/companies", { method: "POST", body });
}

export function updateCompany(id: string, body: CompanyUpdate): Promise<Company> {
  return apiRequest<Company>(`/companies/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body,
  });
}
