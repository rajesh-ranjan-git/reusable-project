export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getRandomItem = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

export const getNumRange = (start, stop, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step,
  );

export const isPlainObject = (data) => {
  return typeof data === "object" && data !== null && !Array.isArray(data);
};

export const omitObjectProperties = (obj, keysToOmit) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key)),
  );
};

export const selectObjectProperties = (obj, keysToSelect) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToSelect.includes(key)),
  );
};

export const toSentenceCase = (text) => {
  if (!text) {
    return "";
  }

  let temp = text.toLowerCase().split("_").join(" ").split("-").join(" ");

  return temp.charAt(0).toUpperCase() + temp.slice(1) + ".";
};

export const toTitleCase = (text) => {
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

export const getUrlString = (text) => {
  if (!text) {
    return "";
  }

  return `/${text.toLowerCase().split(" ").join("-").split("_").join("-")}`;
};

export const sanitizeList = (arr) =>
  arr.map((v) => v.trim()).filter((v) => v.length > 0);

export const deepEquals = (a, b) => {
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

  const objA = a;
  const objB = b;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEquals(objA[key], objB[key])) return false;
  }

  return true;
};
