import { propertyConstraints } from "../config/common.config.js";
import {
  datePropertyValidator,
  stringPropertiesValidator,
} from "./common.validator.js";
import AppError from "../services/error/error.service.js";

export const validateExperience = (experience) => {
  if (!experience?.company || !experience?.role || !experience?.startDate) {
    throw AppError.unprocessable({
      message:
        "Please provide company, role and startDate to update experience!",
      code: "EXPERIENCE UPDATE FAILED",
      details: { experience },
    });
  }

  const {
    isPropertyValid: isCompanyValid,
    message: companyErrorMessage,
    validatedProperty: validatedCompany,
  } = stringPropertiesValidator(
    "company",
    experience?.company,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isCompanyValid) {
    throw AppError.unprocessable({
      message: companyErrorMessage,
      code: "EXPERIENCE UPDATE FAILED",
      details: { experience },
    });
  }

  const {
    isPropertyValid: isRoleValid,
    message: roleErrorMessage,
    validatedProperty: validatedRole,
  } = stringPropertiesValidator(
    "role",
    experience?.role,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isRoleValid) {
    throw AppError.unprocessable({
      message: roleErrorMessage,
      code: "EXPERIENCE UPDATE FAILED",
      details: { experience },
    });
  }

  const {
    isPropertyValid: isStartDateValid,
    message: startDateErrorMessage,
    validatedProperty: validatedStartDate,
  } = datePropertyValidator("start date", experience?.startDate);

  if (!isStartDateValid) {
    throw AppError.unprocessable({
      message: startDateErrorMessage,
      code: "EXPERIENCE UPDATE FAILED",
      details: { experience },
    });
  }

  let validatedEndDate;

  if (experience?.endDate) {
    const {
      isPropertyValid: isEndDateValid,
      message: endDateErrorMessage,
      validatedProperty,
    } = datePropertyValidator("end date", experience?.endDate);

    if (!isEndDateValid) {
      throw AppError.unprocessable({
        message: endDateErrorMessage,
        code: "EXPERIENCE UPDATE FAILED",
        details: { experience },
      });
    }

    validatedEndDate = validatedProperty;
  }

  let validatedDescription;

  if (experience?.description) {
    const {
      isPropertyValid: isDescriptionValid,
      message: descriptionErrorMessage,
      validatedProperty,
    } = stringPropertiesValidator(
      "description",
      experience?.description,
      propertyConstraints.minStringLength,
      propertyConstraints.maxStringLength,
    );

    if (!isDescriptionValid) {
      throw AppError.unprocessable({
        message: descriptionErrorMessage,
        code: "EXPERIENCE UPDATE FAILED",
        details: { experience },
      });
    }

    validatedDescription = validatedProperty;
  }

  const updatedExperience = {
    company: validatedCompany,
    role: validatedRole,
    startDate: new Date(validatedStartDate),
    endDate: validatedEndDate ? new Date(validatedEndDate) : null,
    isCurrent: experience?.isCurrent && experience?.isCurrent === true,
    description: experience?.description ? validatedDescription : "",
  };

  return updatedExperience;
};
