import {
  useState,
  useEffect,
  useRef,
  useActionState,
  KeyboardEvent,
} from "react";
import Form from "next/form";
import { LuPlus, LuX, LuSparkles } from "react-icons/lu";
import { INTEREST_SUGGESTIONS } from "@/constants/profile.constants";
import { InterestsFormProps } from "@/types/props/profile.props.types";
import { HighlightedInterestType } from "@/types/types/profile.types";
import { FormStateType } from "@/types/types/actions.types";
import { initialState } from "@/config/forms.config";
import { toTitleCase } from "@/utils/common.utils";
import { validateInterest } from "@/validators/profile.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateProfile } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormButton from "@/components/forms/shared/form.button";
import FormDivider from "@/components/forms/shared/form.divider";
import FormFooter from "@/components/forms/shared/form.footer";

const InterestsForm = ({
  isOpen,
  onClose,
  initialData = [],
  onSave,
}: InterestsFormProps) => {
  const [interests, setInterests] = useState<string[]>(initialData);
  const [highlightedInterest, setHighlightedInterest] =
    useState<HighlightedInterestType | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();

  const interestInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: validateInterest,
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateProfile(prevState, formData);

  const [state, interestsFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  const addInterest = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;

    const existingIndex = interests.findIndex(
      (i) => i.toLowerCase() === trimmed,
    );

    if (existingIndex !== -1) {
      setHighlightedInterest({ index: existingIndex });

      setTimeout(() => {
        setHighlightedInterest(null);
      }, 5000);

      showToast({
        title: "INTEREST ADD FAILED",
        message: `${toTitleCase(trimmed)} already exists!`,
        variant: "warning",
      });

      interestInput.reset();
      return;
    }

    const error = validateInterest(value);
    if (error) {
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

  const unusedSuggestions = INTEREST_SUGGESTIONS.filter(
    (s) => !interests.includes(s.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      setInterests(initialData);
      interestInput.reset();
    }
  }, [isOpen]);

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
        <FormFooter
          formType="interests-form"
          onClose={onClose}
          isPending={isPending || interests.length === 0}
        />
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
          <div className="shrink-0">
            <FormButton
              type="button"
              variant="primary"
              onClick={() => addInterest(interestInput.raw)}
            >
              <LuPlus size={18} />
              Add
            </FormButton>
          </div>
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
              {interests.map((interest, idx) => (
                <div
                  key={interest}
                  className={`group flex items-center gap-1.5 py-2 pr-1 pl-3 border border-glass-border-accent rounded-border-radius-pill transition-all glass ${highlightedInterest?.index === idx ? `ring-2 ring-status-warning-border alert-pulse bg-status-warning-bg alert-warning` : ""}`}
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
