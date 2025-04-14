import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL!,
});

export async function POST(req: NextRequest) {
  let userID: string | undefined;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    try {
      const userString = formData.get("user")?.toString();
      if (userString) {
        const user = JSON.parse(userString);
        userID = user.id?.toString();
      }
    } catch (error) {
      console.error("Failed to parse user JSON:", error);
    }

    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: `voice_uploads/${userID}`,
          format: "webm",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    return NextResponse.json(
      { success: true, url: result.secure_url },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
