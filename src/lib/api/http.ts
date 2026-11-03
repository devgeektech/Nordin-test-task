import { getAccessToken } from "@/lib/auth/token-store";

import type { HTTPValidationError, ValidationErrorItem } from "./schema";

const API_BASE_PATH = "/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function isApiError(error: unknown, status?: number): error is ApiError {
  return error instanceof ApiError && (status === undefined || error.status === status);
}

export type QueryValue = string | number | undefined;

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  query?: Record<string, QueryValue>;
  body?: unknown;
  signal?: AbortSignal;
};

export function buildApiUrl(path: string, query: Record<string, QueryValue> = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const search = params.toString();
  return `${API_BASE_PATH}${path}${search ? `?${search}` : ""}`;
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text === "") return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<TResponse>(
  path: string,
  { method = "GET", query, body, signal }: RequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers({ Accept: "application/json" });
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (body !== undefined) headers.set("Content-Type", "application/json");

  const response = await fetch(buildApiUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  const payload = await readBody(response);
  if (!response.ok) throw new ApiError(response.status, payload);

  return payload as TResponse;
}

function isValidationErrorItem(value: unknown): value is ValidationErrorItem {
  if (typeof value !== "object" || value === null) return false;
  return (
    "loc" in value &&
    Array.isArray(value.loc) &&
    "msg" in value &&
    typeof value.msg === "string" &&
    "type" in value &&
    typeof value.type === "string"
  );
}

function isHTTPValidationError(body: unknown): body is HTTPValidationError {
  return (
    typeof body === "object" &&
    body !== null &&
    "detail" in body &&
    Array.isArray(body.detail) &&
    body.detail.every(isValidationErrorItem)
  );
}

export function getValidationErrors(error: unknown): ValidationErrorItem[] | null {
  if (!isApiError(error, 422) || !isHTTPValidationError(error.body)) return null;
  return error.body.detail;
}

function isHTTPError(body: unknown): body is { detail: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "detail" in body &&
    typeof body.detail === "string"
  );
}

export function getErrorDetail(error: unknown): string | null {
  if (!isApiError(error) || !isHTTPError(error.body)) return null;
  return error.body.detail;
}
