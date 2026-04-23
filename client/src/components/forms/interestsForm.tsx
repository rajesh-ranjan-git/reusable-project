"use client";

import {
  useState,
  useEffect,
  useRef,
  useActionState,
  KeyboardEvent,
} from "react";
import { LuPlus, LuX, LuSparkles } from "react-icons/lu";
import ModalPortal from "@/components/forms/modalPortal";
import {
  FormInput,
  FormButton,
  FormDivider,
  FormField,
} from "@/components/forms/formPrimitives";
import Form from "next/form";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { stringPropertiesValidator } from "@/validators/common.validator";
import { propertyConstraints } from "@/config/common.config";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/api/apiHandler";
import { updateProfile } from "@/lib/actions/profileActions";
import { toTitleCase } from "@/utils/common.utils";
import { useToast } from "@/hooks/toast";

type InterestsFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string[];
  onSave: (interests: string[]) => void;
};

type FieldErrors = {
  interests?: string | null;
};

type ProfileFormStateType<T = any> =
  | (ApiSuccessResponse<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: never;
    })
  | (ApiErrorResponse<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: FieldErrors;
    });

const SUGGESTIONS = [
  "Open Source",
  "Machine Learning",
  "UI/UX Design",
  "Web3",
  "Game Dev",
  "Photography",
  "Music",
  "Hiking",
  "Reading",
  "Taekwondo",
  "Travel",
  "Cooking",
  "Fitness",
  "Chess",
  "Writing",
];

const InterestsForm = ({
  isOpen,
  onClose,
  initialData = [],
  onSave,
}: InterestsFormProps) => {
  const [interests, setInterests] = useState<string[]>(initialData);

  const inputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();

  const validateInterest = (val: string): string => {
    if (!val.trim()) return "";

    if (interests.includes(val.toLowerCase())) {
      return `${toTitleCase(val.trim())} is already added!`;
    }

    const { message } = stringPropertiesValidator(
      "interest",
      val,
      propertyConstraints.minStringLength,
      propertyConstraints.maxStringLength,
    );

    return message ?? "";
  };

  const interestInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: validateInterest,
  });

  const initialState: ProfileFormStateType = {
    success: false,
    status: "IDLE",
    code: "INITIAL",
    statusCode: 0,
    message: "",
    details: null,
    timestamp: new Date().toISOString(),
    metadata: null,
    errors: {},
    inputs: {},
  };

  const action = async (
    prevState: ProfileFormStateType,
    formData: FormData,
  ): Promise<ProfileFormStateType> => updateProfile(prevState, formData);

  const [state, interestsFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    if (isOpen) {
      setInterests(initialData);
      interestInput.reset();
    }
  }, [isOpen]);

  const addInterest = (value: string) => {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) return;

    const error = validateInterest(value);

    if (error) {
      interestInput.handleInput(value);
      interestInput.handleBlur();
      return;
    }

    if (interests.includes(trimmed)) {
      interestInput.handleInput(value);
      interestInput.handleBlur();
      return;
    }

    setInterests((prev) => [...prev, trimmed]);

    interestInput.reset();
    inputRef.current?.focus();
  };

  const removeInterest = (interest: string) =>
    setInterests((prev) => prev.filter((i) => i !== interest));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest(interestInput.raw);
    }
  };

  const unusedSuggestions = SUGGESTIONS.filter(
    (s) => !interests.includes(s.toLowerCase()),
  );

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Profile updated successfully!",
        variant: "success",
      });
      onSave(interests);
      onClose();
    } else {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    }
  }, [state]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Interests & Hobbies"
      subtitle="Share what you're passionate about"
      maxWidth="max-w-lg"
      footer={
        <>
          <FormButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            variant="primary"
            form="interests-form"
            loading={isPending}
            disabled={interests.length === 0}
          >
            Save Changes
          </FormButton>
        </>
      }
    >
      <Form id="interests-form" action={interestsFormAction}>
        <div className="flex gap-2">
          <div className="flex-1">
            <FormField error={interestInput.error}>
              <FormInput
                ref={inputRef}
                placeholder="e.g. Taekwondo, Coding, Travel…"
                autoComplete="off"
                value={interestInput.raw}
                onChange={(e) =>
                  interestInput.handleInput(e.currentTarget.value)
                }
                onBlur={interestInput.handleBlur}
                error={interestInput.error}
                onKeyDown={handleKeyDown}
              />
            </FormField>
          </div>
          <FormButton
            type="button"
            variant="primary"
            onClick={() => addInterest(interestInput.raw)}
          >
            <LuPlus size={18} />
            Add
          </FormButton>
        </div>

        <input
          type="hidden"
          name="interests"
          value={JSON.stringify(interests)}
        />

        {interests.length > 0 && (
          <>
            <FormDivider label={`${interests.length} added`} />
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <div
                  key={interest}
                  className="group flex items-center gap-1.5 py-2 pr-1 pl-3 border border-glass-border-accent rounded-border-radius-pill transition-all glass"
                >
                  <span className="font-medium text-text-secondary text-sm">
                    {toTitleCase(interest)}
                  </span>
                  <button
                    onClick={() => removeInterest(interest)}
                    className="flex justify-center items-center hover:bg-status-error-bg p-0 border border-transparent hover:border-status-error-border rounded-full w-5 h-5 text-text-muted hover:text-status-error-text transition-colors"
                    aria-label={`Remove ${interest}`}
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {unusedSuggestions.length > 0 && (
          <>
            <FormDivider label="Suggestions" />
            <div className="flex flex-wrap gap-2">
              {unusedSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addInterest(suggestion)}
                  className="flex items-center gap-1.5 bg-glass-bg-subtle hover:bg-glass-bg px-3 py-1.5 border border-border-subtle hover:border-glass-border-accent rounded-pill text-text-muted hover:text-text-primary text-sm transition-all"
                >
                  <LuPlus size={16} />
                  {suggestion}
                </button>
              ))}
            </div>
          </>
        )}

        {interests.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-text-muted">
            <LuSparkles size={28} className="opacity-40" />
            <p className="text-sm">
              No interests yet — add some above or pick a suggestion.
            </p>
          </div>
        )}
      </Form>
    </ModalPortal>
  );
};

export default InterestsForm;
