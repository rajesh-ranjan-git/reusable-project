export type HttpMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptionsType<TBody = unknown> = {
  method?: HttpMethodType;
  body?: TBody;
  headers?: Record<string, string>;
  token?: string;
  requireAuth?: boolean;
  fetchOptions?: RequestInit;
};

export type ResponseMetadataType = {
  requestId?: string;
  path?: string;
  method?: string;
  isOperational?: boolean;
};

export type ApiSuccessResponseType<T = unknown> = {
  success: true;
  status: string;
  statusCode: number;
  message: string | null;
  data: T;
  timestamp: string;
  metadata: ResponseMetadataType | null;
};

export type ApiErrorResponseType<T = unknown> = {
  success: false;
  status: string;
  code: string;
  statusCode: number;
  message: string;
  details: T | null;
  timestamp: string;
  metadata: ResponseMetadataType | null;
};

export type ApiResponseType<T = unknown> =
  | ApiSuccessResponseType<T>
  | ApiErrorResponseType<T>;
