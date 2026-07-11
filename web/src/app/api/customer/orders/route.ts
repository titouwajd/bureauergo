import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getOrdersByCustomer } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    let token: string | undefined;

    token = request.cookies.get("auth_token")?.value;

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
    const orders = await getOrdersByCustomer(payload.customerId);

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    );
  }
}
