#!/bin/bash
# Export des variables d'environnement nécessaires (sans valeurs secrètes)
# Usage : ./export_environment.sh > .env
# Puis remplacez chaque '...' par votre valeur réelle

set -euo pipefail

cat << 'ENVEOF'
=== Variables d'environnement BureauErgo ===

# Base de données
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Affiliation
AFFILIATE_TAG=bureauergo-21

# AdSense
ADSENSE_ENABLED=false
ADSENSE_CLIENT_ID=ca-pub-...
ADSENSE_SLOT_HEADER=XXXXXXXXXX
ADSENSE_SLOT_SIDEBAR=XXXXXXXXXX
ADSENSE_SLOT_INFEED=XXXXXXXXXX

# Admin
ADMIN_EMAIL=admin@bureauergo.fr
ADMIN_PASSWORD_HASH=...

# JWT
JWT_SECRET=...

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# Google Analytics
GOOGLE_ANALYTICS_ID=G-...
ENVEOF

echo ""
echo "=== Instructions ==="
echo "1. Lancez : ./export_environment.sh > .env"
echo "2. Éditez le fichier .env"
echo "3. Remplacez chaque '...' par votre valeur réelle"
echo "4. Ne commitez JAMAIS le fichier .env rempli !"
echo "5. Vérifiez que .env est bien dans .gitignore"
