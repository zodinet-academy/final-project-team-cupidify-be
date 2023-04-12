export type THttpResponse<T> = {
  statusCode?: number;
  message?: string;
  totalPages?: number;
  data?: T;
};
