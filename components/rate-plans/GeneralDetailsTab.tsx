"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatePlanFormData } from "@/types/rate-plan.types";
import { RoomListItem } from "@/types/room.types";
import { RatePlanStatus } from "@/enums/rate-plan.enums";

interface GeneralDetailsTabProps {
  formData: RatePlanFormData;
  updateFormData: (updates: Partial<RatePlanFormData>) => void;
  availableRooms: RoomListItem[];
}

export function GeneralDetailsTab({
  formData,
  updateFormData,
  availableRooms,
}: GeneralDetailsTabProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value;
    if (value === "") {
      updateFormData({ [fieldName]: undefined });
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        updateFormData({ [fieldName]: numValue });
      }
    }
  };

  const toggleRoom = (roomId: number) => {
    const isSelected = formData.applicableRooms.includes(roomId);
    let updatedRooms: number[];

    if (isSelected) {
      updatedRooms = formData.applicableRooms.filter((id) => id !== roomId);
    } else {
      updatedRooms = [...formData.applicableRooms, roomId];
    }

    updateFormData({ applicableRooms: updatedRooms });
  };

  const selectAllRooms = () => {
    updateFormData({
      applicableRooms: availableRooms.map((room) => room.roomId),
    });
  };

  const clearAllRooms = () => {
    updateFormData({ applicableRooms: [] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Rate Plan Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. Summer Special, Weekend Getaway"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe this rate plan and any special conditions"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>
          Applicable Rooms <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {formData.applicableRooms.length > 0
                ? `${formData.applicableRooms.length} room${
                    formData.applicableRooms.length > 1 ? "s" : ""
                  } selected`
                : "Select rooms"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search rooms..." />
              <CommandList>
                <CommandEmpty>No rooms found.</CommandEmpty>
                <CommandGroup>
                  {availableRooms.map((room) => (
                    <CommandItem
                      key={room.roomId}
                      value={room.name}
                      onSelect={() => toggleRoom(room.roomId)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.applicableRooms.includes(room.roomId)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {room.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={selectAllRooms}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.applicableRooms.length ===
                          availableRooms.length
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Select All
                  </CommandItem>
                  <CommandItem onSelect={clearAllRooms}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Selection
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {formData.applicableRooms.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.applicableRooms.map((roomId) => {
              const room = availableRooms.find((r) => r.roomId === roomId);
              return (
                <Badge
                  key={roomId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {room?.name}
                  <button type="button" onClick={() => toggleRoom(roomId)}>
                    <X className="h-3 w-3 cursor-pointer" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="status">Visibility</Label>
          <p className="text-sm text-muted-foreground">
            Make this rate plan visible to guests
          </p>
        </div>
        <Switch
          id="status"
          checked={true}
          onCheckedChange={(checked) =>
            updateFormData({
              ratePlanStatus: RatePlanStatus[checked ? "ACTIVE" : "INACTIVE"],
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="minimumStay">
            Minimum Stay <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center">
            <Input
              id="minimumStay"
              type="number"
              min="1"
              value={formData.minimumStay ?? ""}
              onChange={(e) => handleNumberInputChange(e, "minimumStay")}
              className="w-full"
              required
            />
            <span className="ml-2 text-sm text-muted-foreground">nights</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maximumStay">Maximum Stay</Label>
          <div className="flex items-center">
            <Input
              id="maximumStay"
              type="number"
              min={formData.minimumStay || 1}
              value={formData.maximumStay || ""}
              onChange={(e) => handleNumberInputChange(e, "maximumStay")}
              className="w-full"
              placeholder="No maximum"
            />
            <span className="ml-2 text-sm text-muted-foreground">nights</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="basePrice">
            Base Price Per Night <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              $
            </span>
            <Input
              id="basePrice"
              name="basePrice"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              value={formData.basePrice}
              onChange={handleInputChange}
              className="pl-7"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Discount Percentage</Label>
          <div className="relative">
            <Input
              id="discountPercentage"
              name="discountPercentage"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              className="pr-7"
              placeholder="0"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
