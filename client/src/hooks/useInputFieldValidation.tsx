import { useEffect, useState } from "react";

type Validator<T> = (val: T) => string;

type UseInputFieldOptions<T> = {
  initialValue: T;
  validate: Validator<T>;
  parse?: (val: string) => T;
};

function useInputFieldValidator<T>({
  initialValue,
  validate,
  parse,
}: UseInputFieldOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [raw, setRaw] = useState<string>(String(initialValue ?? ""));
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const handleInput = (input: string) => {
    setRaw(input);

    const parsedValue = parse ? parse(input) : (input as unknown as T);
    setValue(parsedValue);
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  const reset = () => {
    setValue(initialValue);
    setRaw(String(initialValue ?? ""));
    setError("");
    setTouched(false);
  };

  useEffect(() => {
    if (!touched) return;

    const timer = setTimeout(() => {
      setError(validate(value));
    }, 300);

    return () => clearTimeout(timer);
  }, [value, touched, validate]);

  return {
    value,
    raw,
    error,
    touched,
    handleInput,
    handleBlur,
    reset,
  };
}

export default useInputFieldValidator;
