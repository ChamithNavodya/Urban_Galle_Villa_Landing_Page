// components/rooms/AmenitiesTab.tsx
"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RoomDropdownData, RoomFormData } from "../../types/room.types";

interface AmenitiesTabProps {
  formData: RoomFormData;
  dropdownData: RoomDropdownData;
  onAmenityChange: (amenityId: string, checked: boolean) => void;
}

export function AmenitiesTab({
  formData,
  dropdownData,
  onAmenityChange,
}: AmenitiesTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {dropdownData.amenities &&
          dropdownData.amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={amenity.value}
                checked={formData.selectedAmenities.includes(amenity.value)}
                onCheckedChange={(checked) =>
                  onAmenityChange(amenity.value, checked as boolean)
                }
              />
              <Label htmlFor={amenity.value} className="cursor-pointer">
                {amenity.label}
              </Label>
            </div>
          ))}
      </div>
    </div>
  );
}
