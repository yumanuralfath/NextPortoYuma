import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function ValidateWithToken() {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized, Please login again" },
      { status: 401 }
    );
  }
  return undefined;
}
