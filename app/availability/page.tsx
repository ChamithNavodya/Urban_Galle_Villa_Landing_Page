"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RoomSelection from "./components/RoomSelection";
import DatePickerWithRange from "@/components/DatePickerWithRange";

// Dummy data for room availability
const generateDummyAvailabilityData = () => {
  const data: Record<string, { available: boolean; price: number | null }> = {};
  const today = startOfDay(new Date());

  // Generate data for the next 60 days
  for (let i = 0; i < 60; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");

    // Random availability (70% chance of being available)
    const available = Math.random() > 0.3;

    // Random price between $150 and $350 if available
    const price = available ? Math.floor(Math.random() * 200) + 150 : null;

    data[dateStr] = { available, price };
  }

  return data;
};

const BookingPage = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState<string>("2");
  const [availabilityData, setAvailabilityData] = useState<
    Record<string, { available: boolean; price: number | null }>
  >({});
  const [isSearching, setIsSearching] = useState(false);
  const [showRoomSelection, setShowRoomSelection] = useState(false);

  // Generate dummy availability data on component mount
  useEffect(() => {
    setAvailabilityData(generateDummyAvailabilityData());
  }, []);

  const handleCheckAvailability = () => {
    if (!dateRange.from || !dateRange.to) {
      return;
    }

    setIsSearching(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setShowRoomSelection(true);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Book Your Stay</h1>
      <p className="text-gray-600 mb-8">
        Find the perfect accommodation for your dream vacation
      </p>

      {/* Search filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-in & Check-out</label>
            <DatePickerWithRange
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              availabilityData={availabilityData}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Guests</label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5">5 Guests</SelectItem>
                <SelectItem value="6">6 Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full bg-primary hover:bg-black/90"
              onClick={handleCheckAvailability}
              disabled={isSearching || !dateRange.from || !dateRange.to}
            >
              {isSearching ? (
                "Checking..."
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Check Availability
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Room selection */}
      {showRoomSelection && dateRange.from && dateRange.to ? (
        <RoomSelection
          checkInDate={dateRange.from}
          checkOutDate={dateRange.to}
          guestCount={Number.parseInt(guests)}
        />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">
            Select your dates to see available rooms
          </h2>
          <p className="text-gray-600">
            Choose your check-in and check-out dates along with the number of
            guests to view our available accommodations.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
