import { NextRequest, NextResponse } from "next/server";
import { getItems, logSearch } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    if (q.length < 1) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const { items, total } = await getItems({
      query: q,
      pageSize: 10,
      sort: "popular",
    });

    const ip = request.headers.get("x-forwarded-for") || undefined;
    await logSearch(q, total, ip);

    return NextResponse.json({ items, total });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
