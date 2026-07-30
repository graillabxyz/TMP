const internalOrigin = "https://internal.tmp.invalid";

export function getSafeInternalPath(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  const candidate = value?.trim();

  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.includes("\\") ||
    /%5c/i.test(candidate)
  ) {
    return fallback;
  }

  try {
    const resolved = new URL(candidate, internalOrigin);

    if (resolved.origin !== internalOrigin) {
      return fallback;
    }

    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}
