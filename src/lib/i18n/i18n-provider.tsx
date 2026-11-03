"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  catalogs,
  DEFAULT_LOCALE,
  intlLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
  type Messages,
} from "./messages";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  formatDate: (iso: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readLocaleCookie(): Locale {
  const match = document.cookie.match(new RegExp(`${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = readLocaleCookie();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the locale cookie on the client
    setLocaleState(saved);
    document.documentElement.lang = saved;
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
  }

  const messages = catalogs[locale];
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale[locale], { dateStyle: "medium" }).format(new Date(iso));

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used within I18nProvider");
  return value;
}
