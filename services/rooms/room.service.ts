import apiClient from "../config/axiosConfig";
import { RoomDropdownResponse } from "../../types/roomDropdowns";
import {
  AmenitiesResponse,
  GetAllRoomsResponse,
  RoomFormData,
  RoomListResponse,
  ViewRoomResponse,
} from "@/types/room.types";

export const roomService = {
  async getDropdownData(): Promise<RoomDropdownResponse> {
    const response = await apiClient.get<RoomDropdownResponse>(
      "/settings/add-new-room/dropdowns",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async addNewRoom(formData: RoomFormData): Promise<{
    success: boolean;
    message: string;
    data: Record<string, unknown>;
  }> {
    const response = await apiClient.post("/room/create", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: response?.data?.success || false,
      message: response?.data?.message || "",
      data: response?.data?.data || null,
    };
  },

  async getAllRooms(): Promise<GetAllRoomsResponse> {
    const response = await apiClient.get<GetAllRoomsResponse>("room/all", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  async viewRoom(roomId: string): Promise<ViewRoomResponse> {
    const response = await apiClient.get<ViewRoomResponse>(
      `room/view/${roomId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async updateRoom(
    roomId: string,
    formData: RoomFormData
  ): Promise<ViewRoomResponse> {
    const response = await apiClient.post<ViewRoomResponse>(
      `room/update/${roomId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async deleteRoom(roomId: string): Promise<ViewRoomResponse> {
    const response = await apiClient.post<ViewRoomResponse>(
      `room/delete/${roomId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async getRoomList(): Promise<RoomListResponse> {
    const response = await apiClient.get<RoomListResponse>(`room/list`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  async getAmenitiesList(): Promise<AmenitiesResponse> {
    const response = await apiClient.get<AmenitiesResponse>(
      `settings/fetch-amenities`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
};
