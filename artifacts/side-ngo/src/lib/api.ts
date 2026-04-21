const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return configuredApiUrl
    ? `${configuredApiUrl}${normalizedPath}`
    : `${basePath}${normalizedPath}`;
}