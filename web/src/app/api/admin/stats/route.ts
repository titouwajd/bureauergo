import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createClient } from "@libsql/client";
import path from "path";

const DB_PATH = path.join(process.cwd(), "..", "data", "nichesite.db");

function getDb() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  if (tursoUrl && tursoToken) {
    return createClient({ url: tursoUrl, authToken: tursoToken });
  }
  return createClient({ url: `file:${DB_PATH}` });
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const database = getDb();

    const totalItemsResult = await database.execute({
      sql: "SELECT COUNT(*) as count FROM item",
      args: [],
    });
    const totalItems = Number(totalItemsResult.rows[0]?.[0] || 0);

    const activeItemsResult = await database.execute({
      sql: "SELECT COUNT(*) as count FROM item WHERE is_active = 1",
      args: [],
    });
    const activeItems = Number(activeItemsResult.rows[0]?.[0] || 0);

    const totalCategoriesResult = await database.execute({
      sql: "SELECT COUNT(*) as count FROM category",
      args: [],
    });
    const totalCategories = Number(totalCategoriesResult.rows[0]?.[0] || 0);

    const totalSubscribersResult = await database.execute({
      sql: "SELECT COUNT(*) as count FROM subscriber",
      args: [],
    });
    const totalSubscribers = Number(totalSubscribersResult.rows[0]?.[0] || 0);

    const totalClicksResult = await database.execute({
      sql: "SELECT COUNT(*) as count FROM affiliate_click",
      args: [],
    });
    const totalClicks = Number(totalClicksResult.rows[0]?.[0] || 0);

    const recentSearchesResult = await database.execute({
      sql: "SELECT id, query, results_count, searched_at FROM search_log ORDER BY searched_at DESC LIMIT 20",
      args: [],
    });
    const recentSearches = recentSearchesResult.rows.map((row) => {
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < recentSearchesResult.columns.length; i++) {
        obj[recentSearchesResult.columns[i]] = row[i];
      }
      return obj;
    });

    const recentScrapesResult = await database.execute({
      sql: "SELECT * FROM scrape_log ORDER BY started_at DESC LIMIT 5",
      args: [],
    });
    const recentScrapes = recentScrapesResult.rows.map((row) => {
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < recentScrapesResult.columns.length; i++) {
        obj[recentScrapesResult.columns[i]] = row[i];
      }
      return obj;
    });

    return NextResponse.json({
      total_items: totalItems,
      active_items: activeItems,
      total_categories: totalCategories,
      total_subscribers: totalSubscribers,
      total_clicks: totalClicks,
      recent_searches: recentSearches,
      recent_scrapes: recentScrapes,
    });
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
