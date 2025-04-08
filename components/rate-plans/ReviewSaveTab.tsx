"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Check, X, AlertCircle } from "lucide-react";
import type { RatePlanFormData } from "@/types/rate-plan.types";
import { Amenity, RoomListItem } from "@/types/room.types";

interface ReviewSaveTabProps {
  formData: RatePlanFormData;
  availableRooms: RoomListItem[];
  availableAmenities: Amenity[];
  onEditSection: (section: string) => void;
  validationErrors?: Record<string, string[]>;
}

export function ReviewSaveTab({
  formData,
  availableRooms,
  availableAmenities,
  onEditSection,
  validationErrors,
}: ReviewSaveTabProps) {
  // Helper function to get room names from IDs
  const getRoomNames = (roomIds: number[]) => {
    return roomIds.map((id) => {
      const room = availableRooms.find((r) => r.roomId === id);
      return room ? room.name : id;
    });
  };

  // Helper function to get amenity names from IDs
  const getAmenityNames = (amenityIds: string[]) => {
    return amenityIds.map((id) => {
      const amenity = availableAmenities.find((a) => a.value === id);
      return amenity ? amenity.label : id;
    });
  };

  // Helper function to format meal plan name
  const formatMealPlan = (mealPlan: string) => {
    switch (mealPlan) {
      case "none":
        return "None";
      case "breakfast":
        return "Breakfast Only";
      case "half_board":
        return "Half Board (Breakfast & Dinner)";
      case "full_board":
        return "Full Board (All Meals)";
      case "all_inclusive":
        return "All Inclusive (Meals & Drinks)";
      default:
        return mealPlan;
    }
  };

  // Helper function to format payment terms
  const formatPaymentTerms = (terms: string) => {
    switch (terms) {
      case "pay_at_property":
        return "Pay at Property";
      case "prepaid":
        return "Prepaid (Full Payment Required)";
      case "partial_deposit":
        return "Partial Deposit (50%)";
      default:
        return terms;
    }
  };

  // Helper function to format duration type
  const formatDurationType = (type: string) => {
    switch (type) {
      case "weekly":
        return "Weekly (7 nights)";
      case "monthly":
        return "Monthly (30 nights)";
      case "custom":
        return `Custom (${formData.customStayLength} nights)`;
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add validation summary at the top */}
      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <Card className="border-red-500" id="validation-errors">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              Missing Required Information
            </CardTitle>
            <CardDescription>
              Please fix the following issues before saving:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-red-500">
              {Object.entries(validationErrors).map(
                ([section, sectionErrors]) => (
                  <li key={section}>
                    <strong className="capitalize">{section}:</strong>
                    <ul className="ml-4 list-disc">
                      {sectionErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>General Details</CardTitle>
            <CardDescription>
              Basic information about the rate plan
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditSection("general")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm">
                {formData.name || "Not specified"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 text-sm">
                {formData.isActive ? (
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Description
              </dt>
              <dd className="mt-1 text-sm">
                {formData.description || "Not provided"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Applicable Rooms
              </dt>
              <dd className="mt-1 text-sm">
                {formData.applicableRooms.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {getRoomNames(formData.applicableRooms).map(
                      (name, index) => (
                        <Badge key={index} variant="outline">
                          {name}
                        </Badge>
                      )
                    )}
                  </div>
                ) : (
                  "None selected"
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Stay Length
              </dt>
              <dd className="mt-1 text-sm">
                {formData.minimumStay === formData.maximumStay
                  ? `Exactly ${formData.minimumStay} nights`
                  : `${formData.minimumStay} to ${
                      formData.maximumStay || "unlimited"
                    } nights`}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Pricing
              </dt>
              <dd className="mt-1 text-sm">
                ${formData.basePrice} per night
                {formData.discountPercentage && (
                  <span className="ml-2 text-green-600">
                    ({formData.discountPercentage}% discount)
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Duration & Date Rules</CardTitle>
            <CardDescription>
              Availability settings for this rate plan
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditSection("duration")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {formData.isDateSpecific ? (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Availability Type
                </dt>
                <dd className="mt-1 text-sm">Date-specific rate plan</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Date Ranges
                </dt>
                <dd className="mt-1 text-sm">
                  {formData.dateRanges.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {formData.dateRanges.map((range, index) => (
                        <span key={index}>
                          {format(range.from ?? new Date(), "MMM d, yyyy")} -{" "}
                          {format(range.to ?? new Date(), "MMM d, yyyy")}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "No date ranges specified"
                  )}
                </dd>
              </div>

              {formData.hasBlackoutDates && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Blackout Dates
                  </dt>
                  <dd className="mt-1 text-sm">
                    {formData.blackoutDates.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {formData.blackoutDates.map((range, index) => (
                          <span key={index}>
                            {format(range.from ?? new Date(), "MMM d, yyyy")} -{" "}
                            {format(range.to ?? new Date(), "MMM d, yyyy")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "No blackout dates specified"
                    )}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Availability Type
                </dt>
                <dd className="mt-1 text-sm">Duration-based rate plan</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Duration Type
                </dt>
                <dd className="mt-1 text-sm">
                  {formatDurationType(formData.durationType)}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Meals & Amenities</CardTitle>
            <CardDescription>Included services and amenities</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditSection("meals")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Meal Plan
              </dt>
              <dd className="mt-1 text-sm">
                {formatMealPlan(formData.mealPlan)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Amenities Included
              </dt>
              <dd className="mt-1 text-sm">
                {formData.amenitiesIncluded.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {getAmenityNames(formData.amenitiesIncluded).map(
                      (name, index) => (
                        <Badge key={index} variant="outline">
                          {name}
                        </Badge>
                      )
                    )}
                  </div>
                ) : (
                  "No amenities included"
                )}
              </dd>
            </div>

            {formData.customInclusions.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Custom Inclusions
                </dt>
                <dd className="mt-1 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {formData.customInclusions.map((inclusion, index) => (
                      <Badge key={index} variant="outline">
                        {inclusion}
                      </Badge>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Policies & Cancellation</CardTitle>
            <CardDescription>Cancellation and payment policies</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditSection("policies")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Refundable
              </dt>
              <dd className="mt-1 text-sm flex items-center">
                {formData.isRefundable ? (
                  <>
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    Yes
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-500 mr-1" />
                    No
                  </>
                )}
              </dd>
            </div>

            {formData.isRefundable && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Refund Window
                </dt>
                <dd className="mt-1 text-sm">
                  Free cancellation up to {formData.refundWindow} days before
                  check-in
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Payment Terms
              </dt>
              <dd className="mt-1 text-sm">
                {formatPaymentTerms(formData.paymentTerms)}
              </dd>
            </div>

            {formData.cancellationPolicy && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Cancellation Policy
                </dt>
                <dd className="mt-1 text-sm">{formData.cancellationPolicy}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
