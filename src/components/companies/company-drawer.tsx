"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { getCompany } from "@/lib/api/companies";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/lib/api/company-mutations";
import { companyKeys, companyOptions } from "@/lib/api/company-queries";
import { getErrorDetail, getValidationErrors, isApiError } from "@/lib/api/http";
import type { Company } from "@/lib/api/schema";
import type { DrawerState } from "@/lib/companies/url-state";
import { useI18n } from "@/lib/i18n/i18n-provider";

import { CompanyForm, type CompanyValues } from "./company-form";

type CompanyDrawerProps = {
  drawer: DrawerState;
  onClose: () => void;
  onCreated: (company: Company) => void;
};

export function CompanyDrawer({ drawer, onClose, onCreated }: CompanyDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = drawer.kind !== "closed";

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const firstField = panel?.querySelector<HTMLElement>("input, select, button");
    firstField?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const fields = [...panel.querySelectorAll<HTMLElement>("input, select, button, textarea")];
      const first = fields[0];
      const last = fields[fields.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-drawer-title"
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        {drawer.kind === "create" ? (
          <CreateCompany onClose={onClose} onCreated={onCreated} />
        ) : (
          <EditCompany key={drawer.id} companyId={drawer.id} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function CreateCompany({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (company: Company) => void;
}) {
  const { messages } = useI18n();
  const createCompany = useCreateCompanyMutation();
  const [formError, setFormError] = useState<string | null>(null);

  function save(values: CompanyValues) {
    setFormError(null);
    createCompany.mutate(
      {
        name: values.name,
        domain: values.domain === "" ? null : values.domain,
        status: values.status,
      },
      {
        onSuccess: onCreated,
        onError: (error) => setFormError(errorMessage(error, messages.drawer.error)),
      },
    );
  }

  return (
    <CompanyForm
      mode="create"
      saving={createCompany.isPending}
      conflict={false}
      formError={formError}
      onSave={save}
      onCancel={onClose}
    />
  );
}

function EditCompany({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const { messages } = useI18n();
  const queryClient = useQueryClient();
  const query = useQuery(companyOptions(companyId));
  const updateCompany = useUpdateCompanyMutation();

  const [version, setVersion] = useState<number | null>(null);
  const [conflict, setConflict] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fill version once the company has loaded. Do not depend on query.data after
  // that — a later refetch must not overwrite what the user is typing.
  if (query.data && version === null) {
    setVersion(query.data.version);
  }

  if (query.isError) {
    const missing = isApiError(query.error, 404);
    return (
      <div className="px-6 py-8 text-sm text-slate-600">
        <p>{missing ? messages.drawer.notFound : messages.drawer.error}</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-sm hover:bg-slate-100">
            {messages.drawer.close}
          </button>
          {!missing ? (
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white"
            >
              {messages.drawer.retry}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (query.isPending || !query.data || version === null) {
    return <div className="px-6 py-8 text-sm text-slate-600">{messages.drawer.loading}</div>;
  }

  const currentVersion = version;

  function save(values: CompanyValues) {
    setFormError(null);
    updateCompany.mutate(
      {
        id: companyId,
        body: {
          if_version: currentVersion,
          name: values.name,
          domain: values.domain === "" ? null : values.domain,
          status: values.status,
        },
      },
      {
        onSuccess: onClose,
        onError: (error) => {
          if (isApiError(error, 409)) {
            setConflict(true);
            return;
          }
          setFormError(errorMessage(error, messages.drawer.error));
        },
      },
    );
  }

  async function reloadLatest() {
    setReloading(true);
    setFormError(null);
    try {
      const latest = await getCompany(companyId);
      queryClient.setQueryData(companyKeys.detail(latest.id), latest);
      setVersion(latest.version);
      setConflict(false);
    } catch (error) {
      setFormError(errorMessage(error, messages.drawer.error));
    } finally {
      setReloading(false);
    }
  }

  return (
    <CompanyForm
      mode="edit"
      company={query.data}
      version={version}
      saving={updateCompany.isPending}
      conflict={conflict}
      reloading={reloading}
      formError={formError}
      onSave={save}
      onCancel={onClose}
      onReload={() => void reloadLatest()}
    />
  );
}

function errorMessage(error: unknown, fallback: string): string {
  const fields = getValidationErrors(error);
  if (fields && fields.length > 0) {
    return fields.map((item) => item.msg).join(" ");
  }
  return getErrorDetail(error) ?? fallback;
}
