/**
 * Form data structure for creating/updating a chapter
 */
export interface ChapterFormData {
  title: string;
  images: string[];
}

/**
 * Bulk import data structure
 */
export interface BulkImportData {
  chapters: ChapterFormData[];
}
