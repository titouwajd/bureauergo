# Guide de Migration — BureauErgo

---

## Bienvenue, nouveau propriétaire !

Félicitations pour l'acquisition de **BureauErgo** ! 🎉

Ce guide a été conçu pour vous accompagner pas à pas dans la migration complète du site. Pas d'inquiétude : chaque étape est expliquée simplement, même si vous n'êtes pas familier avec la technique. Prenez votre temps, et n'hésitez pas à solliciter de l'aide si besoin.

---

## 1. Ce que vous venez d'acheter

**BureauErgo** est un site web spécialisé dans les **accessoires de bureau ergonomiques**. 

| Élément | Détail |
|---------|--------|
| **Nom** | BureauErgo |
| **URL** | https://bureauergo.fr |
| **Niche** | Accessoires de bureau ergonomiques (sièges, supports écran, éclairage, rangement…) |
| **Création** | 2026 |
| **Technologie** | Next.js (React) + base de données SQLite + scripts Python |
| **Hébergement actuel** | Vercel (recommandé) |

### Sources de revenus

1. **Affiliation** — Liens vers Amazon, Fnac, Boulanger, etc. Vous touchez une commission sur chaque vente.
2. **Boutique** — Vente de guides et ebooks digitaux (paiement via Stripe).
3. **Publicité** — Google AdSense (optionnel, désactivé par défaut).

### Contenu inclus

- Code source complet du site (Next.js / React / TypeScript)
- Base de données avec tous les produits et catégories
- Scripts de scraping automatique de prix
- Documentation complète de migration (ce document)
- Fichiers de configuration prêts à l'emploi

---

## 2. Transfert du domaine

