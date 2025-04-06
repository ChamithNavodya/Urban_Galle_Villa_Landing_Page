"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react"; // Added Loader2 for spinner
import Image from "next/image";
import { UploadService } from "@/services/upload/upload.service";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<number[]>([]); // Track which images are uploading

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    try {
      setIsUploading(true);
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      // Track which images are being uploaded (their future indices)
      const newUploadingIndices = Array.from(
        { length: validFiles.length },
        (_, i) => images.length + i
      );
      setUploadingImages(newUploadingIndices);

      // Upload to backend
      const uploadedUrls = await UploadService.uploadRoomImages(validFiles);

      // Update parent with new URLs
      const urlS = uploadedUrls.data;
      onChange([...images, ...urlS]);
    } catch (error) {
      console.error("Upload failed:", error);
      // Add your error handling (toast, etc.)
    } finally {
      setIsUploading(false);
      setUploadingImages([]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload area remains the same */}
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25"
        } ${isUploading ? "opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="rounded-full bg-muted p-3">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-lg font-semibold">
            {isUploading ? "Uploading..." : "Drag & drop your images"}
          </h3>
          <p className="text-sm text-muted-foreground">
            or click to browse (max 10 images)
          </p>
          <p className="text-xs text-red-600 font-extralight">
            * Minimum 3 images need to be uploaded.
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={images.length >= 10 || isUploading}
        />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={images.length >= 10 || isUploading}
          type="button"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Select Files
        </Button>
      </div>

      {/* Preview section with loading states */}
      {(images.length > 0 || uploadingImages.length > 0) && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Existing images */}
          {images.map((image, index) => (
            <Card key={`uploaded-${index}`} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Room image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.svg";
                    }}
                    width={400}
                    loading="lazy"
                    height={300}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => removeImage(index)}
                    type="button"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Loading placeholders for uploading images */}
          {uploadingImages.map((index) => (
            <Card key={`uploading-${index}`} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
