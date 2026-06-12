import { FormFooterProps } from "@/types/props/forms.props.types";
import FormButton from "@/components/forms/shared/form.button";

const FormFooter = ({
  formType,
  onClose,
  isPending,
  isDisabled,
}: FormFooterProps) => {
  return (
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
        form={formType}
        loading={isPending}
        disabled={isDisabled}
      >
        Save Changes
      </FormButton>
    </>
  );
};

export default FormFooter;
