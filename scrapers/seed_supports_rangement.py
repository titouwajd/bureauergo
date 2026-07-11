#!/usr/bin/env python3
"""Seed 16 products (8 Supports écran + 8 Rangement bureau) into the ErgoZone SQLite database."""

import sqlite3
import re
import unicodedata
import hashlib
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "nichesite.db"


def slugify(title: str) -> str:
    """Generate a URL-friendly slug from a product title."""
    slug = title.lower()
    slug = unicodedata.normalize("NFKD", slug).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    slug = slug.strip("-")
    return slug


def extract_brand(title: str) -> str:
    """Extract brand name from the dash-separated suffix of the title."""
    parts = title.rsplit(" - ", 1)
    if len(parts) == 2:
        return parts[1].strip()
    return ""


def make_affiliate_url(brand_slug: str) -> str:
    """Generate a unique affiliate URL with the ergozone-21 tag."""
    code_hash = hashlib.md5(brand_slug.encode()).hexdigest()[:8].upper()
    return f"https://www.amazon.fr/dp/EXAMPLE{code_hash}?tag=ergozone-21"


def get_category_id(cursor, category_name: str) -> int:
    cursor.execute("SELECT id FROM category WHERE name = ?", (category_name,))
    row = cursor.fetchone()
    assert row is not None, f"Category not found: {category_name}"
    return row[0]


