# ⚠️ Disclaimers — BureauErgo

## Avertissement sur le web scraping

Ce projet utilise du web scraping pour collecter des données publiques sur des sites tiers (Amazon, Fnac, etc.). Les points suivants doivent être respectés :

### 1. Respect des CGU
- Avant toute mise en production, vérifiez les Conditions Générales d'Utilisation de chaque site cible.
- Certains sites interdisent explicitement le scraping dans leurs CGU.
- Amazon, par exemple, interdit le scraping automatisé de ses pages sans autorisation via son API Product Advertising.

### 2. Alternative légale : API Product Advertising
- Amazon propose l'API Product Advertising (PA-API 5.0) qui permet d'accéder légalement aux données produits.
- L'utilisation de cette API est recommandée pour un site en production.
- Les données de démonstration dans ce projet sont générées manuellement et ne proviennent pas d'un scraping réel.

### 3. robots.txt
- Le scraper vérifie automatiquement le fichier robots.txt avant chaque requête.
- Si une ressource est interdite, le scraper la saute.
- Cette vérification est faite de bonne foi mais ne constitue pas une autorisation légale.

### 4. Données extraites
- Seules des données factuelles et publiques sont extraites : noms de produits, prix publics, notes moyennes.
- Aucune donnée personnelle ni contenu protégé par le droit d'auteur n'est collecté.
- Les descriptions de produits sont reformulées ou tronquées.

### 5. Rythme de scraping
- Délai minimum de 2 secondes entre chaque requête (configurable).
- Le scraper s'arrête automatiquement en cas de rate limiting (HTTP 429).
- En production, limitez-vous à 1 requête par seconde maximum.

### 6. Images
- Les images sont téléchargées, redimensionnées (max 800px) et converties en WebP.
- Elles sont stockées localement pour ne pas voler de bande passante aux sites sources.
- Chaque image est accompagnée d'un lien "Source" pointant vers l'original.

### 7. Affiliation
- Les liens d'affiliation sont clairement identifiés avec `rel="nofollow sponsored"`.
- Une mention de transparence est présente sur chaque page.
- Conformément aux règles Amazon Associates, le site déclare : "En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises."

### 8. RGPD
- Le site est conforme au RGPD : politique de confidentialité, consentement cookies, droit d'accès/rectification/suppression.
- Seules les données strictement nécessaires sont collectées (email pour newsletter, logs de recherche anonymisés).

### 9. Responsabilité
- L'auteur de ce code ne pourra être tenu responsable de l'utilisation qui en est faite.
- Il incombe à l'utilisateur final de s'assurer de la conformité légale de son site.
- En cas de doute, consultez un avocat spécialisé en droit du numérique.

---

## Recommandations pour la mise en production

1. **Remplacer le scraping par l'API Amazon PA-API 5.0** pour les données produits.
2. **Utiliser des APIs officielles** pour les autres sources (Fnac, Boulanger, Cdiscount).
3. **Souscrire à une API de données produits** comme Keepa, CamelCamelCamel, ou Semrush.
4. **Mettre en place un fichier `attribution.md`** listant toutes les sources de données.
5. **Limiter le nombre de pages scrappées** (max 100/jour par source).
6. **Utiliser des proxies résidentiels** uniquement si nécessaire et légal.
7. **Conserver les logs de scraping** pour pouvoir justifier de la bonne foi en cas de litige.

---

*Dernière mise à jour : 2026-07-11*