Le nom de domaine `bureauergo.fr` est actuellement enregistré chez un **registrar** (le bureau d'enregistrement qui gère votre domaine). Vous allez le transférer vers votre propre compte.

### Étape 1 : Déverrouiller le domaine

1. Connectez-vous au compte du registrar actuel.
2. Recherchez la section **« Domaines »** ou **« Gestion de domaine »**.
3. Trouvez `bureauergo.fr` et désactivez le **verrouillage de transfert** (souvent appelé « Registrar Lock » ou « Protection anti-transfert »).

### Étape 2 : Obtenir le code d'autorisation (EPP)

1. Toujours dans la gestion du domaine, cherchez l'option **« Code d'autorisation »**, **« Code EPP »** ou **« Auth Code »**.
2. Générez ou affichez ce code. **Copiez-le précieusement**.
3. Ce code ressemble à une chaîne de caractères aléatoire (ex : `X7k9P-m2Qw`).

### Étape 3 : Initier le transfert chez votre registrar

1. Créez un compte chez le registrar de votre choix (ex : **OVH**, **Gandi**, **Namecheap**, **Cloudflare Registrar**, **Infomaniak**).
2. Lancez une procédure de **transfert de domaine**.
3. Saisissez `bureauergo.fr` et le code EPP obtenu à l'étape 2.
4. Réglez les frais de transfert (généralement le prix d'une année de renouvellement).
5. Validez le transfert. Cela prend généralement **5 à 7 jours**.

> ⚠️ **Important** : Ne changez PAS les DNS pendant le transfert, sinon le site sera indisponible. Attendez la fin du transfert.

---

## 3. Transfert de l'hébergement

### Option A : Vercel (recommandé, facile) 🚀

Vercel est la plateforme actuelle. C'est gratuit pour un site de cette taille et très simple à utiliser.

1. **Créez un compte Vercel** sur [vercel.com](https://vercel.com) (connexion via GitHub recommandée).
2. **Connectez votre compte GitHub** dans les paramètres Vercel.
3. **Importez le dépôt** :
   - Cliquez sur **« Add New… » → « Project »**
   - Sélectionnez le dépôt GitHub contenant le code de BureauErgo
   - Vercel détectera automatiquement qu'il s'agit d'un projet Next.js
4. **Configurez les variables d'environnement** (voir section 4 ci-dessous).
5. Cliquez sur **« Deploy »**. Le site sera en ligne en moins de 2 minutes !
6. Une fois déployé, allez dans **Settings → Domains** et ajoutez `bureauergo.fr`.

> 💡 **Pour info** : Vercel propose un plan gratuit très généreux (100 Go de bande passante, 6000 minutes de build/mois). C'est largement suffisant pour BureauErgo.

### Option B : VPS (Hetzner / DigitalOcean) 🖥️

Si vous préférez un serveur dédié (plus de contrôle, mais plus technique) :

1. Louez un VPS chez **Hetzner** (à partir de 4€/mois) ou **DigitalOcean** (à partir de 6$/mois).
2. Choisissez Ubuntu 22.04 ou 24.04 LTS.
3. Connectez-vous en SSH et installez Docker :
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
4. Clonez le dépôt du site sur le serveur.
5. Configurez le fichier `.env` (voir section 4).
6. Lancez avec Docker Compose :
   ```bash
   docker compose up -d
   ```
7. Installez Nginx comme reverse proxy :
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   ```
8. Configurez Nginx pour pointer vers `localhost:3000`.
9. Générez un certificat SSL avec Let's Encrypt :
   ```bash
   sudo certbot --nginx -d bureauergo.fr -d www.bureauergo.fr
   ```

> ⚠️ Cette option nécessite des connaissances Linux de base. Si vous n'êtes pas à l'aise, restez sur l'Option A (Vercel).

---

## 4. Configuration des clés API

Le site utilise plusieurs services externes. Voici la liste complète des clés à configurer dans le fichier **`.env`** à la racine du projet.

### 4.1 Stripe (paiements boutique)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (commence par `sk_live_`) |
| `STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe (commence par `pk_live_`) |
| `STRIPE_WEBHOOK_SECRET` | Secret de webhook (commence par `whsec_`) |

**Où créer le compte** : [stripe.com](https://stripe.com) → Créez un compte → Dashboard → Développeurs → Clés API.

### 4.2 Amazon Associates (affiliation)

| Variable | Description |
|----------|-------------|
| `AFFILIATE_TAG` | Votre tag Amazon Associates (ex: `bureauergo-21`) |

**Où créer le compte** : [affiliate-program.amazon.com](https://affiliate-program.amazon.com) → Inscription → Choisir la boutique France.

### 4.3 Google AdSense (publicité)

| Variable | Description |
|----------|-------------|
| `ADSENSE_ENABLED` | `true` ou `false` |
| `ADSENSE_CLIENT_ID` | Votre ID éditeur (commence par `ca-pub-`) |
| `ADSENSE_SLOT_HEADER` | ID de l'emplacement bannière |
| `ADSENSE_SLOT_SIDEBAR` | ID de l'emplacement sidebar |
| `ADSENSE_SLOT_INFEED` | ID de l'emplacement dans le flux |

**Où créer le compte** : [adsense.google.com](https://adsense.google.com) → Inscription → Validation du site → Créer des blocs d'annonces.

### 4.4 SMTP (emails — newsletter, contact)

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | Serveur SMTP (ex: `smtp.gmail.com`) |
| `SMTP_PORT` | Port SMTP (ex: `587`) |
| `SMTP_USER` | Adresse email d'envoi |
| `SMTP_PASS` | Mot de passe d'application (Gmail) ou mot de passe SMTP |

**Pour Gmail** : activez la validation en 2 étapes, puis générez un « mot de passe d'application » dans les paramètres de sécurité Google.

### 4.5 JWT (sécurité)

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Clé secrète pour les tokens JWT |

**Générez une clé aléatoire** : vous pouvez utiliser un générateur en ligne ou taper n'importe quelle longue chaîne de caractères complexes.

### 4.6 Google Analytics

| Variable | Description |
|----------|-------------|
| `GOOGLE_ANALYTICS_ID` | ID de mesure (commence par `G-`) |

**Où créer le compte** : [analytics.google.com](https://analytics.google.com) → Créer un compte → Créer une propriété Web → Récupérer l'ID de mesure.

### 4.7 Admin

| Variable | Description |
|----------|-------------|
| `ADMIN_EMAIL` | Email de l'administrateur |
| `ADMIN_PASSWORD_HASH` | Hash du mot de passe admin |

### Où mettre ces clés ?

Toutes ces valeurs vont dans le fichier **`.env`** situé à la racine du projet. Un fichier exemple (`.env.example`) est fourni. Copiez-le :

```bash
cp .env.example .env
```

Puis éditez `.env` avec vos valeurs réelles. **⚠️ Ne partagez jamais ce fichier et ne le commitez jamais sur GitHub !**

---

## 5. Transfert de Stripe

Stripe gère les paiements de la boutique (guides/ebooks).

### Option A : Transférer le compte Stripe existant

Si le vendeur vous transfère son compte Stripe :

1. Le vendeur vous ajoute comme administrateur dans **Settings → Team**.
2. Vous mettez à jour l'email, le compte bancaire, et les informations légales.
3. Mettez à jour les clés API dans votre fichier `.env`.

### Option B : Créer un nouveau compte Stripe

1. Créez un compte sur [stripe.com](https://stripe.com).
2. Activez votre compte (vérification d'identité, compte bancaire).
3. Récupérez les clés API dans le Dashboard → Développeurs → Clés API.
4. Configurez un **webhook** pointant vers `https://bureauergo.fr/api/webhook` :
   - Dashboard → Développeurs → Webhooks → Ajouter un endpoint
   - URL : `https://bureauergo.fr/api/webhook`
   - Événements à écouter : `checkout.session.completed`
   - Copiez le secret de signature (`whsec_...`) dans votre `.env`.

---

## 6. Base de données

### Où se trouve le fichier ?

La base de données est un fichier SQLite situé dans le dossier **`data/`** à la racine du projet :

```
data/nichesite.db
```

Ce fichier contient :
- Tous les produits et leurs informations
- Les catégories
- Les abonnés à la newsletter
- L'historique des recherches
- Les logs d'affiliation

### Sauvegarde

Pour sauvegarder la base, copiez simplement le fichier :

```bash
cp data/nichesite.db data/nichesite_backup_$(date +%Y%m%d).db
```

### Restauration

Pour restaurer une sauvegarde :

```bash
cp data/nichesite_backup_20260101.db data/nichesite.db
```

> 💡 **Automatisez les sauvegardes** : vous pouvez configurer un cron qui copie le fichier chaque jour vers un stockage cloud (Dropbox, Google Drive) ou un autre serveur.

---

## 7. Tâches planifiées (cron)

### Le scraper

Un script Python tourne toutes les **6 heures** pour mettre à jour les prix des produits et découvrir de nouveaux produits. Il est géré via **Docker Compose**.

- **Fréquence** : toutes les 6 heures
- **Commande** : définie dans `docker-compose.yml`
- **Sur Vercel** : le scraper ne tourne pas (Vercel est serverless). Vous pouvez le lancer manuellement depuis l'admin, ou l'héberger sur un petit serveur séparé (ex : Raspberry Pi, petit VPS).
- **Sur VPS** : `docker compose up -d` lance automatiquement le service de scraping planifié.

### Vérifier que le scraper fonctionne

Allez dans l'admin → **Scraper** → cliquez sur **Lancer le scraper** pour un test manuel.

---

## 8. Vérification post-migration

Une fois tout configuré, parcourez cette checklist pour vous assurer que tout fonctionne :

- [ ] Le site est en ligne sur `https://bureauergo.fr`
- [ ] Le cadenas HTTPS est vert dans la barre d'adresse
- [ ] La page d'accueil s'affiche correctement
- [ ] Les pages catégories listent bien les produits
- [ ] Les fiches produits s'affichent avec images et prix
- [ ] Le blog et les articles sont accessibles
- [ ] La boutique en ligne fonctionne
- [ ] Un paiement test Stripe a réussi (mode test)
- [ ] Le webhook Stripe répond (Dashboard Stripe → Webhooks → Logs)
- [ ] La newsletter accepte les inscriptions
- [ ] Le back-office admin est accessible (`/admin`)
- [ ] Le scraper se lance sans erreur
- [ ] Les comptes affiliés sont créés ou transférés
- [ ] Google Analytics enregistre des visites
- [ ] Google Search Console est configurée et vérifiée
- [ ] Les sauvegardes automatiques sont en place
- [ ] Un monitoring (ex: UptimeRobot gratuit) surveille le site

---

## 9. Contacts et support

### Support technique

Pour toute question technique, contactez le développeur qui vous a vendu le site. Les informations de contact figurent dans le dossier de vente.

### Ressources utiles

- **Documentation Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Stripe** : [support.stripe.com](https://support.stripe.com)
- **Communauté française Next.js** : Discord React-France, forum Next.js

### Dépannage rapide

| Problème | Solution probable |
|----------|-------------------|
| Site inaccessible | Vérifiez les DNS, attendez la propagation (24-48h) |
| Erreur 500 | Vérifiez les logs Vercel ou Docker (`docker compose logs`) |
| Paiement Stripe échoue | Vérifiez les clés API dans `.env` |
| Images cassées | Vérifiez le dossier `public/` |
| Email non reçu | Vérifiez la configuration SMTP dans `.env` |

---

**Bonne chance avec BureauErgo !** 🚀

N'oubliez pas : un site e-commerce est un travail de longue haleine. Continuez à publier du contenu, à optimiser le SEO, et à interagir avec votre audience. Le succès viendra avec la régularité.
