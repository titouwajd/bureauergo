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
      Math.max(1, parseInt(searchParams.get("pageSize") || "50", 10)),
      200
    );
    const offset = (page - 1) * pageSize;

    const database = getDb();

    const subscribersResult = await database.execute({
      sql: "SELECT * FROM subscriber ORDER BY subscribed_at DESC LIMIT ? OFFSET ?",
      args: [pageSize, offset],
    });

    const totalResult = await database.execute({
      sql: "SELECT COUNT(*) as total FROM subscriber",
      args: [],
    });

    const subscribers = subscribersResult.rows.map((row) => {
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < subscribersResult.columns.length; i++) {
        obj[subscribersResult.columns[i]] = row[i];
      }
      return obj;
    });

    const total = Number(totalResult.rows[0]?.[0] || 0);

    return NextResponse.json({
      subscribers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Admin subscribers GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
