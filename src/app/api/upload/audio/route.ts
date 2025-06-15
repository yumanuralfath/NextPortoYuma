/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";
import { NextRequest, NextResponse } from "next/server";
import { ValidateWithToken } from "@/lib/checkTokenAPI";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL!,
});

export async function POST(req: NextRequest) {
  const authResponse = await ValidateWithToken();
  if (authResponse) return authResponse;

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authResponse = await ValidateWithToken();
  if (authResponse) return authResponse;

  const { searchParams } = new URL(req.url);
  const userID = searchParams.get("userID");
  const dateParam = searchParams.get("date");

  if (!userID) {
    return NextResponse.json(
      { error: "Missing userID query parameter" },
      { status: 400 }
    );
  }

  let startDate: Date;
  let endDate: Date;

  if (dateParam) {
    const parsedDate = new Date(dateParam);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    startDate = new Date(parsedDate);
    startDate.setUTCHours(0, 0, 0, 0);

    endDate = new Date(parsedDate);
    endDate.setUTCHours(23, 59, 59, 999);
  } else {
    startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);

    endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
  }

  try {
    const result = await cloudinary.search
      .expression(
        `resource_type:video AND folder:voice_uploads/${userID} AND uploaded_at>=${startDate
          .toISOString()
          .slice(0, 10)} AND uploaded_at<=${endDate.toISOString().slice(0, 10)}`
      )
      .sort_by("uploaded_at", "desc")
      .max_results(30)
      .execute();

    return NextResponse.json(
      { success: true, audios: result.resources },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cloudinary search error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve audio files" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResponse = await ValidateWithToken();
  if (authResponse) return authResponse;

  const { searchParams } = new URL(req.url);
  const userID = searchParams.get("userID");
  const dateParam = searchParams.get("date");

  if (!userID) {
    return NextResponse.json(
      { error: "Missing userID query parameter" },
      { status: 400 }
    );
  }

  let dateStr: string;

  if (dateParam) {
    const parsedDate = new Date(dateParam);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }
    dateStr = parsedDate.toISOString().split("T")[0];
  } else {
    const today = new Date();
    dateStr = today.toISOString().split("T")[0];
  }

  try {
    const result = await cloudinary.search
      .expression(
        `resource_type:video AND folder:voice_uploads/${userID} AND uploaded_at>=${dateStr} AND uploaded_at<=${dateStr}`
      )
      .sort_by("uploaded_at", "desc")
      .max_results(100)
      .execute();

    const deleteResults = await Promise.all(
      (result.resources.map((r: any) => r.public_id) as string[]).map(
        (id: string) =>
          cloudinary.uploader.destroy(id, { resource_type: "video" })
      )
    );

    return NextResponse.json(
      { success: true, deleted: deleteResults.length },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete audio files" },
      { status: 500 }
    );
  }
}
