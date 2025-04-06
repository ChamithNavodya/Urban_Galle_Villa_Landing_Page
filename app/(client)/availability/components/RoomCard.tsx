// components/RoomCard.tsx
import { format } from "date-fns";
import { Badge, Bed, Check, Coffee, Users, X } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoomCardProps {
  room: {
    id: number;
    name: string;
    images: string[];
    availability: number;
    maxGuests: number;
    bedType: string;
    size: string;
    views: string[];
    amenities: string[];
    originalPrice: number;
    currentPrice: number;
    discount: number;
    breakfast: boolean;
    refundable: boolean;
    prepayment: boolean;
    geniusDiscount: boolean;
  };
  nights: number;
  checkInDate: Date;
  selectedCount: number;
  onSelectChange: (count: number) => void;
  onReserve: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  nights,
  checkInDate,
  selectedCount,
  onSelectChange,
  onReserve,
}) => {
  return (
    <Card className="overflow-hidden border-gray-200">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">
          {/* Room image */}
          <div className="relative h-48 lg:h-full">
            <Image
              src={room.images[0] || "/placeholder.svg"}
              alt={room.name}
              width={300}
              height={200}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {room.availability <= 3 && (
              <div className="absolute top-4 left-0 bg-red-500 text-white px-3 py-1 text-sm font-medium">
                Only {room.availability}{" "}
                {room.availability === 1 ? "room" : "rooms"} left!
              </div>
            )}
          </div>

          {/* Room details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Users className="h-4 w-4" />
                      <span>Up to {room.maxGuests} guests</span>
                      <span className="mx-1">•</span>
                      <Bed className="h-4 w-4" />
                      <span>{room.bedType}</span>
                      <span className="mx-1">•</span>
                      <span>{room.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.views.map((view, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-50 border border-gray-200"
                    >
                      {view}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  {room.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="amenities" className="border-none">
                    <AccordionTrigger className="py-0 text-sm font-medium text-gray-600 hover:no-underline">
                      <span className="underline">
                        Show all {room.amenities.length} amenities
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm">
                        {room.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-6 pt-4 lg:pt-0">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="line-through text-gray-500 text-sm">
                        ${room.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-green-600 hover:bg-green-600">
                        {room.discount}% OFF
                      </Badge>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold">
                        ${room.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-600 text-sm mb-1">
                        for {nights} {nights === 1 ? "night" : "nights"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Includes taxes and charges
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {room.breakfast && (
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          Good breakfast included
                        </span>
                      </div>
                    )}

                    {room.refundable ? (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Free cancellation before 18:00 on{" "}
                          {checkInDate instanceof Date
                            ? format(checkInDate, "d MMM yyyy")
                            : "arrival date"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Non-refundable</span>
                      </div>
                    )}

                    {!room.prepayment && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">No prepayment needed</span>
                      </div>
                    )}

                    {room.geniusDiscount && (
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs font-semibold bg-blue-50 border-blue-200 text-blue-700">
                          GENIUS
                        </Badge>
                        <span className="text-sm">Discount available</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="w-24">
                      <Select
                        value={selectedCount.toString()}
                        onValueChange={(value) =>
                          onSelectChange(Number.parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(room.availability + 1)].map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={selectedCount === 0}
                      onClick={onReserve}
                    >
                      I&apos;ll reserve
                    </Button>
                  </div>

                  {selectedCount > 0 && (
                    <p className="text-xs text-center mt-2">
                      Confirmation is immediate
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
