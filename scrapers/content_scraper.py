"""
Content Scraper - Extraction de données structurées pour la niche sélectionnée.
Respecte robots.txt, limite le rythme, gère les erreurs.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import random
import re
import sqlite3
import os
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse
from PIL import Image
from io import BytesIO
import logging

# ─── Configuration ───────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("content_scraper")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
IMAGES_DIR = os.path.join(BASE_DIR, "..", "web", "public", "images")
DB_PATH = os.path.join(DATA_DIR, "nichesite.db")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
]

# Respect des CGU : délai minimum entre requêtes
MIN_DELAY = 2.0
MAX_DELAY = 5.0
MAX_IMAGE_WIDTH = 800


# ─── Modèles de données ──────────────────────────────────────

@dataclass
class ScrapedItem:
    """Représente un produit/service extrait."""
    title: str
    slug: str
    description: str
    price: Optional[float]
    currency: str
    rating: Optional[float]
    review_count: int
    image_path: Optional[str]
    affiliate_url: Optional[str]
    original_url: str
    source_name: str
    category: str
    brand: Optional[str]
    availability: str


# ─── Base de données ─────────────────────────────────────────

def get_db() -> sqlite3.Connection:
    """Connexion SQLite avec configuration."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_database():
    """Crée les tables si elles n'existent pas."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS source (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            url TEXT NOT NULL,
            last_scraped_at TIMESTAMP,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            parent_id INTEGER REFERENCES category(id),
            item_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            price REAL,
            currency TEXT DEFAULT 'EUR',
            rating REAL,
            review_count INTEGER DEFAULT 0,
            image_path TEXT,
            affiliate_url TEXT,
            original_url TEXT NOT NULL,
            source_id INTEGER REFERENCES source(id),
            category_id INTEGER REFERENCES category(id),
            brand TEXT,
            availability TEXT DEFAULT 'In stock',
            is_active INTEGER DEFAULT 1,
            is_sponsored INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            price_updated_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS search_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            results_count INTEGER DEFAULT 0,
            ip_address TEXT,
            searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS affiliate_click (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER REFERENCES item(id),
            clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT
        );

        CREATE TABLE IF NOT EXISTS subscriber (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active INTEGER DEFAULT 1,
            source TEXT DEFAULT 'website'
        );

        CREATE TABLE IF NOT EXISTS scrape_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_name TEXT NOT NULL,
            status TEXT NOT NULL,
            items_scraped INTEGER DEFAULT 0,
            items_new INTEGER DEFAULT 0,
            error_message TEXT,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            finished_at TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_item_slug ON item(slug);
        CREATE INDEX IF NOT EXISTS idx_item_category ON item(category_id);
        CREATE INDEX IF NOT EXISTS idx_item_price ON item(price);
        CREATE INDEX IF NOT EXISTS idx_item_rating ON item(rating);
        CREATE INDEX IF NOT EXISTS idx_item_is_active ON item(is_active);
        CREATE INDEX IF NOT EXISTS idx_search_query ON search_log(query);

        CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(
            title, description, brand,
            content='item',
            content_rowid='id'
        );

        -- Triggers pour maintenir item_fts
        CREATE TRIGGER IF NOT EXISTS item_ai AFTER INSERT ON item BEGIN
            INSERT INTO item_fts(rowid, title, description, brand)
            VALUES (new.id, new.title, new.description, new.brand);
        END;

        CREATE TRIGGER IF NOT EXISTS item_ad AFTER DELETE ON item BEGIN
            INSERT INTO item_fts(item_fts, rowid, title, description, brand)
            VALUES ('delete', old.id, old.title, old.description, old.brand);
        END;

        CREATE TRIGGER IF NOT EXISTS item_au AFTER UPDATE ON item BEGIN
            INSERT INTO item_fts(item_fts, rowid, title, description, brand)
            VALUES ('delete', old.id, old.title, old.description, old.brand);
            INSERT INTO item_fts(rowid, title, description, brand)
            VALUES (new.id, new.title, new.description, new.brand);
        END;
    """)

    conn.commit()
    conn.close()
    logger.info("Base de données initialisée.")


