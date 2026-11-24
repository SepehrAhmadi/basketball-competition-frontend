export function safeRedirect(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return fallback;
  }
  if (value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  if (
    value === "/auth" ||
    value.startsWith("/auth/") ||
    value.startsWith("/auth?") ||
    value.startsWith("/auth#")
  ) {
    return fallback;
  }
  return value;
}
