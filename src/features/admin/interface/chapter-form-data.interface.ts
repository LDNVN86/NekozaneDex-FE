export interface ChapterFormData {
  title: string;
  images: string[];
}

export interface BulkImportData {
  chapters: ChapterFormData[];
}
