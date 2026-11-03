export const LOCALES = ["en", "nl"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "companies.locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "nl";
}

export const intlLocale: Record<Locale, string> = {
  en: "en-GB",
  nl: "nl-NL",
};

export const en = {
  appName: "Companies",
  language: {
    en: "EN",
    nl: "NL",
    switchToEnglish: "Switch to English",
    switchToDutch: "Switch to Dutch",
  },
  auth: {
    title: "Sign in",
    description:
      "This assessment uses a fake identity provider. Any non-empty token is accepted and sent as a bearer token.",
    tokenLabel: "Access token",
    submit: "Sign in",
    signOut: "Sign out",
    tokenRequired: "Enter a token to continue.",
  },
  companies: {
    title: "Companies",
    description: "Accounts in the current pipeline.",
    create: "New company",
    search: "Search",
    searchPlaceholder: "Search name or domain",
    status: "Status",
    allStatuses: "All statuses",
    name: "Name",
    domain: "Domain",
    created: "Created",
    noDomain: "No domain",
    loading: "Loading companies…",
    error: "Could not load companies.",
    retry: "Try again",
    empty: "No companies yet.",
    emptyFiltered: "No companies match these filters.",
    fetching: "Updating results…",
    previous: "Previous",
    next: "Next",
    page: "Page {page} of {pages}",
    range: "{from}–{to} of {total}",
    openCompany: "Open {name}",
    sortByName: "Sort by name",
    sortByCreated: "Sort by created date",
    caption: "Companies list",
  },
  status: {
    new: "New",
    researching: "Researching",
    contacted: "Contacted",
    qualified: "Qualified",
    rejected: "Rejected",
  },
  drawer: {
    createTitle: "New company",
    editTitle: "Edit company",
    close: "Close",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving…",
    name: "Name",
    domain: "Domain",
    domainHint: "Optional. Example: acme.com",
    status: "Status",
    loading: "Loading company…",
    error: "Could not load this company.",
    notFound: "This company no longer exists.",
    retry: "Try again",
    created: "Created",
    version: "Version {version}",
    conflictTitle: "This company changed while you were editing",
    conflictBody:
      "Someone else saved a newer version. Reload the latest version to continue. Values you typed stay in the form.",
    reloadLatest: "Reload latest version",
    reloading: "Reloading…",
  },
  validation: {
    required: "Name is required.",
    too_long: "Name must be at most 120 characters.",
    invalid_domain: "Domain must look like example.com.",
    invalid_status: "Choose a valid status.",
  },
  routeError: {
    title: "Something went wrong",
    retry: "Try again",
  },
};

export type Messages = typeof en;

export const nl: Messages = {
  appName: "Bedrijven",
  language: {
    en: "EN",
    nl: "NL",
    switchToEnglish: "Overschakelen naar Engels",
    switchToDutch: "Overschakelen naar Nederlands",
  },
  auth: {
    title: "Inloggen",
    description:
      "Deze assessment gebruikt een nep-identity provider. Elk niet-leeg token wordt geaccepteerd en als bearer token meegestuurd.",
    tokenLabel: "Toegangstoken",
    submit: "Inloggen",
    signOut: "Uitloggen",
    tokenRequired: "Voer een token in om verder te gaan.",
  },
  companies: {
    title: "Bedrijven",
    description: "Accounts in de huidige pijplijn.",
    create: "Nieuw bedrijf",
    search: "Zoeken",
    searchPlaceholder: "Zoek op naam of domein",
    status: "Status",
    allStatuses: "Alle statussen",
    name: "Naam",
    domain: "Domein",
    created: "Aangemaakt",
    noDomain: "Geen domein",
    loading: "Bedrijven laden…",
    error: "Bedrijven konden niet worden geladen.",
    retry: "Opnieuw proberen",
    empty: "Nog geen bedrijven.",
    emptyFiltered: "Geen bedrijven komen overeen met deze filters.",
    fetching: "Resultaten bijwerken…",
    previous: "Vorige",
    next: "Volgende",
    page: "Pagina {page} van {pages}",
    range: "{from}–{to} van {total}",
    openCompany: "{name} openen",
    sortByName: "Sorteren op naam",
    sortByCreated: "Sorteren op aanmaakdatum",
    caption: "Bedrijvenlijst",
  },
  status: {
    new: "Nieuw",
    researching: "Onderzoek",
    contacted: "Contact gelegd",
    qualified: "Gekwalificeerd",
    rejected: "Afgewezen",
  },
  drawer: {
    createTitle: "Nieuw bedrijf",
    editTitle: "Bedrijf bewerken",
    close: "Sluiten",
    cancel: "Annuleren",
    save: "Opslaan",
    saving: "Opslaan…",
    name: "Naam",
    domain: "Domein",
    domainHint: "Optioneel. Bijvoorbeeld: acme.com",
    status: "Status",
    loading: "Bedrijf laden…",
    error: "Dit bedrijf kon niet worden geladen.",
    notFound: "Dit bedrijf bestaat niet meer.",
    retry: "Opnieuw proberen",
    created: "Aangemaakt",
    version: "Versie {version}",
    conflictTitle: "Dit bedrijf is gewijzigd tijdens het bewerken",
    conflictBody:
      "Iemand anders heeft een nieuwere versie opgeslagen. Laad de laatste versie om door te gaan. Wat je hebt getypt blijft in het formulier staan.",
    reloadLatest: "Laatste versie laden",
    reloading: "Laden…",
  },
  validation: {
    required: "Naam is verplicht.",
    too_long: "Naam mag maximaal 120 tekens zijn.",
    invalid_domain: "Domein moet eruitzien als example.com.",
    invalid_status: "Kies een geldige status.",
  },
  routeError: {
    title: "Er ging iets mis",
    retry: "Opnieuw proberen",
  },
};

export const catalogs: Record<Locale, Messages> = { en, nl };
