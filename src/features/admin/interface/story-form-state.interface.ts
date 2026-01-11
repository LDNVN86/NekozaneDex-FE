import type { StoryFormData } from "./story-form-data.interface";

/**
 * Field-level validation errors for story form
 */
export interface StoryFieldErrors {
  title?: string;
  description?: string;
  author_name?: string;
  translator?: string;
  source_url?: string;
  cover_image_url?: string;
  genre_ids?: string;
}

/**
 * Form state returned from server action
 */
export interface StoryFormState {
  success: boolean;
  message?: string;
  fieldErrors?: StoryFieldErrors;
  values?: StoryFormData;
}
