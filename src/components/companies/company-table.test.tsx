import { useState } from "react";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Company, CompanyList } from "@/lib/api/schema";
import type { CompaniesUrlState } from "@/lib/companies/url-state";
import { renderWithProviders } from "@/test/render";

import { CompaniesWorkspace } from "./companies-workspace";

vi.mock("@/lib/api/companies", () => ({
  listCompanies: vi.fn(),
  getCompany: vi.fn(),
  createCompany: vi.fn(),
  updateCompany: vi.fn(),
}));

import { listCompanies } from "@/lib/api/companies";

const listCompaniesMock = vi.mocked(listCompanies);

function makeCompany(overrides: Partial<Company> = {}): Company {
  return {
    id: "company-1",
    name: "Acme Logistics",
    domain: "acmelogistics.com",
    status: "new",
    version: 1,
    created_at: "2026-10-30T09:00:00.000Z",
    updated_at: "2026-10-30T09:00:00.000Z",
    ...overrides,
  };
}

function listResponse(items: Company[]): CompanyList {
  return { items, total: items.length, limit: 20, offset: 0 };
}

const initialState: CompaniesUrlState = {
  q: "",
  status: undefined,
  sort: "-created_at",
  offset: 0,
  drawer: { kind: "closed" },
};

function FilterHarness() {
  const [state, setState] = useState(initialState);
  return <CompaniesWorkspace state={state} onStateChange={setState} />;
}

describe("company list filtering", () => {
  beforeEach(() => {
    listCompaniesMock.mockReset();
  });

  it("requests the selected status and keeps the table mounted", async () => {
    const user = userEvent.setup();
    listCompaniesMock.mockImplementation(async (params) => {
      if (params.status === "qualified") {
        return listResponse([
          makeCompany({ id: "company-2", name: "Helix Biotech", status: "qualified" }),
        ]);
      }
      return listResponse([makeCompany()]);
    });

    renderWithProviders(<FilterHarness />);

    expect(await screen.findByRole("cell", { name: "Acme Logistics" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Status"), "qualified");

    await waitFor(() => {
      expect(listCompaniesMock).toHaveBeenCalledWith(
        expect.objectContaining({ status: "qualified", limit: 20, offset: 0 }),
        expect.anything(),
      );
    });
    expect(await screen.findByRole("cell", { name: "Helix Biotech" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
