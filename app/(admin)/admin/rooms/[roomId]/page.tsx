"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Bed,
  Users,
  Bath,
  SquareIcon as SquareFeet,
  Coffee,
  Wifi,
  AirVent,
  ShieldCheck,
  Droplets,
  Shirt,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Room } from "@/types/room.types";
import { roomService } from "@/services/rooms/room.service";
import Image from "next/image";

// Map amenity IDs to readable names and icons
const amenityMap: Record<string, { label: string; icon: React.ElementType }> = {
  wifi: { label: "Free WiFi", icon: Wifi },
  ac: { label: "Air Conditioning", icon: AirVent },
  tv: { label: "Flat-screen TV", icon: Wifi },
  fridge: { label: "Mini Fridge", icon: Wifi },
  safe: { label: "In-room Safe", icon: ShieldCheck },
  bath: { label: "Private Bathroom", icon: Bath },
  shower: { label: "Shower", icon: Droplets },
  bathtub: { label: "Bathtub", icon: Bath },
  toiletries: { label: "Free Toiletries", icon: Droplets },
  desk: { label: "Work Desk", icon: Wifi },
  iron: { label: "Iron & Ironing Board", icon: Shirt },
  coffee: { label: "Coffee Machine", icon: Coffee },
  balcony: { label: "Balcony", icon: Wifi },
  view: { label: "Sea View", icon: Wifi },
  soundproof: { label: "Soundproofing", icon: Wifi },
  kitchen: { label: "Kitchenette", icon: Wifi },
  washer: { label: "Washing Machine", icon: Shirt },
};

// Sample booking data for this room
const bookings = [
  {
    id: "B-1001",
    guestName: "John Smith",
    checkIn: "2025-04-15",
    checkOut: "2025-04-18",
    guests: 2,
    status: "confirmed",
  },
  {
    id: "B-1002",
    guestName: "Emma Johnson",
    checkIn: "2025-04-20",
    checkOut: "2025-04-25",
    guests: 2,
    status: "confirmed",
  },
  {
    id: "B-1003",
    guestName: "Michael Brown",
    checkIn: "2025-05-01",
    checkOut: "2025-05-07",
    guests: 1,
    status: "pending",
  },
];

export default function RoomViewPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room>();
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await roomService.deleteRoom(roomId);
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Error deleting room: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await roomService.viewRoom(roomId);
        setRoom(data.data);
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-2">Room Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The room you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild>
          <Link href="/admin/rooms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Link>
        </Button>
      </div>
    );
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/rooms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{room.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="capitalize">
              {room.type}
            </Badge>
            {getStatusBadge(room.roomStatus)}
            <span className="text-sm text-muted-foreground">
              Last updated: {format(new Date(room.updatedAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" asChild>
            <Link href={`/admin/rates-availability?room=${room.roomId}`}>
              <Calendar className="mr-2 h-4 w-4" />
              Manage Rates
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/rooms/${room.roomId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Room
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  room and all associated data including bookings and
                  availability.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground"
                  onClick={() => handleDelete()}
                >
                  Delete Room
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Carousel className="w-full">
                <CarouselContent>
                  {room.images.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${room.name} - Image ${index + 1}`}
                          width={400}
                          height={300}
                          className="object-cover w-full h-full rounded-t-lg"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Room Description</h2>
                <p className="text-muted-foreground">{room.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Bed Type</span>
                </div>
                <span className="font-medium capitalize">
                  {room.bedType} ({room.numBeds})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SquareFeet className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Room Size</span>
                </div>
                <span className="font-medium">{room.size} m²</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Max Guests</span>
                </div>
                <span className="font-medium">{room.maxGuests} guests</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Bathrooms</span>
                </div>
                <span className="font-medium">
                  {room.numBathrooms}{" "}
                  {room.bathrooms[0].isPrivate ? "(private)" : ""}
                </span>
              </div>

              <div className="pt-2 border-t">
                <h3 className="font-medium mb-2">Policies</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {room.refundable ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span>Refundable</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {room.prepayment ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span>Prepayment Required</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {room.breakfast ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span>Breakfast Included</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h3 className="font-medium mb-2">Base Price</h3>
                <div className="text-2xl font-bold">
                  ${room.basePrice}
                  <span className="text-sm font-normal text-muted-foreground">
                    /night
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {room.selectedAmenities.map((amenityId: string) => {
                  const amenity = amenityMap[amenityId] || {
                    label:
                      amenityId.charAt(0).toUpperCase() + amenityId.slice(1),
                    icon: Check,
                  };
                  const Icon = amenity.icon;

                  return (
                    <div key={amenityId} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span>{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                View and manage bookings for this room.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No bookings found for this room.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                          Booking ID
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                          Guest
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                          Check-in
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                          Check-out
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                          Guests
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="whitespace-nowrap px-4 py-3 font-medium">
                            {booking.id}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {booking.guestName}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {booking.guests}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <Badge
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-500"
                                  : booking.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href={`/bookings?room=${room.roomId}`}>
                  View All Bookings
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Availability</CardTitle>
              <CardDescription>
                View and manage availability for this room.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  This room has {room.available} units available for booking.
                </p>
                <Button asChild>
                  <Link href={`/rates-availability?room=${room.roomId}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Availability
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Analytics</CardTitle>
              <CardDescription>
                View performance metrics for this room.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Analytics data is not available yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
