import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { file }: { file: string } = body;
    const publicId = `image_assets/${Date.now()}`;

    const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
      public_id: publicId,
    });

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
