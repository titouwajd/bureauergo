import { createClient, type Client } from "@libsql/client";
import crypto from "crypto";

// ─── JSON Data (bundled at build time) ─────────────────────
import categoriesData from "../../data/categories.json";
import itemsData from "../../data/items.json";
import topItemsData from "../../data/top_items.json";
import productsData from "../../data/products.json";

function isTurso(): boolean {
  return !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

// ─── Turso client ───────────────────────────────────────────

let turso: Client | null = null;

function getTurso(): Client {
  if (!turso) {
    turso = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return turso;
}

// ─── Types ───────────────────────────────────────────────────

export interface ItemRow { id: number; title: string; slug: string; description: string | null;
  price: number | null; currency: string; rating: number | null; review_count: number;
  image_path: string | null; affiliate_url: string | null; original_url: string;
  source_id: number; category_id: number; brand: string | null; availability: string;
  is_active: number; is_sponsored: number; created_at: string; updated_at: string;
  price_updated_at: string | null; category_name?: string; category_slug?: string; source_name?: string; }

export interface CategoryRow { id: number; name: string; slug: string; description: string | null; item_count: number; }
export interface ProductRow { id: number; title: string; slug: string; description: string | null;
  price: number; file_path: string | null; file_size: number | null; image_path: string | null;
  category: string; is_active: number; sales_count: number; created_at: string; updated_at: string; }
export interface CustomerRow { id: number; email: string; password_hash: string; name: string | null; created_at: string; }
export interface OrderRow { id: number; customer_id: number; status: string; total: number; stripe_session_id: string | null; created_at: string; }
export interface OrderItemRow { id: number; order_id: number; product_id: number; quantity: number; unit_price: number; }
export interface DownloadTokenRow { id: number; token: string; order_item_id: number; customer_id: number; product_id: number; expires_at: string; used_at: string | null; created_at: string; }
export interface RevenueLogRow { id: number; source: string; amount: number; description: string | null; recorded_at: string; }

// ─── Items (from JSON) ──────────────────────────────────────

const _items: ItemRow[] = itemsData as ItemRow[];
function allItems(): ItemRow[] { return _items; }

export async function getItems(params: { category?: string; minPrice?: number; maxPrice?: number;
  minRating?: number; sort?: string; page?: number; pageSize?: number; query?: string; }): Promise<{ items: ItemRow[]; total: number }> {
  let items = allItems().filter(i => i.is_active === 1);
  if (params.category) items = items.filter(i => i.category_slug === params.category);
  if (params.minPrice !== undefined) items = items.filter(i => i.price !== null && i.price >= params.minPrice!);
  if (params.maxPrice !== undefined) items = items.filter(i => i.price !== null && i.price <= params.maxPrice!);
  if (params.minRating !== undefined) items = items.filter(i => i.rating !== null && i.rating >= params.minRating!);
  if (params.query) {
    const q = params.query.toLowerCase();
    items = items.filter(i => (i.title || "").toLowerCase().includes(q) || (i.description || "").toLowerCase().includes(q) || (i.brand || "").toLowerCase().includes(q));
  }
  // Sort
  items.sort((a, b) => {
    if (a.is_sponsored && !b.is_sponsored) return -1;
    if (!a.is_sponsored && b.is_sponsored) return 1;
    switch (params.sort) {
      case "price_asc": return (a.price || 0) - (b.price || 0);
      case "price_desc": return (b.price || 0) - (a.price || 0);
      case "recent": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "popular": return (b.review_count || 0) - (a.review_count || 0);
      default: return (b.rating || 0) - (a.rating || 0);
    }
  });
  const total = items.length;
  const page = params.page || 1;
  const pageSize = Math.min(params.pageSize || 20, 50);
  return { items: items.slice((page - 1) * pageSize, page * pageSize), total };
}

export async function getItemBySlug(slug: string): Promise<ItemRow | null> {
  return allItems().find(i => i.slug === slug && i.is_active === 1) || null;
}

export async function getSimilarItems(categoryId: number, excludeId: number, limit = 6): Promise<ItemRow[]> {
  return allItems()
    .filter(i => i.category_id === categoryId && i.id !== excludeId && i.is_active === 1)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

// ─── Categories (from JSON) ─────────────────────────────────

const _cats: CategoryRow[] = categoriesData as CategoryRow[];
function allCats(): CategoryRow[] { return _cats; }

export async function getCategories(): Promise<CategoryRow[]> {
  return allCats().filter(c => c.item_count > 0).sort((a, b) => b.item_count - a.item_count);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  return allCats().find(c => c.slug === slug) || null;
}

// ─── Top Items (from JSON) ──────────────────────────────────

export async function getTopItems(limit = 5): Promise<ItemRow[]> {
  return (topItemsData as ItemRow[]).slice(0, limit);
}

// ─── Products (from JSON) ───────────────────────────────────

const _products: ProductRow[] = productsData as ProductRow[];
function allProducts(): ProductRow[] { return _products; }

export async function getProducts(): Promise<ProductRow[]> {
  return allProducts().filter(p => p.is_active === 1);
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  return allProducts().find(p => p.slug === slug && p.is_active === 1) || null;
}

// ─── Runtime-only functions (need real DB for writes) ──────

export async function logSearch(_q: string, _c: number, _ip?: string): Promise<void> {}
export async function getAffiliateUrl(itemId: number): Promise<string | null> {
  return allItems().find(i => i.id === itemId)?.affiliate_url || null;
}
export async function logAffiliateClick(_id: number, _ip?: string, _ua?: string): Promise<void> {}
export async function subscribeEmail(_email: string): Promise<boolean> { return false; }
export async function createCustomer(_e: string, _h: string, _n?: string): Promise<number> { return 0; }
export async function getCustomerByEmail(_email: string): Promise<CustomerRow | null> { return null; }
export async function verifyCustomerPassword(_e: string, _p: string): Promise<CustomerRow | null> { return null; }
export async function createOrder(_cid: number, _t: number, _sid: string, _items: any[]): Promise<number> { return 0; }
export async function getOrdersByCustomer(_cid: number): Promise<OrderRow[]> { return []; }
export async function getOrderByStripeSession(_sid: string): Promise<OrderRow | null> { return null; }
export async function updateOrderStatus(_oid: number, _s: string): Promise<void> {}
export async function createDownloadToken(_oi: number, _ci: number, _pi: number): Promise<string> { return ""; }
export async function validateDownloadToken(_t: string): Promise<DownloadTokenRow | null> { return null; }
export async function markTokenUsed(_t: string): Promise<void> {}
export async function logRevenue(_s: string, _a: number, _d?: string): Promise<void> {}
export async function getRevenueSummary(): Promise<{ source: string; total: number }[]> { return []; }
export async function getMonthlyRevenue(): Promise<number> { return 0; }
export async function getTotalCustomers(): Promise<number> { return 0; }
export async function getTotalOrders(): Promise<number> { return 0; }
