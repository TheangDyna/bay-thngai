export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  total?: number;
  results: number;
}
