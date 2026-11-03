"use client";

import { useCompaniesUrlState } from "@/lib/companies/use-companies-url-state";

import { CompaniesWorkspace } from "./companies-workspace";

export function CompaniesScreen() {
  const [state, setState] = useCompaniesUrlState();
  return <CompaniesWorkspace state={state} onStateChange={setState} />;
}
