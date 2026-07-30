function cleanOrigin(value?: string | null) {
  const origin = value?.trim().replace(/\/$/, "");

  return origin || null;
}

function withHttps(value?: string | null) {
  const origin = cleanOrigin(value);

  if (!origin) {
    return null;
  }

  return origin.startsWith("http://") || origin.startsWith("https://")
    ? origin
    : `https://${origin}`;
}

export function getAppOrigin(fallback?: string | null) {
  return (
    withHttps(process.env.NEXT_PUBLIC_SITE_URL) ??
    (process.env.NODE_ENV === "production"
      ? "https://www.turkiyemarketplace.org"
      : null) ??
    cleanOrigin(fallback) ??
    "http://localhost:3000"
  );
}

export function isAllowedAppOrigin(
  requestOrigin: string | null,
  fallback?: string | null,
) {
  return Boolean(
    requestOrigin && cleanOrigin(requestOrigin) === getAppOrigin(fallback),
  );
}
