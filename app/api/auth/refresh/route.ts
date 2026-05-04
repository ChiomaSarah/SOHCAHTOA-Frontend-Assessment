import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found!" },
        { status: 401 },
      );
    }

    const isValid = refreshToken.startsWith("refresh_");

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid refresh token!" },
        { status: 401 },
      );
    }

    const userId = refreshToken.split("_")[1];

    const newAccessToken = `access_${userId}_${Date.now()}`;
    const expiresIn = 60 * 15;

    const response = NextResponse.json({
      accessToken: newAccessToken,
      expiresIn,
    });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
