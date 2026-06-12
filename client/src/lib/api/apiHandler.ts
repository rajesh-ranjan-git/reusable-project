import { HOST_API_URL } from "@/constants/env.constants";
import { httpStatusConfig } from "@/config/http.config";
import { useAppStore } from "@/store/store";
import {
  ApiErrorResponseType,
  ApiRequestOptionsType,
  ApiResponseType,
  ApiSuccessResponseType,
  ResponseMetadataType,
} from "@/types/types/api.types";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown | null;
  public readonly timestamp: string;
  public readonly metadata: ResponseMetadataType | null;
  public readonly raw: ApiErrorResponseType;

  constructor(response: ApiErrorResponseType) {
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

export async function apiHandler<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  options: ApiRequestOptionsType<TBody> = {},
): Promise<ApiSuccessResponseType<TResponse>> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    token,
    fetchOptions = {},
  } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  let authToken = token;

  if (options.requireAuth && !authToken) {
    authToken = useAppStore.getState().accessToken ?? "";
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const init: RequestInit = {
    method,
    headers,
    credentials: "include",
    ...fetchOptions,
  };

  if (body !== undefined && method !== "GET" && method !== "DELETE") {
    init.body = isFormData ? body : JSON.stringify(body);
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

  let json: ApiResponseType<TResponse>;
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
    throw new ApiError(json as ApiErrorResponseType);
  }

  return json as ApiSuccessResponseType<TResponse>;
}

export const api = {
  get: <TResponse = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptionsType, "method" | "body">,
  ) => apiHandler<TResponse>(endpoint, { ...options, method: "GET" }),

  post: <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<ApiRequestOptionsType<TBody>, "method" | "body">,
  ) =>
    apiHandler<TResponse, TBody>(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<ApiRequestOptionsType<TBody>, "method" | "body">,
  ) =>
    apiHandler<TResponse, TBody>(endpoint, { ...options, method: "PUT", body }),

  patch: <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<ApiRequestOptionsType<TBody>, "method" | "body">,
  ) =>
    apiHandler<TResponse, TBody>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: <TResponse = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptionsType, "method" | "body">,
  ) => apiHandler<TResponse>(endpoint, { ...options, method: "DELETE" }),
};
