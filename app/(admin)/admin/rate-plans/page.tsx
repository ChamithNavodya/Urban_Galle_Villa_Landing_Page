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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  Tag,
  Calendar,
  Bed,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { toast } from "sonner";
import { ratePlanService } from "@/services/rate-plan/rate-plan.service";
import { RatePlan } from "@/types/rate-plan.types";
import { RatePlanStatus, RatePlanTypes } from "@/enums/rate-plan.enums";

export default function RatePlansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setisLoading] = useState(false);
  const [ratePlans, setratePlans] = useState<RatePlan[]>([]);
  const [loadingRatePlanId, setLoadingRatePlanId] = useState<number | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Filter rate plans based on search query and filters
  const filteredRatePlans = ratePlans.filter((plan) => {
    const matchesSearch = plan.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all";
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && plan.isActive) ||
      (statusFilter === "inactive" && !plan.isActive);
    const matchesRoom =
      roomFilter === "all" ||
      plan.applicableRooms.some((room) => room.name === roomFilter) ||
      (roomFilter === "All Rooms" &&
        plan.applicableRooms.some((room) => room.name === "All Rooms"));

    return matchesSearch && matchesType && matchesStatus && matchesRoom;
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRatePlans.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get all unique room types for filtering
  const uniqueRooms = Array.from(
    new Set(ratePlans.flatMap((plan) => plan.applicableRooms))
  );

  // Format meal plan for display
  const formatMealPlan = (mealPlan: string) => {
    switch (mealPlan) {
      case "none":
        return "No Meals";
      case "breakfast":
        return "Breakfast";
      case "half_board":
        return "Half Board";
      case "full_board":
        return "Full Board";
      case "all_inclusive":
        return "All Inclusive";
      default:
        return mealPlan;
    }
  };

  // Handle room status change
  const handleStatusChange = async (plan: RatePlan, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingRatePlanId(plan.ratePlanId);
    try {
      const newStatus =
        plan.ratePlanStatus === RatePlanStatus.INACTIVE
          ? RatePlanStatus.ACTIVE
          : RatePlanStatus.INACTIVE;
      const response = await ratePlanService.changeRatePlanStatus(
        plan.ratePlanId,
        newStatus
      );
      if (response.success) {
        fetchRatesFromServer();
        toast.success("Rate plan status changed successfully");
      } else {
        console.log("response: ", response);
        toast.error("Failed to change rate plan status");
      }
    } catch (error) {
      console.error("Error changing status: ", error);
      toast.error("Error changing status");
    } finally {
      setLoadingRatePlanId(null);
    }
  };

  // Handle room delete
  const handleDelete = async (plan: RatePlan) => {
    try {
      const response = await ratePlanService.deleteRatePlan(plan.ratePlanId);
      if (response.success) {
        fetchRatesFromServer();
        toast.success("Rate plan deleted successfully");
      } else {
        console.log("response: ", response);
        toast.error("Failed to delete rate plan");
      }
    } catch (error) {
      console.error("Error delete rate plan: ", error);
      toast.error("Error deleting rate plan");
    } finally {
      setLoadingRatePlanId(null);
    }
  };

  const fetchRatesFromServer = async () => {
    setisLoading(true);
    try {
      const response = await ratePlanService.getAllRatePlans();

      if (response.success) {
        setratePlans(response.data);
        console.log("response success: ", response);
      } else {
        console.log("response: ", response);
        toast.error("Failed to fetch rate plans");
      }
    } catch (error) {
      console.error("Error fetching rate plans: ", error);
      toast.error("Error fetching rate plans");
    } finally {
      setisLoading(false);
    }
  };

  // Fecth Rates from the server
  useEffect(() => {
    fetchRatesFromServer();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Rate Plans</h2>
        <Button asChild>
          <Link href="/admin/rate-plans/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Rate Plan
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search rate plans..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filters:</span>
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RatePlanTypes).map(([key, value]) => (
                <SelectItem key={key} value={key.toLowerCase()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {uniqueRooms.map((room, index) => (
                <SelectItem key={index} value={room.name}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rate Plan List</CardTitle>
          <CardDescription>
            Manage your property&apos;s rate plans and special offers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rate Plan Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applicable Rooms</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Meals</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No rate plans found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRecords.map((plan) => (
                    <TableRow key={plan.ratePlanId}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/rate-plans/${plan.ratePlanId}`}
                          className="hover:underline"
                        >
                          {plan.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {plan.ratePlanType === RatePlanTypes.DateSpecific ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Date Specific</span>
                            </div>
                          ) : plan.ratePlanType ===
                            RatePlanTypes.DurationBased ? (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span>Duration Based</span>
                            </div>
                          ) : plan.ratePlanType === RatePlanTypes.Standard ? (
                            <div className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              <span>Standard</span>
                            </div>
                          ) : (
                            <span>Standard</span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {plan.applicableRooms.length > 2 ? (
                            <>
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <Bed className="h-3 w-3" />
                                {plan.applicableRooms.length} rooms
                              </Badge>
                            </>
                          ) : (
                            plan.applicableRooms.map((room, index) => (
                              <Badge key={index} variant="secondary">
                                {room.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${plan.basePrice}</TableCell>
                      <TableCell>
                        {plan.discountPercentage > 0 ? (
                          <Badge className="bg-green-500">
                            {plan.discountPercentage}% OFF
                          </Badge>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatMealPlan(plan.mealPlan)}</TableCell>
                      <TableCell>
                        {loadingRatePlanId === plan.ratePlanId ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-ping rounded-full bg-gray-400" />
                            <span className="text-sm">Updating...</span>
                          </div>
                        ) : plan.ratePlanStatus === RatePlanStatus.ACTIVE ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu
                          open={openDropdownId === plan.ratePlanId}
                          onOpenChange={(open) =>
                            setOpenDropdownId(open ? plan.ratePlanId : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link
                                href={`/admin/rate-plans/${plan.ratePlanId}`}
                                className="flex w-full"
                              >
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/admin/rate-plans/${plan.ratePlanId}/edit`}
                                className="flex w-full"
                              >
                                Edit rate plan
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                handleStatusChange(plan, e);
                                setOpenDropdownId(null);
                              }}
                            >
                              {plan.ratePlanStatus === RatePlanStatus.ACTIVE
                                ? "Deactivate"
                                : "Activate"}{" "}
                              rate plan
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(plan);
                                setOpenDropdownId(null);
                              }}
                            >
                              Delete rate plan
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

          <Pagination
            currentPage={currentPage}
            totalItems={filteredRatePlans.length}
            itemsPerPage={recordsPerPage}
            onPageChange={paginate}
            onItemsPerPageChange={setRecordsPerPage}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}
