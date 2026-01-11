export {
  getAdminStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  getAllGenres,
  getChaptersByStoryId,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
  scheduleChapter,
  bulkImportChapters,
  uploadSingleImage,
  uploadChapterImages,
  deleteImage,
} from "./api";

export type { BulkChapterData, UploadResponse } from "./api";
