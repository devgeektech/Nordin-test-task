// Fake access token for this tab. sessionStorage survives refresh, not a new browser.

const STORAGE_KEY = "companies.access-token";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

export function getAccessToken(): string | null {
  return storage()?.getItem(STORAGE_KEY) ?? null;
}

export function setAccessToken(token: string): void {
  storage()?.setItem(STORAGE_KEY, token);
}

export function clearAccessToken(): void {
  storage()?.removeItem(STORAGE_KEY);
}
