import { RatePlanFormData } from "@/types/rate-plan.types";

export const validateRatePlan = (formData: RatePlanFormData) => {
  const errors: Record<string, string[]> = {};

  // General Details validation
  const generalErrors = [];
  if (!formData.name.trim()) generalErrors.push("Name is required");
  if (formData.minimumStay <= 0)
    generalErrors.push("Minimum stay must be greater than 0");
  if (!formData.basePrice.trim()) generalErrors.push("Base price is required");
  if (formData.applicableRooms.length === 0)
    generalErrors.push("At least one room must be selected");
  if (generalErrors.length) errors.general = generalErrors;

  // Duration & Dates validation
  const durationErrors = [];
  if (formData.isDateSpecific && formData.dateRanges.length === 0) {
    durationErrors.push("At least one date range must be specified");
  }
  if (durationErrors.length) errors.duration = durationErrors;

  // Policies validation
  const policiesErrors = [];
  if (formData.isRefundable && formData.refundWindow <= 0) {
    policiesErrors.push(
      "Refund window must be specified for refundable rate plans"
    );
  }
  if (policiesErrors.length) errors.policies = policiesErrors;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
