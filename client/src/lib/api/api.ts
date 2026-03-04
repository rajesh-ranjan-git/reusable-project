"use server";

import {
  api,
  ApiErrorType,
  ApiOptions,
  ApiResponse,
} from "@/lib/api/apiHandler";
import { getCookies, setCookies } from "@/lib/api/cookiesHandler";

export type ApiMethod =
  | "GET"
  | "get"
  | "POST"
  | "post"
  | "PUT"
  | "put"
  | "PATCH"
  | "patch"
  | "DELETE"
  | "delete";

export interface ApiRequestParams<T = any> {
  method?: ApiMethod;
  url: string;
  data?: T;
  requiresAuth?: boolean;
  options?: ApiOptions;
}

export async function apiRequest<T = any, D = any>({
  method = "GET",
  url,
  data,
  requiresAuth = true,
  options,
}: ApiRequestParams<D>): Promise<ApiResponse<T>> {
  if (requiresAuth) {
    const token = await getCookies("authToken");

    if (!token) {
      return {
        success: false,
        error: {
          message: "Authentication required. Please log in.",
          code: ApiErrorType.FORBIDDEN_ERROR,
        },
      };
    }

    options = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  const handleResponse = async <R>(
    result: ApiResponse<R>
  ): Promise<ApiResponse<R>> => {
    if (!result.success && result.error) {
      return {
        success: false,
        error: {
          message: result.error.message,
          code: ApiErrorType.FORBIDDEN_ERROR,
        },
      };
    }

    if (result?.metadata?.cookies) {
      await setCookies(result.metadata.cookies);
    }

    return result;
  };

  switch (method) {
    case "GET":
    case "get":
      const getResult = await api.get<T>(url, options);

      return handleResponse(getResult);
    case "POST":
    case "post":
      const postResult = await api.post<T>(url, data, options);

      return handleResponse(postResult);
    case "PUT":
    case "put":
      const putResult = await api.put<T>(url, data, options);

      return handleResponse(putResult);
    case "PATCH":
    case "patch":
      const patchResult = await api.patch<T>(url, data, options);

      return handleResponse(patchResult);
    case "DELETE":
    case "delete":
      const deleteResult = await api.delete<T>(url, options);

      return handleResponse(deleteResult);
    default:
      return {
        success: false,
        error: {
          message: `Unsupported HTTP method: ${method}`,
          code: ApiErrorType.VALIDATION_ERROR,
        },
      };
  }
}
