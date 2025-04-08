"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plus, X, Info } from "lucide-react";
import type { RatePlanFormData } from "@/types/rate-plan.types";
import { DateRange } from "react-day-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RatePlanTypes, StayDurationType } from "@/enums/rate-plan.enums";

interface DurationDateRulesTabProps {
  formData: RatePlanFormData;
  updateFormData: (updates: Partial<RatePlanFormData>) => void;
}

export function DurationDateRulesTab({
  formData,
  updateFormData,
}: DurationDateRulesTabProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [blackoutRange, setBlackoutRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleAddDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      updateFormData({
        dateRanges: [...formData.dateRanges, dateRange],
      });
      setDateRange(undefined);
    }
  };

  const handleRemoveDateRange = (index: number) => {
    const updatedRanges = [...formData.dateRanges];
    updatedRanges.splice(index, 1);
    updateFormData({ dateRanges: updatedRanges });
  };

  const handleAddBlackoutRange = () => {
    if (blackoutRange?.from && blackoutRange?.to) {
      updateFormData({
        blackoutDates: [...formData.blackoutDates, blackoutRange],
      });
      setBlackoutRange(undefined);
    }
  };

  const handleRemoveBlackoutRange = (index: number) => {
    const updatedRanges = [...formData.blackoutDates];
    updatedRanges.splice(index, 1);
    updateFormData({ blackoutDates: updatedRanges });
  };

  // This used to generate a calendar preview of date ranges and blackout dates
  /*
  // Helper function to check if a date is in any of the blackout ranges
  const isDateBlackedOut = (date: Date) => {
    return formData.blackoutDates.some(
      (range) =>
        range.from &&
        range.to &&
        isWithinInterval(date, { start: range.from, end: range.to })
    );
  };

  // Helper function to check if a date is in any of the valid date ranges
  const isDateInValidRange = (date: Date) => {
    return formData.dateRanges.some(
      (range) =>
        range.from &&
        range.to &&
        isWithinInterval(date, { start: range.from, end: range.to })
    );
  };

  // Generate calendar days for preview
  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const isValid = isDateInValidRange(date);
      const isBlackout = isDateBlackedOut(date);

      days.push({
        date,
        isValid,
        isBlackout,
      });
    }

    return days;
  };
  */

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-medium">Availability Type</Label>
        <RadioGroup
          value={
            formData.ratePlanType === RatePlanTypes.Standard
              ? "standard"
              : formData.ratePlanType === RatePlanTypes.DateSpecific
              ? "date"
              : "duration"
          }
          onValueChange={(value) => {
            if (value === "standard") {
              updateFormData({
                ratePlanType: RatePlanTypes.Standard,
                isDateSpecific: false,
              });
            } else if (value === "date") {
              updateFormData({
                ratePlanType: RatePlanTypes.DateSpecific,
                isDateSpecific: true,
              });
            } else {
              updateFormData({
                ratePlanType: RatePlanTypes.DurationBased,
                isDateSpecific: false,
              });
            }
          }}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="font-normal">
              Standard rate plan (available anytime)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date" id="date-specific" />
            <Label htmlFor="date-specific" className="font-normal">
              This rate plan is available only for specific date ranges
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="duration" id="duration-based" />
            <Label htmlFor="duration-based" className="font-normal">
              This rate plan is based on stay duration (e.g., weekly rate)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {formData.ratePlanType === RatePlanTypes.Standard ? (
        <div className="bg-muted/50 p-4 rounded-md">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Standard Rate Plan</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This rate plan will be available year-round with no date
                restrictions. Guests can book this rate plan for any length of
                stay that meets the minimum stay requirement.
              </p>
            </div>
          </div>
        </div>
      ) : formData.ratePlanType === RatePlanTypes.DateSpecific ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Date Ranges</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Add one or more date ranges when this rate plan will be
                      available. For example, you might have a &quot;Summer
                      Special&quot; that&apos;s available from June to August.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex flex-col space-y-2">
              {formData.dateRanges.map((range, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                >
                  <span>
                    {format(range.from ?? new Date(), "MMM d, yyyy")} -{" "}
                    {format(range.to ?? new Date(), "MMM d, yyyy")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDateRange(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="date-range" className="mb-2 block">
                  Add Date Range
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d, yyyy")} -{" "}
                            {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                onClick={handleAddDateRange}
                disabled={!dateRange?.from || !dateRange?.to}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hasBlackoutDates">Blackout Dates</Label>
                <p className="text-sm text-muted-foreground">
                  Exclude specific dates from availability
                </p>
              </div>
              <Switch
                id="hasBlackoutDates"
                checked={formData.hasBlackoutDates}
                onCheckedChange={(checked) =>
                  updateFormData({ hasBlackoutDates: checked })
                }
              />
            </div>

            {formData.hasBlackoutDates && (
              <>
                <div className="flex flex-col space-y-2">
                  {formData.blackoutDates.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                    >
                      <span>
                        {format(range.from ?? new Date(), "MMM d, yyyy")} -{" "}
                        {format(range.to ?? new Date(), "MMM d, yyyy")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBlackoutRange(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="blackout-range" className="mb-2 block">
                      Add Blackout Range
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="blackout-range"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {blackoutRange?.from ? (
                            blackoutRange.to ? (
                              <>
                                {format(blackoutRange.from, "MMM d, yyyy")} -{" "}
                                {format(blackoutRange.to, "MMM d, yyyy")}
                              </>
                            ) : (
                              format(blackoutRange.from, "MMM d, yyyy")
                            )
                          ) : (
                            <span>Select blackout dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={blackoutRange?.from}
                          selected={blackoutRange}
                          onSelect={setBlackoutRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    onClick={handleAddBlackoutRange}
                    disabled={!blackoutRange?.from || !blackoutRange?.to}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* This part is to render preview of the date ranges and bloackout dates */}
          {/* {(formData.dateRanges.length > 0 ||
            formData.blackoutDates.length > 0) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Calendar Preview</CardTitle>
                <CardDescription>
                  Preview of your rate plan availability for the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium"
                      >
                        {day}
                      </div>
                    )
                  )}

                  {generateCalendarDays().map((day, i) => {
                    const date = day.date;
                    const dayOfMonth = date.getDate();
                    const dayOfWeek = date.getDay();

                    // Add empty cells for proper alignment
                    const cells = [];
                    if (i === 0) {
                      for (let j = 0; j < dayOfWeek; j++) {
                        cells.push(
                          <div
                            key={`empty-${j}`}
                            className="h-8 rounded-md"
                          ></div>
                        );
                      }
                    }

                    cells.push(
                      <div
                        key={date.toISOString()}
                        className={cn(
                          "h-8 rounded-md flex items-center justify-center text-sm",
                          day.isValid && !day.isBlackout
                            ? "bg-green-100 dark:bg-green-900/30"
                            : day.isBlackout
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-muted"
                        )}
                      >
                        {dayOfMonth}
                      </div>
                    );

                    return cells;
                  })}
                </div>

                <div className="flex items-center justify-center mt-4 gap-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-1"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-1"></div>
                    <span>Blackout</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-muted mr-1"></div>
                    <span>Not Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="durationType">Duration Type</Label>
            <Select
              value={formData.durationType}
              onValueChange={(value: StayDurationType) =>
                updateFormData({ durationType: value })
              }
            >
              <SelectTrigger id="durationType">
                <SelectValue placeholder="Select duration type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly (7 nights)</SelectItem>
                <SelectItem value="monthly">Monthly (30 nights)</SelectItem>
                <SelectItem value="custom">Custom Length</SelectItem>
              </SelectContent>
            </Select>

            {formData.durationType === "custom" && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="customStayLength">
                  Custom Stay Length (nights)
                </Label>
                <div className="flex items-center">
                  <Input
                    id="customStayLength"
                    type="number"
                    min="1"
                    value={formData.customStayLength}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        updateFormData({ customStayLength: value });
                      }
                    }}
                    className="w-full"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">
                    nights
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This rate will apply only if a guest selects exactly this stay
                  length.
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Duration-Based Rate Plan</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.durationType === "weekly" &&
                    "This rate plan will only be offered for stays of exactly 7 nights."}
                  {formData.durationType === "monthly" &&
                    "This rate plan will only be offered for stays of exactly 30 nights."}
                  {formData.durationType === "custom" &&
                    `This rate plan will only be offered for stays of exactly ${formData.customStayLength} nights.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
