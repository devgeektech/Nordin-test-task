import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-col">
      <AppHeader variant="public" />
      <main className="flex-1">
        <Suspense>
          <SignInForm />
        </Suspense>
      </main>
    </div>
  );
}