PRODUCTS = [
    # ── Supports écran (category_id=5) ──
    {
        "title": 'Bras Écran Triple 17-27" avec Vérins à Gaz - TripleArm',
        "description": (
            "Le bras écran triple TripleArm supporte jusqu'à trois moniteurs de 17 à 27 pouces "
            "grâce à ses vérins à gaz offrant un réglage fluide en hauteur, inclinaison et rotation. "
            "Compatible VESA 75x75 et 100x100, chaque bras supporte jusqu'à 8 kg. La pince de "
            "fixation en C s'adapte aux bureaux jusqu'à 85 mm d'épaisseur, libérant un espace "
            "précieux pour un poste de travail multi-écran professionnel."
        ),
        "price": 129.99,
        "rating": 4.5,
        "review_count": 345,
        "category": "Supports écran",
    },
    {
        "title": 'Support Mural TV Écran Inclinable et Pivotant 32-55" - FullMotion',
        "description": (
            "Le support mural FullMotion offre une flexibilité complète pour votre écran ou téléviseur "
            "de 32 à 55 pouces. Inclinaison de -15° à +5°, pivotement à 180° et rotation pour un "
            "angle de vision parfait quelle que soit votre position. Structure en acier renforcé "
            "supportant jusqu'à 35 kg, avec niveau à bulle intégré et kit de visserie complet."
        ),
        "price": 49.99,
        "rating": 4.6,
        "review_count": 876,
        "category": "Supports écran",
    },
    {
        "title": "Support Bureau pour 2 Écrans + Plateau Portable - AllInOne",
        "description": (
            "Le support AllInOne combine un bras double écran et un plateau pour ordinateur portable "
            "en une seule solution compacte. Les deux bras articulés supportent des moniteurs de 13 à "
            "27 pouces, tandis que le plateau ventilé accueille un laptop jusqu'à 17 pouces. Gestion "
            "des câbles intégrée et fixation par pince universelle pour une installation rapide."
        ),
        "price": 89.99,
        "rating": 4.4,
        "review_count": 432,
        "category": "Supports écran",
    },
    {
        "title": "Bras Écran USB-C avec Hub Intégré - SmartArm",
        "description": (
            "Le bras écran SmartArm intègre un hub USB-C complet directement dans la base du support. "
            "Connectez votre moniteur, vos périphériques et chargez votre ordinateur via un seul câble "
            "USB-C Power Delivery 65W. Compatible VESA 75x75 et 100x100 pour écrans de 17 à 32 pouces "
            "jusqu'à 9 kg, avec vérin à gaz pour un ajustement sans effort."
        ),
        "price": 99.99,
        "rating": 4.5,
        "review_count": 234,
        "category": "Supports écran",
    },
    {
        "title": 'Pied Support Écran sur Roulettes 32-70" - TrolleyStand',
        "description": (
            "Le pied mobile TrolleyStand transforme n'importe quel écran de 32 à 70 pouces en "
            "solution nomade pour les salles de réunion, les espaces de coworking ou les présentations. "
            "Quatre roulettes verrouillables, plateau ajustable en hauteur de 120 à 160 cm, et étagère "
            "intégrée pour un lecteur multimédia ou une visioconférence. Charge maximale de 50 kg."
        ),
        "price": 159.99,
        "rating": 4.3,
        "review_count": 123,
        "category": "Supports écran",
    },
    {
        "title": "Adaptateur VESA Universel pour Écran - VESAplate",
        "description": (
            "L'adaptateur VESAplate rend compatible tout écran non-VESA avec les supports standard "
            "VESA 75x75, 100x100, 200x100 et 200x200. Plaque en acier robuste avec patins en silicone "
            "anti-rayures, livrée avec toute la visserie nécessaire. Installation en moins de 5 minutes "
            "sans perçage pour la plupart des moniteurs de 13 à 32 pouces."
        ),
        "price": 19.99,
        "rating": 4.7,
        "review_count": 987,
        "category": "Supports écran",
    },
    {
        "title": "Support Plafond Écran Réglable - CeilingMount",
        "description": (
            "Le support plafond CeilingMount libère totalement l'espace au sol et sur le bureau en "
            "suspendant votre écran au plafond. Hauteur réglable de 50 à 80 cm, inclinaison de -20° "
            "à +20°, rotation 360° et pivotement 180°. Compatible avec les écrans de 17 à 43 pouces "
            "jusqu'à 25 kg. Idéal pour les espaces d'accueil, les salles de contrôle ou le télétravail."
        ),
        "price": 54.99,
        "rating": 4.2,
        "review_count": 321,
        "category": "Supports écran",
    },
    {
        "title": "Bras Écran avec Plateau pour Mini PC - MiniMount",
        "description": (
            "Le bras MiniMount associe un support écran articulé et un plateau pour mini PC en une "
            "seule solution gain de place. Le bras supporte des moniteurs de 17 à 27 pouces via son "
            "vérin à gaz, tandis que le plateau ventilé accueille un mini PC ou une box. Gestion des "
            "câbles intégrée et pince de fixation universelle pour un bureau parfaitement organisé."
        ),
        "price": 59.99,
        "rating": 4.4,
        "review_count": 654,
        "category": "Supports écran",
    },
    # ── Rangement bureau (category_id=6) ──
    {
        "title": "Meuble Rangement Bureau 3 Tiroirs Mobile - DrawerCart",
        "description": (
            "Le meuble DrawerCart combine trois tiroirs spacieux et une mobilité totale grâce à ses "
            "roulettes pivotantes dont deux freinées. Structure en métal robuste avec façade en MDF, "
            "poignées ergonomiques et tiroirs coulissant sur rails à billes. Dimensions compactes "
            "idéales pour se glisser sous un bureau et garder fournitures et dossiers à portée de main."
        ),
        "price": 79.99,
        "rating": 4.5,
        "review_count": 567,
        "category": "Rangement bureau",
    },
    {
        "title": "Classeur Rotatif de Bureau 360° - SpinFile",
        "description": (
            "Le classeur rotatif SpinFile offre un accès instantané à vos documents grâce à sa rotation "
            "à 360°. Doté de 6 compartiments verticaux pour dossiers suspendus A4, il optimise le "
            "rangement dans un encombrement minimal. Base lestée antidérapante, structure en acier "
            "laqué et séparateurs ajustables pour organiser projets, factures et archives au quotidien."
        ),
        "price": 34.99,
        "rating": 4.3,
        "review_count": 432,
        "category": "Rangement bureau",
    },
    {
        "title": "Étagère Bureau Suspendue Murale - WallShelf",
        "description": (
            "L'étagère murale WallShelf ajoute un espace de rangement sans empiéter sur le bureau. "
            "Fabriquée en MDF avec finition bois naturel et support mural en acier renforcé, elle "
            "supporte jusqu'à 10 kg. Parfaite pour les livres, fournitures, plantes ou éléments de "
            "décoration. Installation facile avec le kit de fixation et le niveau à bulle fournis."
        ),
        "price": 29.99,
        "rating": 4.4,
        "review_count": 345,
        "category": "Rangement bureau",
    },
    {
        "title": "Bac de Rangement Empilable A4 x3 - StackBox",
        "description": (
            "Le lot de 3 bacs empilables StackBox s'adapte à tous vos besoins d'organisation. Chaque "
            "bac au format A4 s'empile verticalement et s'incline pour un accès facile aux documents. "
            "Plastique PP robuste et design sobre, compatible avec les classeurs, dossiers et magazines. "
            "Empilables ou utilisables côte à côte pour une organisation modulable."
        ),
        "price": 24.99,
        "rating": 4.6,
        "review_count": 1234,
        "category": "Rangement bureau",
    },
    {
        "title": "Pot à Crayons Connecté avec Chargeur USB - SmartCup",
        "description": (
            "Le pot à crayons SmartCup intègre 3 ports de charge USB (2 USB-A + 1 USB-C) dans sa base "
            "tout en organisant stylos, ciseaux et accessoires de bureau. Alimenté par un câble USB "
            "fourni, il charge simultanément smartphone, écouteurs et montre connectée. Compartiments "
            "modulables et fond antidérapant pour un bureau connecté et ordonné."
        ),
        "price": 22.99,
        "rating": 4.2,
        "review_count": 567,
        "category": "Rangement bureau",
    },
    {
        "title": "Support Tour Disques Durs Externes - DiskRack",
        "description": (
            "Le support DiskRack organise jusqu'à 5 disques durs externes à la verticale pour libérer "
            "l'espace du bureau tout en améliorant le refroidissement. Séparateurs en mousse souple "
            "ajustables, base lestée antidérapante et design épuré en aluminium. Compatible avec les "
            "disques de 2,5 et 3,5 pouces de toutes marques."
        ),
        "price": 18.99,
        "rating": 4.3,
        "review_count": 234,
        "category": "Rangement bureau",
    },
    {
        "title": "Panneau Affichage Liège + Tableau Blanc 2en1 - PinBoard",
        "description": (
            "Le panneau 2en1 PinBoard associe un tableau en liège naturel pour épingler notes et "
            "photos et un tableau blanc effaçable à sec pour vos to-do lists et brainstormings. "
            "Dimensions 60x40 cm, cadre en aluminium et kit de fixation murale inclus. Livré avec "
            "4 aimants, un marqueur effaçable et une brosse pour une organisation visuelle complète."
        ),
        "price": 27.99,
        "rating": 4.5,
        "review_count": 876,
        "category": "Rangement bureau",
    },
    {
        "title": "Boîte Archive Document avec Serrure - SafeBox",
        "description": (
            "La boîte archive SafeBox protège vos documents confidentiels grâce à sa serrure à clé. "
            "Format A4 compatible avec les dossiers suspendus, structure en métal renforcé et finition "
            "noire sobre. Poignée de transport ergonomique et fond renforcé supportant jusqu'à 15 kg. "
            "Idéale pour les contrats, relevés bancaires et archives sensibles au bureau comme à domicile."
        ),
        "price": 39.99,
        "rating": 4.4,
        "review_count": 432,
        "category": "Rangement bureau",
    },
]


