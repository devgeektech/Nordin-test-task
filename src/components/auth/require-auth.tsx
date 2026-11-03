"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAccessToken } from "@/lib/auth/token-store";

import { PageSkeleton } from "../page-skeleton";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const ok = getAccessToken() !== null;
    // sessionStorage is only available after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read token on the client
    setSignedIn(ok);
    setChecked(true);
    if (!ok) {
      const from = `${window.location.pathname}${window.location.search}`;
      router.replace(`/signin?from=${encodeURIComponent(from)}`);
    }
  }, [router]);

  if (!checked || !signedIn) return <PageSkeleton />;
  return children;
}
