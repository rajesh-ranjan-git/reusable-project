export const getTypedKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const getNumRange = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step,
  );

export const isPlainObject = (
  data: unknown,
): data is Record<string, unknown> => {
  return typeof data === "object" && data !== null && !Array.isArray(data);
};

export const omitObjectProperties = <
  T extends Record<string, any>,
  K extends readonly (keyof T)[],
>(
  obj: T,
  keysToOmit: K,
): Omit<T, K[number]> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key as keyof T)),
  ) as Omit<T, K[number]>;
};

export const selectObjectProperties = <
  T extends Record<string, any>,
  K extends readonly (keyof T)[],
>(
  obj: T,
  keysToSelect: K,
): Pick<T, K[number]> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) =>
      keysToSelect.includes(key as keyof T),
    ),
  ) as Pick<T, K[number]>;
};

export const toSentenceCase = (text?: string) => {
  if (!text) {
    return "";
  }

  let temp = text.toLowerCase().split("_").join(" ").split("-").join(" ");

  return temp.charAt(0).toUpperCase() + temp.slice(1) + ".";
};

export const toTitleCase = (text?: string) => {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .split("_")
    .join(" ")
    .split("-")
    .join(" ")
    .split(" ")
    .map((word) => {
      if (word.length === 0) {
        return "";
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const getUrlString = (text?: string) => {
  if (!text) {
    return "";
  }

  return `/${text.toLowerCase().split(" ").join("-").split("_").join("-")}`;
};

export const getTransformedDate = (dateString?: string | Date) => {
  if (!dateString) return "N/A";

  return new Date(dateString)
    .toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
};

export const sanitizeList = (arr: string[]) =>
  arr.map((v) => v.trim()).filter((v) => v.length > 0);

export const deepEquals = (a: unknown, b: unknown) => {
  if (Object.is(a, b)) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") return a === b;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEquals(objA[key], objB[key])) return false;
  }

  return true;
};
