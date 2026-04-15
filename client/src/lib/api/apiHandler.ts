import { httpStatusConfig } from "@/config/http.config";
import { HOST_API_URL } from "@/constants/env.constants";

export interface ResponseMetadata {
  requestId?: string;
  path?: string;
  method?: string;
  isOperational?: boolean;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  status: string;
  statusCode: number;
  message: string | null;
  data: T;
  timestamp: string;
  metadata: ResponseMetadata | null;
}

export interface ApiErrorResponse<T = unknown> {
  success: false;
  status: string;
  code: string;
  statusCode: number;
  message: string;
  details: T | null;
  timestamp: string;
  metadata: ResponseMetadata | null;
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse<T>;

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown | null;
  public readonly timestamp: string;
  public readonly metadata: ResponseMetadata | null;
  public readonly raw: ApiErrorResponse;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = response.status ?? "API Error";
    this.statusCode = response.statusCode;
    this.code = response.code;
    this.details = response.details;
    this.timestamp = response.timestamp;
    this.metadata = response.metadata;
    this.raw = response;
  }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  token?: string;
  fetchOptions?: RequestInit;
}

export async function apiHandler<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<ApiSuccessResponse<TResponse>> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    token,
    fetchOptions = {},
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
    credentials: "include",
    ...fetchOptions,
  };

  if (body !== undefined && method !== "GET" && method !== "DELETE") {
    init.body = JSON.stringify(body);
  }

  const url = `${HOST_API_URL}${endpoint}`;

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (error) {
    if (error instanceof Error && navigator.onLine) {
      throw new ApiError({
        success: false,
        status: httpStatusConfig.serviceUnavailable.message,
        code: httpStatusConfig.serviceUnavailable.message,
        statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        message: "Something went wrong at our end, please try again later!",
        details: null,
        timestamp: new Date().toISOString(),
        metadata: null,
      });
    } else {
      throw new ApiError({
        success: false,
        status: "NETWORK UNAVAILABLE",
        code: "NETWORK UNAVAILABLE",
        statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        message: "Please check your internet connection!",
        details: null,
        timestamp: new Date().toISOString(),
        metadata: null,
      });
    }
  }

  let json: ApiResponse<TResponse>;
  try {
    json = await res.json();
  } catch (error) {
    throw new ApiError({
      success: false,
      status: httpStatusConfig.serviceUnavailable.message,
      code: httpStatusConfig.serviceUnavailable.message,
      statusCode: httpStatusConfig.serviceUnavailable.statusCode,
      message: "Something went wrong at our end, please try again later!",
      details: null,
      timestamp: new Date().toISOString(),
      metadata: null,
    });
  }

  if (!res.ok || json.success === false) {
    throw new ApiError(json as ApiErrorResponse);
  }

  return json as ApiSuccessResponse<TResponse>;
}

export const api = {
  get: <TResponse = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ) => apiHandler<TResponse>(endpoint, { ...options, method: "GET" }),

  post: <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<ApiRequestOptions<TBody>, "method" | "body">,
  ) =>
    apiHandler<TResponse, TBody>(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<ApiRequestOptions<TBody>, "method" | "body">,
  ) =>
    apiHandler<TResponse, TBody>(endpoint, { ...options, method: "PUT", body }),

  patch: <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<ApiRequestOptions<TBody>, "method" | "body">,
  ) =>
    apiHandler<TResponse, TBody>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: <TResponse = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ) => apiHandler<TResponse>(endpoint, { ...options, method: "DELETE" }),
};
