"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RoomFormData } from "../../types/room.types";

interface PricingTabProps {
  formData: RoomFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export function PricingTab({
  formData,
  onInputChange,
  onSwitchChange,
}: PricingTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              type="number"
              min="0"
              step="0.01"
              value={formData.basePrice}
              onChange={onInputChange}
              placeholder="e.g. 199.99"
              className="pl-7"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="refundable">Refundable</Label>
            <p className="text-sm text-muted-foreground">
              Allow guests to cancel and receive a refund
            </p>
          </div>
          <Switch
            id="refundable"
            checked={formData.refundable}
            onCheckedChange={(checked) => onSwitchChange("refundable", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="prepayment">Prepayment Required</Label>
            <p className="text-sm text-muted-foreground">
              Require guests to pay in advance
            </p>
          </div>
          <Switch
            id="prepayment"
            checked={formData.prepayment}
            onCheckedChange={(checked) => onSwitchChange("prepayment", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="breakfast">Breakfast Included</Label>
            <p className="text-sm text-muted-foreground">
              Include breakfast in the room rate
            </p>
          </div>
          <Switch
            id="breakfast"
            checked={formData.breakfast}
            onCheckedChange={(checked) => onSwitchChange("breakfast", checked)}
          />
        </div>
      </div>
    </div>
  );
}
