/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralDetailsTab } from "@/components/rate-plans/GeneralDetailsTab";
import { DurationDateRulesTab } from "@/components/rate-plans/DurationDateRulesTab";
import { MealsAmenitiesTab } from "@/components/rate-plans/MealsAmenitiesTab";
import { PoliciesCancellationTab } from "@/components/rate-plans/PoliciesCancellationTab";
import { ReviewSaveTab } from "@/components/rate-plans/ReviewSaveTab";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useRatePlanForm } from "@/hooks/rate-plans/useRatePlanForm";
import { useRatePlanNavigation } from "@/hooks/rate-plans/useRatePlanNavigation";
import { roomService } from "@/services/rooms/room.service";
import type { Amenity, RoomListItem } from "@/types/room.types";
import { ratePlanService } from "@/services/rate-plan/rate-plan.service";
import { validateRatePlan } from "@/services/rate-plan/helpers";
import { mapRatePlanToFormData } from "@/types/rate-plan.types";

export default function EditRatePlanPage() {
  const router = useRouter();
  const params = useParams();
  const { formData, updateFormData, setFormData } = useRatePlanForm();
  const [availableRooms, setAvailableRooms] = useState<RoomListItem[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const ratePlanId = Number(params.ratePlanId);

  const validateTab = (tab: string): boolean => {
    switch (tab) {
      case "general":
        return (
          formData.name.trim() !== "" &&
          formData.minimumStay > 0 &&
          formData.basePrice.trim() !== ""
        );
      case "duration":
        return formData.isDateSpecific ? formData.dateRanges.length > 0 : true;
      case "meals":
      case "policies":
        return true;
      default:
        return true;
    }
  };

  const {
    activeTab,
    setActiveTab,
    isSubmitting,
    setIsSubmitting,
    nextTab,
    prevTab,
    getProgress,
  } = useRatePlanNavigation(validateTab);

  // Fetch rate plan data
  useEffect(() => {
    const fetchRatePlan = async () => {
      try {
        setLoading(true);
        const response = await ratePlanService.viewRatePlan(ratePlanId);
        if (response.success) {
          setFormData(mapRatePlanToFormData(response.data));
        } else {
          toast.error("Failed to load rate plan details");
          router.push("/admin/rate-plans");
        }
      } catch (error) {
        console.error("Error fetching rate plan:", error);
        toast.error("Failed to load rate plan details");
        router.push("/admin/rate-plans");
      } finally {
        setLoading(false);
      }
    };

    fetchRatePlan();
  }, [ratePlanId, router]);

  // Fetch rooms and amenities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsList, amenitiesList] = await Promise.all([
          roomService.getRoomList(),
          roomService.getAmenitiesList(),
        ]);
        setAvailableRooms(roomsList.data);
        setAvailableAmenities(amenitiesList.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch data. Please try again.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid } = validateRatePlan(formData);
    if (!isValid) {
      toast.error("Please fix the highlighted issues before saving", {
        action: {
          label: "Show Issues",
          onClick: () => {
            setActiveTab("review");
            setTimeout(() => {
              document.getElementById("validation-errors")?.scrollIntoView({
                behavior: "smooth",
              });
            }, 100);
          },
        },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Updating rate plan:", formData);
      const response = await ratePlanService.updateRatePlan(
        ratePlanId,
        formData
      );
      if (response.success) {
        toast.success("Rate plan updated successfully!");
        router.push(`/admin/rate-plans/${ratePlanId}`);
      } else {
        toast.error("Failed to update rate plan. Please try again.");
      }
    } catch (error) {
      console.error("Error updating rate plan:", error);
      toast.error("Failed to update rate plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/rate-plans/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rate Plan Details
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-muted-foreground">
                Loading rate plan data...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/rate-plans/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rate Plan Details
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Edit Rate Plan: {formData.name}
        </h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <span>Progress</span>
          <span>{Math.round(getProgress())}%</span>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rate Plan Information</CardTitle>
            <CardDescription>
              Update your rate plan details. Fields marked with * are required.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">General Details</TabsTrigger>
                <TabsTrigger value="duration">Duration & Dates</TabsTrigger>
                <TabsTrigger value="meals">Meals & Amenities</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="review">Review & Save</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                <GeneralDetailsTab
                  formData={formData}
                  updateFormData={updateFormData}
                  availableRooms={availableRooms}
                />
              </TabsContent>

              <TabsContent value="duration" className="space-y-4 pt-4">
                <DurationDateRulesTab
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </TabsContent>

              <TabsContent value="meals" className="space-y-4 pt-4">
                <MealsAmenitiesTab
                  formData={formData}
                  updateFormData={updateFormData}
                  availableAmenities={availableAmenities}
                />
              </TabsContent>

              <TabsContent value="policies" className="space-y-4 pt-4">
                <PoliciesCancellationTab
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </TabsContent>

              <TabsContent value="review" className="space-y-4 pt-4">
                <ReviewSaveTab
                  formData={formData}
                  availableRooms={availableRooms}
                  availableAmenities={availableAmenities}
                  onEditSection={setActiveTab}
                  validationErrors={validateRatePlan(formData).errors}
                />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevTab}
              disabled={activeTab === "general"}
            >
              Previous
            </Button>

            {activeTab === "review" ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-pulse -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Update Rate Plan
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  nextTab();
                }}
              >
                Next
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
