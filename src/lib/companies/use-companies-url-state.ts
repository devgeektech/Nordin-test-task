"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  parseCompaniesSearchParams,
  serializeCompaniesSearchParams,
  type CompaniesUrlState,
} from "./url-state";

export function useCompaniesUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = parseCompaniesSearchParams(searchParams);

  function setState(next: CompaniesUrlState) {
    const query = serializeCompaniesSearchParams(next);
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return [state, setState] as const;
}
