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

export interface RoomDropdownData {
  roomTypes: RoomType[];
  bedTypes: BedType[];
  amenities: Amenity[];
  privacyPolicies: PrivacyPolicy[];
}

export interface RoomDropdownResponse {
  success: boolean;
  message: string;
  data: RoomDropdownData;
}
