import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentBookings = [
  {
    id: "B-1001",
    guestName: "John Smith",
    guestInitials: "JS",
    roomName: "Deluxe King Room",
    checkIn: "Jun 15, 2023",
    checkOut: "Jun 18, 2023",
    status: "confirmed",
    amount: "$597",
  },
  {
    id: "B-1002",
    guestName: "Emma Johnson",
    guestInitials: "EJ",
    roomName: "Premium Ocean View Suite",
    checkIn: "Jun 20, 2023",
    checkOut: "Jun 25, 2023",
    status: "confirmed",
    amount: "$1,495",
  },
  {
    id: "B-1003",
    guestName: "Michael Brown",
    guestInitials: "MB",
    roomName: "Family Suite",
    checkIn: "Jul 01, 2023",
    checkOut: "Jul 07, 2023",
    status: "pending",
    amount: "$2,394",
  },
  {
    id: "B-1004",
    guestName: "Sophia Garcia",
    guestInitials: "SG",
    roomName: "Deluxe King Room",
    checkIn: "Jun 25, 2023",
    checkOut: "Jun 27, 2023",
    status: "confirmed",
    amount: "$398",
  },
];

export function RecentBookings() {
  return (
    <div className="space-y-8">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg`} alt={booking.guestName} />
            <AvatarFallback>{booking.guestInitials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {booking.guestName}
            </p>
            <p className="text-sm text-muted-foreground">
              {booking.checkIn} - {booking.checkOut}
            </p>
          </div>
          <div className="ml-auto text-right">
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
            <p className="mt-1 text-sm text-muted-foreground">
              {booking.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
