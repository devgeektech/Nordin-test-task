import { AppHeader } from "@/components/app-header";
import { RequireAuth } from "@/components/auth/require-auth";

export default function CompaniesLayout({ children }: LayoutProps<"/companies">) {
  return (
    <RequireAuth>
      <div className="flex min-h-full flex-col">
        <AppHeader variant="app" />
        <main className="flex-1">{children}</main>
      </div>
    </RequireAuth>
  );
}
