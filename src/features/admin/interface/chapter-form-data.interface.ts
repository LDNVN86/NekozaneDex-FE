export interface ChapterFormData {
  title: string;
  chapter_label?: string;
  chapter_type?: string;
  ordering?: number;
  images: string[];
}

export interface BulkImportData {
  chapters: ChapterFormData[];
}
