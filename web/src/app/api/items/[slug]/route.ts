import { NextRequest, NextResponse } from "next/server";
import { getItemBySlug, getSimilarItems } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const item = await getItemBySlug(slug);
    if (!item) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    const similar = await getSimilarItems(item.category_id, item.id);

    return NextResponse.json({ item, similar });
  } catch (error) {
    console.error("API item detail error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
