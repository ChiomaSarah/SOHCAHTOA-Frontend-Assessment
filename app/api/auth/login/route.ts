import { NextRequest, NextResponse } from "next/server";

const USERS = [
  {
    id: "1",
    email: "admin@sohcahtoa.com",
    password: "admin123",
    role: "admin" as const,
    name: "Emmanuel Israel",
  },
  {
    id: "2",
    email: "analyst@sohcahtoa.com",
    password: "analyst123",
    role: "analyst" as const,
    name: "Emmanuel Israel",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
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
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
