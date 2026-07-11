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

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();

    const logs = await query<Record<string, unknown>>(
      db,
      "SELECT * FROM scrape_log ORDER BY started_at DESC LIMIT 50",
      []
    );

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Admin scraper GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({
      message:
        "Scraper trigger received. In development, run manually: " +
        "cd ../../scrapers && ../scrapers/venv/bin/python content_scraper.py",
      status: "acknowledged",
    });
  } catch (error) {
    console.error("Admin scraper POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
