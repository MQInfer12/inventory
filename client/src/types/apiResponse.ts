export type SuccessResponse<T> = {
  status: 200;
  message: string;
  data: T;
}

export type ErrorResponse = {
  status: 404 | 401 | 500;
  message: string;
  data: null;
}

export type ApiResponse<T> = Promise<SuccessResponse<T> | ErrorResponse>;