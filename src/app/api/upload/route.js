import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // Ambil file dari form-data

    if (!file) {
      return new Response(
        JSON.stringify({ error: "File is required" }),
        { status: 400 }
      );
    }


    // Convert Blob ke Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload ke Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "profile_pictures",
          allowed_formats: ["jpg", "jpeg", "png"]
        },
        (error, result) => {
          if (error) reject(new Error(error.message || "Cloudinary upload error"));
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    return new Response(
      JSON.stringify({ url: uploadResult.secure_url }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
