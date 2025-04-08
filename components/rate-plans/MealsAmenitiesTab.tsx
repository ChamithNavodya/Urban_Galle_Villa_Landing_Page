"use client";

import type React from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { RatePlanFormData } from "@/types/rate-plan.types";
import { MealPlanType } from "@/enums/rate-plan.enums";
import { Amenity } from "@/types/room.types";

interface MealsAmenitiesTabProps {
  formData: RatePlanFormData;
  updateFormData: (updates: Partial<RatePlanFormData>) => void;
  availableAmenities: Amenity[];
}

export function MealsAmenitiesTab({
  formData,
  updateFormData,
  availableAmenities,
}: MealsAmenitiesTabProps) {
  const [newInclusion, setNewInclusion] = useState("");

  const toggleAmenity = (amenityId: string) => {
    const isSelected = formData.amenitiesIncluded.includes(amenityId);
    let updatedAmenities: string[];

    if (isSelected) {
      updatedAmenities = formData.amenitiesIncluded.filter(
        (id) => id !== amenityId
      );
    } else {
      updatedAmenities = [...formData.amenitiesIncluded, amenityId];
    }

    updateFormData({ amenitiesIncluded: updatedAmenities });
  };

  const selectAllAmenities = () => {
    updateFormData({
      amenitiesIncluded: availableAmenities.map((amenity) => amenity.value),
    });
  };

  const clearAllAmenities = () => {
    updateFormData({ amenitiesIncluded: [] });
  };

  const addCustomInclusion = () => {
    if (
      newInclusion.trim() !== "" &&
      !formData.customInclusions.includes(newInclusion.trim())
    ) {
      updateFormData({
        customInclusions: [...formData.customInclusions, newInclusion.trim()],
      });
      setNewInclusion("");
    }
  };

  const removeCustomInclusion = (inclusion: string) => {
    updateFormData({
      customInclusions: formData.customInclusions.filter(
        (item) => item !== inclusion
      ),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomInclusion();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mealPlan">Meal Plan</Label>
        <Select
          value={formData.mealPlan}
          onValueChange={(value: MealPlanType) =>
            updateFormData({ mealPlan: value })
          }
        >
          <SelectTrigger id="mealPlan">
            <SelectValue placeholder="Select meal plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="breakfast">Breakfast Only</SelectItem>
            <SelectItem value="half_board">
              Half Board (Breakfast & Dinner)
            </SelectItem>
            <SelectItem value="full_board">Full Board (All Meals)</SelectItem>
            <SelectItem value="all_inclusive">
              All Inclusive (Meals & Drinks)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Amenities Included</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {formData.amenitiesIncluded.length > 0
                ? `${formData.amenitiesIncluded.length} ${
                    formData.amenitiesIncluded.length === 1
                      ? "amenity"
                      : "amenities"
                  } selected`
                : "Select amenities"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search amenities..." />
              <CommandList>
                <CommandEmpty>No amenities found.</CommandEmpty>
                <CommandGroup>
                  {availableAmenities.map((amenity) => (
                    <CommandItem
                      key={amenity.id}
                      value={amenity.label}
                      onSelect={() => toggleAmenity(amenity.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.amenitiesIncluded.includes(amenity.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {amenity.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={selectAllAmenities}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.amenitiesIncluded.length ===
                          availableAmenities.length
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Select All
                  </CommandItem>
                  <CommandItem onSelect={clearAllAmenities}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Selection
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {formData.amenitiesIncluded.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.amenitiesIncluded.map((amenityId) => {
              const amenity = availableAmenities.find(
                (a) => a.value === amenityId
              );
              return (
                <Badge
                  key={amenityId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {amenity?.label}
                  <button
                    type="button"
                    onClick={() => toggleAmenity(amenityId)}
                  >
                    <X className="h-3 w-3 cursor-pointer" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customInclusions">Custom Inclusions</Label>
        <div className="flex gap-2">
          <Input
            id="customInclusions"
            value={newInclusion}
            onChange={(e) => setNewInclusion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add custom inclusions (e.g., Welcome Drink)"
            className="flex-1"
          />
          <Button
            onClick={addCustomInclusion}
            disabled={newInclusion.trim() === ""}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {formData.customInclusions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.customInclusions.map((inclusion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="flex items-center gap-1"
              >
                {inclusion}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeCustomInclusion(inclusion)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
