import type { NextRequest } from "next/server";

import { parseUpdateBody } from "@/server/companies/parse";
import { getCompany, updateCompany } from "@/server/companies/store";
import {
  errorResponse,
  isAuthenticated,
  readJsonObject,
  simulateLatency,
  validationErrorResponse,
} from "@/server/http";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/v1/companies/[id]">,
) {
  await simulateLatency();
  if (!isAuthenticated(request)) return errorResponse(401, "Not authenticated");

  const { id } = await context.params;
  const company = getCompany(id);
  if (!company) return errorResponse(404, "Company not found");

  return Response.json(company);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/v1/companies/[id]">,
) {
  await simulateLatency();
  if (!isAuthenticated(request)) return errorResponse(401, "Not authenticated");

  const body = await readJsonObject(request);
  if (!body) {
    return validationErrorResponse([
      { loc: ["body"], msg: "Input should be a valid JSON object", type: "model_attributes_type" },
    ]);
  }
  const input = parseUpdateBody(body);
  if (!input.ok) return validationErrorResponse(input.errors);

  const { id } = await context.params;
  const result = updateCompany(id, input.value.ifVersion, input.value.changes);
  switch (result.kind) {
    case "not_found":
      return errorResponse(404, "Company not found");
    case "version_conflict":
      return errorResponse(409, "Company was modified by someone else");
    case "updated":
      return Response.json(result.company);
  }
}
