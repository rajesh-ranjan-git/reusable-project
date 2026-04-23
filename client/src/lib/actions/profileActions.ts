import {
  api,
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";
import { listPropertiesValidator } from "@/validators/common.validator";

type ImageTarget = "cover" | "avatar" | null;

type FieldErrors = {
  interests?: string | null;
};

type ProfileFormStateType<T = any> =
  | (ApiSuccessResponse<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: never;
    })
  | (ApiErrorResponse<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: FieldErrors;
    });

export const uploadImage = async (
  image: File,
  type: ImageTarget,
  token: string,
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    return await api.post(
      `${apiUrls.profile.uploadImageToCloudinary}/${type}`,
      formData,
      {
        token,
      },
    );
  } catch (error) {
    return error as ApiErrorResponse;
  }
};

export const fetchProfile = async (
  token: string,
  userName?: string,
): Promise<ApiResponse> => {
  try {
    return await api.get(
      `${userName ? `${apiUrls.profile.fetchProfile}/${userName}` : apiUrls.profile.fetchProfile}`,
      { token },
    );
  } catch (error) {
    return error as ApiErrorResponse;
  }
};

export const updateProfile = async (
  prevState: ProfileFormStateType,
  formData: FormData,
): Promise<ProfileFormStateType> => {
  const interestsRaw = formData.get("interests");

  let interests: string[] = [];

  try {
    interests = JSON.parse(interestsRaw as string);
  } catch {
    interests = [];
  }

  const errors: ProfileFormStateType["errors"] = {};

  const {
    validatedProperty: validatedInterests,
    message: interestsErrorMessage,
  } = listPropertiesValidator("interests", interests);
  errors.interests = interestsErrorMessage ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "INTERESTS UPDATE FAILED",
      statusCode: 422,
      message: "Please provide valid interests to update!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.patch(
      apiUrls.profile.updateProfile,
      {
        interests: validatedInterests,
      },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "VALIDATION FAILED",
      code: error?.code ?? "INTERESTS UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message:
        error?.message ?? "Unable to update interests, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};
