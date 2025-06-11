# Gestion-stock

Gestion-stock est une petite démonstration d'application mobile réalisée avec [Expo](https://expo.dev/). Elle permet de gérer simplement un stock de produits directement depuis un téléphone ou un émulateur.

## Fonctionnalités principales

- Tableau de bord avec statistiques de stock
- Consultation et mise à jour rapide des produits
- Saisie des stocks initiaux et seuils d'alerte
- Alertes pour ruptures et niveaux faibles
- Scanner de codes‑barres pour déduire le stock
- Page de paramètres (email, seuil par défaut, options du scanner)
- Chargement de données d'exemple en un clic

## Installation

1. Installez [Node.js](https://nodejs.org/) puis récupérez les dépendances :
   ```bash
   npm install
   ```
2. Lancez ensuite le serveur de développement Expo :
   ```bash
   npm run dev
   ```
3. Scannez le QR code affiché ou démarrez un émulateur pour ouvrir l'application.

## Lancer l'application

À la première ouverture, une page de connexion s'affiche. Pour la démo, entrez n'importe quel email et mot de passe ou utilisez le bouton **"Essai rapide"** pour accéder directement à l'interface.

### Charger les données d'exemple

Depuis le tableau de bord (premier onglet), appuyez sur **"🎯 Tester l'App"**. Quatre produits seront ajoutés automatiquement afin de découvrir les écrans sans importer de catalogue.

## Limitations de la démo

Cette version stocke toutes les données uniquement en local via `AsyncStorage`. Aucune synchronisation ou sauvegarde distante n'est effectuée et les informations seront perdues si vous réinstallez l'application.

Certaines fonctionnalités comme l'import/export complet ou la synchronisation cloud sont présentées dans l'interface mais ne sont pas implémentées dans cette démo.
