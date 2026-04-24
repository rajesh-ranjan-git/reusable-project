import { FormStateType } from "@/types/types/actions.types";
import { ApiErrorResponseType } from "@/types/types/api.types";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  userNameValidator,
} from "@/validators/auth.validators";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const registerAction = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const email = formData.get("email");
  const password = formData.get("password");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  const errors: FormStateType["errors"] = {};

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

export const loginAction = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const loginField = formData.get("loginField");
  const password = formData.get("password");

  const errors: FormStateType["errors"] = {};

  let validatedUserName: string | undefined;
  let validatedEmail: string | undefined;

  if (!loginField || typeof loginField !== "string") {
    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "LOGIN FAILED",
      statusCode: 422,
      message: "Please provide email address or username to login!",
      details: { loginField },
      timestamp: new Date().toISOString(),
      metadata: null,
      errors: {
        userName: "Login field is required",
        email: "Login field is required",
        password: null,
      },
      inputs: Object.fromEntries(formData),
    };
  }

  const isEmail = loginField.includes("@");

  if (isEmail) {
    const { validatedEmail: validEmail, message: emailError } = emailValidator(
      loginField as string,
    );
    validatedEmail = validEmail;
    errors.email = emailError ?? null;
    errors.userName = null;
  } else {
    const { validatedUserName: validUserName, message: userNameError } =
      userNameValidator(loginField as string);
    validatedUserName = validUserName;
    errors.userName = userNameError ?? null;
    errors.email = null;
  }

  const { validatedPassword, message: passwordError } = passwordValidator(
    password as string,
  );
  errors.password = passwordError ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "LOGIN FAILED",
      statusCode: 422,
      message: "Please provide valid inputs to login!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(apiUrls.auth.login, {
      userName: validatedUserName,
      email: validatedEmail,
      password: validatedPassword,
    });

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "LOGIN FAILED",
      code: error?.code ?? "LOGIN FAILED",
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Unable to login, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};

export const logoutAction = async () => {
  try {
    return await api.post(apiUrls.auth.logout);
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const forgotPasswordAction = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const email = formData.get("email");

  const errors: FormStateType["errors"] = {};

  const { validatedEmail, message: emailError } = emailValidator(
    email as string,
  );
  errors.email = emailError ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "FORGOT PASSWORD FAILED",
      statusCode: 422,
      message: emailError ?? "Please provide valid email to register!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(apiUrls.auth.forgotPassword, {
      email: validatedEmail,
    });

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "FORGOT PASSWORD FAILED",
      code: error?.code ?? "FORGOT PASSWORD FAILED",
      statusCode: error?.statusCode ?? 500,
      message:
        error?.message ??
        "Unable to process forgot password request, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};
