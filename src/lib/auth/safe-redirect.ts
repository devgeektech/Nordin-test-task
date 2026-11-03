/** Only same-origin relative paths, so `from` cannot bounce the user off-site. */
export function safeInternalPath(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/companies";
}
