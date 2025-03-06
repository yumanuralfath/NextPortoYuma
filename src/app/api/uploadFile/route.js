import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { file } = req.body;
    const publicId = `image_assets/${Date.now()}`;

    const result = await cloudinary.uploader.upload(file, { public_id: publicId });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ error: error.message || "Upload failed" });
  }
}
