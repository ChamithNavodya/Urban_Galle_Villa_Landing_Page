import apiClient from "../config/axiosConfig";

export interface UploadRoomImagesResponse {
  success: boolean;
  message: string;
  data: string[];
}

export const UploadService = {
  async uploadRoomImages(files: File[]): Promise<UploadRoomImagesResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await apiClient.post<UploadRoomImagesResponse>(
      "/upload/room-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  },
};
