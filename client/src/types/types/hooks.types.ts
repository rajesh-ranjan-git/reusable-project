export type ValidatorType<T> = (val: T) => string;

export type UseInputFieldValidatorReturnType<T> = {
  value: T;
  raw: string;
  error: string;
  touched: boolean;
  handleInput: (input: string) => void;
  handleBlur: () => void;
  reset: () => void;
};

export type ScreenWidthType = {
  isMobileScreenWidth: boolean;
  isTabletScreenWidth: boolean;
  isDesktopScreenWidth: boolean;
};
