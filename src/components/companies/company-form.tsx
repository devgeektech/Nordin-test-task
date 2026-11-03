"use client";

import { FormEvent, useState } from "react";

import type { Company, CompanyStatus } from "@/lib/api/schema";
import { COMPANY_STATUSES } from "@/lib/api/schema";
import { normalizeDomain, validateDomain, validateName } from "@/lib/company-rules";
import { useI18n } from "@/lib/i18n/i18n-provider";

const inputClass =
  "w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-900";

export type CompanyValues = {
  name: string;
  domain: string;
  status: CompanyStatus;
};

type CompanyFormProps = {
  mode: "create" | "edit";
  company?: Company;
  version?: number;
  saving: boolean;
  conflict: boolean;
  reloading?: boolean;
  formError: string | null;
  onSave: (values: CompanyValues) => void;
  onCancel: () => void;
  onReload?: () => void;
};

export function CompanyForm({
  mode,
  company,
  version,
  saving,
  conflict,
  reloading = false,
  formError,
  onSave,
  onCancel,
  onReload,
}: CompanyFormProps) {
  const { messages, formatDate } = useI18n();
  const [name, setName] = useState(company?.name ?? "");
  const [domain, setDomain] = useState(company?.domain ?? "");
  const [status, setStatus] = useState<CompanyStatus>(company?.status ?? "new");
  const [nameError, setNameError] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nameIssue = validateName(name);
    const nextNameError =
      nameIssue === "required"
        ? messages.validation.required
        : nameIssue === "too_long"
          ? messages.validation.too_long
          : null;
    const nextDomainError =
      validateDomain(domain) === "invalid_domain" ? messages.validation.invalid_domain : null;

    setNameError(nextNameError);
    setDomainError(nextDomainError);
    if (nextNameError || nextDomainError) return;

    onSave({
      name: name.trim(),
      domain: normalizeDomain(domain) ?? "",
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="space-y-1 border-b border-slate-200 px-6 py-4">
        <h2 id="company-drawer-title" className="text-lg font-semibold text-slate-900">
          {mode === "create" ? messages.drawer.createTitle : messages.drawer.editTitle}
        </h2>
        {company ? (
          <p className="text-sm text-slate-500">
            {messages.drawer.created} {formatDate(company.created_at)}
            {version ? ` · ${messages.drawer.version.replace("{version}", String(version))}` : null}
          </p>
        ) : null}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {conflict ? (
          <div
            role="alert"
            className="rounded-md border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-950"
          >
            <p className="font-semibold">{messages.drawer.conflictTitle}</p>
            <p className="mt-1 leading-5">{messages.drawer.conflictBody}</p>
            {onReload ? (
              <button
                type="button"
                onClick={onReload}
                disabled={reloading}
                className="mt-3 rounded-md bg-amber-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800 disabled:opacity-60"
              >
                {reloading ? messages.drawer.reloading : messages.drawer.reloadLatest}
              </button>
            ) : null}
          </div>
        ) : null}

        {formError ? (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="company-name" className="block text-sm font-medium text-slate-700">
            {messages.drawer.name}
          </label>
          <input
            id="company-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError(null);
            }}
            aria-invalid={nameError !== null}
            aria-describedby={nameError ? "company-name-error" : undefined}
            className={`${inputClass} ${nameError ? "border-red-400" : "border-slate-300"}`}
          />
          {nameError ? (
            <p id="company-name-error" role="alert" className="text-sm text-red-700">
              {nameError}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="company-domain" className="block text-sm font-medium text-slate-700">
            {messages.drawer.domain}
          </label>
          <input
            id="company-domain"
            value={domain}
            onChange={(event) => {
              setDomain(event.target.value);
              setDomainError(null);
            }}
            aria-invalid={domainError !== null}
            aria-describedby={domainError ? "company-domain-error" : "company-domain-hint"}
            className={`${inputClass} ${domainError ? "border-red-400" : "border-slate-300"}`}
          />
          <p id="company-domain-hint" className="text-xs text-slate-500">
            {messages.drawer.domainHint}
          </p>
          {domainError ? (
            <p id="company-domain-error" role="alert" className="text-sm text-red-700">
              {domainError}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="company-form-status" className="block text-sm font-medium text-slate-700">
            {messages.drawer.status}
          </label>
          <select
            id="company-form-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as CompanyStatus)}
            className={`${inputClass} border-slate-300`}
          >
            {COMPANY_STATUSES.map((item) => (
              <option key={item} value={item}>
                {messages.status[item]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          {messages.drawer.cancel}
        </button>
        <button
          type="submit"
          disabled={saving || conflict}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? messages.drawer.saving : messages.drawer.save}
        </button>
      </div>
    </form>
  );
}
