import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Chemins possibles pour la DB locale (essayés dans l'ordre)
const DB_PATHS = [
  path.join(process.cwd(), "data", "nichesite.db"),        // Vercel / production
  path.join(process.cwd(), "..", "data", "nichesite.db"),   // dev local depuis web/
];

function findLocalDb(): string {
  for (const p of DB_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  // Fallback : le premier chemin (Vercel)
  return DB_PATHS[0];
}

// ─── Client ──────────────────────────────────────────────────

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoToken = process.env.TURSO_AUTH_TOKEN;

    if (tursoUrl && tursoToken) {
      // Production : Turso (compatible Vercel serverless)
      client = createClient({ url: tursoUrl, authToken: tursoToken });
    } else {
      // Local : fichier SQLite
      client = createClient({ url: `file:${findLocalDb()}` });
    }
  }
  return client;
}

// ─── Helpers ─────────────────────────────────────────────────

async function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const db = getClient();
  const result = await db.execute({ sql, args: params as any[] });
  return result.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < result.columns.length; i++) {
      obj[result.columns[i]] = row[i];
    }
    return obj as T;
  });
}

async function queryOne<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

async function execute(sql: string, params: unknown[] = []): Promise<number> {
  const db = getClient();
  const result = await db.execute({ sql, args: params as any[] });
  return Number(result.lastInsertRowid || 0);
}

// ─── Types ───────────────────────────────────────────────────

export interface ItemRow {
  id: number; title: string; slug: string; description: string | null;
  price: number | null; currency: string; rating: number | null;
  review_count: number; image_path: string | null; affiliate_url: string | null;
  original_url: string; source_id: number; category_id: number; brand: string | null;
  availability: string; is_active: number; is_sponsored: number;
  created_at: string; updated_at: string; price_updated_at: string | null;
  category_name?: string; category_slug?: string; source_name?: string;
}

export interface CategoryRow {
  id: number; name: string; slug: string; description: string | null; item_count: number;
}

export interface ProductRow {
  id: number; title: string; slug: string; description: string | null;
  price: number; file_path: string | null; file_size: number | null;
  image_path: string | null; category: string; is_active: number;
  sales_count: number; created_at: string; updated_at: string;
}

export interface CustomerRow {
  id: number; email: string; password_hash: string; name: string | null; created_at: string;
}

export interface OrderRow {
  id: number; customer_id: number; status: string; total: number;
  stripe_session_id: string | null; created_at: string;
}

export interface OrderItemRow {
  id: number; order_id: number; product_id: number; quantity: number; unit_price: number;
}

export interface DownloadTokenRow {
  id: number; token: string; order_item_id: number; customer_id: number;
  product_id: number; expires_at: string; used_at: string | null; created_at: string;
}

export interface RevenueLogRow {
  id: number; source: string; amount: number; description: string | null; recorded_at: string;
}

// ─── Items ──────────────────────────────────────────────────

