import type { NextRequest } from "next/server";

import { parseCreateBody, parseListQuery } from "@/server/companies/parse";
import { createCompany, listCompanies } from "@/server/companies/store";
import {
  errorResponse,
  isAuthenticated,
  readJsonObject,
  simulateLatency,
  validationErrorResponse,
} from "@/server/http";

export async function GET(request: NextRequest) {
  await simulateLatency();
  if (!isAuthenticated(request)) return errorResponse(401, "Not authenticated");

  const query = parseListQuery(request.nextUrl.searchParams);
  if (!query.ok) return validationErrorResponse(query.errors);

  return Response.json(listCompanies(query.value));
}

export async function POST(request: NextRequest) {
  await simulateLatency();
  if (!isAuthenticated(request)) return errorResponse(401, "Not authenticated");

  const body = await readJsonObject(request);
  if (!body) {
    return validationErrorResponse([
      { loc: ["body"], msg: "Input should be a valid JSON object", type: "model_attributes_type" },
    ]);
  }
  const input = parseCreateBody(body);
  if (!input.ok) return validationErrorResponse(input.errors);

  return Response.json(createCompany(input.value), { status: 201 });
}
