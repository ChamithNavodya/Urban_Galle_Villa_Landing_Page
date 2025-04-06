import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { roomOptions } from "@/constants/DummyData";
import { Button } from "@/components/ui/button";
import { RoomCard } from "./RoomCard";

interface RoomSelectionProps {
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
}
const RoomSelection: React.FC<RoomSelectionProps> = ({
  checkInDate,
  checkOutDate,
  guestCount,
}) => {
  const [selectedRooms, setSelectedRooms] = useState<Record<number, number>>(
    {}
  );

  // Calculate number of nights
  const nights =
    checkInDate &&
    checkOutDate &&
    checkInDate instanceof Date &&
    checkOutDate instanceof Date
      ? differenceInDays(checkOutDate, checkInDate)
      : 0;

  // Handle room selection
  const handleRoomSelection = (roomId: number, count: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: count,
    }));
  };

  // Calculate total price
  const calculateTotalPrice = (room: (typeof roomOptions)[0]) => {
    return room.currentPrice * nights;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Your Accommodation</h2>
        <p className="text-gray-600">
          {nights} {nights === 1 ? "night" : "nights"} at Villa Serenity,{" "}
          {format(
            checkInDate instanceof Date ? checkInDate : new Date(),
            "MMM d, yyyy"
          )}{" "}
          to{" "}
          {format(
            checkOutDate instanceof Date ? checkOutDate : new Date(),
            "MMM d, yyyy"
          )}{" "}
          for {guestCount} {guestCount === 1 ? "guest" : "guests"}
        </p>
      </div>

      <div className="space-y-6">
        {roomOptions.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            nights={nights}
            checkInDate={checkInDate}
            selectedCount={selectedRooms[room.id] || 0}
            onSelectChange={(count) => handleRoomSelection(room.id, count)}
            onReserve={() =>
              console.log(`Reserved ${selectedRooms[room.id]} of ${room.name}`)
            }
          />
        ))}
      </div>

      {Object.keys(selectedRooms).length > 0 &&
        Object.values(selectedRooms).some((count) => count > 0) && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-10">
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {Object.values(selectedRooms).reduce((a, b) => a + b, 0)}{" "}
                  room(s) selected
                </p>
                <p className="text-sm text-gray-600">
                  Total: $
                  {roomOptions
                    .filter(
                      (room) =>
                        selectedRooms[room.id] && selectedRooms[room.id] > 0
                    )
                    .reduce(
                      (total, room) =>
                        total +
                        calculateTotalPrice(room) *
                          (selectedRooms[room.id] || 0),
                      0
                    )
                    .toLocaleString()}
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Complete Reservation
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default RoomSelection;
