"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { RatePlanFormData } from "@/types/rate-plan.types";
import { PaymentMethod } from "@/enums/rate-plan.enums";

interface PoliciesCancellationTabProps {
  formData: RatePlanFormData;
  updateFormData: (updates: Partial<RatePlanFormData>) => void;
}

export function PoliciesCancellationTab({
  formData,
  updateFormData,
}: PoliciesCancellationTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="isRefundable">Refundable</Label>
          <p className="text-sm text-muted-foreground">
            Allow guests to cancel and receive a refund
          </p>
        </div>
        <Switch
          id="isRefundable"
          checked={formData.isRefundable}
          onCheckedChange={(checked) =>
            updateFormData({ isRefundable: checked })
          }
        />
      </div>

      {formData.isRefundable && (
        <div className="space-y-2">
          <Label htmlFor="refundWindow">
            Refund Window (days before check-in)
          </Label>
          <div className="flex items-center">
            <Input
              id="refundWindow"
              type="number"
              min="0"
              value={formData.refundWindow}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  updateFormData({ refundWindow: value });
                }
              }}
              className="w-full"
            />
            <span className="ml-2 text-sm text-muted-foreground">days</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Free cancellation up to {formData.refundWindow} days before check-in
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
        <Textarea
          id="cancellationPolicy"
          value={formData.cancellationPolicy}
          onChange={(e) =>
            updateFormData({ cancellationPolicy: e.target.value })
          }
          placeholder="Describe your cancellation policy in detail..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Select
          value={formData.paymentTerms}
          onValueChange={(value: PaymentMethod) =>
            updateFormData({ paymentTerms: value })
          }
        >
          <SelectTrigger id="paymentTerms">
            <SelectValue placeholder="Select payment terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pay_at_property">Pay at Property</SelectItem>
            <SelectItem value="prepaid">
              Prepaid (Full Payment Required)
            </SelectItem>
            <SelectItem value="partial_deposit">
              Partial Deposit (50%)
            </SelectItem>
          </SelectContent>
        </Select>

        <p className="text-sm text-muted-foreground mt-1">
          {formData.paymentTerms === "pay_at_property" &&
            "Guests will pay the full amount at the property during check-in."}
          {formData.paymentTerms === "prepaid" &&
            "Guests must pay the full amount at the time of booking."}
          {formData.paymentTerms === "partial_deposit" &&
            "Guests must pay 50% at the time of booking and the remaining balance at check-in."}
        </p>
      </div>
    </div>
  );
}
