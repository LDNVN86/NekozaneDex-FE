import { serverFetch } from "@/shared/lib/api";
import { ok, err, type Result } from "@/shared/lib/result";
import type {
  Story,
  Chapter,
  PaginatedResponse,
  SingleResponse,
} from "../interface/story-interface";

export async function getStories(
  page = 1,
  limit = 20,
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/stories?page=${page}&limit=${limit}`,
    );
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch stories",
    );
  }
}

export interface StoryFilters {
  genres?: string[];
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getStoriesWithFilters(
  filters: StoryFilters = {},
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const hasStatusFilter = filters.status && filters.status !== "all";
    const hasSortFilter = filters.sort && filters.sort !== "latest";
    const hasGenreFilter = filters.genres && filters.genres.length > 0;

    // If we have any filter, use search endpoint
    if (hasStatusFilter || hasSortFilter || hasGenreFilter) {
      const params = new URLSearchParams();
      if (hasGenreFilter) {
        params.set("genres", filters.genres!.join(","));
      }
      if (hasStatusFilter) {
        params.set("status", filters.status!);
      }
      if (hasSortFilter) {
        params.set("sort", filters.sort!);
      }
      params.set("page", String(page));
      params.set("limit", String(limit));

      const data = await serverFetch<PaginatedResponse<Story>>(
        `/stories/search?${params.toString()}`,
      );
      return ok(data);
    }

    // No filters, get all stories
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/stories?page=${page}&limit=${limit}`,
    );
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch stories",
    );
  }
}

export async function getLatestStories(
  limit = 10,
): Promise<Result<Story[], string>> {
  try {
    const data = await serverFetch<SingleResponse<Story[]>>(
      `/stories/latest?limit=${limit}`,
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch latest stories",
    );
  }
}

export async function getHotStories(
  limit = 10,
): Promise<Result<Story[], string>> {
  try {
    const data = await serverFetch<SingleResponse<Story[]>>(
      `/stories/hot?limit=${limit}`,
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch hot stories",
    );
  }
}

export async function getStoryBySlug(
  slug: string,
): Promise<Result<Story, string>> {
  try {
    const data = await serverFetch<SingleResponse<Story>>(`/stories/${slug}`);
    return ok(data.data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Story not found");
  }
}

export async function searchStories(
  query: string,
  page = 1,
  limit = 20,
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/stories/search?q=${encodeURIComponent(
        query,
      )}&page=${page}&limit=${limit}`,
    );
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Search failed");
  }
}

export async function getStoriesByGenre(
  genreSlug: string,
  page = 1,
  limit = 20,
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/genres/${genreSlug}/stories?page=${page}&limit=${limit}`,
    );
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error
        ? error.message
        : "Failed to fetch stories by genre",
    );
  }
}

export async function getRandomStory(): Promise<Result<Story, string>> {
  try {
    const data = await serverFetch<SingleResponse<Story>>(`/stories/random`);
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to get random story",
    );
  }
}

export interface ChaptersResponse {
  chapters: Chapter[];
  total: number;
  page: number;
  limit: number;
}

export async function getChaptersByStory(
  storySlug: string,
  page = 1,
  limit = 100,
): Promise<Result<ChaptersResponse, string>> {
  try {
    // Backend returns: { success: true, data: { chapters, total, page, limit } }
    const response = await serverFetch<{ data: ChaptersResponse }>(
      `/stories/${storySlug}/chapters?page=${page}&limit=${limit}`,
    );
    // Handle both response formats
    const result = response.data || (response as unknown as ChaptersResponse);
    return ok({
      chapters: result.chapters || [],
      total: result.total || 0,
      page: result.page || page,
      limit: result.limit || limit,
    });
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch chapters",
    );
  }
}

export async function getChapterByNumber(
  storySlug: string,
  chapterNumber: number,
): Promise<Result<Chapter, string>> {
  try {
    const data = await serverFetch<SingleResponse<Chapter>>(
      `/stories/${storySlug}/chapters/${chapterNumber}`,
    );
    return ok(data.data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Chapter not found");
  }
}
