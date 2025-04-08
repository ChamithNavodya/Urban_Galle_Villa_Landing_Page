import {
  RatePlanCreateResponse,
  RatePlanFormData,
  RatePlanResponse,
  RatePlansResponse,
} from "@/types/rate-plan.types";
import apiClient from "../config/axiosConfig";
import { RatePlanStatus } from "@/enums/rate-plan.enums";

export const ratePlanService = {
  async addNewRatePlan(
    formData: RatePlanFormData
  ): Promise<RatePlanCreateResponse> {
    const response = await apiClient.post<RatePlanCreateResponse>(
      "/rate-plan/create",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async getAllRatePlans(): Promise<RatePlansResponse> {
    const response = await apiClient.get<RatePlansResponse>("rate-plan/all", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  async viewRatePlan(ratePlanId: number): Promise<RatePlanResponse> {
    const response = await apiClient.get<RatePlanResponse>(
      `rate-plan/view/${ratePlanId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async updateRatePlan(
    ratePlanId: number,
    formData: RatePlanFormData
  ): Promise<RatePlanResponse> {
    const response = await apiClient.post<RatePlanResponse>(
      `rate-plan/update/${ratePlanId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async changeRatePlanStatus(
    ratePlanId: number,
    newStatus: RatePlanStatus
  ): Promise<RatePlanResponse> {
    const response = await apiClient.post<RatePlanResponse>(
      "rate-plan/change-status",
      {
        ratePlanId,
        newStatus,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async deleteRatePlan(ratePlanId: number): Promise<RatePlanResponse> {
    const response = await apiClient.get<RatePlanResponse>(
      `rate-plan/delete/${ratePlanId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // async getRoomList(): Promise<RoomListResponse> {
  //   const response = await apiClient.get<RoomListResponse>(`room/list`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   return response.data;
  // },

  // async getAmenitiesList(): Promise<AmenitiesResponse> {
  //   const response = await apiClient.get<AmenitiesResponse>(
  //     `settings/fetch-amenities`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   return response.data;
  // },
};
