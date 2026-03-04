import { useState, useEffect } from "react";
import { UseWebStorageProps } from "@/types/propTypes";
import { storageConfig } from "@/config/config";
import { StoredDataType } from "@/types/types";

export const useWebStorage = <T,>({
  key,
  value,
  type = storageConfig.local,
  expiresIn,
}: UseWebStorageProps<T>) => {
  const storage =
    typeof window !== "undefined"
      ? type === storageConfig.local
        ? localStorage
        : sessionStorage
      : null;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!storage) return value;
    try {
      const item = storage.getItem(key);
      if (!item) return value;

      const parsed: StoredDataType<T> = JSON.parse(item);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        storage.removeItem(key);
        return value;
      }

      return parsed.data;
    } catch {
      return value;
    }
  });

  useEffect(() => {
    if (!storage) return;
    try {
      const payload: StoredDataType<T> = {
        data: storedValue,
        expiresAt: expiresIn ? Date.now() + expiresIn : undefined,
      };
      storage.setItem(key, JSON.stringify(payload));
    } catch (err) {
      logger.error("❌ ERROR :: Error setting storage:", err);
    }
  }, [key, storedValue, expiresIn, storage]);

  useEffect(() => {
    if (type !== storageConfig.local) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const parsed: StoredDataType<T> = JSON.parse(event.newValue);
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            storage?.removeItem(key);
            setStoredValue(value);
          } else {
            setStoredValue(parsed.data);
          }
        } catch (err) {
          logger.error("❌ ERROR :: Error syncing storage:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, type, value, storage]);

  const setWebStorageValue = (newValue: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) =>
        newValue instanceof Function ? newValue(prev) : newValue,
      );
    } catch (err) {
      logger.error("❌ ERROR :: Error setting storage:", err);
    }
  };

  return [storedValue, setWebStorageValue] as const;
};
