#!/usr/bin/env python3
"""Seed 16 products (8 Accessoires bureau + 8 Éclairage bureau) into the ErgoZone SQLite database."""

import sqlite3
import re
import unicodedata
import hashlib
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "nichesite.db"


def slugify(title: str) -> str:
    """Generate a URL-friendly slug from a product title."""
    slug = title.lower()
    # Remove accents
    slug = unicodedata.normalize("NFKD", slug).encode("ascii", "ignore").decode("ascii")
    # Replace non-alphanumeric chars (except spaces and hyphens) with nothing
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    # Replace spaces with hyphens
    slug = re.sub(r"\s+", "-", slug)
    # Collapse multiple hyphens
    slug = re.sub(r"-+", "-", slug)
    # Strip leading/trailing hyphens
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


PRODUCTS = [
    # ── Accessoires bureau (category_id=1) ──
    {
        "title": "Support Téléphone Bureau Ajustable - PhoneStand Pro",
        "description": (
            "Le Support Téléphone Ajustable PhoneStand Pro maintient votre smartphone à "
            "hauteur des yeux pour un confort visuel optimal. Bras articulé réglable sur "
            "360° avec pince universelle compatible tous smartphones jusqu'à 7 pouces. "
            "Base lestée antidérapante, finition aluminium brossé élégante."
        ),
        "price": 19.99,
        "rating": 4.5,
        "review_count": 2341,
        "category_id": 1,
    },
    {
        "title": "Porte-Stylos Rotatif 360° Design - PenWheel",
        "description": (
            "Le Porte-Stylos Rotatif PenWheel apporte une touche design à votre bureau "
            "avec sa rotation fluide à 360°. Il accueille jusqu'à 12 stylos ou outils "
            "d'écriture dans des compartiments inclinés. Base en acier brossé, structure "
            "stable qui ne bascule pas."
        ),
        "price": 17.99,
        "rating": 4.3,
        "review_count": 876,
        "category_id": 1,
    },
    {
        "title": "Tapis de Bureau Cuir Synthétique 120x60cm - DeskLeather",
        "description": (
            "Le Tapis de Bureau DeskLeather en cuir synthétique de 120x60 cm transforme "
            "votre espace de travail avec son toucher premium et sa surface lisse idéale "
            "pour la souris. Dos antidérapant en suédine, résistant aux taches et à l'eau, "
            "bords cousus pour une durabilité exceptionnelle."
        ),
        "price": 34.99,
        "rating": 4.6,
        "review_count": 1456,
        "category_id": 1,
    },
    {
        "title": "Panneau Perforé Mural Bureau - PegBoard Pro",
        "description": (
            "Le Panneau Perforé Mural PegBoard Pro optimise votre espace bureau avec son "
            "système d'organisation modulable. Livré avec 16 accessoires (étagères, crochets, "
            "pots à stylos) pour personnaliser votre rangement mural. Installation facile, "
            "chevilles et vis incluses."
        ),
        "price": 44.99,
        "rating": 4.4,
        "review_count": 678,
        "category_id": 1,
    },
    {
        "title": "Ventilateur USB Bureau Silencieux - BreezeDesk",
        "description": (
            "Le Ventilateur USB BreezeDesk diffuse un flux d'air frais et silencieux (moins "
            "de 25 dB) pour vos longues sessions de travail. Alimenté par USB, 3 vitesses "
            "réglables, tête orientable à 180°. Design compact qui se glisse partout sur le bureau."
        ),
        "price": 22.99,
        "rating": 4.2,
        "review_count": 1234,
        "category_id": 1,
    },
    {
        "title": "Support Casque Bureau Aluminium - HeadStand",
        "description": (
            "Le Support Casque HeadStand en aluminium brossé affiche fièrement votre casque "
            "audio sur le bureau. Base lestée antidérapante, bras incurvé compatible tous "
            "les casques à arceau. Dessous en silicone doux pour ne pas rayer la surface "
            "du bureau."
        ),
        "price": 15.99,
        "rating": 4.5,
        "review_count": 987,
        "category_id": 1,
    },
    {
        "title": "Rallonge USB Bureau 7 Ports - PowerStrip",
        "description": (
            "La Rallonge USB PowerStrip 7 ports transforme une seule prise en véritable "
            "station de charge. 4 ports USB-A et 3 ports USB-C avec charge rapide PD 65W, "
            "interrupteur individuel par port, protection contre les surtensions. Cordon "
            "de 2 mètres pour une grande flexibilité de placement."
        ),
        "price": 29.99,
        "rating": 4.3,
        "review_count": 2345,
        "category_id": 1,
    },
    {
        "title": "Set Bureau Minimaliste (Tapis + Repose-Poignet + Range-Câbles) - DeskKit",
        "description": (
            "Le Set Bureau Minimaliste DeskKit regroupe l'essentiel pour un espace de travail "
            "épuré et confortable : tapis de souris en feutre, repose-poignet en mousse mémoire "
            "de forme, et range-câbles adhésif magnétique. Look sobre noir et gris adapté à "
            "tous les styles de bureau."
        ),
        "price": 49.99,
        "rating": 4.6,
        "review_count": 567,
        "category_id": 1,
    },
    # ── Éclairage bureau (category_id=2) ──
    {
        "title": "Lampe Bureau LED Double Bras Articulé - DualLight",
        "description": (
            "La Lampe Bureau LED DualLight est équipée de deux bras articulés indépendants "
            "pour un éclairage directionnel précis. 5 températures de couleur (2700K à 6500K), "
            "5 niveaux de luminosité, pince de fixation universelle et variateur tactile. "
            "Idéale pour le travail de précision et la lecture."
        ),
        "price": 69.99,
        "rating": 4.7,
        "review_count": 876,
        "category_id": 2,
    },
    {
        "title": 'Barre Lumineuse Écran Curved 34" - CurveGlow',
        "description": (
            "La Barre Lumineuse CurveGlow s'adapte parfaitement aux écrans incurvés jusqu'à "
            '34 pouces. Elle diffuse une lumière d\'ambiance sans reflet ni éblouissement, '
            "réduisant la fatigue oculaire lors des sessions prolongées. Fixation par clip "
            "universel, télécommande tactile incluse."
        ),
        "price": 39.99,
        "rating": 4.4,
        "review_count": 654,
        "category_id": 2,
    },
    {
        "title": "Veilleuse Bureau LED avec Chargeur Induction - NightCharge",
        "description": (
            "La Veilleuse NightCharge allie éclairage d'ambiance doux et chargeur à induction "
            "15W intégré dans la base. 3 modes d'éclairage (chaud, neutre, froid), minuterie "
            "intégrée, compatible avec tous les smartphones Qi. Design épuré qui libère "
            "l'espace de votre table de nuit ou bureau."
        ),
        "price": 27.99,
        "rating": 4.3,
        "review_count": 432,
        "category_id": 2,
    },
    {
        "title": "Tube LED Bureau 120cm Connecté WiFi - SmartTube",
        "description": (
            "Le Tube LED SmartTube de 120 cm se connecte en WiFi pour un contrôle intelligent "
            "via application mobile ou assistant vocal (Alexa, Google Home). 16 millions de "
            "couleurs, programmation horaire, modes scènes prédéfinis. Installation facile "
            "avec kit de fixation inclus."
        ),
        "price": 44.99,
        "rating": 4.5,
        "review_count": 789,
        "category_id": 2,
    },
    {
        "title": "Projecteur Plafond LED Bureau 4000K - CeilingPro",
        "description": (
            "Le Projecteur Plafond CeilingPro offre un éclairage professionnel à 4000K "
            "(blanc neutre) idéal pour les espaces de travail. 36W, équivalent 250W "
            "incandescent, angle de faisceau large 120°. Installation encastrée ou en "
            "surface, durée de vie 50 000 heures, indice de rendu des couleurs CRI>90."
        ),
        "price": 89.99,
        "rating": 4.6,
        "review_count": 345,
        "category_id": 2,
    },
    {
        "title": "Ruban LED RGBIC Bureau 5m avec Télécommande - DeskStrip",
        "description": (
            "Le Ruban LED DeskStrip de 5 mètres en technologie RGBIC permet des effets "
            "multicolores dynamiques sur votre bureau. Télécommande 24 touches, 210 LED/m, "
            "bande adhésive 3M au dos, découpable tous les 10 cm. Parfait pour le rétro-"
            "éclairage de bureau, étagères ou derrière l'écran."
        ),
        "price": 24.99,
        "rating": 4.4,
        "review_count": 2103,
        "category_id": 2,
    },
    {
        "title": "Lampe Bureau Vintage Edison LED - RetroDesk",
        "description": (
            "La Lampe de Bureau RetroDesk marie le charme vintage des ampoules Edison "
            "apparentes à la technologie LED économique. Bras articulé en laiton vieilli, "
            "base en bois massif, ampoule LED Edison E27 incluse (4W, 400 lumens, 2200K). "
            "Interrupteur à chaînette pour une authenticité totale."
        ),
        "price": 34.99,
        "rating": 4.3,
        "review_count": 567,
        "category_id": 2,
    },
    {
        "title": 'Anneau Lumineux Webcam 15" avec Trépied - RingLight Pro',
        "description": (
            "L'Anneau Lumineux RingLight Pro de 15 pouces est l'accessoire indispensable "
            "pour les visioconférences et le streaming. 3 températures de couleur, 10 niveaux "
            "de luminosité, trépied réglable de 40 à 210 cm, support smartphone et rotule "
            "orientable. Alimentation USB, télécommande sans fil incluse."
        ),
        "price": 49.99,
        "rating": 4.6,
        "review_count": 1234,
        "category_id": 2,
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
        category_id = product["category_id"]
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
            ) VALUES (?, ?, ?, ?, 'EUR', ?, ?, ?, ?, ?, 1, ?, ?, 'In stock', 1, 0)
            """,
            (
                title,
                slug,
                product["description"],
                product["price"],
                product["rating"],
                product["review_count"],
                "/images/PLACEHOLDER.webp",
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

    # Verify total
    cursor.execute("SELECT COUNT(*) FROM item")
    total = cursor.fetchone()[0]
    print(f"\n{'='*60}")
    print(f"Inserted {inserted} new products.")
    print(f"Total products in database: {total}")
    print(f"{'='*60}")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    main()
