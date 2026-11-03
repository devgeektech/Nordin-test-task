"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCompany, updateCompany } from "./companies";
import { companyKeys } from "./company-queries";
import type { Company, CompanyCreate, CompanyUpdate } from "./schema";

function rememberCompany(
  queryClient: ReturnType<typeof useQueryClient>,
  company: Company,
): void {
  queryClient.setQueryData(companyKeys.detail(company.id), company);
  void queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CompanyCreate) => createCompany(body),
    onSuccess: (company) => rememberCompany(queryClient, company),
  });
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CompanyUpdate }) =>
      updateCompany(id, body),
    onSuccess: (company) => rememberCompany(queryClient, company),
  });
}
