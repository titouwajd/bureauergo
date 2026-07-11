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

    // Group affiliate clicks by item with count and last clicked time
    const clicks = await query<Record<string, unknown>>(
      db,
      `SELECT
           ac.item_id,
           i.title,
           i.slug,
           i.affiliate_url,
           COUNT(*) as click_count,
           MAX(ac.clicked_at) as last_clicked_at
         FROM affiliate_click ac
         JOIN item i ON ac.item_id = i.id
         GROUP BY ac.item_id
         ORDER BY last_clicked_at DESC`,
      []
    );

    return NextResponse.json({ clicks });
  } catch (error) {
    console.error("Admin affiliates GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, affiliate_url } = body as {
      id?: number;
      affiliate_url?: string;
    };

    if (!id || affiliate_url === undefined) {
      return NextResponse.json(
        { error: "Item id and affiliate_url are required" },
        { status: 400 }
      );
    }

    const db = getDb();

    const result = await db.execute({
      sql: "UPDATE item SET affiliate_url = ?, updated_at = datetime('now') WHERE id = ?",
      args: [affiliate_url, id],
    });

    if (Number(result.lastInsertRowid) === 0 && result.rowsAffected === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updatedRows = await query<Record<string, unknown>>(
      db,
      "SELECT id, title, slug, affiliate_url FROM item WHERE id = ?",
      [id]
    );

    return NextResponse.json({ item: updatedRows[0] || null });
  } catch (error) {
    console.error("Admin affiliates PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
