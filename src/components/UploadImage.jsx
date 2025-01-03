"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

import { useState } from "react";

const UploadImage = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Buat form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload ke API lokal (/api/upload)
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { url: imageUrl } = await uploadResponse.json();

      // Update Supabase dengan URL baru menggunakan Bearer Token
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      // Update ke Supabase dengan URL gambar yang baru
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

      // Beri tahu parent bahwa upload berhasil
      onUploadSuccess(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
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
