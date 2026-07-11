"""Export SQLite data to JSON for static site generation."""
import sqlite3, json, os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "web", "data")
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nichesite.db")
os.makedirs(DATA_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row

# Categories
cats = [dict(r) for r in conn.execute("SELECT * FROM category").fetchall()]
json.dump(cats, open(os.path.join(DATA_DIR, "categories.json"), "w"), ensure_ascii=False)
print(f"Categories: {len(cats)}")

# Items with category + source names
items = [dict(r) for r in conn.execute("""
    SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
    FROM item i JOIN category c ON i.category_id = c.id JOIN source s ON i.source_id = s.id
    WHERE i.is_active = 1
""").fetchall()]
json.dump(items, open(os.path.join(DATA_DIR, "items.json"), "w"), ensure_ascii=False)
print(f"Items: {len(items)}")

# Products
products = [dict(r) for r in conn.execute("SELECT * FROM product WHERE is_active=1").fetchall()]
json.dump(products, open(os.path.join(DATA_DIR, "products.json"), "w"), ensure_ascii=False)
print(f"Products: {len(products)}")

# Top items
top = [dict(r) for r in conn.execute("""
    SELECT i.*, c.name as category_name, c.slug as category_slug, s.name as source_name
    FROM item i JOIN category c ON i.category_id = c.id JOIN source s ON i.source_id = s.id
    WHERE i.is_active = 1 ORDER BY i.rating DESC, i.review_count DESC LIMIT 10
""").fetchall()]
json.dump(top, open(os.path.join(DATA_DIR, "top_items.json"), "w"), ensure_ascii=False)
print(f"Top items: {len(top)}")

conn.close()
print("✅ Export terminé")
