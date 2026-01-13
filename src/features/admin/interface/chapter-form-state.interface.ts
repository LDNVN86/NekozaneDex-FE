import type { ChapterFormData } from "./chapter-form-data.interface";

export interface ChapterFieldErrors {
  title?: string;
  images?: string;
}
export interface ChapterFormState {
  success: boolean;
  message?: string;
  fieldErrors?: ChapterFieldErrors;
  values?: ChapterFormData;
}
