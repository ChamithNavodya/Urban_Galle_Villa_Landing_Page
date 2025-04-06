// components/rooms/OccupancyTab.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RoomFormData } from "../../types/room.types";

interface OccupancyTabProps {
  formData: RoomFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

export function OccupancyTab({
  formData,
  onInputChange,
  onSelectChange,
  onCheckboxChange,
}: OccupancyTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Total occupancy</h3>
        <p className="text-sm text-muted-foreground mb-2">
          What is the total number of guests (adults and children) that can stay
          here?
        </p>
        <div className="flex items-center space-x-2">
          <Label htmlFor="totalOccupancy" className="mr-2">
            Maximum guests
          </Label>
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => {
                const current = Number.parseInt(formData.totalOccupancy);
                if (current > 1) {
                  onSelectChange("totalOccupancy", (current - 1).toString());
                }
              }}
            >
              -
            </Button>
            <Input
              id="totalOccupancy"
              className="h-8 w-12 rounded-none text-center"
              value={formData.totalOccupancy}
              onChange={onInputChange}
              name="totalOccupancy"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => {
                const current = Number.parseInt(formData.totalOccupancy);
                onSelectChange("totalOccupancy", (current + 1).toString());
              }}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="limitAdults"
            checked={formData.limitAdults}
            onCheckedChange={(checked) =>
              onCheckboxChange("limitAdults", checked as boolean)
            }
          />
          <Label htmlFor="limitAdults">
            Do you want to limit how many adults can stay here?
          </Label>
        </div>

        {formData.limitAdults && (
          <div className="flex items-center space-x-2 ml-6 mt-2">
            <Label htmlFor="maxAdults" className="mr-2">
              Maximum adults
            </Label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => {
                  const current = Number.parseInt(formData.maxAdults);
                  if (current > 1) {
                    onSelectChange("maxAdults", (current - 1).toString());
                  }
                }}
              >
                -
              </Button>
              <Input
                id="maxAdults"
                className="h-8 w-12 rounded-none text-center"
                value={formData.maxAdults}
                onChange={onInputChange}
                name="maxAdults"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => {
                  const current = Number.parseInt(formData.maxAdults);
                  onSelectChange("maxAdults", (current + 1).toString());
                }}
              >
                +
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="limitChildren"
            checked={formData.limitChildren}
            onCheckedChange={(checked) =>
              onCheckboxChange("limitChildren", checked as boolean)
            }
          />
          <Label htmlFor="limitChildren">
            Do you want to limit how many children can stay here?
          </Label>
        </div>

        {formData.limitChildren && (
          <div className="flex items-center space-x-2 ml-6 mt-2">
            <Label htmlFor="maxChildren" className="mr-2">
              Maximum children
            </Label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => {
                  const current = Number.parseInt(formData.maxChildren);
                  if (current > 0) {
                    onSelectChange("maxChildren", (current - 1).toString());
                  }
                }}
              >
                -
              </Button>
              <Input
                id="maxChildren"
                className="h-8 w-12 rounded-none text-center"
                value={formData.maxChildren}
                onChange={onInputChange}
                name="maxChildren"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => {
                  const current = Number.parseInt(formData.maxChildren);
                  onSelectChange("maxChildren", (current + 1).toString());
                }}
              >
                +
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
