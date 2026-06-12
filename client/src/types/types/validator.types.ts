export type ValidatorResultType<T> = {
  isPropertyValid: boolean;
  message?: string;
  validatedProperty?: T | null;
};

export type DateValidatorOptionsType = {
  noFuture?: boolean;
  minDate?: string;
  maxDate?: string;
};
