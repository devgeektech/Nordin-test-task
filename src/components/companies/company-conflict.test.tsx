import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/http";
import type { Company } from "@/lib/api/schema";
import { renderWithProviders } from "@/test/render";

import { CompanyDrawer } from "./company-drawer";

vi.mock("@/lib/api/companies", () => ({
  listCompanies: vi.fn(),
  getCompany: vi.fn(),
  createCompany: vi.fn(),
  updateCompany: vi.fn(),
}));

import { getCompany, updateCompany } from "@/lib/api/companies";

const getCompanyMock = vi.mocked(getCompany);
const updateCompanyMock = vi.mocked(updateCompany);

const original: Company = {
  id: "company-1",
  name: "Acme Logistics",
  domain: "acmelogistics.com",
  status: "new",
  version: 1,
  created_at: "2026-10-30T09:00:00.000Z",
  updated_at: "2026-10-30T09:00:00.000Z",
};

const latest: Company = {
  ...original,
  name: "Acme Logistics BV",
  status: "contacted",
  version: 2,
  updated_at: "2026-10-31T09:00:00.000Z",
};

describe("409 conflict flow", () => {
  beforeEach(() => {
    getCompanyMock.mockReset();
    updateCompanyMock.mockReset();
    getCompanyMock.mockResolvedValue(original);
  });

  it("keeps typed values, reloads the latest version, then retries with the new if_version", async () => {
    const user = userEvent.setup();
    updateCompanyMock
      .mockRejectedValueOnce(
        new ApiError(409, { detail: "Company was modified by someone else" }),
      )
      .mockResolvedValueOnce({ ...latest, name: "Name I typed", version: 3 });

    renderWithProviders(
      <CompanyDrawer
        drawer={{ kind: "edit", id: original.id }}
        onClose={vi.fn()}
        onCreated={vi.fn()}
      />,
    );

    const nameInput = await screen.findByLabelText("Name");
    expect(nameInput).toHaveValue("Acme Logistics");

    await user.clear(nameInput);
    await user.type(nameInput, "Name I typed");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("This company changed while you were editing"),
    ).toBeInTheDocument();
    expect(updateCompanyMock).toHaveBeenCalledWith(original.id, {
      if_version: 1,
      name: "Name I typed",
      domain: "acmelogistics.com",
      status: "new",
    });

    getCompanyMock.mockResolvedValueOnce(latest);
    await user.click(screen.getByRole("button", { name: "Reload latest version" }));

    await waitFor(() => {
      expect(getCompanyMock).toHaveBeenCalledTimes(2);
    });
    expect(screen.getByLabelText("Name")).toHaveValue("Name I typed");
    expect(screen.getByText(/version 2/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(updateCompanyMock).toHaveBeenLastCalledWith(original.id, {
        if_version: 2,
        name: "Name I typed",
        domain: "acmelogistics.com",
        status: "new",
      });
    });
  });
});
