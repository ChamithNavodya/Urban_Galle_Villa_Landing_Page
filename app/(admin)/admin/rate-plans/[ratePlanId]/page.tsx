/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Edit, Tag, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ratePlanService } from "@/services/rate-plan/rate-plan.service";
import { RatePlan } from "@/types/rate-plan.types";
import {
  RatePlanStatus,
  RatePlanTypes,
  StayDurationType,
} from "@/enums/rate-plan.enums";

export default function RatePlanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [ratePlan, setRatePlan] = useState<RatePlan>();
  const [loading, setLoading] = useState(true);
  const ratePlanId = Number(params.ratePlanId);
  const [statusChangeLoading, setstatusChangeLoading] =
    useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle room status change
  const handleStatusChange = async (plan: RatePlan) => {
    setstatusChangeLoading(true);
    try {
      const newStatus =
        plan.ratePlanStatus === RatePlanStatus.INACTIVE
          ? RatePlanStatus.ACTIVE
          : RatePlanStatus.INACTIVE;
      const response = await ratePlanService.changeRatePlanStatus(
        plan.ratePlanId,
        newStatus
      );
      if (response.success) {
        toast.success("Rate plan status changed successfully");
        fetchRatePlan();
      } else {
        console.log("response: ", response);
        toast.error("Failed to change rate plan status");
      }
    } catch (error) {
      console.error("Error changing status: ", error);
      toast.error("Error changing status");
    } finally {
      setstatusChangeLoading(false);
    }
  };

  // Handle room delete
  const handleDelete = async (plan: RatePlan) => {
    setDeleteLoading(true);
    try {
      const response = await ratePlanService.deleteRatePlan(plan.ratePlanId);
      if (response.success) {
        fetchRatePlan();
        toast.success("Rate plan deleted successfully");
        router.push("/admin/rate-plans");
      } else {
        console.log("response: ", response);
        toast.error("Failed to delete rate plan");
      }
    } catch (error) {
      console.error("Error delete rate plan: ", error);
      toast.error("Error deleting rate plan");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Format meal plan for display
  const formatMealPlan = (mealPlan: string) => {
    switch (mealPlan) {
      case "none":
        return "No Meals";
      case "breakfast":
        return "Breakfast";
      case "half_board":
        return "Half Board";
      case "full_board":
        return "Full Board";
      case "all_inclusive":
        return "All Inclusive";
      default:
        return mealPlan;
    }
  };

  const fetchRatePlan = async () => {
    try {
      setLoading(true);
      const response = await ratePlanService.viewRatePlan(ratePlanId);

      if (response.success) {
        if (response.data.isActive === false) {
          console.log("Rate plan has deleted");
          router.push("/admin/rate-plans");
        }
        setRatePlan(response.data);
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

  useEffect(() => {
    fetchRatePlan();
  }, [ratePlanId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/rate-plans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rate Plans
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-muted-foreground">
                Loading rate plan details...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ratePlan) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/rate-plans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rate Plans
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <div className="text-muted-foreground">Rate plan not found</div>
              <Button asChild>
                <Link href="/admin/rate-plans">Return to Rate Plans</Link>
              </Button>
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
          <Link href="/admin/rate-plans">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rate Plans
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{ratePlan.name}</h2>
        <Button asChild>
          <Link href={`/admin/rate-plans/${ratePlanId}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit Rate Plan
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Rate Plan Details</CardTitle>
            <CardDescription>
              Complete information about this rate plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                General Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {statusChangeLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-ping rounded-full bg-gray-400" />
                        <span className="text-sm">Updating...</span>
                      </div>
                    ) : ratePlan.ratePlanStatus === RatePlanStatus.ACTIVE ? (
                      <Badge className="bg-green-500">
                        {RatePlanStatus.ACTIVE}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {RatePlanStatus.INACTIVE}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Badge variant="outline" className="capitalize">
                      {ratePlan.ratePlanType === RatePlanTypes.DateSpecific ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Date Specific</span>
                        </div>
                      ) : ratePlan.ratePlanType ===
                        RatePlanTypes.DurationBased ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{RatePlanTypes.DurationBased}</span>
                          </div>
                        </>
                      ) : (
                        <span>Standard</span>
                      )}
                    </Badge>
                    {ratePlan.ratePlanType === RatePlanTypes.DurationBased && (
                      <Badge variant="outline" className="capitalize">
                        {ratePlan.durationType === StayDurationType.WEEKLY && (
                          <div className="flex items-center gap-1">
                            <span>Weekly</span>
                          </div>
                        )}
                        {ratePlan.durationType === StayDurationType.MONTHLY && (
                          <div className="flex items-center gap-1">
                            <span>Monthly</span>
                          </div>
                        )}
                        {ratePlan.durationType === StayDurationType.CUSTOM && (
                          <div className="flex items-center gap-1">
                            <span>{ratePlan.customStayLength} Days</span>
                          </div>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="font-medium">${ratePlan.basePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="font-medium">
                    {ratePlan.discountPercentage > 0 ? (
                      <Badge className="bg-green-500">
                        {ratePlan.discountPercentage}% OFF
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-1">Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Stay</p>
                  <p className="font-medium">{ratePlan.minimumStay} night(s)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Maximum Stay</p>
                  <p className="font-medium">
                    {ratePlan.maximumStay
                      ? `${ratePlan.maximumStay} night(s)`
                      : "-"}
                  </p>
                </div>
              </div>
              {ratePlan.ratePlanType === RatePlanTypes.DateSpecific && (
                <div className="grid grid-cols-2 gap-4 mt-3.5">
                  <div>
                    <p className="text-sm text-muted-foreground">Date Ranges</p>
                    {ratePlan.dateRanges &&
                      ratePlan.dateRanges.map((range, index) => (
                        <p className="font-medium" key={index}>
                          {new Date(range.from).toLocaleDateString()} -{" "}
                          {new Date(range.to).toLocaleDateString()}
                        </p>
                      ))}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Blackout Date Ranges
                    </p>
                    {ratePlan.blackoutDates && ratePlan.blackoutDates.length ? (
                      ratePlan.blackoutDates.map((range, index) => (
                        <p className="font-medium" key={index}>
                          {new Date(range.from).toLocaleDateString()} -{" "}
                          {new Date(range.to).toLocaleDateString()}
                        </p>
                      ))
                    ) : (
                      <span> - </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Applicable Rooms</h3>
              <div className="flex flex-wrap gap-2">
                {ratePlan?.applicableRooms &&
                  ratePlan.applicableRooms.length &&
                  ratePlan.applicableRooms.map((room, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Bed className="h-3 w-3" />
                      {room.name}
                    </Badge>
                  ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Meals & Policies</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Meal Plan</p>
                  <p className="font-medium">
                    {formatMealPlan(ratePlan.mealPlan)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Refundable</p>
                  <p className="font-medium">
                    {ratePlan.isRefundable ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {ratePlan.description && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-sm font-extralight">
                    {ratePlan.description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Created on {new Date(ratePlan.createdAt).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full cursor-pointer" asChild>
              <Link href={`/admin/rate-plans/${ratePlanId}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Rate Plan
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleStatusChange(ratePlan);
              }}
            >
              {ratePlan.ratePlanStatus === RatePlanStatus.ACTIVE
                ? "Deactivate"
                : "Activate"}{" "}
              Rate Plan
            </Button>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={() => {
                setDeleteDialogOpen(true);
              }}
            >
              Delete Rate Plan
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              rate plan &quot;{ratePlan.name}&quot; and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(ratePlan)}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