def main():
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()

    inserted = 0
    for product in PRODUCTS:
        title = product["title"]
        slug = slugify(title)
        brand = extract_brand(title)
        category_name = product["category"]
        category_id = get_category_id(cursor, category_name)
        affiliate_url = make_affiliate_url(brand.lower().replace(" ", "-"))

        # Check for slug uniqueness; if collision, append brand to slug
        cursor.execute("SELECT id FROM item WHERE slug = ?", (slug,))
        if cursor.fetchone():
            brand_slug = slugify(brand)
            slug = f"{slug}-{brand_slug}"
            cursor.execute("SELECT id FROM item WHERE slug = ?", (slug,))
            if cursor.fetchone():
                print(f"WARNING: Duplicate slug '{slug}' for '{title}', skipping")
                continue

        cursor.execute(
            """
            INSERT INTO item (
                title, slug, description, price, currency, rating, review_count,
                image_path, affiliate_url, original_url, source_id, category_id,
                brand, availability, is_active, is_sponsored
            ) VALUES (?, ?, ?, ?, 'EUR', ?, ?, NULL, ?, ?, 1, ?, ?, 'In stock', 1, 0)
            """,
            (
                title,
                slug,
                product["description"],
                product["price"],
                product["rating"],
                product["review_count"],
                affiliate_url,
                affiliate_url,
                category_id,
                brand,
            ),
        )
        inserted += 1
        print(f"  ✓ {title}  →  {slug}  [{brand}]  {product['price']}€")

    conn.commit()

    # Update category item counts
    cursor.execute(
        """
        UPDATE category
        SET item_count = (SELECT COUNT(*) FROM item WHERE item.category_id = category.id)
        """
    )

    # Verify totals
    cursor.execute("SELECT COUNT(*) FROM item")
    total = cursor.fetchone()[0]
    print(f"\n{'='*60}")
    print(f"Inserted {inserted} new products.")
    print(f"Total products in database: {total}")
    print(f"{'='*60}")

    # Per-category breakdown
    cursor.execute(
        "SELECT c.name, c.item_count FROM category c ORDER BY c.id"
    )
    print("\nCategory breakdown:")
    for name, count in cursor.fetchall():
        print(f"  {name}: {count}")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    main()
