"""Seed 20 products: 8 Confort bureau (cat_id=3) + 12 Sièges bureau (cat_id=4)."""
import sqlite3
import os
import re

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nichesite.db")

PRODUCTS = [
    # ---- CONFORT BUREAU (cat 3) ----
    {
        "title": "Repose-Bras Bureau Réglable Clamp Fixation - ArmRest",
        "slug": "repose-bras-bureau-reglable-clamp-fixation-armrest",
        "description": "Repose-bras ergonomique à fixation par clamp pour bureau. Réglable en hauteur et en angle. Soulage les tensions des épaules et des poignets. Compatible avec la plupart des bureaux.",
        "price": 39.99,
        "rating": 4.4,
        "review_count": 876,
        "category_id": 3,
    },
    {
        "title": "Surmatelas Chaise Bureau Gel Refroidissant - CoolSeat",
        "slug": "surmatelas-chaise-bureau-gel-refroidissant-coolseat",
        "description": "Surmatelas en gel rafraîchissant pour chaise de bureau. Technologie Cool Gel qui dissipe la chaleur corporelle. Améliore le confort des longues sessions de travail.",
        "price": 29.99,
        "rating": 4.2,
        "review_count": 654,
        "category_id": 3,
    },
    {
        "title": "Support Poignets Clavier Long 50cm - LongWrist",
        "slug": "support-poignets-clavier-long-50cm-longwrist",
        "description": "Support poignets extra-long de 50 cm pour clavier. Mousse à mémoire de forme pour un confort optimal. Surface antidérapante et base stable.",
        "price": 16.99,
        "rating": 4.5,
        "review_count": 1234,
        "category_id": 3,
    },
    {
        "title": "Tapis Acupression Pieds Bureau - SpikeMat",
        "slug": "tapis-acupression-pieds-bureau-spikemat",
        "description": "Tapis d'acupression pour les pieds, idéal sous le bureau. Stimule la circulation sanguine et réduit la fatigue. 6000 points de pression pour un massage naturel.",
        "price": 22.99,
        "rating": 4.1,
        "review_count": 432,
        "category_id": 3,
    },
    {
        "title": "Oreiller Cervical Bureau Sieste - NapRest",
        "slug": "oreiller-cervical-bureau-sieste-naprest",
        "description": "Oreiller cervical conçu pour les micro-siestes au bureau. Soutien optimal de la nuque et des cervicales. Housse amovible et lavable.",
        "price": 19.99,
        "rating": 4.3,
        "review_count": 567,
        "category_id": 3,
    },
    {
        "title": "Housse Chaise Bureau Élastique Universelle - StretchCover",
        "slug": "housse-chaise-bureau-elastique-universelle-stretchcover",
        "description": "Housse extensible universelle pour chaise de bureau. Tissu élastique haute qualité qui s'adapte à toutes les formes. Protège et modernise votre chaise en un instant.",
        "price": 24.99,
        "rating": 4.0,
        "review_count": 321,
        "category_id": 3,
    },
    {
        "title": "Repose-Nuque Chaise Bureau Mémoire de Forme - NeckRest",
        "slug": "repose-nuque-chaise-bureau-memoire-de-forme-neckrest",
        "description": "Repose-nuque en mousse à mémoire de forme pour chaise de bureau. Sangle de fixation universelle et réglable. Soulage les tensions cervicales pendant le travail.",
        "price": 18.99,
        "rating": 4.4,
        "review_count": 789,
        "category_id": 3,
    },
    {
        "title": "Kit Confort Bureau Complet (Lombaire + Poignets + Pieds) - ComfortPack",
        "slug": "kit-confort-bureau-complet-lombaire-poignets-pieds-comfortpack",
        "description": "Kit complet pour transformer votre bureau en espace 100% ergonomique. Inclut support lombaire, repose-poignets et repose-pieds. Solution tout-en-un économique.",
        "price": 69.99,
        "rating": 4.6,
        "review_count": 456,
        "category_id": 3,
    },
    # ---- SIÈGES BUREAU (cat 4) ----
    {
        "title": "Chaise de Bureau Ergonomique Accoudoirs 4D - ErgoChair Pro",
        "slug": "chaise-de-bureau-ergonomique-accoudoirs-4d-ergochair-pro",
        "description": "Chaise de bureau ergonomique haut de gamme avec accoudoirs 4D. Support lombaire ajustable, dossier inclinable jusqu'à 135°. Filet respirant pour un confort longue durée.",
        "price": 349.99,
        "rating": 4.7,
        "review_count": 1234,
        "category_id": 4,
    },
    {
        "title": "Siège Assis-Genoux Bambou Naturel - KneeBamboo",
        "slug": "siege-assis-genoux-bambou-naturel-kneebamboo",
        "description": "Siège assis-genoux en bambou naturel écologique. Favorise une posture droite et soulage le bas du dos. Structure robuste et coussin épais en mousse haute densité.",
        "price": 119.99,
        "rating": 4.4,
        "review_count": 432,
        "category_id": 4,
    },
    {
        "title": "Fauteuil Bureau Cuir PU Haut Dossier - ExecLeather",
        "slug": "fauteuil-bureau-cuir-pu-haut-dossier-execleather",
        "description": "Fauteuil de bureau en cuir PU avec dossier haut. Look professionnel et entretien facile. Accoudoirs rembourrés et mécanisme bascule synchronisé.",
        "price": 279.99,
        "rating": 4.5,
        "review_count": 876,
        "category_id": 4,
    },
    {
        "title": "Chaise Bureau Enfant Réglable - KidDesk",
        "slug": "chaise-bureau-enfant-reglable-kiddesk",
        "description": "Chaise de bureau spécialement conçue pour les enfants. Hauteur réglable pour s'adapter à la croissance. Design coloré et matériaux sans BPA. Sécurité anti-bascule.",
        "price": 89.99,
        "rating": 4.3,
        "review_count": 345,
        "category_id": 4,
    },
    {
        "title": "Tabouret Assis-Debout Réglable avec Roulettes - FlexStool",
        "slug": "tabouret-assis-debout-reglable-avec-roulettes-flexstool",
        "description": "Tabouret assis-debout réglable en hauteur avec roulettes. Idéal pour alterner entre position assise et debout. Assise inclinée qui favorise une posture active.",
        "price": 149.99,
        "rating": 4.5,
        "review_count": 567,
        "category_id": 4,
    },
    {
        "title": "Chaise Bureau Filet Respirant Accoudoirs Rabattables - AirMesh",
        "slug": "chaise-bureau-filet-respirant-accoudoirs-rabattables-airmesh",
        "description": "Chaise de bureau en filet mesh respirant avec accoudoirs rabattables. Design ergonomique avec support lombaire intégré. Parfait pour les espaces réduits.",
        "price": 199.99,
        "rating": 4.6,
        "review_count": 987,
        "category_id": 4,
    },
    {
        "title": "Fauteuil Direction Cuir Véritable - BossChair",
        "slug": "fauteuil-direction-cuir-veritable-bosschair",
        "description": "Fauteuil de direction en cuir véritable pleine fleur. Dossier haut rembourré avec soutien lombaire renforcé. Accoudoirs capitonnés et base chrome robuste.",
        "price": 599.99,
        "rating": 4.8,
        "review_count": 234,
        "category_id": 4,
    },
    {
        "title": "Chaise Bureau Pliante Compacte - FoldSeat",
        "slug": "chaise-bureau-pliante-compacte-foldseat",
        "description": "Chaise de bureau pliante ultra-compacte. Se range facilement sous un bureau ou dans un placard. Structure acier légère et assise en tissu résistant.",
        "price": 69.99,
        "rating": 4.2,
        "review_count": 654,
        "category_id": 4,
    },
    {
        "title": "Chaise de Bureau avec Repose-Pieds Intégré - FootRest Chair",
        "slug": "chaise-de-bureau-avec-repose-pieds-integre-footrest-chair",
        "description": "Chaise de bureau avec repose-pieds escamotable intégré. Dossier inclinable, accoudoirs réglables et coussin lombaire. Confort ultime pour les longues journées.",
        "price": 259.99,
        "rating": 4.5,
        "review_count": 432,
        "category_id": 4,
    },
    {
        "title": "Siège Balançoire Bureau Dynamique - SwingSeat",
        "slug": "siege-balancoire-bureau-dynamique-swingseat",
        "description": "Siège balançoire dynamique pour bureau. Mouvement pendulaire naturel qui renforce les muscles du dos. Assise large et confortable, structure acier robuste.",
        "price": 179.99,
        "rating": 4.3,
        "review_count": 345,
        "category_id": 4,
    },
    {
        "title": "Chaise Bureau Grande Taille 200kg - BigBoss",
        "slug": "chaise-bureau-grande-taille-200kg-bigboss",
        "description": "Chaise de bureau renforcée pour grande taille supportant jusqu'à 200 kg. Assise XL extra-large, dossier haut renforcé. Vérin pneumatique classe 4 et base acier.",
        "price": 449.99,
        "rating": 4.6,
        "review_count": 234,
        "category_id": 4,
    },
    {
        "title": "Chaise Bureau Design Scandinave Tissu Gris - NordicDesk",
        "slug": "chaise-bureau-design-scandinave-tissu-gris-nordicdesk",
        "description": "Chaise de bureau au design scandinave épuré en tissu gris. Pieds en bois de hêtre massif, assise en tissu bouclette. Allie esthétique minimaliste et confort au quotidien.",
        "price": 229.99,
        "rating": 4.7,
        "review_count": 567,
        "category_id": 4,
    },
]

