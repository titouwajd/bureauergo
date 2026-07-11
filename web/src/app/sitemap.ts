import { createClient } from "@libsql/client";
import { SITE_URL } from "@/lib/constants";
import { MetadataRoute } from "next";
import path from "path";

export const dynamic = "force-dynamic";

const DB_PATH = path.join(process.cwd(), "..", "data", "nichesite.db");

function getClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  if (tursoUrl && tursoToken) return createClient({ url: tursoUrl, authToken: tursoToken });
  return createClient({ url: `file:${DB_PATH}` });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getClient();

  const itemsResult = await db.execute(
    "SELECT slug, updated_at FROM item WHERE is_active = 1",
  );
  const items = itemsResult.rows.map((row) => ({
    slug: String(row[0]),
    updated_at: String(row[1]),
  }));

  const categoriesResult = await db.execute(
    "SELECT slug, updated_at FROM category WHERE item_count > 0",
  );
  const categories = categoriesResult.rows.map((row) => ({
    slug: String(row[0]),
    updated_at: row[1] ? String(row[1]) : undefined,
  }));

  const staticPages = [
    { url: SITE_URL, priority: 1, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/contact`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/mentions-legales`, priority: 0.1, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/politique-confidentialite`, priority: 0.1, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/conditions-utilisation`, priority: 0.1, changeFrequency: "yearly" as const },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${SITE_URL}/categorie/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const itemPages = items.map((item) => ({
    url: `${SITE_URL}/item/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...itemPages];
}
