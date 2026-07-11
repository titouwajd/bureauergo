"""Génère des images placeholder WebP pour tous les produits."""
import sqlite3
import os
from PIL import Image, ImageDraw, ImageFont
import random

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nichesite.db")
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "web", "public", "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

# Palette de couleurs par catégorie
CATEGORY_COLORS = {
    "Accessoires bureau": ("#4F46E5", "#818CF8"),    # Indigo
    "Éclairage bureau": ("#F59E0B", "#FCD34D"),      # Amber
    "Confort bureau": ("#10B981", "#6EE7B7"),         # Emerald
    "Sièges bureau": ("#3B82F6", "#93C5FD"),          # Blue
    "Supports écran": ("#8B5CF6", "#C4B5FD"),         # Violet
    "Rangement bureau": ("#EC4899", "#F9A8D4"),       # Pink
    "Mobilier bureau": ("#14B8A6", "#5EEADB"),        # Teal
    "High-tech bureau": ("#6366F1", "#A5B4FC"),       # Indigo
}

# Emoji par type de produit
PRODUCT_ICONS = {
    "support": "💻", "lampe": "💡", "repose": "🤲",
    "chaise": "🪑", "siege": "🪑", "tapis": "🖱️",
    "bras": "📺", "support ecran": "🖥️", "organiseur": "🗂️",
    "range": "🔌", "repose-pieds": "🦶", "convertisseur": "📐",
    "webcam": "📷", "casque": "🎧", "hub": "🔗",
}

def get_color_and_icon(title, category):
    """Détermine la couleur et l'emoji pour un produit."""
    color = CATEGORY_COLORS.get(category, ("#6B7280", "#D1D5DB"))
    icon = "📦"
    title_lower = title.lower()
    for key, ico in PRODUCT_ICONS.items():
        if key in title_lower:
            icon = ico
            break
    return color, icon


def generate_image(title, category, slug):
    """Génère une image placeholder 800x600."""
    img = Image.new("RGB", (800, 600), "#F3F4F6")
    draw = ImageDraw.Draw(img)

    (primary, secondary), icon = get_color_and_icon(title, category)

    # Fond avec dégradé
    for y in range(600):
        r = int(int(primary[1:3], 16) * (1 - y/600) + int(secondary[1:3], 16) * (y/600))
        g = int(int(primary[3:5], 16) * (1 - y/600) + int(secondary[3:5], 16) * (y/600))
        b = int(int(primary[5:7], 16) * (1 - y/600) + int(secondary[5:7], 16) * (y/600))
        draw.line([(0, y), (800, y)], fill=(r, g, b))

    # Cercle décoratif
    draw.ellipse([600, -100, 900, 200], fill=(255, 255, 255, 30))
    draw.ellipse([-50, 400, 200, 650], fill=(255, 255, 255, 20))

    # Emoji (utiliser un grand texte car Pillow ne rend pas bien les emojis)
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
    except:
        font_large = ImageFont.load_default()

    # Icône texte
    draw.text((400, 220), icon, fill="white", font=font_large, anchor="mm")

    # Titre du produit
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font_title = ImageFont.load_default()

    # Wrapper le titre
    words = title.split()
    lines = []
    current_line = ""
    for word in words:
        if len(current_line + " " + word) < 40:
            current_line = (current_line + " " + word).strip()
        else:
            lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)

    y_text = 340
    for line in lines[:3]:
        draw.text((400, y_text), line, fill="white", font=font_title, anchor="mm")
        y_text += 32

    # Catégorie
    try:
        font_cat = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    except:
        font_cat = ImageFont.load_default()
    draw.text((400, y_text + 20), category.upper(), fill=(255, 255, 255, 180), font=font_cat, anchor="mm")

    # Prix et note décoratifs
    draw.rounded_rectangle([300, 470, 500, 520], radius=12, fill=(255, 255, 255, 40))
    draw.text((400, 495), "Voir le produit →", fill="white", font=font_cat, anchor="mm")

    # Sauvegarder
    filename = f"{slug[:80]}.webp"
    filepath = os.path.join(IMAGES_DIR, filename)
    img.save(filepath, "WEBP", quality=75)
    return f"/images/{filename}"


def main():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    items = conn.execute("""
        SELECT i.id, i.title, i.slug, c.name as category
        FROM item i
        JOIN category c ON i.category_id = c.id
        WHERE i.image_path IS NULL
    """).fetchall()

    print(f"Génération de {len(items)} images...")
    updated = 0

    for item in items:
        image_path = generate_image(item["title"], item["category"], item["slug"])
        conn.execute("UPDATE item SET image_path = ? WHERE id = ?", (image_path, item["id"]))
        updated += 1
        if updated % 5 == 0:
            print(f"  {updated}/{len(items)}")

    conn.commit()
    conn.close()
    print(f"✅ {updated} images générées dans {IMAGES_DIR}")


if __name__ == "__main__":
    main()
