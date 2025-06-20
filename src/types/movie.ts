export interface Movie {
  movie_id: number;
  title: string;
  original_title?: string;
  aka?: string;
  year: number;
  countries: string;
  languages?: string;
  genres: string;
  durations?: string;
  directors: string;
  actors: string;
  summary: string;
  rating_score: number;
  tags?: string;
  image_large: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}