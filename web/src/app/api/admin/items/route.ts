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
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)),
      100
    );
    const offset = (page - 1) * pageSize;

    const database = getDb();

    const itemsResult = await database.execute({
      sql: `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
         FROM item i
         LEFT JOIN category c ON i.category_id = c.id
         LEFT JOIN source s ON i.source_id = s.id
         ORDER BY i.created_at DESC
         LIMIT ? OFFSET ?`,
      args: [pageSize, offset],
    });

    const totalResult = await database.execute({
      sql: "SELECT COUNT(*) as total FROM item",
      args: [],
    });

    const items = itemsResult.rows.map((row) => {
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < itemsResult.columns.length; i++) {
        obj[itemsResult.columns[i]] = row[i];
      }
      return obj;
    });

    const total = Number(totalResult.rows[0]?.[0] || 0);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Admin items GET error:", error);
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
    const { id, ...fields } = body as {
      id: number;
      title?: string;
      description?: string;
      price?: number;
      is_active?: number;
      is_sponsored?: number;
      category_id?: number;
      affiliate_url?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "Item id is required" }, { status: 400 });
    }

    const database = getDb();

    // Build dynamic UPDATE statement from allowed fields
    const allowedFields = [
      "title",
      "description",
      "price",
      "is_active",
      "is_sponsored",
      "category_id",
      "affiliate_url",
    ];

    const setClauses: string[] = [];
    const values: (string | number)[] = [];

    for (const field of allowedFields) {
      if (fields[field as keyof typeof fields] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(fields[field as keyof typeof fields] as string | number);
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Always bump updated_at
    setClauses.push("updated_at = datetime('now')");
    values.push(id);

    const sql = `UPDATE item SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = await database.execute({ sql, args: values });

    if (Number(result.lastInsertRowid) === 0 && result.rowsAffected === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updatedResult = await database.execute({
      sql: `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
         FROM item i
         LEFT JOIN category c ON i.category_id = c.id
         LEFT JOIN source s ON i.source_id = s.id
         WHERE i.id = ?`,
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
    console.error("Admin items PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body as { id?: number };

    if (!id) {
      return NextResponse.json({ error: "Item id is required" }, { status: 400 });
    }

    const database = getDb();

    // Soft-delete: set is_active = 0
    const result = await database.execute({
      sql: "UPDATE item SET is_active = 0, updated_at = datetime('now') WHERE id = ?",
      args: [id],
    });

    if (Number(result.lastInsertRowid) === 0 && result.rowsAffected === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item deactivated" });
  } catch (error) {
    console.error("Admin items DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
