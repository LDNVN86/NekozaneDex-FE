import type { Story, Genre } from "@/features/story/interface/story-interface";

export interface SearchContentProps {
  initialStories: Story[];
  genres: Genre[];
  totalPages: number;
  currentPage: number;
  total: number;
  initialQuery: string;
  initialGenres: string[];
}

export interface SearchParams {
  q?: string;
  genres?: string[];
  status?: string;
  page?: number;
  limit?: number;
}

export interface SearchHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  selectedGenresCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export interface GenreFilterProps {
  genres: Genre[];
  selectedGenres: string[];
  genreMode: "AND" | "OR";
  onToggleGenre: (slug: string) => void;
  onToggleGenreMode: () => void;
  onClearFilters: () => void;
}

export interface SearchResultsProps {
  stories: Story[];
  query: string;
  selectedGenresCount: number;
  total: number;
  isSearching?: boolean;
}

export interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
