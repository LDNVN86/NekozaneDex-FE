// ===== Types =====
export type {
  Story,
  Chapter,
  Genre,
  StoryStatus,
  PaginatedResponse,
  SingleResponse,
} from "./interface/story-interface";

export type { StoryFilters } from "./server/api";

export {
  getStories,
  getStoriesWithFilters,
  getLatestStories,
  getHotStories,
  getStoryBySlug,
  searchStories,
  getStoriesByGenre,
  getRandomStory,
  getChaptersByStory,
  getChapterByNumber,
} from "./server/api";
