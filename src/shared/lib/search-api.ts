// Client-side search API for suggestions
import type {
  Story,
  PaginatedResponse,
} from "@/features/story/interface/story-interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function searchStoriesSuggestions(
  query: string,
  limit = 10
): Promise<Story[]> {
  if (!query.trim()) return [];

  try {
    const res = await fetch(
      `${API_URL}/stories/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const data: PaginatedResponse<Story> = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}
