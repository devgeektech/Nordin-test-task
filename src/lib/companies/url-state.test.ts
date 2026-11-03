import { describe, expect, it } from "vitest";

import {
  parseCompaniesSearchParams,
  serializeCompaniesSearchParams,
  toListParams,
  toggleSort,
} from "./url-state";

describe("companies URL state", () => {
  it("parses filters, sort, pagination and the open drawer from the query string", () => {
    const state = parseCompaniesSearchParams(
      new URLSearchParams("q=acme&status=qualified&sort=name&offset=20&company=abc"),
    );

    expect(state).toEqual({
      q: "acme",
      status: "qualified",
      sort: "name",
      offset: 20,
      drawer: { kind: "edit", id: "abc" },
    });
    expect(toListParams(state)).toEqual({
      limit: 20,
      offset: 20,
      sort: "name",
      q: "acme",
      status: "qualified",
    });
  });

  it("round-trips defaults as an empty query string", () => {
    const state = parseCompaniesSearchParams(new URLSearchParams());
    expect(serializeCompaniesSearchParams(state)).toBe("");
    expect(state.drawer).toEqual({ kind: "closed" });
    expect(parseCompaniesSearchParams(new URLSearchParams("company=new")).drawer).toEqual({
      kind: "create",
    });
  });

  it("toggles sort independently per column", () => {
    expect(toggleSort("-created_at", "name")).toBe("name");
    expect(toggleSort("name", "name")).toBe("-name");
    expect(toggleSort("-name", "created_at")).toBe("-created_at");
    expect(toggleSort("-created_at", "created_at")).toBe("created_at");
  });
});
