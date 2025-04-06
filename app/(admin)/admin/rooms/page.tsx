"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Search, Users } from "lucide-react";
import { roomService } from "@/services/rooms/room.service";
import type { Room } from "@/types/room.types";

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [rooms2, setrooms2] = useState<Room[] | undefined>(undefined);

  const filteredRooms =
    rooms2 !== undefined
      ? rooms2.filter(
          (room) =>
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setisLoading(true);
        const response = await roomService.getAllRooms();
        if (!response.success) {
          throw new Error(response.message);
        }
        console.log("response from component: ", response);
        response.data.map((r) => r.available);
        setrooms2(response.data);
      } catch (error) {
        console.log("Error fetching rooms: ", error);
      } finally {
        setisLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    console.log("room2: ", rooms2);
  }, [rooms2]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Rooms Management</h2>
        <Button asChild>
          <Link href="/admin/rooms/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Room
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search rooms..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Max Guests</TableHead>
              <TableHead>Amenities</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-10 w-10">
                      <div className="absolute h-10 w-10 animate-ping rounded-full bg-gray-200"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="h-6 w-6 animate-spin text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading rooms data...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      No rooms found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "No rooms have been added yet"}
                    </p>
                    {!searchQuery && (
                      <Button asChild className="mt-4">
                        <Link href="/admin/rooms/new">
                          <Plus className="mr-2 h-4 w-4" /> Add New Room
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRooms.map((room) => (
                <TableRow key={room.roomId}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.bedType}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      {room.maxGuests}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.selectedAmenities.slice(0, 3).map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {amenity.replace("Free ", "")}{" "}
                          {/* Clean up display name if needed */}
                        </Badge>
                      ))}

                      {room.selectedAmenities.length > 3 && (
                        <Badge variant="outline">
                          +{room.selectedAmenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{room.available}</TableCell>
                  <TableCell>${room.basePrice}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        room.roomStatus === "active" ? "default" : "secondary"
                      }
                    >
                      {room.roomStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link
                            href={`/admin/rooms/${room.roomId}`}
                            className="flex w-full"
                          >
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`/rooms/${room.roomId}/edit`}
                            className="flex w-full"
                          >
                            Edit room
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`/rates-availability?room=${room.roomId}`}
                            className="flex w-full"
                          >
                            Manage rates & availability
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete room
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // return (
  //   <div className="flex flex-col gap-4">
  //     <div className="flex items-center justify-between">
  //       <h2 className="text-3xl font-bold tracking-tight">Rooms Management</h2>
  //       <Button asChild>
  //         <Link href="/admin/rooms/new">
  //           <Plus className="mr-2 h-4 w-4" /> Add New Room
  //         </Link>
  //       </Button>
  //     </div>
  //     <div className="flex items-center gap-2">
  //       <div className="relative flex-1 max-w-sm">
  //         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  //         <Input
  //           type="search"
  //           placeholder="Search rooms..."
  //           className="pl-8"
  //           value={searchQuery}
  //           onChange={(e) => setSearchQuery(e.target.value)}
  //         />
  //       </div>
  //     </div>
  //     <div className="rounded-md border">
  //       <Table>
  //         <TableHeader>
  //           <TableRow>
  //             <TableHead>Room Name</TableHead>
  //             <TableHead>Type</TableHead>
  //             <TableHead>Beds</TableHead>
  //             <TableHead>Max Guests</TableHead>
  //             <TableHead>Amenities</TableHead>
  //             <TableHead>Available</TableHead>
  //             <TableHead>Base Price</TableHead>
  //             <TableHead>Status</TableHead>
  //             <TableHead className="text-right">Actions</TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           {filteredRooms.map((room) => (
  //             <TableRow key={room.id}>
  //               <TableCell className="font-medium">{room.name}</TableCell>
  //               <TableCell>{room.type}</TableCell>
  //               <TableCell>{room.beds}</TableCell>
  //               <TableCell>
  //                 <div className="flex items-center">
  //                   <Users className="mr-1 h-4 w-4 text-muted-foreground" />
  //                   {room.maxGuests}
  //                 </div>
  //               </TableCell>
  //               <TableCell>
  //                 <div className="flex flex-wrap gap-1">
  //                   {room.amenities.includes("Free WiFi") && (
  //                     <Badge
  //                       variant="outline"
  //                       className="flex items-center gap-1"
  //                     >
  //                       <Wifi className="h-3 w-3" /> WiFi
  //                     </Badge>
  //                   )}
  //                   {room.amenities.includes("Breakfast") && (
  //                     <Badge
  //                       variant="outline"
  //                       className="flex items-center gap-1"
  //                     >
  //                       <Coffee className="h-3 w-3" /> Breakfast
  //                     </Badge>
  //                   )}
  //                   {room.amenities.includes("Private bathroom") && (
  //                     <Badge
  //                       variant="outline"
  //                       className="flex items-center gap-1"
  //                     >
  //                       <Bath className="h-3 w-3" /> Bath
  //                     </Badge>
  //                   )}
  //                   {room.amenities.length > 3 && (
  //                     <Badge variant="outline">
  //                       +{room.amenities.length - 3}
  //                     </Badge>
  //                   )}
  //                 </div>
  //               </TableCell>
  //               <TableCell>{room.available}</TableCell>
  //               <TableCell>${room.basePrice}</TableCell>
  //               <TableCell>
  //                 <Badge
  //                   variant={room.status === "active" ? "default" : "secondary"}
  //                 >
  //                   {room.status}
  //                 </Badge>
  //               </TableCell>
  //               <TableCell className="text-right">
  //                 <DropdownMenu>
  //                   <DropdownMenuTrigger asChild>
  //                     <Button variant="ghost" className="h-8 w-8 p-0">
  //                       <span className="sr-only">Open menu</span>
  //                       <MoreHorizontal className="h-4 w-4" />
  //                     </Button>
  //                   </DropdownMenuTrigger>
  //                   <DropdownMenuContent align="end">
  //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //                     <DropdownMenuItem>
  //                       <Link
  //                         href={`/rooms/${room.id}`}
  //                         className="flex w-full"
  //                       >
  //                         View details
  //                       </Link>
  //                     </DropdownMenuItem>
  //                     <DropdownMenuItem>
  //                       <Link
  //                         href={`/rooms/${room.id}/edit`}
  //                         className="flex w-full"
  //                       >
  //                         Edit room
  //                       </Link>
  //                     </DropdownMenuItem>
  //                     <DropdownMenuSeparator />
  //                     <DropdownMenuItem>
  //                       <Link
  //                         href={`/rates-availability?room=${room.id}`}
  //                         className="flex w-full"
  //                       >
  //                         Manage rates & availability
  //                       </Link>
  //                     </DropdownMenuItem>
  //                     <DropdownMenuSeparator />
  //                     <DropdownMenuItem className="text-destructive">
  //                       Delete room
  //                     </DropdownMenuItem>
  //                   </DropdownMenuContent>
  //                 </DropdownMenu>
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </div>
  // );
}
