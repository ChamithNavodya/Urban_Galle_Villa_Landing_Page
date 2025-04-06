"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import { RoomDropdownData, RoomFormData } from "../../types/room.types";

interface BasicInfoTabProps {
  formData: RoomFormData;
  dropdownData: RoomDropdownData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function BasicInfoTab({
  formData,
  dropdownData,
  onInputChange,
  onSelectChange,
}: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Room Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="e.g. Deluxe King Room"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">
            Room Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => onSelectChange("type", value)}
            required
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.roomTypes &&
                dropdownData.roomTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="bedType">
            Bed Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.bedType}
            onValueChange={(value) => onSelectChange("bedType", value)}
            required
          >
            <SelectTrigger id="bedType">
              <SelectValue placeholder="Select bed type" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.bedTypes &&
                dropdownData.bedTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="numBeds">
            Number of Beds <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.numBeds}
            onValueChange={(value) => onSelectChange("numBeds", value)}
            required
          >
            <SelectTrigger id="numBeds">
              <SelectValue placeholder="Select number of beds" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxGuests">
            Maximum Guests <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <Select
              value={formData.maxGuests}
              onValueChange={(value) => onSelectChange("maxGuests", value)}
              required
            >
              <SelectTrigger id="maxGuests">
                <SelectValue placeholder="Select max guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
