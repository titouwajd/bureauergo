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

    // Group affiliate clicks by item with count and last clicked time
    const clicksResult = await database.execute({
      sql: `SELECT
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
      args: [],
    });

    const clicks = clicksResult.rows.map((row) => {
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < clicksResult.columns.length; i++) {
        obj[clicksResult.columns[i]] = row[i];
      }
      return obj;
    });

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

    const database = getDb();

    const result = await database.execute({
      sql: "UPDATE item SET affiliate_url = ?, updated_at = datetime('now') WHERE id = ?",
      args: [affiliate_url, id],
    });

    if (Number(result.lastInsertRowid) === 0 && result.rowsAffected === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updatedResult = await database.execute({
      sql: "SELECT id, title, slug, affiliate_url FROM item WHERE id = ?",
      args: [id],
    });

    const updated = updatedResult.rows[0]
      ? (() => {
          const obj: Record<string, unknown> = {};
          for (let i = 0; i < updatedResult.columns.length; i++) {
            obj[updatedResult.columns[i]] = updatedResult.rows[0][i];
          }
          return obj;
        })()
      : null;

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("Admin affiliates PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
