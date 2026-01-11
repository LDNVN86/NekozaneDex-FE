import type { ChapterFormData } from "./chapter-form-data.interface";

/**
 * Field-level validation errors for chapter form
 */
export interface ChapterFieldErrors {
  title?: string;
  images?: string;
}

/**
 * Form state returned from server action
 */
export interface ChapterFormState {
  success: boolean;
  message?: string;
  fieldErrors?: ChapterFieldErrors;
  values?: ChapterFormData;
}
