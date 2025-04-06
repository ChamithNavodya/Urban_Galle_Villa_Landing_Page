/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import type React from "react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
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
import { ImageUpload } from "@/components/rooms/ImageUpload";
import { BasicInfoTab } from "@/components/rooms/BasicInfoTab";
import { DetailsTab } from "@/components/rooms/DetailsTab";
import { OccupancyTab } from "@/components/rooms/OccupancyTab";
import { AmenitiesTab } from "@/components/rooms/AmenitiesTab";
import { PricingTab } from "@/components/rooms/PricingTab";
import type { RoomFormData } from "@/types/room.types";
import { RoomStatus } from "@/enums/room.enums";
import { toast } from "sonner";
import { useRoomForm } from "@/hooks/useRoomForm";
import { roomService } from "@/services/rooms/room.service";

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    type: "",
    bedType: "",
    numBeds: "1",
    size: "",
    maxGuests: "2",
    available: "1",
    basePrice: "",
    description: "",
    refundable: true,
    prepayment: false,
    breakfast: false,
    selectedAmenities: [],
    images: [],
    totalOccupancy: "2",
    limitAdults: false,
    maxAdults: "2",
    limitChildren: false,
    maxChildren: "0",
    numBathrooms: "1",
    bathrooms: [{ isPrivate: true, isInRoom: true }],
    roomStatus: RoomStatus.ACTIVE,
  });
  const { dropdownData } = useRoomForm();

  const tabsEnabled = {
    basic: true,
    details: true,
    occupancy: true,
    amenities: true,
    images: true,
    pricing: true,
  };

  // Fetch room data and dropdown data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: roomData } = await roomService.viewRoom(roomId);

        // Update form data with fetched room data
        setFormData({
          name: roomData.name || "",
          type: roomData.type || "",
          bedType: roomData.bedType || "",
          numBeds: roomData.numBeds?.toString() || "1",
          size: roomData.size?.toString() || "",
          maxGuests: roomData.maxGuests?.toString() || "2",
          available: roomData.available?.toString() || "1",
          basePrice: roomData.basePrice?.toString() || "",
          description: roomData.description || "",
          refundable: roomData.refundable || false,
          prepayment: roomData.prepayment || false,
          breakfast: roomData.breakfast || false,
          selectedAmenities: roomData.selectedAmenities || [],
          images: roomData.images || [],
          totalOccupancy: roomData.totalOccupancy?.toString() || "2",
          limitAdults: roomData.limitAdults || false,
          maxAdults: roomData.maxAdults?.toString() || "2",
          limitChildren: roomData.limitChildren || false,
          maxChildren: roomData.maxChildren?.toString() || "0",
          numBathrooms: roomData.numBathrooms?.toString() || "1",
          bathrooms: roomData.bathrooms || [
            { isPrivate: true, isInRoom: true },
          ],
          roomStatus: RoomStatus.ACTIVE || "active",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load room data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId, toast]);

  const validateTab = (tab: string) => {
    switch (tab) {
      case "basic":
        return (
          formData.name.trim() !== "" &&
          formData.type !== "" &&
          formData.bedType !== "" &&
          formData.numBeds !== "" &&
          formData.maxGuests !== ""
        );
      case "details":
        return (
          formData.size !== "" &&
          formData.available !== "" &&
          formData.description.trim() !== "" &&
          formData.numBathrooms !== ""
        );
      case "occupancy":
        return formData.totalOccupancy !== "";
      case "amenities":
        return true;
      case "images":
        // In a real app, you might want to enforce a minimum number of images
        return true;
      case "pricing":
        return formData.basePrice !== "";
      default:
        return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: checked
        ? [...prev.selectedAmenities, amenityId]
        : prev.selectedAmenities.filter((id) => id !== amenityId),
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleBathroomChange = (
    index: number,
    field: string,
    value: boolean
  ) => {
    setFormData((prev) => {
      const updatedBathrooms = [...prev.bathrooms];
      updatedBathrooms[index] = { ...updatedBathrooms[index], [field]: value };
      return { ...prev, bathrooms: updatedBathrooms };
    });
  };

  const handleNumBathroomsChange = (value: string) => {
    const numBathrooms = Number.parseInt(value);
    setFormData((prev) => {
      let bathrooms = [...prev.bathrooms];
      while (bathrooms.length < numBathrooms) {
        bathrooms.push({ isPrivate: true, isInRoom: true });
      }
      if (bathrooms.length > numBathrooms) {
        bathrooms = bathrooms.slice(0, numBathrooms);
      }
      return { ...prev, numBathrooms: value, bathrooms };
    });
  };

  const nextTab = () => {
    if (!validateTab(activeTab)) return;
    console.log("Active tab: ", activeTab);
    switch (activeTab) {
      case "basic":
        setActiveTab("details");
        break;
      case "details":
        setActiveTab("occupancy");
        break;
      case "occupancy":
        setActiveTab("amenities");
        break;
      case "amenities":
        setActiveTab("images");
        break;
      case "images":
        setActiveTab("pricing");
        break;
    }
  };

  const prevTab = () => {
    switch (activeTab) {
      case "details":
        setActiveTab("basic");
        break;
      case "occupancy":
        setActiveTab("details");
        break;
      case "amenities":
        setActiveTab("occupancy");
        break;
      case "images":
        setActiveTab("amenities");
        break;
      case "pricing":
        setActiveTab("images");
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTab("pricing")) {
      toast.warning("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    const submitForm = async () => {
      try {
        console.log("Updating room:", formData, roomId);
        const response = await roomService.updateRoom(roomId, formData);
        if (response.success) {
          toast.success("Room updated successfully!");
        } else {
          let toastMessage = "Failed to update room. Please try again";
          console.log(response.error?.errors);

          if (response?.error?.errors && response?.error?.errors.length > 0) {
            toastMessage = response?.error?.errors[0];
          }
          toast.error(toastMessage);
        }
        // Navigate back to room view page
        router.push(`/admin/rooms/${roomId}`);
      } catch (error) {
        console.error("Error updating room:", error);
        toast.error("Failed to update room. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };
    submitForm();
  };

  const isLastTab = activeTab === "pricing";
  const isFirstTab = activeTab === "basic";

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/rooms/${roomId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Room
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading room data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/rooms/${roomId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Room
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Room</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
            <CardDescription>
              Update the details for this room. All fields marked with * are
              required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(tab) => {
                if (tabsEnabled[tab as keyof typeof tabsEnabled]) {
                  setActiveTab(tab);
                }
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic" disabled={!tabsEnabled.basic}>
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="details" disabled={!tabsEnabled.details}>
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="occupancy"
                  disabled={!tabsEnabled.occupancy}
                >
                  Occupancy
                </TabsTrigger>
                <TabsTrigger
                  value="amenities"
                  disabled={!tabsEnabled.amenities}
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger value="images" disabled={!tabsEnabled.images}>
                  Images
                </TabsTrigger>
                <TabsTrigger value="pricing" disabled={!tabsEnabled.pricing}>
                  Pricing & Policies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <BasicInfoTab
                  formData={formData}
                  dropdownData={dropdownData}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <DetailsTab
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onNumBathroomsChange={handleNumBathroomsChange}
                  onBathroomChange={handleBathroomChange}
                />
              </TabsContent>

              <TabsContent value="occupancy" className="space-y-4 pt-4">
                <OccupancyTab
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onCheckboxChange={handleCheckboxChange}
                />
              </TabsContent>

              <TabsContent value="amenities" className="space-y-4 pt-4">
                <AmenitiesTab
                  formData={formData}
                  dropdownData={dropdownData}
                  onAmenityChange={handleAmenityChange}
                />
              </TabsContent>

              <TabsContent value="images" className="space-y-4 pt-4">
                <ImageUpload
                  images={formData.images}
                  onChange={handleImagesChange}
                />
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 pt-4">
                <PricingTab
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSwitchChange={handleSwitchChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevTab}
              disabled={isFirstTab}
            >
              Previous
            </Button>
            {isLastTab ? (
              <Button
                type="submit"
                disabled={isSubmitting || !validateTab("pricing")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Update Room
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
                disabled={!validateTab(activeTab)}
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
