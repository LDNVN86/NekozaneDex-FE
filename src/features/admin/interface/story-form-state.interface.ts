import type { StoryFormData } from "./story-form-data.interface";
export interface StoryFieldErrors {
  title?: string;
  description?: string;
  author_name?: string;
  translator?: string;
  source_url?: string;
  cover_image_url?: string;
  genre_ids?: string;
}
export interface StoryFormState {
  success: boolean;
  message?: string;
  fieldErrors?: StoryFieldErrors;
  values?: StoryFormData;
}
