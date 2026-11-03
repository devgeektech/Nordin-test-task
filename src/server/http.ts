import "server-only";

import type { HTTPError, HTTPValidationError, ValidationErrorItem } from "@/lib/api/schema";

const MIN_LATENCY_MS = 300;
const MAX_LATENCY_MS = 800;

/** Artificial latency so loading states are visible. */
export function simulateLatency(): Promise<void> {
  const delay = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/** The mock accepts any non-empty bearer token. */
export function isAuthenticated(request: Request): boolean {
  const header = request.headers.get("authorization");
  return header !== null && /^Bearer\s+\S+/i.test(header);
}

export function errorResponse(status: number, detail: string): Response {
  const body: HTTPError = { detail };
  return Response.json(body, {
    status,
    headers: status === 401 ? { "WWW-Authenticate": "Bearer" } : undefined,
  });
}

export function validationErrorResponse(detail: ValidationErrorItem[]): Response {
  const body: HTTPValidationError = { detail };
  return Response.json(body, { status: 422 });
}

/** Resolves to `null` when the body is not a JSON object. */
export async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return isRecord(body) ? body : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
