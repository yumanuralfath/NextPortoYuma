import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { ValidateWithToken } from "@/lib/checkTokenAPI";
import sharp from "sharp";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL!,
});

export async function POST(req: NextRequest) {
  const authResponse = await ValidateWithToken();
  if (authResponse) return authResponse;

  try {
    const body = await req.json();
    const { file }: { file: string } = body;

    // 1. Convert base64 to buffer
    const buffer = Buffer.from(file.split(",")[1], "base64");

    // 2. Process image with sharp
    const processedImageBuffer = await sharp(buffer)
      .resize({ width: 1024, withoutEnlargement: true }) // Resize max-width 1024px, don't enlarge
      .jpeg({ quality: 80 }) // Compress to JPEG with 80% quality
      .toBuffer();

    // 3. Convert processed buffer back to base64
    const processedFile = `data:image/jpeg;base64,${processedImageBuffer.toString(
      "base64"
    )}`;

    const publicId = `image_assets/${Date.now()}`;

    // 4. Upload processed image to Cloudinary
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      processedFile,
      {
        public_id: publicId,
      }
    );

    return NextResponse.json({ success: true, data: result }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
