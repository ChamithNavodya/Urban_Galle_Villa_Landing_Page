import { useState } from "react";
import {
  MealPlanType,
  PaymentMethod,
  RatePlanStatus,
  RatePlanTypes,
  StayDurationType,
} from "@/enums/rate-plan.enums";
import { RatePlanFormData } from "@/types/rate-plan.types";

export const useRatePlanForm = () => {
  const [formData, setFormData] = useState<RatePlanFormData>({
    name: "",
    description: "",
    applicableRooms: [],
    isActive: true,
    minimumStay: 1,
    maximumStay: undefined,
    basePrice: "",
    discountPercentage: "0",
    isDateSpecific: false,
    dateRanges: [],
    hasBlackoutDates: false,
    blackoutDates: [],
    durationType: StayDurationType.CUSTOM,
    ratePlanType: RatePlanTypes.Standard,
    ratePlanStatus: RatePlanStatus.ACTIVE,
    customStayLength: 1,
    mealPlan: MealPlanType.NONE,
    amenitiesIncluded: [],
    customInclusions: [],
    isRefundable: false,
    refundWindow: 7,
    cancellationPolicy: "",
    paymentTerms: PaymentMethod.PREPAID,
  });

  const updateFormData = (updates: Partial<RatePlanFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return { formData, updateFormData, setFormData };
};
