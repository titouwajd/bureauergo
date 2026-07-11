#!/usr/bin/env python3
"""Migrate the SQLite DB with shop tables and seed digital products."""

import sqlite3
import os
import re
import unicodedata

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nichesite.db")


def slugify(title: str) -> str:
    """Generate a URL-friendly slug from a French title."""
    # Normalize unicode (decompose accents)
    slug = unicodedata.normalize("NFKD", title)
    # Remove diacritics
    slug = "".join(c for c in slug if not unicodedata.combining(c))
    # Lowercase
    slug = slug.lower()
    # Replace non-alphanumeric with hyphens
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    # Strip leading/trailing hyphens
    slug = slug.strip("-")
    return slug


PRODUCTS = [
    {
        "title": "Guide Ultime du Télétravail Ergonomique",
        "price": 19.99,
        "category": "ebook",
        "description": (
            "Découvrez les meilleures pratiques pour aménager un espace de télétravail "
            "sain et productif. Ce guide complet couvre le choix du mobilier, la posture, "
            "l'éclairage et les routines essentielles pour préserver votre santé au quotidien."
        ),
    },
    {
        "title": "Checklist : Aménager son Bureau à la Maison",
        "price": 9.99,
        "category": "template",
        "description": (
            "Une checklist pas-à-pas pour transformer n'importe quelle pièce en bureau "
            "ergonomique. Inclut les dimensions recommandées, les distances écran, et les "
            "accessoires indispensables pour un confort optimal."
        ),
    },
    {
        "title": "30 Jours pour un Dos sans Douleur au Bureau",
        "price": 24.99,
        "category": "ebook",
        "description": (
            "Un programme progressif de 30 jours combinant exercices, étirements et ajustements "
            "posturaux. Conçu par des kinésithérapeutes pour soulager et prévenir les douleurs "
            "dorsales liées au travail sédentaire."
        ),
    },
    {
        "title": "Pack de Templates Notion pour Freelances",
        "price": 14.99,
        "category": "template",
        "description": (
            "Collection de 12 templates Notion prêts à l'emploi : suivi de projets, facturation, "
            "gestion du temps et bien-être. Optimisez votre productivité en tant que freelance "
            "avec des outils ergonomiques et bien pensés."
        ),
    },
    {
        "title": "Le Guide du Bureau Assis-Debout",
        "price": 17.99,
        "category": "guide",
        "description": (
            "Apprenez à tirer le meilleur parti de votre bureau assis-debout. Ce guide explique "
            "les bonnes transitions, les réglages de hauteur idéaux, et les accessoires "
            "complémentaires pour alterner les positions sans risque."
        ),
    },
    {
        "title": "Ebook : Productivité & Bien-être au Travail",
        "price": 29.99,
        "category": "ebook",
        "description": (
            "Un ebook complet qui fait le lien entre productivité durable et bien-être physique "
            "au travail. Explorez des méthodes éprouvées pour rester concentré tout en protégeant "
            "votre corps des effets négatifs de la sédentarité."
        ),
    },
]


def create_tables(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS product (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            price REAL NOT NULL,
            file_path TEXT,
            file_size INTEGER,
            image_path TEXT,
            category TEXT DEFAULT 'ebook',
            is_active INTEGER DEFAULT 1,
            sales_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS customer_order (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER REFERENCES customer(id),
            status TEXT DEFAULT 'pending',
            total REAL NOT NULL,
            stripe_session_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS order_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER REFERENCES customer_order(id),
            product_id INTEGER REFERENCES product(id),
            quantity INTEGER DEFAULT 1,
            unit_price REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS download_token (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL UNIQUE,
            order_item_id INTEGER REFERENCES order_item(id),
            customer_id INTEGER REFERENCES customer(id),
            product_id INTEGER REFERENCES product(id),
            expires_at TIMESTAMP NOT NULL,
            used_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS revenue_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_product_slug ON product(slug);
        CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);
        CREATE INDEX IF NOT EXISTS idx_download_token ON download_token(token);
        CREATE INDEX IF NOT EXISTS idx_order_customer ON customer_order(customer_id);
        """
    )


def seed_products(conn: sqlite3.Connection) -> None:
    cursor = conn.cursor()
    for product in PRODUCTS:
        slug = slugify(product["title"])
        cursor.execute(
            """
            INSERT OR IGNORE INTO product (title, slug, description, price, image_path, category, is_active)
            VALUES (?, ?, ?, ?, '/images/PLACEHOLDER.webp', ?, 1)
            """,
            (product["title"], slug, product["description"], product["price"], product["category"]),
        )
    conn.commit()


def main() -> None:
    print(f"Connecting to database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")

    print("Creating tables...")
    create_tables(conn)

    print("Seeding products...")
    seed_products(conn)

    # Verify
    cursor = conn.execute("SELECT COUNT(*) FROM product")
    count = cursor.fetchone()[0]
    print(f"Products in database: {count}")

    conn.close()
    print("Migration complete.")


if __name__ == "__main__":
    main()