export async function getItems(params: {
  category?: string; minPrice?: number; maxPrice?: number; minRating?: number;
  sort?: string; page?: number; pageSize?: number; query?: string;
}): Promise<{ items: ItemRow[]; total: number }> {
  const page = params.page || 1;
  const pageSize = Math.min(params.pageSize || 20, 50);
  const offset = (page - 1) * pageSize;

  let where = "WHERE i.is_active = 1";
  const binds: unknown[] = [];

  if (params.category) { where += " AND c.slug = ?"; binds.push(params.category); }
  if (params.minPrice !== undefined) { where += " AND i.price >= ?"; binds.push(params.minPrice); }
  if (params.maxPrice !== undefined) { where += " AND i.price <= ?"; binds.push(params.maxPrice); }
  if (params.minRating !== undefined) { where += " AND i.rating >= ?"; binds.push(params.minRating); }
  if (params.query) {
    where += " AND (i.title LIKE ? OR i.description LIKE ? OR i.brand LIKE ?)";
    const q = `%${params.query}%`; binds.push(q, q, q);
  }

  let orderBy = "ORDER BY i.rating DESC, i.review_count DESC";
  switch (params.sort) {
    case "price_asc": orderBy = "ORDER BY i.price ASC"; break;
    case "price_desc": orderBy = "ORDER BY i.price DESC"; break;
    case "recent": orderBy = "ORDER BY i.created_at DESC"; break;
    case "popular": orderBy = "ORDER BY i.review_count DESC"; break;
  }
  const sponsoredFirst = "ORDER BY i.is_sponsored DESC, " + orderBy.slice(9);

  const sql = `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
    FROM item i JOIN category c ON i.category_id = c.id JOIN source s ON i.source_id = s.id
    ${where} ${sponsoredFirst} LIMIT ? OFFSET ?`;

  const countSql = `SELECT COUNT(*) as total FROM item i JOIN category c ON i.category_id = c.id ${where}`;

  const items = await query<ItemRow>(sql, [...binds, pageSize, offset]);
  const countRow = await queryOne<{ total: number }>(countSql, binds);
  return { items, total: countRow?.total || 0 };
}

export async function getItemBySlug(slug: string): Promise<ItemRow | null> {
  return queryOne<ItemRow>(
    `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
     FROM item i JOIN category c ON i.category_id = c.id JOIN source s ON i.source_id = s.id
     WHERE i.slug = ? AND i.is_active = 1`, [slug]);
}

export async function getSimilarItems(categoryId: number, excludeId: number, limit = 6): Promise<ItemRow[]> {
  return query<ItemRow>(
    `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
     FROM item i JOIN category c ON i.category_id = c.id JOIN source s ON i.source_id = s.id
     WHERE i.category_id = ? AND i.id != ? AND i.is_active = 1 ORDER BY i.rating DESC LIMIT ?`,
    [categoryId, excludeId, limit]);
}

// ─── Categories ─────────────────────────────────────────────

export async function getCategories(): Promise<CategoryRow[]> {
  return query<CategoryRow>("SELECT * FROM category WHERE item_count > 0 ORDER BY item_count DESC");
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  return queryOne<CategoryRow>("SELECT * FROM category WHERE slug = ?", [slug]);
}

// ─── Search ─────────────────────────────────────────────────

export async function logSearch(q: string, resultsCount: number, ip?: string): Promise<void> {
  await execute("INSERT INTO search_log (query, results_count, ip_address) VALUES (?, ?, ?)", [q, resultsCount, ip || null]);
}

// ─── Affiliate ──────────────────────────────────────────────

export async function getAffiliateUrl(itemId: number): Promise<string | null> {
  const row = await queryOne<{ affiliate_url: string }>("SELECT affiliate_url FROM item WHERE id = ? AND is_active = 1", [itemId]);
  return row?.affiliate_url || null;
}

export async function logAffiliateClick(itemId: number, ip?: string, ua?: string): Promise<void> {
  await execute("INSERT INTO affiliate_click (item_id, ip_address, user_agent) VALUES (?, ?, ?)", [itemId, ip || null, ua || null]);
}

// ─── Newsletter ─────────────────────────────────────────────

export async function subscribeEmail(email: string): Promise<boolean> {
  try {
    await execute("INSERT OR IGNORE INTO subscriber (email) VALUES (?)", [email.toLowerCase().trim()]);
    return true;
  } catch { return false; }
}

// ─── Top Items ──────────────────────────────────────────────

export async function getTopItems(limit = 5): Promise<ItemRow[]> {
  return query<ItemRow>(
    `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
     FROM item i JOIN category c ON i.category_id = c.id JOIN source s ON i.source_id = s.id
     WHERE i.is_active = 1 ORDER BY i.rating DESC, i.review_count DESC LIMIT ?`, [limit]);
}

// ─── Products ───────────────────────────────────────────────

