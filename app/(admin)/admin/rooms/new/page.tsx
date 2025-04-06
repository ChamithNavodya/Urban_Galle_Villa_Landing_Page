// app/(admin)/admin/rooms/new/page.tsx
"use client";
import { useRouter } from "next/navigation";
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
import { useRoomForm } from "@/hooks/useRoomForm";
import { BasicInfoTab } from "@/components/rooms/BasicInfoTab";
import { DetailsTab } from "@/components/rooms/DetailsTab";
import { OccupancyTab } from "@/components/rooms/OccupancyTab";
import { AmenitiesTab } from "@/components/rooms/AmenitiesTab";
import { PricingTab } from "@/components/rooms/PricingTab";
import { roomService } from "@/services/rooms/room.service";

export default function NewRoomPage() {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    loading,
    isSubmitting,
    setisSubmitting,
    formData,
    tabsEnabled,
    dropdownData,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleAmenityChange,
    handleImagesChange,
    nextTab,
    prevTab,
    isLastTab,
    isFirstTab,
    validateTab,
    handleCheckboxChange,
    handleBathroomChange,
    handleNumBathroomsChange,
  } = useRoomForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      setisSubmitting(true);
      const response = await roomService.addNewRoom(formData);
      console.log(response);
    } catch (error) {
      console.error("Error creating room: ", error);
    } finally {
      setisSubmitting(false);
    }
    router.push("/admin/rooms");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/rooms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add New Room</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
            <CardDescription>
              Enter the details for the new room. All fields marked with * are
              required.
            </CardDescription>
          </CardHeader>
          {!loading && (
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
          )}
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
              <Button type="submit" disabled={!validateTab("pricing")}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Creating..." : "Create Rooms"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextTab}
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
