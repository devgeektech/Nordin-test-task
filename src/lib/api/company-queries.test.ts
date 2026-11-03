import { describe, expect, it } from "vitest";

import { companyKeys, normalizeListParams } from "./company-queries";

describe("normalizeListParams", () => {
  it("fills defaults and drops empty search so equivalent requests share a cache key", () => {
    expect(normalizeListParams({})).toEqual({
      limit: 20,
      offset: 0,
      sort: "-created_at",
    });
    expect(normalizeListParams({ q: "  acme  ", offset: 0 })).toEqual({
      limit: 20,
      offset: 0,
      sort: "-created_at",
      q: "acme",
    });
    expect(normalizeListParams({ q: "   " })).toEqual({
      limit: 20,
      offset: 0,
      sort: "-created_at",
    });
  });
});

describe("companyKeys", () => {
  it("nests list keys under lists() so one invalidate refetches every filter", () => {
    const filtered = companyKeys.list({ q: "acme", status: "new" });
    const unfiltered = companyKeys.list({});

    expect(companyKeys.lists()).toEqual(["companies", "list"]);
    expect(filtered.slice(0, 2)).toEqual(["companies", "list"]);
    expect(unfiltered.slice(0, 2)).toEqual(["companies", "list"]);
    expect(filtered).not.toEqual(unfiltered);
    expect(companyKeys.detail("abc")).toEqual(["companies", "detail", "abc"]);
  });
});