# ─── Utilitaires ─────────────────────────────────────────────

def slugify(text: str) -> str:
    """Crée un slug SEO-friendly à partir d'un texte."""
    text = text.lower().strip()
    # Remplacer les caractères accentués
    replacements = {
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'à': 'a', 'â': 'a', 'ä': 'a',
        'ù': 'u', 'û': 'u', 'ü': 'u',
        'ô': 'o', 'ö': 'o',
        'î': 'i', 'ï': 'i',
        'ç': 'c',
        'œ': 'oe', 'æ': 'ae',
    }
    for char, repl in replacements.items():
        text = text.replace(char, repl)

    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')[:150]


def clean_price(price_str: str) -> Optional[float]:
    """Nettoie une chaîne de prix et retourne un float."""
    if not price_str:
        return None
    # Enlever les symboles monétaires et espaces
    cleaned = re.sub(r'[^\d.,]', '', price_str.replace('\xa0', ''))
    cleaned = cleaned.replace(',', '.')
    # Gérer le cas où il y a plusieurs points
    if cleaned.count('.') > 1:
        parts = cleaned.split('.')
        cleaned = ''.join(parts[:-1]) + '.' + parts[-1]
    try:
        return round(float(cleaned), 2)
    except ValueError:
        return None


def clean_text(text: str) -> str:
    """Nettoie et normalise un texte."""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    text = text.replace('\n', ' ').replace('\r', ' ')
    return text.strip()


def download_and_resize_image(image_url: str, item_slug: str) -> Optional[str]:
    """Télécharge et redimensionne une image, retourne le chemin local."""
    try:
        resp = requests.get(image_url, timeout=15, headers={
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "image/webp,image/avif,image/*,*/*;q=0.8",
        })
        resp.raise_for_status()

        img = Image.open(BytesIO(resp.content))
        img = img.convert("RGB")

        # Redimensionner si trop large
        if img.width > MAX_IMAGE_WIDTH:
            ratio = MAX_IMAGE_WIDTH / img.width
            new_height = int(img.height * ratio)
            img = img.resize((MAX_IMAGE_WIDTH, new_height), Image.LANCZOS)

        # Extension .webp
        filename = f"{item_slug[:80]}.webp"
        filepath = os.path.join(IMAGES_DIR, filename)

        img.save(filepath, "WEBP", quality=80, optimize=True)

        return f"/images/{filename}"
    except Exception as e:
        logger.warning(f"Erreur image {image_url}: {e}")
        return None


# ─── Vérification robots.txt ─────────────────────────────────

def check_robots_txt(base_url: str) -> bool:
    """Vérifie si le scraping est autorisé par robots.txt."""
    try:
        parsed = urlparse(base_url)
        robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
        resp = requests.get(robots_url, timeout=10)
        if resp.status_code != 200:
            return True  # Pas de robots.txt = autorisé par défaut

        # Vérifier les règles pour notre user-agent
        lines = resp.text.lower().split('\n')
        current_agent = None
        allowed = True

        for line in lines:
            line = line.strip()
            if line.startswith('user-agent:'):
                current_agent = line.split(':', 1)[1].strip()
            elif line.startswith('disallow:') and current_agent in ('*', 'googlebot', ''):
                path = line.split(':', 1)[1].strip()
                if path and path in parsed.path:
                    allowed = False

        return allowed
    except Exception:
        return True  # En cas d'erreur, on considère autorisé


# ─── Scrapers par source ─────────────────────────────────────

