/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

import { getAccessToken } from "@/lib/fetchLib";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

interface UploadImageProps {
  onUploadSuccess: (imageUrl: string) => void;
}

const UploadImage = ({ onUploadSuccess }: UploadImageProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadLogic = async () => {
      setUploading(true);

      try {
        // Buat form data
        const formData = new FormData();
        formData.append("file", file);

        // Upload ke API lokal
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const { url: imageUrl } = await uploadResponse.json();

        // Ambil token
        const token = getAccessToken();
        if (!token) throw new Error("Token not found");

        // Update profil Supabase
        const updateResponse = await fetch(`${BASE_URL}/user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_picture_url: imageUrl,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error("Failed to update user profile picture");
        }

        // Beri tahu parent
        onUploadSuccess(imageUrl);
      } finally {
        setUploading(false);
      }
    };

    await toast.promise(
      uploadLogic(),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully!",
        error: (err: any) =>
          typeof err?.message === "string" ? err.message : "Upload failed",
      },
      {
        duration: 2000,
        style: {
          border: "2px solid #ff00ff",
          padding: "16px",
          color: "#00ffff",
          background: "#1a001a",
          boxShadow: "0 0 20px #ff00ff",
          fontFamily: "monospace",
        },
        iconTheme: {
          primary: "#00ffff",
          secondary: "#ff00ff",
        },
      }
    );
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
        disabled={uploading}
      />
      {uploading && <p className="text-gray-500">Uploading...</p>}
    </div>
  );
};

export default UploadImage;
