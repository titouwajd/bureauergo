# 🪑 BureauErgo — Site de niche monétisé clé en main

Site web complet pour la niche **"Accessoires de bureau ergonomiques"** avec :
- 🕷️ Scraping automatique de produits
- 💰 Monétisation par affiliation + publicité
- 🔍 SEO optimisé (SSR, JSON-LD, sitemap, URLs propres)
- 📱 Design responsive avec Tailwind CSS
- ⚡ Next.js 14 + TypeScript + SQLite
- 🐳 Docker pour le déploiement

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js 22+** et npm
- **Python 3.10+** (pour les scrapers)
- Optionnel : Docker

### 1. Cloner et installer

```bash
cd nichesite

# Installer les dépendances web
cd web
npm install
cd ..

# Installer les dépendances Python
cd scrapers
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 2. Générer les données de démonstration

```bash
cd scrapers
source venv/bin/activate
python content_scraper.py
```

Cela crée la base de données SQLite dans `data/nichesite.db` avec 21 produits de démonstration.

### 3. Lancer le site en développement

```bash
cd web
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Architecture du projet

```
nichesite/
├── web/                          # Application Next.js
│   ├── src/
│   │   ├── app/                  # Pages et API routes (App Router)
│   │   │   ├── page.tsx          # Accueil
│   │   │   ├── categorie/[slug]/ # Page catégorie avec filtres
│   │   │   ├── item/[slug]/      # Fiche détail produit
│   │   │   ├── blog/             # Blog
│   │   │   ├── contact/          # Contact
│   │   │   ├── mentions-legales/ # Mentions légales
│   │   │   ├── politique-confidentialite/
│   │   │   ├── conditions-utilisation/
│   │   │   ├── api/              # API REST
│   │   │   │   ├── items/        # GET /api/items (pagination, filtres)
│   │   │   │   ├── search/       # GET /api/search (recherche)
│   │   │   │   ├── categories/   # GET /api/categories
│   │   │   │   ├── subscribe/    # POST /api/subscribe (newsletter)
│   │   │   │   └── go/[id]/      # GET /api/go/[id] (redirection affiliée)
│   │   │   ├── robots.ts         # robots.txt dynamique
│   │   │   ├── sitemap.ts        # Sitemap XML dynamique
│   │   │   ├── not-found.tsx     # Page 404
│   │   │   └── error.tsx         # Page 500
│   │   ├── components/           # Composants React
│   │   │   ├── Header.tsx        # Header avec nav + barre de recherche
│   │   │   ├── Footer.tsx        # Footer avec liens + newsletter
│   │   │   ├── SearchBar.tsx     # Recherche prédictive (debounce 300ms)
│   │   │   ├── ItemCard.tsx      # Carte produit
│   │   │   ├── StarRating.tsx    # Étoiles de notation SVG
│   │   │   ├── FilterSidebar.tsx # Filtres (catégories, prix, note, tri)
│   │   │   ├── Pagination.tsx    # Pagination
│   │   │   ├── Breadcrumbs.tsx   # Fil d'Ariane + JSON-LD
│   │   │   ├── CookieBanner.tsx  # Bannière cookies RGPD
│   │   │   └── NewsletterForm.tsx# Formulaire newsletter
│   │   ├── lib/
│   │   │   ├── db.ts             # Accès base de données SQLite
│   │   │   └── constants.ts      # Configuration
│   │   └── types/
│   │       └── index.ts          # Types TypeScript
│   ├── public/images/            # Images des produits
│   ├── next.config.ts            # Configuration Next.js
│   ├── Dockerfile                # Docker pour l'app web
│   ├── .env.example              # Variables d'environnement
│   └── package.json
├── scrapers/                     # Scripts Python de scraping
│   ├── niche_finder.py           # Identification de niches
│   ├── content_scraper.py        # Extraction de produits
│   ├── requirements.txt
│   └── Dockerfile
├── data/                         # Base de données SQLite
│   └── nichesite.db
├── docker-compose.yml            # Stack Docker complète
└── README.md
```

---

## 📊 Base de données

**Tables :**
- `source` — Sources de données (Amazon, Fnac, etc.)
- `category` — Catégories de produits (8 catégories)
- `item` — Produits avec prix, note, avis, URL affiliée
- `search_log` — Journal des recherches internes
- `affiliate_click` — Traçage des clics affiliés
- `subscriber` — Emails newsletter
- `scrape_log` — Historique des scrapings

**Index :** slug, category_id, price, rating

