// ===== Types =====
export type {
  Story,
  Chapter,
  Genre,
  StoryStatus,
  PaginatedResponse,
  SingleResponse,
} from "./interface/story-interface";

export {
  getStories,
  getLatestStories,
  getHotStories,
  getStoryBySlug,
  searchStories,
  getStoriesByGenre,
  getRandomStory,
  getChaptersByStory,
  getChapterByNumber,
} from "./server/api";
