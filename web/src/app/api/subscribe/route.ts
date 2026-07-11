import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    await subscribeEmail(email);
    return NextResponse.json({ success: true, message: "Inscription réussie !" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
