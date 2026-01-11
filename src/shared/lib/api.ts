const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Normalize endpoint: remove leading slash if exists
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;

  // Build full URL with /api prefix
  const url = `${API_BASE_URL}/${normalizedEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // Try to get error message from response body
    try {
      const errorBody = await res.json();
      const message =
        errorBody.message || errorBody.error || `API Error: ${res.status}`;
      console.error(`[serverFetch] ${res.status} - ${message} - ${url}`);
      throw new Error(message);
    } catch {
      throw new Error(`API Error: ${res.status}`);
    }
  }

  return res.json();
}
