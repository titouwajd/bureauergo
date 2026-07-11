import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getCustomerByEmail } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    let token: string | undefined;

    // Try cookie first
    token = request.cookies.get("auth_token")?.value;

    // Try Authorization header
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const customer = await getCustomerByEmail(payload.email);

    if (!customer) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      createdAt: customer.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    );
  }
}
