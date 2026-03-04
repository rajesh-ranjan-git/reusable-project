export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    statusCode?: number;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    cookies?: string[];
    requestId?: string;
  };
}

export enum ApiErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  FORBIDDEN_ERROR = "FORBIDDEN_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  CONFLICT_ERROR = "CONFLICT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  CANCELLED_ERROR = "CANCELLED_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ApiOptions extends Omit<RequestInit, "method" | "body"> {
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
}

const DEFAULT_TIMEOUT = 30000;
const BASE_URL = process.env.NEXT_PUBLIC_BRAINBOX_HOST_URL || "";

const getErrorType = (
  statusCode?: number,
  isTimeout?: boolean,
  isNetworkError?: boolean
): ApiErrorType => {
  if (isTimeout) return ApiErrorType.TIMEOUT_ERROR;
  if (isNetworkError) return ApiErrorType.NETWORK_ERROR;

  if (!statusCode) return ApiErrorType.NETWORK_ERROR;

  const errorMap: Record<number, ApiErrorType> = {
    400: ApiErrorType.VALIDATION_ERROR,
    401: ApiErrorType.AUTHENTICATION_ERROR,
    403: ApiErrorType.FORBIDDEN_ERROR,
    404: ApiErrorType.NOT_FOUND_ERROR,
    409: ApiErrorType.CONFLICT_ERROR,
    429: ApiErrorType.RATE_LIMIT_ERROR,
    500: ApiErrorType.SERVER_ERROR,
    502: ApiErrorType.SERVER_ERROR,
    503: ApiErrorType.SERVER_ERROR,
    504: ApiErrorType.SERVER_ERROR,
  };

  return errorMap[statusCode] || ApiErrorType.UNKNOWN_ERROR;
};

const getErrorMessage = (
  errorType: ApiErrorType,
  customMessage?: string
): string => {
  if (customMessage) return customMessage;

  const messages: Record<ApiErrorType, string> = {
    [ApiErrorType.NETWORK_ERROR]:
      "Network error. Please check your internet connection.",
    [ApiErrorType.TIMEOUT_ERROR]: "Request timed out. Please try again.",
    [ApiErrorType.VALIDATION_ERROR]:
      "Invalid request data. Please check your input.",
    [ApiErrorType.AUTHENTICATION_ERROR]:
      "Authentication failed. Please log in again.",
    [ApiErrorType.FORBIDDEN_ERROR]:
      "You do not have permission to perform this action.",
    [ApiErrorType.NOT_FOUND_ERROR]: "The requested resource was not found.",
    [ApiErrorType.CONFLICT_ERROR]: "The requested resource already exists.",
    [ApiErrorType.SERVER_ERROR]: "Server error. Please try again later.",
    [ApiErrorType.RATE_LIMIT_ERROR]:
      "Too many requests. Please try again later.",
    [ApiErrorType.CANCELLED_ERROR]: "Request was cancelled.",
    [ApiErrorType.UNKNOWN_ERROR]: "An unexpected error occurred.",
  };

  return messages[errorType];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("TIMEOUT");
    }
    throw error;
  }
};

async function handleRequest<T>(
  url: string,
  method: string = "GET",
  body?: any,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    retryAttempts = 0,
    retryDelay = 1000,
    timeout = DEFAULT_TIMEOUT,
    credentials = "include",
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  let lastError: any = null;
  let attempt = 0;
  let statusCode: number | undefined;
  let isTimeout = false;
  let isNetworkError = false;

  while (attempt <= retryAttempts) {
    try {
      const response = await fetchWithTimeout(
        fullUrl,
        {
          method,
          headers,
          credentials,
          body: body ? JSON.stringify(body) : undefined,
          ...fetchOptions,
        },
        timeout
      );

      statusCode = response.status;

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        const errorType = getErrorType(statusCode);
        const customMessage =
          typeof errorData === "object" && errorData?.message
            ? errorData.message
            : typeof errorData === "object" && errorData?.error
            ? typeof errorData.error === "string"
              ? errorData.error
              : errorData.error.message
            : undefined;

        const shouldRetry =
          attempt < retryAttempts &&
          (errorType === ApiErrorType.SERVER_ERROR ||
            errorType === ApiErrorType.RATE_LIMIT_ERROR);

        if (shouldRetry) {
          attempt++;
          await sleep(retryDelay * Math.pow(2, attempt - 1));
          continue;
        }

        return {
          success: false,
          error: {
            message: getErrorMessage(errorType, customMessage),
            code: errorType,
            statusCode,
            details: errorData,
          },
        };
      }

      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      const setCookieHeader = response.headers.get("set-cookie");
      const cookies = setCookieHeader ? [setCookieHeader] : undefined;

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          cookies,
          requestId: response.headers.get("x-request-id") || undefined,
        },
      };
    } catch (error: any) {
      lastError = error;
      attempt++;

      if (error.message === "TIMEOUT") {
        isTimeout = true;
        const shouldRetry = attempt <= retryAttempts;
        if (shouldRetry) {
          await sleep(retryDelay * Math.pow(2, attempt - 1));
          continue;
        }
      } else if (error.name === "TypeError" || !navigator.onLine) {
        isNetworkError = true;
        const shouldRetry = attempt <= retryAttempts;
        if (shouldRetry) {
          await sleep(retryDelay * Math.pow(2, attempt - 1));
          continue;
        }
      }

      break;
    }
  }

  const errorType = getErrorType(statusCode, isTimeout, isNetworkError);
  const errorMessage = getErrorMessage(errorType);

  return {
    success: false,
    error: {
      message: errorMessage,
      code: errorType,
      statusCode,
      details: lastError?.message,
    },
  };
}

export const api = {
  get: <T = any>(url: string, options?: ApiOptions) =>
    handleRequest<T>(url, "GET", undefined, options),

  post: <T = any>(url: string, data?: any, options?: ApiOptions) =>
    handleRequest<T>(url, "POST", data, options),

  put: <T = any>(url: string, data?: any, options?: ApiOptions) =>
    handleRequest<T>(url, "PUT", data, options),

  patch: <T = any>(url: string, data?: any, options?: ApiOptions) =>
    handleRequest<T>(url, "PATCH", data, options),

  delete: <T = any>(url: string, options?: ApiOptions) =>
    handleRequest<T>(url, "DELETE", undefined, options),
};
