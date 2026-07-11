import { NextRequest, NextResponse } from "next/server";
import { getItems, logSearch, getCategories } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
      sort: searchParams.get("sort") || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 20,
      query: searchParams.get("q") || undefined,
    };

    const { items, total } = await getItems(params);

    // Logger la recherche si query
    if (params.query) {
      const ip = request.headers.get("x-forwarded-for") || undefined;
      await logSearch(params.query, total, ip);
    }

    return NextResponse.json({
      items,
      total,
      page: params.page,
      pageSize: params.pageSize || 20,
      totalPages: Math.ceil(total / (params.pageSize || 20)),
    });
  } catch (error) {
    console.error("API items error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