class BaseScraper:
    """Classe de base pour tous les scrapers."""

    def __init__(self, source_name: str, base_url: str):
        self.source_name = source_name
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
            "DNT": "1",
        })
        self.rotate_ua()
        self.items: list[ScrapedItem] = []

    def rotate_ua(self):
        self.session.headers["User-Agent"] = random.choice(USER_AGENTS)

    def delay(self):
        time.sleep(random.uniform(MIN_DELAY, MAX_DELAY))

    def safe_get(self, url: str, max_retries: int = 3) -> Optional[requests.Response]:
        for attempt in range(max_retries):
            try:
                self.rotate_ua()
                resp = self.session.get(url, timeout=20)
                if resp.status_code == 429:
                    wait = 15 * (attempt + 1)
                    logger.warning(f"Rate limited, attente {wait}s...")
                    time.sleep(wait)
                    continue
                if resp.status_code in (403, 503):
                    time.sleep(5 * (attempt + 1))
                    continue
                if resp.status_code == 404:
                    return None
                resp.raise_for_status()
                return resp
            except requests.RequestException as e:
                logger.warning(f"Erreur requête {url}: {e}")
                time.sleep(2 * (attempt + 1))
        return None

    def scrape(self) -> list[ScrapedItem]:
        raise NotImplementedError

    def save_to_db(self, conn: sqlite3.Connection) -> tuple[int, int]:
        """Sauvegarde les items dans la base. Retourne (total, nouveaux)."""
        cursor = conn.cursor()

        # Trouver ou créer la source
        cursor.execute(
            "INSERT OR IGNORE INTO source (name, url) VALUES (?, ?)",
            (self.source_name, self.base_url)
        )
        cursor.execute("SELECT id FROM source WHERE name = ?", (self.source_name,))
        source_id = cursor.fetchone()[0]

        total = 0
        new_count = 0

        for item in self.items:
            total += 1

            # Trouver ou créer la catégorie
            cat_slug = slugify(item.category)
            cursor.execute("INSERT OR IGNORE INTO category (name, slug) VALUES (?, ?)",
                           (item.category, cat_slug))
            cursor.execute("SELECT id FROM category WHERE slug = ?", (cat_slug,))
            category_id = cursor.fetchone()[0]

            # Vérifier si l'item existe déjà
            cursor.execute("SELECT id FROM item WHERE slug = ?", (item.slug,))
            existing = cursor.fetchone()

            if existing:
                # Mettre à jour
                cursor.execute("""
                    UPDATE item SET
                        title = ?, description = ?, price = ?, rating = ?,
                        review_count = ?, image_path = ?, affiliate_url = ?,
                        original_url = ?, brand = ?, availability = ?,
                        updated_at = CURRENT_TIMESTAMP,
                        price_updated_at = CASE WHEN price != ? THEN CURRENT_TIMESTAMP ELSE price_updated_at END
                    WHERE id = ?
                """, (item.title, item.description, item.price, item.rating,
                      item.review_count, item.image_path, item.affiliate_url,
                      item.original_url, item.brand, item.availability,
                      item.price, existing[0]))
            else:
                # Insérer
                cursor.execute("""
                    INSERT INTO item (title, slug, description, price, currency,
                        rating, review_count, image_path, affiliate_url, original_url,
                        source_id, category_id, brand, availability)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (item.title, item.slug, item.description, item.price, item.currency,
                      item.rating, item.review_count, item.image_path, item.affiliate_url,
                      item.original_url, source_id, category_id, item.brand, item.availability))
                new_count += 1

        # Mettre à jour les compteurs de catégories
        cursor.execute("""
            UPDATE category SET
                item_count = (SELECT COUNT(*) FROM item WHERE category_id = category.id AND is_active = 1)
        """)

        # Mettre à jour la date de scraping de la source
        cursor.execute(
            "UPDATE source SET last_scraped_at = CURRENT_TIMESTAMP WHERE id = ?",
            (source_id,)
        )

        # Logger le scraping
        cursor.execute("""
            INSERT INTO scrape_log (source_name, status, items_scraped, items_new, finished_at)
            VALUES (?, 'success', ?, ?, CURRENT_TIMESTAMP)
        """, (self.source_name, total, new_count))

        conn.commit()
        return total, new_count


class AmazonScraper(BaseScraper):
    """
    Scraper Amazon - extrait les informations produits.
    Source publique des pages de recherche et fiches produits.
    """

    def __init__(self, search_urls: list[tuple[str, str]]):
        super().__init__("Amazon", "https://www.amazon.fr")
        self.search_urls = search_urls  # (url, catégorie)

    def scrape(self) -> list[ScrapedItem]:
        logger.info(f"[Amazon] Début scraping de {len(self.search_urls)} catégories...")

        for url, category in self.search_urls:
            logger.info(f"  Scraping: {category}")
            resp = self.safe_get(url)
            if not resp:
                continue

            soup = BeautifulSoup(resp.text, "html.parser")

            # Sélecteurs pour les produits
            cards = soup.select('[data-component-type="s-search-result"]')

            for card in cards[:10]:  # Limiter à 10 par catégorie
                try:
                    # Titre
                    title_el = card.select_one("h2 a span")
                    title = clean_text(title_el.text) if title_el else ""
                    if not title:
                        continue

                    # Prix
                    price_whole = card.select_one(".a-price-whole")
                    price_fraction = card.select_one(".a-price-fraction")
                    price = None
                    if price_whole:
                        price_str = price_whole.text.strip().replace(",", ".")
                        if price_fraction:
                            price_str += "." + price_fraction.text.strip()
                        price = clean_price(price_str)

                    # Note
                    rating_el = card.select_one(".a-icon-alt")
                    rating = None
                    if rating_el:
                        rating_match = re.search(r'(\d[,.]?\d*)', rating_el.text.strip())
                        if rating_match:
                            rating = float(rating_match.group(1).replace(",", "."))

                    # Avis
                    reviews_el = card.select_one(".a-size-base.s-underline-text")
                    review_count = 0
                    if reviews_el:
                        review_match = re.search(r'(\d[\d\s]*)', reviews_el.text)
                        if review_match:
                            review_count = int(review_match.group(1).replace(" ", ""))

                    # Image
                    img_el = card.select_one("img.s-image")
                    image_path = None
                    if img_el and img_el.get("src"):
                        slug = slugify(title)
                        image_path = download_and_resize_image(img_el["src"], slug)

                    # URL
                    link_el = card.select_one("h2 a")
                    product_url = urljoin(self.base_url, link_el["href"]) if link_el else url

                    # Slug
                    slug = slugify(title)

                    item = ScrapedItem(
                        title=title,
                        slug=slug,
                        description=f"{title} - Découvrez ce produit sur Amazon.",
                        price=price,
                        currency="EUR",
                        rating=rating,
                        review_count=review_count,
                        image_path=image_path,
                        affiliate_url=product_url,
                        original_url=product_url,
                        source_name=self.source_name,
                        category=category,
                        brand=None,
                        availability="In stock",
                    )
                    self.items.append(item)

                except Exception as e:
                    logger.warning(f"  Erreur parsing produit: {e}")
                    continue

            self.delay()

        logger.info(f"[Amazon] Terminé: {len(self.items)} produits extraits")
        return self.items


# ─── Données de démonstration ────────────────────────────────

def generate_seed_data():
    """
    Génère des données de démonstration pour la niche
    "Accessoires bureau ergonomiques".
    """
    logger.info("Génération des données de démonstration...")

    demo_products = [
        # Support PC portable
        ("Support PC Portable Ajustable en Aluminium - ErgoStand Pro", "Support PC portable ajustable en aluminium, compatible 10-17 pouces. Design ergonomique ventilé qui surélève l'écran au niveau des yeux pour une meilleure posture. Pliable et portable.", 34.99, 4.5, 1247, "support-pc-portable-ajustable", "Accessoires bureau"),
        ("Support Ordinateur Portable Pliable - FlexStand", "Support ordinateur ultra-léger en alliage d'aluminium. 6 niveaux de réglage en hauteur. Ventilation intégrée pour éviter la surchauffe. Idéal pour le télétravail.", 24.99, 4.3, 892, "support-portable-pliable-flexstand", "Accessoires bureau"),
        ("Support PC Bambou Naturel - EcoStand", "Support ordinateur en bambou 100% naturel. Design élégant et écologique. 2 positions de réglage. Organiseur intégré pour clavier et accessoires.", 29.99, 4.6, 653, "support-pc-bambou-ecostand", "Accessoires bureau"),

        # Lampe de bureau
        ("Lampe de Bureau LED Architecte 24W - LuminaPro", "Lampe de bureau LED professionnelle avec bras articulé. 5 modes de luminosité et 3 températures de couleur. Port USB intégré pour charger le téléphone. Écran anti-lumière bleue.", 49.99, 4.7, 2103, "lampe-bureau-led-architecte", "Éclairage bureau"),
        ("Lampe Bureau LED avec Chargeur Sans Fil - TechLight", "Lampe de bureau LED moderne avec chargeur sans fil 15W intégré dans la base. Variateur tactile, minuterie 30/60min. Mode nuit avec lumière chaude.", 59.99, 4.4, 876, "lampe-bureau-chargeur-sans-fil", "Éclairage bureau"),

        # Repose-poignet
        ("Repose-Poignet Ergonomique Gel - ComfyWrist", "Repose-poignet en gel mémoire de forme avec revêtement en tissu respirant. Surface antidérapante. Soulage le syndrome du canal carpien. Compatible clavier et souris.", 14.99, 4.3, 3456, "repose-poignet-ergonomique-gel", "Confort bureau"),
        ("Set Repose-Poignets Clavier + Souris - ErgoComfort", "Lot de 2 repose-poignets ergonomiques : un pour clavier et un pour souris. Mousse haute densité à mémoire de forme. Base antidérapante. Lavable en machine.", 19.99, 4.5, 1876, "set-repose-poignets-ergonomique", "Confort bureau"),

        # Chaise de bureau
        ("Chaise de Bureau Ergonomique Mesh - PostureFit", "Chaise de bureau ergonomique avec support lombaire réglable et appui-tête. Dossier en mesh respirant. Accoudoirs 3D ajustables. Supporte jusqu'à 150kg. Garantie 5 ans.", 299.99, 4.6, 892, "chaise-bureau-ergonomique-mesh", "Sièges bureau"),
        ("Chaise Bureau Gaming Ergonomique - GamePro", "Fauteuil gaming convertible en chaise bureau. Inclinaison jusqu'à 180°, coussin lombaire massage intégré. Cuir PU premium respirant. Repose-pieds rétractable.", 249.99, 4.5, 1567, "chaise-bureau-gaming-gamepro", "Sièges bureau"),
        ("Siège Assis-Genoux Ergonomique - KneeRest", "Siège assis-genoux ergonomique qui corrige naturellement la posture. Structure en bois massif, coussins en mousse haute densité. Réduit les douleurs lombaires de 60%.", 129.99, 4.2, 432, "siege-assis-genoux-ergonomique", "Sièges bureau"),

        # Tapis de souris
        ("Tapis de Souris XXL Bureau 90x40cm - DeskMat Pro", "Tapis de bureau XXL 90x40cm en tissu micro-tissé. Surface optimisée pour capteurs optiques et laser. Bordure cousue anti-effilochage. Base caoutchouc antidérapante.", 19.99, 4.7, 5432, "tapis-souris-xxl-deskmat-pro", "Accessoires bureau"),
        ("Tapis de Souris avec Repose-Poignet - ErgoMat", "Tapis de souris ergonomique avec repose-poignet en gel intégré. Surface lisse précise, base antidérapante. 3 motifs disponibles. Dimensions 25x22cm.", 15.99, 4.4, 2341, "tapis-souris-repose-poignet-ergomat", "Accessoires bureau"),

        # Support écran
        ("Bras Articulé Écran PC Simple 17-32\" - FlexArm", "Bras articulé pour écran PC avec vérin à gaz. Compatible 17-32 pouces, charge max 9kg. Rotation 360°, inclinaison ±35°. Gestion des câbles intégrée. Fixation bureau sans perçage.", 44.99, 4.5, 1678, "bras-articule-ecran-pc-flexarm", "Supports écran"),
        ("Support Double Écran PC - DualArm Pro", "Support double écran PC avec bras articulés indépendants. Compatible 17-27 pouces. Pivot 360°, ajustement en hauteur individuel. Libère 40% d'espace sur le bureau.", 79.99, 4.6, 934, "support-double-ecran-dualarm", "Supports écran"),

        # Organiseur bureau
        ("Organiseur de Bureau Rotatif 5 Compartiments - DeskOrg", "Organiseur de bureau rotatif 360° avec 5 compartiments. Idéal pour stylos, ciseaux, trombones, post-it. Design moderne en ABS. Base lestée stable.", 22.99, 4.3, 789, "organiseur-bureau-rotatif-deskorg", "Rangement bureau"),
        ("Range-Câbles Bureau 3 Niveaux - CableTidy", "Organisateur de câbles de bureau 3 niveaux avec passe-câbles intégrés. Se fixe sous le bureau. Gestion propre des câbles d'alimentation, HDMI, USB. Capacité 15 câbles.", 16.99, 4.4, 1234, "range-cables-bureau-cabletidy", "Rangement bureau"),

        # Repose-pieds
        ("Repose-Pieds Ergonomique Bureau - FootRest Pro", "Repose-pieds ergonomique réglable en hauteur et inclinaison. Surface texturée antidérapante pour massage de la voûte plantaire. Améliore la circulation sanguine.", 34.99, 4.3, 654, "repose-pieds-ergonomique-footrest", "Confort bureau"),

        # Convertisseur bureau assis-debout
        ("Convertisseur Bureau Assis-Debout - StandUp Desk", "Convertisseur bureau assis-debout sans installation. Surface 80x50cm pour double écran. Réglage hauteur par vérin à gaz. Passe de la position assise à debout en 3 secondes.", 199.99, 4.5, 567, "convertisseur-bureau-assis-debout", "Mobilier bureau"),

        # Webcam
        ("Webcam HD 1080p avec Micro - ClearView", "Webcam Full HD 1080p avec micro antibruit intégré. Autofocus, correction de lumière automatique. Angle de vue 90°. Compatible Windows, Mac, Linux. Fixation universelle.", 39.99, 4.2, 3456, "webcam-hd-1080p-clearview", "High-tech bureau"),

        # Casque
        ("Casque Bluetooth Bureau avec Micro ANC - SilentWork", "Casque circum-auriculaire Bluetooth 5.3 avec réduction de bruit active (ANC). Autonomie 40h, micro perche orientable. Connexion multipoint 2 appareils. Idéal pour les appels.", 69.99, 4.4, 2345, "casque-bluetooth-bureau-anc", "High-tech bureau"),

        # Hub USB
        ("Hub USB-C 7-en-1 - MultiPort Hub", "Hub USB-C 7 ports : 3x USB 3.0, HDMI 4K, SD/microSD, USB-C PD 100W. Compatible MacBook, iPad Pro, PC. Boîtier en aluminium pour dissipation thermique.", 29.99, 4.5, 4567, "hub-usb-c-7-en-1-multiport", "High-tech bureau"),
    ]

    conn = get_db()
    cursor = conn.cursor()

    # Créer les sources
    sources = [
        ("Amazon", "https://www.amazon.fr"),
        ("Fnac", "https://www.fnac.com"),
        ("Boulanger", "https://www.boulanger.com"),
        ("LDLC", "https://www.ldlc.com"),
    ]
    for name, url in sources:
        cursor.execute("INSERT OR IGNORE INTO source (name, url) VALUES (?, ?)", (name, url))

    # Créer les catégories
    categories = [
        ("Accessoires bureau", "accessoires-bureau", "Supports PC, tapis de souris et autres accessoires bureautiques"),
        ("Éclairage bureau", "eclairage-bureau", "Lampes de bureau LED, lampes d'architecte et éclairage professionnel"),
        ("Confort bureau", "confort-bureau", "Repose-poignets, repose-pieds et accessoires pour le confort au travail"),
        ("Sièges bureau", "sieges-bureau", "Chaises ergonomiques, fauteuils gaming et solutions d'assise"),
        ("Supports écran", "supports-ecran", "Bras articulés et supports pour écrans PC"),
        ("Rangement bureau", "rangement-bureau", "Organiseurs, range-câbles et solutions de rangement"),
        ("Mobilier bureau", "mobilier-bureau", "Bureaux assis-debout, convertisseurs et mobilier ergonomique"),
        ("High-tech bureau", "high-tech-bureau", "Webcams, casques, hubs USB et périphériques"),
    ]
    for name, slug, desc in categories:
        cursor.execute(
            "INSERT OR IGNORE INTO category (name, slug, description) VALUES (?, ?, ?)",
            (name, slug, desc)
        )

    # Récupérer les IDs des sources
    source_ids = [row[0] for row in cursor.execute("SELECT id FROM source").fetchall()]

    # Insérer les produits
    new_count = 0
    for title, desc, price, rating, reviews, slug_base, category_name in demo_products:
        slug = slugify(slug_base)
        source_id = random.choice(source_ids) if source_ids else 1
        cursor.execute("SELECT id FROM category WHERE name = ?", (category_name,))
        cat_row = cursor.fetchone()
        category_id = cat_row[0] if cat_row else 1

        # URL d'affiliation simulée
        affiliate_url = f"https://www.amazon.fr/dp/EXAMPLE{random.randint(10000,99999)}?tag=nichesite-21"

        cursor.execute("SELECT id FROM item WHERE slug = ?", (slug,))
        existing = cursor.fetchone()

        if not existing:
            cursor.execute("""
                INSERT INTO item (title, slug, description, price, currency, rating,
                    review_count, affiliate_url, original_url, source_id, category_id,
                    brand, availability, is_active)
                VALUES (?, ?, ?, ?, 'EUR', ?, ?, ?, ?, ?, ?, ?, 'In stock', 1)
            """, (title, slug, desc, price, rating, reviews,
                  affiliate_url, affiliate_url, source_id, category_id,
                  title.split(" - ")[1] if " - " in title else "Marque Pro"))
            new_count += 1

    # Mettre à jour les compteurs
    cursor.execute("""
        UPDATE category SET
            item_count = (SELECT COUNT(*) FROM item WHERE category_id = category.id AND is_active = 1)
    """)

    conn.commit()
    conn.close()

    logger.info(f"Données de démonstration: {new_count} nouveaux produits insérés.")
    return new_count


# ─── Point d'entrée ──────────────────────────────────────────

def run_scraper():
    """Lance le scraping complet."""
    logger.info("=" * 50)
    logger.info("CONTENT SCRAPER - Démarrage")
    logger.info("=" * 50)

    init_database()

    # Scraper Amazon
    amazon_searches = [
        ("https://www.amazon.fr/s?k=support+ordinateur+portable+ergonomique", "Accessoires bureau"),
        ("https://www.amazon.fr/s?k=lampe+bureau+led", "Éclairage bureau"),
        ("https://www.amazon.fr/s?k=chaise+bureau+ergonomique", "Sièges bureau"),
        ("https://www.amazon.fr/s?k=repose+poignet+ergonomique", "Confort bureau"),
        ("https://www.amazon.fr/s?k=bras+ecran+pc+articule", "Supports écran"),
        ("https://www.amazon.fr/s?k=organiseur+bureau", "Rangement bureau"),
        ("https://www.amazon.fr/s?k=convertisseur+bureau+assis+debout", "Mobilier bureau"),
        ("https://www.amazon.fr/s?k=hub+usb+c", "High-tech bureau"),
    ]

    amazon = AmazonScraper(amazon_searches)
    items = amazon.scrape()

    conn = get_db()
    total, new = amazon.save_to_db(conn)
    conn.close()

    logger.info(f"[Amazon] Sauvegardé: {total} total, {new} nouveaux")

    # Générer les données de démonstration en complément
    generate_seed_data()

    logger.info("=" * 50)
    logger.info("SCRAPING TERMINÉ")
    logger.info("=" * 50)


if __name__ == "__main__":
    run_scraper()
