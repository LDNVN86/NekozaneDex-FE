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
  limit = 20
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/stories?page=${page}&limit=${limit}`
    );
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch stories"
    );
  }
}

export async function getLatestStories(
  limit = 10
): Promise<Result<Story[], string>> {
  try {
    const data = await serverFetch<SingleResponse<Story[]>>(
      `/stories/latest?limit=${limit}`
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch latest stories"
    );
  }
}

export async function getHotStories(
  limit = 10
): Promise<Result<Story[], string>> {
  try {
    const data = await serverFetch<SingleResponse<Story[]>>(
      `/stories/hot?limit=${limit}`
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch hot stories"
    );
  }
}

export async function getStoryBySlug(
  slug: string
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
  limit = 20
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/stories/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Search failed");
  }
}

export async function getStoriesByGenre(
  genreSlug: string,
  page = 1,
  limit = 20
): Promise<Result<PaginatedResponse<Story>, string>> {
  try {
    const data = await serverFetch<PaginatedResponse<Story>>(
      `/genres/${genreSlug}/stories?page=${page}&limit=${limit}`
    );
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error
        ? error.message
        : "Failed to fetch stories by genre"
    );
  }
}

export async function getRandomStory(): Promise<Result<Story, string>> {
  try {
    const data = await serverFetch<SingleResponse<Story>>(`/stories/random`);
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to get random story"
    );
  }
}

export async function getChaptersByStory(
  storySlug: string
): Promise<Result<Chapter[], string>> {
  try {
    const data = await serverFetch<SingleResponse<Chapter[]>>(
      `/stories/${storySlug}/chapters`
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Failed to fetch chapters"
    );
  }
}

export async function getChapterByNumber(
  storySlug: string,
  chapterNumber: number
): Promise<Result<Chapter, string>> {
  try {
    const data = await serverFetch<SingleResponse<Chapter>>(
      `/stories/${storySlug}/chapters/${chapterNumber}`
    );
    return ok(data.data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Chapter not found");
  }
}
