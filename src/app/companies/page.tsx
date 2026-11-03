import { Suspense } from "react";

import { CompaniesScreen } from "@/components/companies/companies-screen";
import { PageSkeleton } from "@/components/page-skeleton";

export default function CompaniesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CompaniesScreen />
    </Suspense>
  );
}
