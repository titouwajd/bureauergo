#!/usr/bin/env python3
"""Seed 24 additional products (3 per category) into the ErgoZone SQLite database."""

import sqlite3
import re
import unicodedata
import hashlib
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "nichesite.db"


def slugify(title: str) -> str:
    """Generate a URL-friendly slug from a product title."""
    # Remove the brand suffix (everything after the last " - ") for slug generation
    # But include a simplified version of the brand for uniqueness
    # Actually, let's slugify the full title including brand, matching existing pattern
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
    # Create a deterministic but unique-looking code from the brand
    code_hash = hashlib.md5(brand_slug.encode()).hexdigest()[:8].upper()
    return f"https://www.amazon.fr/dp/EXAMPLE{code_hash}?tag=ergozone-21"


def get_category_id(cursor, category_name: str) -> int:
    cursor.execute("SELECT id FROM category WHERE name = ?", (category_name,))
    row = cursor.fetchone()
    assert row is not None, f"Category not found: {category_name}"
    return row[0]


PRODUCTS = [
    # ── Accessoires bureau (category_id=1) ──
    {
        "title": "Clavier Ergonomique Sans Fil Split - TypeComfort",
        "description": (
            "Ce clavier ergonomique sans fil au design split réduit la tension des poignets "
            "et favorise une posture naturelle des bras. Compatible Bluetooth et USB, il offre "
            "une autonomie de plusieurs mois grâce à ses piles longue durée. Idéal pour les "
            "professionnels qui passent de longues heures devant l'écran."
        ),
        "price": 79.99,
        "rating": 4.6,
        "review_count": 890,
        "category": "Accessoires bureau",
    },
    {
        "title": "Souris Verticale Sans Fil Ergonomique - VertiMouse",
        "description": (
            "Cette souris verticale sans fil adopte une poignée naturelle « handshake » qui "
            "soulage les tensions du poignet et de l'avant-bras. Dotée d'un capteur optique "
            "précis et de 6 boutons personnalisables, elle convient aussi bien au travail "
            "qu'au gaming léger."
        ),
        "price": 39.99,
        "rating": 4.4,
        "review_count": 1234,
        "category": "Accessoires bureau",
    },
    {
        "title": "Support Document Inclinable - ReadRite",
        "description": (
            "Le support document inclinable ReadRite se place entre le clavier et l'écran "
            "pour maintenir vos documents à hauteur des yeux. Réglable sur 5 angles différents, "
            "il réduit la fatigue cervicale et améliore la productivité lors de la saisie de données."
        ),
        "price": 24.99,
        "rating": 4.3,
        "review_count": 567,
        "category": "Accessoires bureau",
    },
    # ── Éclairage bureau (category_id=2) ──
    {
        "title": "Bandeau Lumineux Écran Anti-Lumière Bleue - ScreenGlow",
        "description": (
            "Le bandeau lumineux ScreenGlow se fixe à l'arrière de votre écran et diffuse "
            "une lumière d'ambiance douce qui réduit la fatigue oculaire. Filtre anti-lumière "
            "bleue intégré, il propose 16 millions de couleurs via une télécommande infrarouge."
        ),
        "price": 34.99,
        "rating": 4.5,
        "review_count": 789,
        "category": "Éclairage bureau",
    },
    {
        "title": "Ampoule Connectée Bureau WiFi - SmartLux",
        "description": (
            "L'ampoule connectée SmartLux s'installe en quelques secondes sur n'importe quel "
            "culot E27 et se pilote via l'application mobile ou par commande vocale. "
            "Température de couleur réglable de 2700K à 6500K, idéale pour adapter la lumière "
            "tout au long de la journée de travail."
        ),
        "price": 19.99,
        "rating": 4.2,
        "review_count": 1456,
        "category": "Éclairage bureau",
    },
    {
        "title": "Lampe de Bureau Pliable USB Rechargeable - TravelLight",
        "description": (
            "La lampe de bureau TravelLight se plie à plat et se recharge en USB, parfaite "
            "pour le télétravail nomade. Trois niveaux de luminosité et une batterie offrant "
            "jusqu'à 20 heures d'autonomie en font un compagnon idéal pour les espaces de coworking."
        ),
        "price": 27.99,
        "rating": 4.4,
        "review_count": 678,
        "category": "Éclairage bureau",
    },
    # ── Confort bureau (category_id=3) ──
    {
        "title": "Coussin Lombaire Ergonomique Mémoire de Forme - BackRest",
        "description": (
            "Le coussin lombaire BackRest épouse parfaitement la courbure naturelle du dos "
            "grâce à sa mousse à mémoire de forme haute densité. Housse respirante et lavable, "
            "sangles élastiques de fixation universelle pour tout type de chaise de bureau."
        ),
        "price": 32.99,
        "rating": 4.5,
        "review_count": 2103,
        "category": "Confort bureau",
    },
    {
        "title": "Tapis Anti-Fatigue Debout Bureau - StandEasy",
        "description": (
            "Le tapis anti-fatigue StandEasy soulage les jambes et le dos lors du travail "
            "debout prolongé. Sa surface antidérapante et son cœur en mousse haute résilience "
            "encouragent des micro-mouvements bénéfiques pour la circulation sanguine."
        ),
        "price": 44.99,
        "rating": 4.3,
        "review_count": 876,
        "category": "Confort bureau",
    },
    {
        "title": "Repose-Poignets Chauffant USB - WarmRest",
        "description": (
            "Le repose-poignets chauffant WarmRest se connecte en USB et diffuse une chaleur "
            "douce qui détend les muscles du poignet pendant la frappe. Revêtement en tissu "
            "doux et base antidérapante pour un confort optimal même lors des longues sessions."
        ),
        "price": 22.99,
        "rating": 4.1,
        "review_count": 432,
        "category": "Confort bureau",
    },
    # ── Sièges bureau (category_id=4) ──
    {
        "title": "Tabouret Ergonomique Actif Bali'Up - MoveSeat",
        "description": (
            "Le tabouret actif MoveSeat favorise une assise dynamique grâce à sa base "
            "légèrement instable qui sollicite en permanence les muscles posturaux. "
            "Réglable en hauteur et recouvert d'un tissu respirant, il transforme votre "
            "poste de travail en espace de mouvement."
        ),
        "price": 119.99,
        "rating": 4.4,
        "review_count": 567,
        "category": "Sièges bureau",
    },
    {
        "title": "Coussin Siège Ergonomique Gel - GelSeat",
        "description": (
            "Le coussin GelSeat associe une mousse haute densité et un insert en gel "
            "rafraîchissant pour un confort d'assise inégalé. Sa forme en U soulage la "
            "pression sur le coccyx et les hanches, idéal pour les personnes souffrant "
            "de douleurs lombaires ou de sciatique."
        ),
        "price": 34.99,
        "rating": 4.3,
        "review_count": 1234,
        "category": "Sièges bureau",
    },
    {
        "title": "Dossier Ergonomique pour Chaise - PostureFix",
        "description": (
            "Le dossier ergonomique PostureFix s'adapte à la plupart des chaises de bureau "
            "grâce à ses sangles réglables. Son support lombaire intégré et son maillage "
            "respirant corrigent la posture tout au long de la journée de travail."
        ),
        "price": 54.99,
        "rating": 4.2,
        "review_count": 345,
        "category": "Sièges bureau",
    },
    # ── Supports écran (category_id=5) ──
    {
        "title": 'Bras Écran Vérin à Gaz 17-32" Premium - GasArm Pro',
        "description": (
            "Le bras écran GasArm Pro est équipé d'un vérin à gaz pour un ajustement "
            "fluide et sans effort de votre moniteur. Compatible VESA 75x75 et 100x100, "
            "il supporte des écrans jusqu'à 9 kg et libère un espace précieux sur le bureau."
        ),
        "price": 64.99,
        "rating": 4.7,
        "review_count": 987,
        "category": "Supports écran",
    },
    {
        "title": "Support Mural TV/Écran Inclinable - SlimMount",
        "description": (
            "Le support mural SlimMount maintient votre écran à seulement 18 mm du mur "
            "pour un rendu ultra-propre. Inclinaison réglable de -12° à +5°, compatible "
            "avec la plupart des écrans et téléviseurs de 23 à 55 pouces."
        ),
        "price": 29.99,
        "rating": 4.5,
        "review_count": 654,
        "category": "Supports écran",
    },
    {
        "title": "Pied Colonne pour Double Écran - TowerStand",
        "description": (
            "Le pied colonne TowerStand permet d'empiler deux écrans l'un au-dessus de "
            "l'autre pour une configuration multi-écran verticale. Base lestée ultra-stable "
            "et gestion des câbles intégrée pour un poste de travail professionnel."
        ),
        "price": 89.99,
        "rating": 4.4,
        "review_count": 432,
        "category": "Supports écran",
    },
    # ── Rangement bureau (category_id=6) ──
    {
        "title": "Plateau Coulissant Sous Bureau pour Clavier - SlideTray",
        "description": (
            "Le plateau coulissant SlideTray se fixe sous le bureau et libère la surface "
            "de travail en accueillant clavier et souris. Rails à roulement à billes, "
            "réglable en hauteur et en inclinaison pour une position de frappe optimale."
        ),
        "price": 32.99,
        "rating": 4.3,
        "review_count": 567,
        "category": "Rangement bureau",
    },
    {
        "title": "Porte-Casque Sous Bureau Adhésif - HangIt",
        "description": (
            "Le porte-casque adhésif HangIt se colle sous le bureau en quelques secondes "
            "et maintient votre casque audio à portée de main sans encombrer l'espace de "
            "travail. Compatible avec tous les arceaux, finition aluminium brossé élégante."
        ),
        "price": 12.99,
        "rating": 4.6,
        "review_count": 2345,
        "category": "Rangement bureau",
    },
    {
        "title": "Boîte de Rangement Passe-Câbles Bois - WoodTidy",
        "description": (
            "La boîte passe-câbles WoodTidy dissimule multiprises et câbles dans un élégant "
            "coffret en bois naturel. Deux ouvertures latérales permettent le passage des "
            "câbles tout en gardant un bureau parfaitement ordonné."
        ),
        "price": 19.99,
        "rating": 4.4,
        "review_count": 876,
        "category": "Rangement bureau",
    },
    # ── Mobilier bureau (category_id=7) ──
    {
        "title": "Bureau Assis-Debout Électrique 140x70cm - StandDesk Pro",
        "description": (
            "Le bureau assis-debout électrique StandDesk Pro passe de la position assise "
            "à debout en 12 secondes grâce à son moteur silencieux. Plateau de 140x70 cm "
            "en mélamine anti-rayures, mémoire de 4 hauteurs programmables et structure "
            "en acier renforcé."
        ),
        "price": 399.99,
        "rating": 4.6,
        "review_count": 345,
        "category": "Mobilier bureau",
    },
    {
        "title": "Plateau Bureau Ergonomique Chêne 160x80cm - OakTop",
        "description": (
            "Le plateau OakTop en chêne massif de 160x80 cm apporte chaleur et robustesse "
            "à votre poste de travail. Chant arrondi pour le confort des avant-bras, finition "
            "huilée naturelle résistante aux taches et aux rayures."
        ),
        "price": 149.99,
        "rating": 4.5,
        "review_count": 234,
        "category": "Mobilier bureau",
    },
    {
        "title": "Roulettes de Chaise Bureau Silencieuses (x5) - RollQuiet",
        "description": (
            "Le kit RollQuiet de 5 roulettes silencieuses remplace les roues d'origine de "
            "votre chaise de bureau. Roulement à billes de précision et bande de roulement "
            "en polyuréthane souple qui protège tous les types de sols, du parquet au carrelage."
        ),
        "price": 18.99,
        "rating": 4.7,
        "review_count": 3210,
        "category": "Mobilier bureau",
    },
    # ── High-tech bureau (category_id=8) ──
    {
        "title": 'Écran Portable USB-C 15.6" Full HD - MobileView',
        "description": (
            "L'écran portable MobileView de 15,6 pouces Full HD se connecte en un seul "
            "câble USB-C à votre ordinateur portable. Dalle IPS antireflet, pied "
            "intégré réglable et poids plume de 780 g pour une productivité étendue "
            "en déplacement."
        ),
        "price": 179.99,
        "rating": 4.4,
        "review_count": 678,
        "category": "High-tech bureau",
    },
    {
        "title": "Clavier Mécanique Silencieux Bluetooth - SilentKey",
        "description": (
            "Le clavier mécanique SilentKey associe la sensation de frappe mécanique "
            "à des switches silencieux spécialement conçus pour le bureau. Rétroéclairage "
            "RGB personnalisable, connexion Bluetooth multi-appareils et autonomie de "
            "30 jours en usage intensif."
        ),
        "price": 89.99,
        "rating": 4.6,
        "review_count": 1456,
        "category": "High-tech bureau",
    },
    {
        "title": "Station d'Accueil USB-C Triple Écran 4K - TriDock",
        "description": (
            "La station d'accueil TriDock transforme un seul port USB-C en hub complet "
            "avec triple sortie vidéo 4K, Ethernet Gigabit, 4 ports USB-A et charge "
            "Power Delivery 100W. Compatible Windows, macOS et ChromeOS."
        ),
        "price": 129.99,
        "rating": 4.3,
        "review_count": 567,
        "category": "High-tech bureau",
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
            # Append brand to disambiguate
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
