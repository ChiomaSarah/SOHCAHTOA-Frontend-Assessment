import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { User } from "@/interface";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const USERS: User[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567891",
    email: "admin@sohcahtoa.com",
    passwordHash:
      "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    role: "admin",
    name: "Emmanuel Israel",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678902",
    email: "analyst@sohcahtoa.com",
    passwordHash:
      "20249749412d73a3f5799f6f1dcf910e7b4aa3ce4de133b1f8a63c044792a4e9",
    role: "analyst",
    name: "Chioma Osuji",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = USERS.find(
      (u) => u.email === email && u.passwordHash === hashPassword(password),
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password!" },
        { status: 401 },
      );
    }

    const accessToken = `access_${user.id}_${Date.now()}`;
    const refreshToken = `refresh_${user.id}_${Date.now()}`;
    const expiresIn = 60 * 15;

    const response = NextResponse.json({
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn,
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 },
    );
  }
}
