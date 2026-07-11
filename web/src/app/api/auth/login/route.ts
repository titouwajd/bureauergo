import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerPassword } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const customer = await verifyCustomerPassword(email, password);

    if (!customer) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = signToken({ customerId: customer.id, email: customer.email });

    const response = NextResponse.json({
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
