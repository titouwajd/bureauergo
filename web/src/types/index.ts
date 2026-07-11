// Types pour l'application
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  item_count: number;
}

export interface Item {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  currency: string;
  rating: number | null;
  review_count: number;
  image_path: string | null;
  affiliate_url: string | null;
  original_url: string | null;
  source_id: number;
  category_id: number;
  brand: string | null;
  availability: string;
  is_active: number;
  is_sponsored: number;
  created_at: string;
  updated_at: string;
  price_updated_at: string | null;
}

export interface ItemWithCategory extends Item {
  category_name: string;
  category_slug: string;
  source_name: string;
}

export interface SearchResult {
  items: ItemWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'recent' | 'popular';
  page?: number;
  pageSize?: number;
  query?: string;
}

export interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  is_active: number;
}

export interface SearchLog {
  id: number;
  query: string;
  results_count: number;
  searched_at: string;
}

export interface AffiliateClick {
  id: number;
  item_id: number;
  clicked_at: string;
}

// ─── Shop / E-commerce ────────────────────────────────────────

export interface ProductRow {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  file_path: string | null;
  file_size: number | null;
  image_path: string | null;
  category: string;
  is_active: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerRow {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
}

export interface OrderRow {
  id: number;
  customer_id: number;
  status: string;
  total: number;
  stripe_session_id: string | null;
  created_at: string;
}

export interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product_title?: string;
}

export interface DownloadTokenRow {
  id: number;
  token: string;
  order_item_id: number;
  customer_id: number;
  product_id: number;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface RevenueLogRow {
  id: number;
  source: string;
  amount: number;
  description: string | null;
  recorded_at: string;
}