export async function getProducts(): Promise<ProductRow[]> {
  return query<ProductRow>("SELECT * FROM product WHERE is_active = 1 ORDER BY created_at DESC");
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  return queryOne<ProductRow>("SELECT * FROM product WHERE slug = ? AND is_active = 1", [slug]);
}

// ─── Customers ──────────────────────────────────────────────

export async function createCustomer(email: string, passwordHash: string, name?: string): Promise<number> {
  return execute("INSERT INTO customer (email, password_hash, name) VALUES (?, ?, ?)",
    [email.toLowerCase().trim(), passwordHash, name || null]);
}

export async function getCustomerByEmail(email: string): Promise<CustomerRow | null> {
  return queryOne<CustomerRow>("SELECT * FROM customer WHERE email = ?", [email.toLowerCase().trim()]);
}

export async function verifyCustomerPassword(email: string, password: string): Promise<CustomerRow | null> {
  return queryOne<CustomerRow>("SELECT * FROM customer WHERE email = ? AND password_hash = ?",
    [email.toLowerCase().trim(), password]);
}

// ─── Orders ─────────────────────────────────────────────────

export async function createOrder(customerId: number, total: number, stripeSessionId: string,
  items: { productId: number; quantity: number; unitPrice: number }[]): Promise<number> {
  const orderId = await execute(
    "INSERT INTO customer_order (customer_id, total, stripe_session_id, status) VALUES (?, ?, ?, 'pending')",
    [customerId, total, stripeSessionId]);
  for (const item of items) {
    await execute("INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
      [orderId, item.productId, item.quantity, item.unitPrice]);
  }
  return orderId;
}

export async function getOrdersByCustomer(customerId: number): Promise<OrderRow[]> {
  return query<OrderRow>("SELECT * FROM customer_order WHERE customer_id = ? ORDER BY created_at DESC", [customerId]);
}

export async function getOrderByStripeSession(sessionId: string): Promise<OrderRow | null> {
  return queryOne<OrderRow>("SELECT * FROM customer_order WHERE stripe_session_id = ?", [sessionId]);
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  await execute("UPDATE customer_order SET status = ? WHERE id = ?", [status, orderId]);
}

// ─── Download Tokens ────────────────────────────────────────

export async function createDownloadToken(orderItemId: number, customerId: number, productId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await execute(
    "INSERT INTO download_token (token, order_item_id, customer_id, product_id, expires_at) VALUES (?, ?, ?, ?, datetime('now', '+24 hours'))",
    [token, orderItemId, customerId, productId]);
  return token;
}

export async function validateDownloadToken(token: string): Promise<DownloadTokenRow | null> {
  return queryOne<DownloadTokenRow>(
    "SELECT * FROM download_token WHERE token = ? AND used_at IS NULL AND expires_at > datetime('now')",
    [token]);
}

export async function markTokenUsed(token: string): Promise<void> {
  await execute("UPDATE download_token SET used_at = datetime('now') WHERE token = ?", [token]);
}

// ─── Revenue ────────────────────────────────────────────────

export async function logRevenue(source: string, amount: number, description?: string): Promise<void> {
  await execute("INSERT INTO revenue_log (source, amount, description) VALUES (?, ?, ?)",
    [source, amount, description || null]);
}

export async function getRevenueSummary(): Promise<{ source: string; total: number }[]> {
  return query<{ source: string; total: number }>(
    "SELECT source, SUM(amount) as total FROM revenue_log GROUP BY source ORDER BY total DESC");
}

export async function getMonthlyRevenue(): Promise<number> {
  const row = await queryOne<{ total: number }>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM revenue_log WHERE recorded_at >= datetime('now', '-30 days')");
  return row?.total || 0;
}

export async function getTotalCustomers(): Promise<number> {
  const row = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM customer");
  return row?.total || 0;
}

export async function getTotalOrders(): Promise<number> {
  const row = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM customer_order WHERE status = 'completed'");
  return row?.total || 0;
}
