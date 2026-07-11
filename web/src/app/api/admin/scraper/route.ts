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

    const logsResult = await database.execute({
      sql: "SELECT * FROM scrape_log ORDER BY started_at DESC LIMIT 50",
      args: [],
    });

    const logs = logsResult.rows.map((row) => {
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < logsResult.columns.length; i++) {
        obj[logsResult.columns[i]] = row[i];
      }
      return obj;
    });

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
