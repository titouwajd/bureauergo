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

async function query<T>(db: ReturnType<typeof getDb>, sql: string, args: any[] = []): Promise<T[]> {
  const result = await db.execute({ sql, args });
  return result.rows.map((row) => {
    const obj: any = {};
    result.columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj as T;
  });
}

async function count(db: ReturnType<typeof getDb>, table: string, where = ""): Promise<number> {
  const sql = where
    ? `SELECT COUNT(*) as count FROM ${table} WHERE ${where}`
    : `SELECT COUNT(*) as count FROM ${table}`;
  const rows = await query<{ count: number }>(db, sql, []);
  return Number(rows[0]?.count || 0);
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();

    const totalItems = await count(db, "item");
    const activeItems = await count(db, "item", "is_active = 1");
    const totalCategories = await count(db, "category");
    const totalSubscribers = await count(db, "subscriber");
    const totalClicks = await count(db, "affiliate_click");

    const recentSearches = await query<Record<string, unknown>>(
      db,
      "SELECT id, query, results_count, searched_at FROM search_log ORDER BY searched_at DESC LIMIT 20",
      []
    );

    const recentScrapes = await query<Record<string, unknown>>(
      db,
      "SELECT * FROM scrape_log ORDER BY started_at DESC LIMIT 5",
      []
    );

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
