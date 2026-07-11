#!/usr/bin/env python3
"""Seed 16 new products (8 Mobilier bureau + 8 High-tech bureau) into the ErgoZone SQLite database."""

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
    # ── Mobilier bureau (category_id=7) ──
    {
        "title": "Bureau d'Angle Ergonomique 140x140cm - CornerDesk",
        "description": (
            "Le bureau d'angle CornerDesk optimise l'espace avec son plateau spacieux "
            "de 140x140 cm. Structure en acier renforcé et panneaux en mélamine anti-rayures, "
            "il s'adapte parfaitement aux configurations en L. Idéal pour créer un poste de "
            "travail enveloppant et fonctionnel, avec suffisamment de place pour plusieurs écrans."
        ),
        "price": 299.99,
        "rating": 4.5,
        "review_count": 432,
        "category_id": 7,
    },
    {
        "title": "Bureau Enfant Réglable en Hauteur 120x60cm - GrowDesk",
        "description": (
            "Le bureau GrowDesk accompagne la croissance de votre enfant grâce à son système "
            "de réglage en hauteur manuel. Plateau de 120x60 cm avec revêtement facile à "
            "nettoyer, bords arrondis de sécurité et structure stable en acier. Inclinaison "
            "du plateau réglable pour le dessin, la lecture et les devoirs."
        ),
        "price": 199.99,
        "rating": 4.6,
        "review_count": 345,
        "category_id": 7,
    },
    {
        "title": "Plateau Bureau Verre Trempé Noir 140x70cm - GlassTop",
        "description": (
            "Le plateau GlassTop en verre trempé noir de 140x70 cm apporte une touche "
            "moderne et élégante à votre espace de travail. Verre sécurit de 8 mm "
            "d'épaisseur, certifié anti-choc et anti-rayures. Compatible avec la plupart "
            "des pieds de bureau standards pour une installation facile."
        ),
        "price": 179.99,
        "rating": 4.3,
        "review_count": 234,
        "category_id": 7,
    },
    {
        "title": "Table de Réunion Pliante 180x80cm - FoldTable",
        "description": (
            "La table de réunion FoldTable se déplie en quelques secondes pour offrir "
            "un espace de travail collaboratif de 180x80 cm. Structure en acier robuste, "
            "plateau en mélamine résistant aux taches et système de verrouillage sécurisé. "
            "Se replie à plat pour un rangement compact contre un mur ou sous un lit."
        ),
        "price": 129.99,
        "rating": 4.4,
        "review_count": 123,
        "category_id": 7,
    },
    {
        "title": "Bureau Assis-Debout Manuel avec Manivelle - CrankDesk",
        "description": (
            "Le bureau assis-debout CrankDesk s'ajuste manuellement grâce à sa manivelle "
            "fluide et silencieuse. Plateau de 120x60 cm en mélamine, cadre en acier robuste "
            "et plage de réglage de 75 à 120 cm de hauteur. Une solution économique pour "
            "alterner entre position assise et debout tout au long de la journée."
        ),
        "price": 249.99,
        "rating": 4.3,
        "review_count": 567,
        "category_id": 7,
    },
    {
        "title": "Caisson Bureau Mobile 3 Tiroirs avec Serrure - LockDrawer",
        "description": (
            "Le caisson mobile LockDrawer offre 3 tiroirs spacieux avec serrure centrale "
            "pour sécuriser vos documents et fournitures de bureau. Roulettes pivotantes "
            "dont 2 freinées, finition sobre et poignées ergonomiques. S'adapte sous la "
            "plupart des bureaux standards pour un rangement discret et accessible."
        ),
        "price": 89.99,
        "rating": 4.5,
        "review_count": 876,
        "category_id": 7,
    },
    {
        "title": "Étagère Bureau Murale Flottante 3 Niveaux - FloatShelf",
        "description": (
            "L'étagère flottante FloatShelf propose 3 niveaux de rangement mural pour "
            "libérer l'espace sur votre bureau. Fixation invisible pour un rendu design "
            "et épuré. Chaque niveau supporte jusqu'à 10 kg, idéal pour livres, dossiers, "
            "plantes et objets déco. Installation facile avec gabarit de perçage inclus."
        ),
        "price": 59.99,
        "rating": 4.4,
        "review_count": 432,
        "category_id": 7,
    },
    {
        "title": "Bureau Gaming LED RGB 160x75cm - GameDesk",
        "description": (
            "Le bureau gaming GameDesk impressionne avec son plateau de 160x75 cm et "
            "ses bandeaux LED RGB intégrés sur les bords, pilotables par télécommande. "
            "Tapis de souris pleine surface inclus, porte-gobelet, support casque et "
            "passe-câbles intégrés. Structure en acier carbone pour une stabilité à toute épreuve."
        ),
        "price": 349.99,
        "rating": 4.7,
        "review_count": 654,
        "category_id": 7,
    },
    # ── High-tech bureau (category_id=8) ──
    {
        "title": 'Écran Incurvé 27" QHD USB-C - CurveView',
        "description": (
            "L'écran incurvé CurveView de 27 pouces offre une résolution QHD (2560x1440) "
            "pour une netteté exceptionnelle. Dalle VA 1500R, taux de rafraîchissement "
            "de 75 Hz et connectique USB-C avec Power Delivery 65W. Haut-parleurs intégrés "
            "et mode Low Blue Light pour un confort visuel optimal en télétravail."
        ),
        "price": 279.99,
        "rating": 4.6,
        "review_count": 876,
        "category_id": 8,
    },
    {
        "title": "Clavier Mécanique RGB Hot-Swap 75% - MechKey Pro",
        "description": (
            "Le clavier mécanique MechKey Pro au format 75% compact est équipé de switches "
            "hot-swap pour personnaliser la sensation de frappe sans soudure. Rétroéclairage "
            "RGB par touche avec 18 effets lumineux, châssis en aluminium anodisé et "
            "connexion USB-C détachable. Compatible Windows, macOS et Linux."
        ),
        "price": 119.99,
        "rating": 4.7,
        "review_count": 1234,
        "category_id": 8,
    },
    {
        "title": "Souris Gaming Sans Fil Ultra-Légère 55g - SwiftMouse",
        "description": (
            "La souris sans fil SwiftMouse ne pèse que 55 grammes pour une glisse "
            "ultra-rapide. Capteur optique 26 000 DPI, autonomie de 70 heures et "
            "connexion sans fil 2,4 GHz ou Bluetooth 5.0. Switchs optiques garantis "
            "70 millions de clics et patins en PTFE pour un contrôle parfait du curseur."
        ),
        "price": 79.99,
        "rating": 4.5,
        "review_count": 987,
        "category_id": 8,
    },
    {
        "title": "Streaming Deck 15 Touches LCD Programmables - MacroPad Pro",
        "description": (
            "Le MacroPad Pro est un pavé de contrôle équipé de 15 touches LCD entièrement "
            "programmables. Créez des macros, lancez des applications, contrôlez votre "
            "streaming ou votre éclairage en un seul geste. Compatible avec OBS, Photoshop, "
            "Premiere Pro et des centaines d'applications via le logiciel inclus."
        ),
        "price": 149.99,
        "rating": 4.6,
        "review_count": 456,
        "category_id": 8,
    },
    {
        "title": "Webcam 4K avec Micro et Anneau Lumineux - UltraCam",
        "description": (
            "La webcam UltraCam capture des vidéos en 4K Ultra HD à 30 fps avec autofocus "
            "rapide et correction automatique de l'éclairage. Anneau lumineux LED intégré "
            "à 3 niveaux, double micro stéréo avec réduction de bruit et angle de vue "
            "réglable de 65° à 90°. Fixation universelle pour écran ou trépied."
        ),
        "price": 129.99,
        "rating": 4.4,
        "review_count": 654,
        "category_id": 8,
    },
    {
        "title": "Enceinte Bluetooth Bureau Son 360° - DeskSound",
        "description": (
            "L'enceinte Bluetooth DeskSound diffuse un son immersif à 360° grâce à son "
            "driver large bande et ses radiateurs passifs. Design compact pour le bureau, "
            "autonomie de 12 heures, étanchéité IPX5 et microphone intégré pour les appels "
            "en hands-free. Connexion multipoint pour basculer entre deux appareils."
        ),
        "price": 89.99,
        "rating": 4.5,
        "review_count": 345,
        "category_id": 8,
    },
    {
        "title": "Câble Management Sleeve Tressé 5m - SleevePro",
        "description": (
            "Le manchon de gestion de câbles SleevePro en polyester tressé de 5 mètres "
            "regroupe et dissimule tous les câbles de votre bureau en un seul faisceau "
            "propre et ordonné. Fermeture auto-agrippante sur toute la longueur pour "
            "ajouter ou retirer des câbles facilement. Résistant à l'abrasion et ignifugé."
        ),
        "price": 14.99,
        "rating": 4.6,
        "review_count": 2345,
        "category_id": 8,
    },
    {
        "title": "Support PC Tour Réglable avec Roulettes - TowerStand",
        "description": (
            "Le support pour tour PC TowerStand maintient votre unité centrale à quelques "
            "centimètres du sol pour une meilleure ventilation et une protection contre "
            "la poussière. Plateau réglable en largeur de 18 à 28 cm, 4 roulettes pivotantes "
            "dont 2 freinées et structure en acier supportant jusqu'à 20 kg."
        ),
        "price": 34.99,
        "rating": 4.4,
        "review_count": 876,
        "category_id": 8,
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
        image_path = f"/images/{slug}.webp"

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
                image_path,
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

    # Verify counts
    for cat_id in (7, 8):
        cursor.execute("SELECT name, item_count FROM category WHERE id = ?", (cat_id,))
        name, count = cursor.fetchone()
        print(f"  📊 {name}: {count} items")

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