**Recherche plein texte :** FTS5 sur title, description, brand

---

## 🔍 SEO

| Feature | Implémentation |
|---------|---------------|
| URLs propres | `/item/slug-du-produit`, `/categorie/nom-categorie` |
| JSON-LD | Product, AggregateRating, Offer, BreadcrumbList |
| Sitemap | Génération dynamique de toutes les pages |
| robots.txt | Configuré avec règles par user-agent |
| Meta tags | Title et description uniques par page |
| Canonical | Gestion des paramètres d'URL |
| Lazy loading | `loading="lazy"` sur toutes les images |
| Images | WebP, redimensionnées à 800px max |
| Core Web Vitals | SSR, bundle splitting automatique Next.js |
| Balises hreflang | Français (fr) |

---

## 💰 Monétisation

### 1. Affiliation
- Liens trackés via `/api/go/[id]` → log du clic → redirection
- Template de tag Amazon configurable via `AFFILIATE_TAG`
- Bouton "Voir l'offre" avec `rel="nofollow sponsored"`
- Déclaration de transparence sur toutes les pages

### 2. Google AdSense
- Emplacements : bannière header, sidebar, in-feed
- Conditionné par `ADSENSE_ENABLED=true`
- Non intrusif, désactivable

### 3. Listings sponsorisés
- Colonne `is_sponsored` dans la table `item`
- Les items sponsorisés apparaissent en premier
- Gérable via l'interface d'administration

---

## 🐳 Déploiement avec Docker

```bash
# Construire et lancer tous les services
docker compose up -d

# Services :
# - web : Next.js sur le port 3000
# - redis : Cache Redis
# - scraper-cron : Scraping automatique toutes les 6h
```

### Déploiement sur VPS (Hetzner / DigitalOcean)

```bash
# 1. Installer Docker et Docker Compose
curl -fsSL https://get.docker.com | sh

# 2. Cloner le projet
git clone <votre-repo> /opt/nichesite
cd /opt/nichesite

# 3. Configurer les variables d'environnement
cp web/.env.example .env
nano .env  # Modifier les valeurs

# 4. Lancer
docker compose up -d

# 5. Configurer Nginx + Let's Encrypt (HTTPS)
#    Utiliser nginx-proxy + acme-companion
```

### Déploiement sur Vercel (Next.js) + Railway (DB)

```bash
# Déployer le frontend sur Vercel
cd web
vercel --prod

# Pour la base de données, utiliser Railway ou Supabase
# et configurer DATABASE_URL
```

---

## 🔄 Maintenance

### Scraping manuel
```bash
cd scrapers
source venv/bin/activate
python content_scraper.py
```

### Ajouter une nouvelle source de scraping
1. Créer une classe héritant de `BaseScraper` dans `scrapers/content_scraper.py`
2. Implémenter la méthode `scrape()`
3. Ajouter l'appel dans `run_scraper()`

### Sauvegarde de la base de données
```bash
# Sauvegarde quotidienne (cron)
0 3 * * * cp /opt/nichesite/data/nichesite.db /backup/nichesite_$(date +\%Y\%m\%d).db
```

### Mise à jour des prix
Le scraper tourne automatiquement toutes les 6h (via docker-compose).
Pour une mise à jour plus fréquente, modifier l'intervalle dans `docker-compose.yml`.

---

## ⚖️ Aspects légaux

- ✅ Mentions légales
- ✅ Politique de confidentialité (conforme RGPD)
- ✅ Conditions d'utilisation
- ✅ Bannière de consentement cookies
- ✅ Transparence sur les liens d'affiliation
- ✅ Respect des robots.txt avant chaque scraping
- ✅ Seules des données factuelles publiques sont extraites

---

## 📈 Pistes d'évolution

- [ ] Commentaires et avis utilisateurs
- [ ] Comparaison de prix multi-sources
- [ ] Alertes email de baisse de prix
- [ ] Panel d'administration complet
- [ ] Migration PostgreSQL pour la production
- [ ] Cache Redis avancé
- [ ] Tests automatisés (Jest, Playwright)
- [ ] PWA (Progressive Web App)
- [ ] Génération d'articles IA (blog)
- [ ] Intégration Google Analytics / Plausible

---

## 📝 Licence

Ce projet est fourni à titre éducatif et commercial. Vous êtes libre de l'utiliser, le modifier et le déployer pour votre propre site. Assurez-vous de respecter les CGU des sites que vous scrapez et les lois applicables (RGPD, droit d'auteur).

---

**Fait avec ❤️ par CodeWhale**
