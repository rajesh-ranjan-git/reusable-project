export type LoggedInUserType = {
  userId: string;
  status: string;
  email: string;
  role: string;
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  avatar?: string | null;
} | null;

export type ProviderLoginDataType = {
  user: LoggedInUserType;
  accessToken: string;
};

export type UserNameValidatorResultType = {
  isUserNameValid: boolean;
  message?: string;
  validatedUserName?: string;
};

export type NameValidatorResultType = {
  isNameValid: boolean;
  message?: string;
  validatedName?: string | null;
};

export type EmailValidatorResultType = {
  isEmailValid: boolean;
  message?: string;
  validatedEmail?: string;
};

export type PasswordValidatorResultType = {
  isPasswordValid: boolean;
  message?: string;
  validatedPassword?: string;
};
