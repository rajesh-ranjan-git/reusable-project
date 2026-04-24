export type ValidatorResultType<T> = {
  isPropertyValid: boolean;
  message?: string;
  validatedProperty?: T | null;
};
