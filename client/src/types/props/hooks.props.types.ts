import { RefObject } from "react";
import { StorageType } from "@/types/types/common.types";
import { ValidatorType } from "@/types/types/hook.types";

export interface UseWebStorageProps<T> {
  key: string;
  value: T;
  type?: StorageType;
  expiresIn?: number;
}

export interface UseInputFieldOptionsProps<T> {
  initialValue: T;
  validate: ValidatorType<T>;
  parse?: (val: string) => T;
}

export interface UseOutsideClickProps {
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];
  when: boolean;
  callback: () => void;
}
