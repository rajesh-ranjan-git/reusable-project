import {
  ApiErrorResponseType,
  ApiResponseType,
  ApiSuccessResponseType,
} from "@/types/types/api.types";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const connect = async (
  userId: string,
  status: string,
): Promise<ApiSuccessResponseType> => {
  return await api.post(
    `${apiUrls.connection.connect}/${userId}`,
    { status },
    {
      requireAuth: true,
    },
  );
};

export const fetchConnections = async (
  page: number = 1,
): Promise<ApiResponseType> => {
  try {
    return await api.get(
      `${apiUrls.connection.fetchConnections}?page=${page}`,
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const fetchConnectionRequests = async (
  page: number = 1,
): Promise<ApiResponseType> => {
  try {
    return await api.get(`${apiUrls.connection.fetchRequests}?page=${page}`, {
      requireAuth: true,
    });
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};
