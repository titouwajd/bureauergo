import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export async function GET(_request: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
