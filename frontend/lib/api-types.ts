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
