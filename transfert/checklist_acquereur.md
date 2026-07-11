# Checklist Acquéreur — BureauErgo

Cochez chaque élément au fur et à mesure de la migration. Conservez ce document comme preuve de la bonne réalisation du transfert.

---

## 🏷️ Domaine & DNS

- [ ] Domaine `bureauergo.fr` transféré chez votre registrar
- [ ] Contact administratif / technique mis à jour à votre nom
- [ ] DNS configurés et pointant vers le bon hébergeur
- [ ] Propagation DNS vérifiée (utilisez [whatsmydns.net](https://www.whatsmydns.net/))
- [ ] Renouvellement automatique activé sur le domaine

## 🌐 Site web

- [ ] Site en ligne sur `https://bureauergo.fr`
- [ ] HTTPS actif (cadenas vert dans la barre d'adresse)
- [ ] Redirection `www.bureauergo.fr` → `bureauergo.fr` fonctionnelle
- [ ] Page d'accueil fonctionnelle et complète
- [ ] Pages catégories accessibles et affichent les produits
- [ ] Fiches produits avec images, descriptions et prix
- [ ] Blog et articles consultables
- [ ] Page contact fonctionnelle
- [ ] Mentions légales et politique de confidentialité à jour avec VOS informations
- [ ] Formulaire d'inscription newsletter opérationnel

## 🛒 Boutique & Paiement

- [ ] Boutique en ligne accessible (`/shop`)
- [ ] Pages produits digitaux (guides/ebooks) fonctionnelles
- [ ] Paiement Stripe testé en mode test
- [ ] Paiement Stripe testé en mode production (paiement réel de 1€ puis remboursé)
- [ ] Webhook Stripe configuré et répondant
- [ ] Commande test : email de confirmation reçu
- [ ] Commande test : lien de téléchargement fonctionnel
- [ ] Compte bancaire Stripe vérifié et configuré pour les virements

## 🔗 Affiliation

- [ ] Compte Amazon Associates créé ou transféré
- [ ] Tag affiliation configuré dans `.env`
- [ ] Liens d'affiliation testés (clic → redirection Amazon avec tag)
- [ ] Autres programmes d'affiliation configurés (Fnac, Boulanger, etc.)

## 📧 Newsletter

- [ ] Inscription newsletter testée avec une adresse email
- [ ] Email de confirmation reçu (si double opt-in)
- [ ] Configuration SMTP fonctionnelle

## 🔐 Administration

- [ ] Back-office admin accessible (`/admin`)
- [ ] Connexion admin fonctionnelle
- [ ] Dashboard admin affiche les statistiques
- [ ] Gestion des produits accessible
- [ ] Page scraper fonctionnelle
- [ ] Page valorisation accessible (`/admin/valuation`)

## 🕷️ Scraper

- [ ] Scraper lancé manuellement depuis l'admin → succès
- [ ] Scraper planifié actif (toutes les 6h)
- [ ] Nouveaux produits correctement ajoutés
- [ ] Prix mis à jour automatiquement

## 📊 Analytics & SEO

- [ ] Google Analytics installé et enregistre des visites
- [ ] Google Search Console configurée
- [ ] Sitemap soumis dans Search Console
- [ ] Fichier `robots.txt` accessible et correct
- [ ] Balises meta (title, description) présentes sur les pages principales

## 🔒 Sécurité & Sauvegardes

- [ ] Fichier `.env` correctement configuré avec toutes les variables
- [ ] `.env` NON commité sur GitHub (vérifié dans `.gitignore`)
- [ ] Sauvegardes automatiques de la base de données configurées
- [ ] Monitoring UptimeRobot (ou équivalent) activé
- [ ] Certificat SSL renouvellement automatique vérifié

## 📦 Réception des fichiers

- [ ] Code source complet reçu et fonctionnel
- [ ] Base de données (`nichesite.db`) reçue et intacte
- [ ] Scripts de scraping reçus
- [ ] Documentation de migration reçue
- [ ] Fichier `.env.example` reçu
- [ ] Fiche produit du site reçue

## ✅ Validation finale

- [ ] Tous les éléments ci-dessus cochés
- [ ] Site fonctionnel depuis 48h sans incident
- [ ] Aucune erreur dans les logs
- [ ] Le vendeur a confirmé la fin du support de transition

---

**Date de finalisation** : ____/____/________

**Signature de l'acquéreur** : ________________________
