import { RoomStatus } from "@/enums/room.enums";

export interface Room {
  roomId: number;
  name: string;
  type: string;
  bedType: string;
  numBeds: number;
  size: string;
  maxGuests: number;
  available: string;
  basePrice: number;
  description: string;
  refundable: boolean;
  prepayment: boolean;
  breakfast: boolean;
  selectedAmenities: string[];
  images: string[];
  totalOccupancy: number;
  limitAdults: boolean;
  maxAdults: number;
  limitChildren: boolean;
  maxChildren: number;
  numBathrooms: number;
  bathrooms: Bathroom[];
  roomStatus: RoomStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllRoomsResponse {
  success: boolean;
  message: string;
  data: Room[];
}
export interface RoomFormData {
  name: string;
  type: string;
  bedType: string;
  numBeds: string;
  size: string;
  maxGuests: string;
  available: string;
  basePrice: string;
  description: string;
  refundable: boolean;
  prepayment: boolean;
  breakfast: boolean;
  selectedAmenities: string[];
  images: string[];
  totalOccupancy: string;
  limitAdults: boolean;
  maxAdults: string;
  limitChildren: boolean;
  maxChildren: string;
  numBathrooms: string;
  bathrooms: Bathroom[];
  roomStatus: RoomStatus;
}

export interface Bathroom {
  isPrivate: boolean;
  isInRoom: boolean;
}

export interface RoomDropdownData {
  roomTypes: RoomType[];
  bedTypes: BedType[];
  amenities: Amenity[];
  privacyPolicies: PrivacyPolicy[];
}

export interface RoomType {
  id: number;
  value: string;
  label: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface BedType {
  id: number;
  value: string;
  label: string;
  icon: string | null;
  isActive: boolean;
}

export interface Amenity {
  id: number;
  value: string;
  label: string;
  category: string;
  icon: string | null;
  isActive: boolean;
}

export interface PrivacyPolicy {
  id: number;
  value: string;
  label: string;
  content: string;
  isActive: boolean;
}

export type RoomFormTabs = {
  basic: boolean;
  details: boolean;
  occupancy: boolean;
  amenities: boolean;
  images: boolean;
  pricing: boolean;
};

export interface RoomListItem {
  roomId: number;
  name: string;
}

export interface RoomListResponse {
  success: boolean;
  message: string;
  data: RoomListItem[];
}

export interface AmenitiesResponse {
  success: boolean;
  message: string;
  data: Amenity[];
}

export interface ViewRoomResponse {
  error?: {
    statusCode: number;
    errors: string[];
    timestamp: string;
    path: string;
    stack: string;
  };
  success: boolean;
  message: string;
  data: Room;
}

///////////////// Type casting /////////////////
export const roomToFormData = (room: Room): RoomFormData => ({
  name: room.name,
  type: room.type,
  bedType: room.bedType,
  numBeds: String(room.numBeds),
  size: room.size,
  maxGuests: String(room.maxGuests),
  available: room.available,
  basePrice: String(room.basePrice),
  description: room.description,
  refundable: room.refundable,
  prepayment: room.prepayment,
  breakfast: room.breakfast,
  selectedAmenities: room.selectedAmenities,
  images: room.images,
  totalOccupancy: String(room.totalOccupancy),
  limitAdults: room.limitAdults,
  maxAdults: String(room.maxAdults),
  limitChildren: room.limitChildren,
  maxChildren: String(room.maxChildren),
  numBathrooms: String(room.numBathrooms),
  bathrooms: room.bathrooms,
  roomStatus: room.roomStatus,
});
