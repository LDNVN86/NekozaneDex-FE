import "server-only";
import { serverFetch } from "@/shared/lib/api";
import { ok, err, type Result } from "@/shared/lib/result";
import type {
  Story,
  Genre,
  PaginatedResponse,
  SingleResponse,
} from "@/features/story/interface/story-interface";
import { SearchParams } from "../interfaces";

export async function searchStories(
  params: SearchParams,
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const searchParams = new URLSearchParams();

    if (params.q) {
      searchParams.set("q", params.q);
    }
    if (params.genres && params.genres.length > 0) {
      searchParams.set("genres", params.genres.join(","));
    }
    if (params.status) {
      searchParams.set("status", params.status);
    }
    searchParams.set("page", String(params.page || 1));
    searchParams.set("limit", String(params.limit || 20));

    const data = await serverFetch<PaginatedResponse<Story>>(
      `/stories/search?${searchParams.toString()}`,
    );
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Search failed");
  }
}

export async function getGenres(): Promise<Result<Genre[], string>> {
  try {
    const data = await serverFetch<SingleResponse<Genre[]>>("/genres");
    return ok(data.data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Failed to get genres");
  }
}

export async function getStoriesByGenre(
  genreSlug: string,
  page = 1,
  limit = 24,
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/genres/${genreSlug}/stories?page=${page}&limit=${limit}`,
    );
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to get stories",
    );
  }
}
