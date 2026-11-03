import "server-only";

import type { CompanyStatus, ValidationErrorItem } from "@/lib/api/schema";
import {
  COMPANY_NAME_MAX_LENGTH,
  isCompanySort,
  isCompanyStatus,
  normalizeDomain,
  normalizeName,
  validateDomain,
  validateName,
} from "@/lib/company-rules";

import type { CompanyChanges, ListQuery } from "./store";

/**
 * Request validation for the mock API. Error items follow FastAPI/pydantic
 * (`loc`, `msg`, `type`) so the client handles the same shape it would get from
 * the real backend.
 */

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationErrorItem[] };

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parseInteger(
  raw: string | null,
  field: string,
  { min, max, fallback }: { min: number; max: number; fallback: number },
  errors: ValidationErrorItem[],
): number {
  if (raw === null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    errors.push({
      loc: ["query", field],
      msg: `Input should be an integer between ${min} and ${max}`,
      type: "int_parsing",
    });
    return fallback;
  }
  return value;
}

export function parseListQuery(params: URLSearchParams): ParseResult<ListQuery> {
  const errors: ValidationErrorItem[] = [];
  const limit = parseInteger(
    params.get("limit"),
    "limit",
    { min: 1, max: MAX_LIMIT, fallback: DEFAULT_LIMIT },
    errors,
  );
  const offset = parseInteger(
    params.get("offset"),
    "offset",
    { min: 0, max: Number.MAX_SAFE_INTEGER, fallback: 0 },
    errors,
  );

  const rawStatus = params.get("status");
  if (rawStatus !== null && !isCompanyStatus(rawStatus)) {
    errors.push({ loc: ["query", "status"], msg: "Invalid status", type: "enum" });
  }
  const rawSort = params.get("sort");
  if (rawSort !== null && !isCompanySort(rawSort)) {
    errors.push({ loc: ["query", "sort"], msg: "Invalid sort", type: "enum" });
  }
  if (errors.length > 0) return { ok: false, errors };

  const q = params.get("q")?.trim() ?? "";
  return {
    ok: true,
    value: {
      limit,
      offset,
      q: q === "" ? null : q,
      status: isCompanyStatus(rawStatus) ? rawStatus : null,
      sort: isCompanySort(rawSort) ? rawSort : "-created_at",
    },
  };
}

function nameIssue(name: string): ValidationErrorItem | null {
  switch (validateName(name)) {
    case "required":
      return { loc: ["body", "name"], msg: "Name must not be empty", type: "string_too_short" };
    case "too_long":
      return {
        loc: ["body", "name"],
        msg: `Name must be at most ${COMPANY_NAME_MAX_LENGTH} characters`,
        type: "string_too_long",
      };
    default:
      return null;
  }
}

/** Parses the fields shared by create and update. Absent fields stay absent. */
function parseCompanyFields(
  body: Record<string, unknown>,
  errors: ValidationErrorItem[],
): CompanyChanges {
  const changes: CompanyChanges = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string") {
      errors.push({ loc: ["body", "name"], msg: "Input should be a valid string", type: "string_type" });
    } else {
      const issue = nameIssue(body.name);
      if (issue) errors.push(issue);
      else changes.name = normalizeName(body.name);
    }
  }

  if (body.domain !== undefined) {
    if (body.domain !== null && typeof body.domain !== "string") {
      errors.push({ loc: ["body", "domain"], msg: "Input should be a valid string", type: "string_type" });
    } else if (validateDomain(body.domain) !== null) {
      errors.push({
        loc: ["body", "domain"],
        msg: "Domain must look like example.com",
        type: "string_pattern_mismatch",
      });
    } else {
      changes.domain = normalizeDomain(body.domain);
    }
  }

  if (body.status !== undefined) {
    if (isCompanyStatus(body.status)) changes.status = body.status;
    else errors.push({ loc: ["body", "status"], msg: "Invalid status", type: "enum" });
  }

  return changes;
}

export function parseCreateBody(body: Record<string, unknown>): ParseResult<{
  name: string;
  domain: string | null;
  status: CompanyStatus;
}> {
  const errors: ValidationErrorItem[] = [];
  if (body.name === undefined) {
    errors.push({ loc: ["body", "name"], msg: "Field required", type: "missing" });
  }
  const fields = parseCompanyFields(body, errors);
  if (errors.length > 0 || fields.name === undefined) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name: fields.name,
      domain: fields.domain ?? null,
      status: fields.status ?? "new",
    },
  };
}

export function parseUpdateBody(
  body: Record<string, unknown>,
): ParseResult<{ ifVersion: number; changes: CompanyChanges }> {
  const errors: ValidationErrorItem[] = [];
  const ifVersion = body.if_version;
  if (typeof ifVersion !== "number" || !Number.isInteger(ifVersion) || ifVersion < 1) {
    errors.push({
      loc: ["body", "if_version"],
      msg: "Input should be a positive integer",
      type: ifVersion === undefined ? "missing" : "int_type",
    });
  }
  const changes = parseCompanyFields(body, errors);
  if (errors.length > 0 || typeof ifVersion !== "number") return { ok: false, errors };

  return { ok: true, value: { ifVersion, changes } };
}
