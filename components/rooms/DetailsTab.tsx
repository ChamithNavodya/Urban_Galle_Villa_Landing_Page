"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bed, SquareIcon as SquareFeet } from "lucide-react";
import { RoomFormData } from "../../types/room.types";

interface DetailsTabProps {
  formData: RoomFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onNumBathroomsChange: (value: string) => void;
  onBathroomChange: (index: number, field: string, value: boolean) => void;
}

export function DetailsTab({
  formData,
  onInputChange,
  onSelectChange,
  onNumBathroomsChange,
  onBathroomChange,
}: DetailsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="size">
            Room Size (m²) <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center">
            <SquareFeet className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id="size"
              name="size"
              type="number"
              min="1"
              value={formData.size}
              onChange={onInputChange}
              placeholder="e.g. 32"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="available">
            Number of Rooms Available{" "}
            <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center">
            <Bed className="mr-2 h-4 w-4 text-muted-foreground" />
            <Select
              value={formData.available}
              onValueChange={(value) => onSelectChange("available", value)}
              required
            >
              <SelectTrigger id="available">
                <SelectValue placeholder="Select number of rooms" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">
          Room Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Describe the room, its features, and what makes it special..."
          className="min-h-32"
          required
        />
      </div>
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-medium">Bathroom options</h3>
        <div className="space-y-2">
          <Label htmlFor="numBathrooms">Number of bathrooms</Label>
          <Select
            value={formData.numBathrooms}
            onValueChange={onNumBathroomsChange}
          >
            <SelectTrigger id="numBathrooms" className="w-full md:w-40">
              <SelectValue placeholder="Select number" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.bathrooms.map((bathroom, index) => (
          <div key={index} className="p-4 bg-muted/40 rounded-md space-y-4">
            <h4 className="font-medium">Bathroom {index + 1}</h4>

            <div className="space-y-2">
              <p className="text-sm">
                Is the bathroom private? (not shared with host or other guests)
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`private-yes-${index}`}
                    name={`private-${index}`}
                    checked={bathroom.isPrivate}
                    onChange={() => onBathroomChange(index, "isPrivate", true)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor={`private-yes-${index}`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`private-no-${index}`}
                    name={`private-${index}`}
                    checked={!bathroom.isPrivate}
                    onChange={() => onBathroomChange(index, "isPrivate", false)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor={`private-no-${index}`}>No</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm">Is the bathroom inside the room?</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`inroom-yes-${index}`}
                    name={`inroom-${index}`}
                    checked={bathroom.isInRoom}
                    onChange={() => onBathroomChange(index, "isInRoom", true)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor={`inroom-yes-${index}`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`inroom-no-${index}`}
                    name={`inroom-${index}`}
                    checked={!bathroom.isInRoom}
                    onChange={() => onBathroomChange(index, "isInRoom", false)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor={`inroom-no-${index}`}>No</Label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
