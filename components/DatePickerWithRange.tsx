"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DatePickerWithRange = ({
  dateRange,
  onDateRangeChange,
  availabilityData,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  availabilityData: Record<
    string,
    { available: boolean; price: number | null }
  >;
}) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Select check-in and check-out dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              onDateRangeChange({ from: range?.from, to: range?.to });
            }}
            numberOfMonths={2}
            disabled={(date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              return !availabilityData[dateStr]?.available;
            }}
            components={{
              DayContent: (props) => {
                const { date: day } = props;
                // Make sure day is a valid Date object
                if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
                  return (
                    <div className="relative w-full h-full flex flex-col items-center">
                      -
                    </div>
                  );
                }

                const dateStr = format(day, "yyyy-MM-dd");
                const dayData = availabilityData[dateStr];

                return (
                  <div className="relative w-full h-full flex flex-col items-center">
                    <span>{format(day, "d")}</span>
                    {dayData ? (
                      dayData.available ? (
                        <span className="text-xs text-green-600 font-medium">
                          ${dayData.price}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                );
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
