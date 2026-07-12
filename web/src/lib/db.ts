import { createClient, type Client } from "@libsql/client";
import crypto from "crypto";

// ─── Types ───────────────────────────────────────────────────

export interface ItemRow {
  id: number; title: string; slug: string; description: string | null;
  price: number | null; currency: string; rating: number | null; review_count: number;
  image_path: string | null; affiliate_url: string | null; original_url: string;
  source_id: number; category_id: number; brand: string | null; availability: string;
  is_active: number; is_sponsored: number; created_at: string; updated_at: string;
  price_updated_at: string | null; category_name?: string; category_slug?: string; source_name?: string;
}

export interface CategoryRow {
  id: number; name: string; slug: string; description: string | null; item_count: number;
}

export interface ProductRow {
  id: number; title: string; slug: string; description: string | null;
  price: number; file_path: string | null; file_size: number | null; image_path: string | null;
  category: string; is_active: number; sales_count: number; created_at: string; updated_at: string;
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

// ─── Turso client ────────────────────────────────────────────

function isTurso(): boolean {
  return !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

let turso: Client | null = null;

function getTurso(): Client {
  if (!turso) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
    }
    turso = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return turso;
}

// ─── Helpers ─────────────────────────────────────────────────

function rowToItem(row: Record<string, unknown>): ItemRow {
  return {
    id: row.id as number,
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string | null,
    price: row.price as number | null,
    currency: (row.currency as string) || "EUR",
    rating: row.rating as number | null,
    review_count: row.review_count as number,
    image_path: row.image_path as string | null,
    affiliate_url: row.affiliate_url as string | null,
    original_url: row.original_url as string,
    source_id: row.source_id as number,
    category_id: row.category_id as number,
    brand: row.brand as string | null,
    availability: (row.availability as string) || "In stock",
    is_active: row.is_active as number,
    is_sponsored: row.is_sponsored as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    price_updated_at: row.price_updated_at as string | null,
    category_name: row.category_name as string | undefined,
    category_slug: row.category_slug as string | undefined,
    source_name: row.source_name as string | undefined,
  };
}

// ─── Items ───────────────────────────────────────────────────

export async function getItems(params: {
  category?: string; minPrice?: number; maxPrice?: number;
  minRating?: number; sort?: string; page?: number; pageSize?: number; query?: string;
}): Promise<{ items: ItemRow[]; total: number }> {
  const db = getTurso();
  const conditions: string[] = ["i.is_active = 1"];
  const args: any[] = [];

  if (params.category) {
    conditions.push("c.slug = ?");
    args.push(params.category);
  }
  if (params.minPrice !== undefined) {
    conditions.push("i.price >= ?");
    args.push(params.minPrice);
  }
  if (params.maxPrice !== undefined) {
    conditions.push("i.price <= ?");
    args.push(params.maxPrice);
  }
  if (params.minRating !== undefined) {
    conditions.push("i.rating >= ?");
    args.push(params.minRating);
  }
  if (params.query) {
    conditions.push("(i.title LIKE ? OR i.description LIKE ? OR i.brand LIKE ?)");
    const q = `%${params.query}%`;
    args.push(q, q, q);
  }

  const where = conditions.join(" AND ");

  // Count
  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM item i LEFT JOIN category c ON i.category_id = c.id WHERE ${where}`,
    args,
  });
  const total = countResult.rows[0].total as number;

  // Sort
  let orderBy = "i.is_sponsored DESC, i.rating DESC";
  switch (params.sort) {
    case "price_asc": orderBy = "i.is_sponsored DESC, i.price ASC"; break;
    case "price_desc": orderBy = "i.is_sponsored DESC, i.price DESC"; break;
    case "recent": orderBy = "i.is_sponsored DESC, i.created_at DESC"; break;
    case "popular": orderBy = "i.is_sponsored DESC, i.review_count DESC"; break;
  }

  const page = params.page || 1;
  const pageSize = Math.min(params.pageSize || 20, 50);
  const offset = (page - 1) * pageSize;

  const result = await db.execute({
    sql: `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
          FROM item i
          LEFT JOIN category c ON i.category_id = c.id
          LEFT JOIN source s ON i.source_id = s.id
          WHERE ${where}
          ORDER BY ${orderBy}
          LIMIT ? OFFSET ?`,
    args: [...args, pageSize, offset],
  });

  const items = result.rows.map((row) => rowToItem(row as unknown as Record<string, unknown>));
  return { items, total };
}

export async function getItemBySlug(slug: string): Promise<ItemRow | null> {
  const db = getTurso();
  const result = await db.execute({
    sql: `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
          FROM item i
          LEFT JOIN category c ON i.category_id = c.id
          LEFT JOIN source s ON i.source_id = s.id
          WHERE i.slug = ? AND i.is_active = 1`,
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return rowToItem(result.rows[0] as unknown as Record<string, unknown>);
}

export async function getSimilarItems(categoryId: number, excludeId: number, limit = 6): Promise<ItemRow[]> {
  const db = getTurso();
  const result = await db.execute({
    sql: `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
          FROM item i
          LEFT JOIN category c ON i.category_id = c.id
          LEFT JOIN source s ON i.source_id = s.id
          WHERE i.category_id = ? AND i.id != ? AND i.is_active = 1
          ORDER BY i.rating DESC
          LIMIT ?`,
    args: [categoryId, excludeId, limit],
  });
  return result.rows.map((row) => rowToItem(row as unknown as Record<string, unknown>));
}

// ─── Categories ──────────────────────────────────────────────

export async function getCategories(): Promise<CategoryRow[]> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM category WHERE item_count > 0 ORDER BY item_count DESC",
  });
  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    item_count: row.item_count as number,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM category WHERE slug = ?",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id as number,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    item_count: row.item_count as number,
  };
}

// ─── Top Items ───────────────────────────────────────────────

export async function getTopItems(limit = 5): Promise<ItemRow[]> {
  const db = getTurso();
  const result = await db.execute({
    sql: `SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
          FROM item i
          LEFT JOIN category c ON i.category_id = c.id
          LEFT JOIN source s ON i.source_id = s.id
          WHERE i.is_active = 1
          ORDER BY i.rating DESC, i.review_count DESC
          LIMIT ?`,
    args: [limit],
  });
  return result.rows.map((row) => rowToItem(row as unknown as Record<string, unknown>));
}

// ─── Products ────────────────────────────────────────────────

export async function getProducts(): Promise<ProductRow[]> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM products WHERE is_active = 1 ORDER BY sales_count DESC",
  });
  return result.rows.map((row) => ({
    id: row.id as number,
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string | null,
    price: row.price as number,
    file_path: row.file_path as string | null,
    file_size: row.file_size as number | null,
    image_path: row.image_path as string | null,
    category: row.category as string,
    is_active: row.is_active as number,
    sales_count: row.sales_count as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM products WHERE slug = ? AND is_active = 1",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id as number,
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string | null,
    price: row.price as number,
    file_path: row.file_path as string | null,
    file_size: row.file_size as number | null,
    image_path: row.image_path as string | null,
    category: row.category as string,
    is_active: row.is_active as number,
    sales_count: row.sales_count as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

// ─── Search log ──────────────────────────────────────────────

export async function logSearch(q: string, c: number, ip?: string): Promise<void> {
  if (!isTurso()) return;
  const db = getTurso();
  await db.execute({
    sql: "INSERT INTO search_log (query, results_count, ip_address) VALUES (?, ?, ?)",
    args: [q, c, ip || null],
  });
}

// ─── Affiliate ───────────────────────────────────────────────

export async function getAffiliateUrl(itemId: number): Promise<string | null> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT affiliate_url FROM item WHERE id = ?",
    args: [itemId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0].affiliate_url as string | null;
}

export async function logAffiliateClick(id: number, ip?: string, ua?: string): Promise<void> {
  if (!isTurso()) return;
  const db = getTurso();
  await db.execute({
    sql: "INSERT INTO affiliate_click (item_id, ip_address, user_agent) VALUES (?, ?, ?)",
    args: [id, ip || null, ua || null],
  });
}

// ─── Newsletter ──────────────────────────────────────────────

export async function subscribeEmail(email: string): Promise<boolean> {
  if (!isTurso()) return false;
  try {
    const db = getTurso();
    await db.execute({
      sql: "INSERT OR IGNORE INTO subscriber (email) VALUES (?)",
      args: [email],
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Customers ───────────────────────────────────────────────

export async function createCustomer(e: string, h: string, n?: string): Promise<number> {
  const db = getTurso();
  const result = await db.execute({
    sql: "INSERT INTO customers (email, password_hash, name) VALUES (?, ?, ?)",
    args: [e, h, n || null],
  });
  return Number(result.lastInsertRowid);
}

export async function getCustomerByEmail(email: string): Promise<CustomerRow | null> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM customers WHERE email = ?",
    args: [email],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id as number,
    email: row.email as string,
    password_hash: row.password_hash as string,
    name: row.name as string | null,
    created_at: row.created_at as string,
  };
}

export async function verifyCustomerPassword(e: string, p: string): Promise<CustomerRow | null> {
  // In production, use bcrypt.compare. For now, simple check.
  const customer = await getCustomerByEmail(e);
  if (!customer) return null;
  // TODO: replace with proper password hashing (bcrypt)
  if (customer.password_hash === p) return customer;
  return null;
}

// ─── Orders ──────────────────────────────────────────────────

export async function createOrder(cid: number, t: number, sid: string, items: { product_id: number; quantity: number; unit_price: number }[]): Promise<number> {
  const db = getTurso();
  const orderResult = await db.execute({
    sql: "INSERT INTO orders (customer_id, total, stripe_session_id, status) VALUES (?, ?, ?, 'pending')",
    args: [cid, t, sid],
  });
  const orderId = Number(orderResult.lastInsertRowid);

  for (const item of items) {
    await db.execute({
      sql: "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
      args: [orderId, item.product_id, item.quantity, item.unit_price],
    });
  }
  return orderId;
}

export async function getOrdersByCustomer(cid: number): Promise<OrderRow[]> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC",
    args: [cid],
  });
  return result.rows.map((row) => ({
    id: row.id as number,
    customer_id: row.customer_id as number,
    status: row.status as string,
    total: row.total as number,
    stripe_session_id: row.stripe_session_id as string | null,
    created_at: row.created_at as string,
  }));
}

export async function getOrderByStripeSession(sid: string): Promise<OrderRow | null> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM orders WHERE stripe_session_id = ?",
    args: [sid],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id as number,
    customer_id: row.customer_id as number,
    status: row.status as string,
    total: row.total as number,
    stripe_session_id: row.stripe_session_id as string | null,
    created_at: row.created_at as string,
  };
}

export async function updateOrderStatus(oid: number, s: string): Promise<void> {
  const db = getTurso();
  await db.execute({
    sql: "UPDATE orders SET status = ? WHERE id = ?",
    args: [s, oid],
  });
}

// ─── Download tokens ────────────────────────────────────────

export async function createDownloadToken(oi: number, ci: number, pi: number): Promise<string> {
  const db = getTurso();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  await db.execute({
    sql: "INSERT INTO download_tokens (token, order_item_id, customer_id, product_id, expires_at) VALUES (?, ?, ?, ?, ?)",
    args: [token, oi, ci, pi, expiresAt],
  });
  return token;
}

export async function validateDownloadToken(t: string): Promise<DownloadTokenRow | null> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM download_tokens WHERE token = ? AND used_at IS NULL AND expires_at > datetime('now')",
    args: [t],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id as number,
    token: row.token as string,
    order_item_id: row.order_item_id as number,
    customer_id: row.customer_id as number,
    product_id: row.product_id as number,
    expires_at: row.expires_at as string,
    used_at: row.used_at as string | null,
    created_at: row.created_at as string,
  };
}

export async function markTokenUsed(t: string): Promise<void> {
  const db = getTurso();
  await db.execute({
    sql: "UPDATE download_tokens SET used_at = datetime('now') WHERE token = ?",
    args: [t],
  });
}

// ─── Revenue ─────────────────────────────────────────────────

export async function logRevenue(s: string, a: number, d?: string): Promise<void> {
  const db = getTurso();
  await db.execute({
    sql: "INSERT INTO revenue_log (source, amount, description) VALUES (?, ?, ?)",
    args: [s, a, d || null],
  });
}

export async function getRevenueSummary(): Promise<{ source: string; total: number }[]> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT source, SUM(amount) as total FROM revenue_log GROUP BY source ORDER BY total DESC",
  });
  return result.rows.map((row) => ({
    source: row.source as string,
    total: row.total as number,
  }));
}

export async function getMonthlyRevenue(): Promise<number> {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT COALESCE(SUM(amount), 0) as total FROM revenue_log WHERE recorded_at >= date('now', 'start of month')",
  });
  return result.rows[0].total as number;
}

export async function getTotalCustomers(): Promise<number> {
  const db = getTurso();
  const result = await db.execute({ sql: "SELECT COUNT(*) as total FROM customers" });
  return result.rows[0].total as number;
}

export async function getTotalOrders(): Promise<number> {
  const db = getTurso();
  const result = await db.execute({ sql: "SELECT COUNT(*) as total FROM orders" });
  return result.rows[0].total as number;
}
