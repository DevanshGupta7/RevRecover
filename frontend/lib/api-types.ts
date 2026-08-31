export interface ApiErrorResponse {
  message: string;

  code?: string;

  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];

  total: number;

  page?: number;

  pageSize?: number;
}

export interface ApiPaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  pagination: ApiPaginationMeta;
}

export interface ApiAuthTokenResponse {
  access_token: string;
  refresh_token: string;
}
