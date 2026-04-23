import { propertyConstraints } from "@/config/common.config";
import {
  api,
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";
import {
  listPropertiesValidator,
  stringPropertiesValidator,
} from "@/validators/common.validator";

type ImageTarget = "cover" | "avatar" | null;

type FieldErrors = {
  bio?: string | null;
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
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    return await api.post(
      `${apiUrls.profile.uploadImageToCloudinary}/${type}`,
      formData,
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponse;
  }
};

export const fetchProfile = async (userName?: string): Promise<ApiResponse> => {
  try {
    return await api.get(
      `${userName ? `${apiUrls.profile.fetchProfile}/${userName}` : apiUrls.profile.fetchProfile}`,
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponse;
  }
};

export const updateProfile = async (
  prevState: ProfileFormStateType,
  formData: FormData,
): Promise<ProfileFormStateType> => {
  const bio = formData.get("bio");
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

  const { validatedProperty: validatedBio, message: bioErrorMessage } =
    stringPropertiesValidator(
      "bio",
      bio,
      propertyConstraints.minBioLength,
      propertyConstraints.maxBioLength,
    );
  errors.bio = bioErrorMessage ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "PROFILE UPDATE FAILED",
      statusCode: 422,
      message: "Please provide valid details to update!",
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
        bio: validatedBio,
        interests: validatedInterests,
      },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "VALIDATION FAILED",
      code: error?.code ?? "PROFILE UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Unable to update profile, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};
