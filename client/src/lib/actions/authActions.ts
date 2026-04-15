import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "@/validators/auth.validator";
import {
  api,
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

type FieldErrors = {
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type AuthFormStateType<T = unknown> =
  | (ApiSuccessResponse<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: never;
    })
  | (ApiErrorResponse & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: FieldErrors;
    });

export const registerAction = async (
  prevState: AuthFormStateType,
  formData: FormData,
): Promise<AuthFormStateType> => {
  const email = formData.get("email");
  const password = formData.get("password");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  const errors: AuthFormStateType["errors"] = {};

  const { validatedEmail, message: emailError } = emailValidator(
    email as string,
  );
  errors.email = emailError ?? null;

  const { validatedPassword, message: passwordError } = passwordValidator(
    password as string,
  );
  errors.password = passwordError ?? null;
  const { validatedName: validatedFirstName, message: firstNameError } =
    nameValidator(firstName, "firstName");
  errors.firstName = firstNameError ?? null;

  const { validatedName: validatedLastName, message: lastNameError } =
    nameValidator(lastName, "lastName");
  errors.lastName = lastNameError ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "REGISTRATION FAILED",
      statusCode: 422,
      message: "Please provide valid inputs to register!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(apiUrls.auth.register, {
      email: validatedEmail,
      password: validatedPassword,
      firstName: validatedFirstName,
      lastName: validatedLastName,
    });

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "REGISTRATION FAILED",
      code: error?.code ?? "REGISTRATION FAILED",
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Unable to register user, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};
