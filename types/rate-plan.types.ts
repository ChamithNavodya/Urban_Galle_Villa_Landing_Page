import {
  MealPlanType,
  PaymentMethod,
  RatePlanStatus,
  RatePlanTypes,
  StayDurationType,
} from "@/enums/rate-plan.enums";
import { DateRange } from "react-day-picker";

export interface RatePlanFormData {
  // General Details
  name: string;
  description: string;
  applicableRooms: number[];
  isActive: boolean;
  minimumStay: number;
  maximumStay?: number;
  basePrice: string;
  discountPercentage: string;
  ratePlanStatus: RatePlanStatus;

  // Duration & Date Rules
  ratePlanType: RatePlanTypes;
  isDateSpecific: boolean;
  dateRanges: DateRange[];
  hasBlackoutDates: boolean;
  blackoutDates: DateRange[];

  durationType: StayDurationType;
  customStayLength: number;

  // Meals & Amenities
  mealPlan: MealPlanType;
  amenitiesIncluded: string[];
  customInclusions: string[];

  // Policies & Cancellation
  isRefundable: boolean;
  refundWindow: number;
  cancellationPolicy: string;
  paymentTerms: PaymentMethod;
}

export interface RatePlan {
  ratePlanId: number;
  name: string;
  description: string;
  isActive: boolean;
  minimumStay: number;
  maximumStay?: number;
  basePrice: number;
  discountPercentage: number;
  isDateSpecific: boolean;
  dateRanges: Array<{ from: Date; to: Date }>;
  ratePlanType: RatePlanTypes;
  hasBlackoutDates: boolean;
  blackoutDates: Array<{ from: Date; to: Date }>;
  durationType: StayDurationType;
  customStayLength: number;
  mealPlan: MealPlanType;
  amenitiesIncluded: string[];
  customInclusions: string[];
  ratePlanStatus: RatePlanStatus;
  isRefundable: boolean;
  refundWindow: number;
  cancellationPolicy: string;
  paymentTerms: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  applicableRooms: Array<{
    roomId: number;
    name: string;
  }>;
}

export interface RatePlansResponse {
  data: RatePlan[];
  message?: string;
  statusCode?: number;
  success?: boolean;
}

export interface RatePlanResponse {
  data: RatePlan;
  message?: string;
  statusCode?: number;
  success?: boolean;
}

export interface RatePlanCreateResponse {
  success: boolean;
  message: string;
  data: RatePlanFormData[];
}

export const mapRatePlanToFormData = (ratePlan: RatePlan): RatePlanFormData => {
  return {
    // General Details
    name: ratePlan.name,
    description: ratePlan.description,
    applicableRooms: ratePlan.applicableRooms.map((room) => room.roomId),
    isActive: ratePlan.isActive,
    minimumStay: ratePlan.minimumStay,
    maximumStay: ratePlan.maximumStay,
    basePrice: ratePlan.basePrice.toString(),
    discountPercentage: ratePlan.discountPercentage.toString(),
    ratePlanStatus: ratePlan.ratePlanStatus,

    // Duration & Date Rules
    ratePlanType: ratePlan.ratePlanType,
    isDateSpecific: ratePlan.isDateSpecific,
    dateRanges: ratePlan.dateRanges,
    hasBlackoutDates: ratePlan.hasBlackoutDates,
    blackoutDates: ratePlan.blackoutDates,

    durationType: ratePlan.durationType,
    customStayLength: ratePlan.customStayLength,

    // Meals & Amenities
    mealPlan: ratePlan.mealPlan,
    amenitiesIncluded: ratePlan.amenitiesIncluded,
    customInclusions: ratePlan.customInclusions,

    // Policies & Cancellation
    isRefundable: ratePlan.isRefundable,
    refundWindow: ratePlan.refundWindow,
    cancellationPolicy: ratePlan.cancellationPolicy,
    paymentTerms: ratePlan.paymentTerms,
  };
};
