import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Simple authentication check
    if (email !== ADMIN_EMAIL || password !== "admin123") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = "admin-session-token";

    const response = NextResponse.json({ token });

    // Set httpOnly cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
