export type FormSelectOptionType = {
  label: string;
  value: string;
};

export type FormRadioOptionType = {
  label: string;
  value: string;
  hint?: string;
};

export type DateRangeType = { start: Date | null; end: Date | null };