SOURCE_ID = 1
AFFILIATE_TAG = "?tag=ergozone-21"


def slugify(title):
    """Generate a URL-friendly slug from a title."""
    slug = title.lower()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    inserted = {3: 0, 4: 0}

    for p in PRODUCTS:
        slug = p["slug"]
        affiliate_url = f"https://www.amazon.fr/dp/B0EXAMPLE/{slug}{AFFILIATE_TAG}"
        original_url = f"https://www.amazon.fr/dp/B0EXAMPLE/{slug}"
        image_path = f"/images/{slug}.webp"

        cursor.execute(
            """
            INSERT INTO item (title, slug, description, price, currency, rating, review_count,
                              image_path, affiliate_url, original_url, source_id, category_id)
            VALUES (?, ?, ?, ?, 'EUR', ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                p["title"],
                slug,
                p["description"],
                p["price"],
                p["rating"],
                p["review_count"],
                image_path,
                affiliate_url,
                original_url,
                SOURCE_ID,
                p["category_id"],
            ),
        )
        inserted[p["category_id"]] += 1

    # Update category item_count
    for cat_id, count in inserted.items():
        cursor.execute(
            "UPDATE category SET item_count = item_count + ? WHERE id = ?",
            (count, cat_id),
        )

    conn.commit()
    conn.close()

    print(f"✅ Inserted {inserted[3]} products into Confort bureau (cat 3)")
    print(f"✅ Inserted {inserted[4]} products into Sièges bureau (cat 4)")
    print(f"✅ Total: {sum(inserted.values())} products")


if __name__ == "__main__":
    main()
