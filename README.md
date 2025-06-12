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

## Configuration de l'API

L'application communique avec un serveur distant pour la connexion et la
synchronisation. L'URL de base peut être modifiée dans le fichier
`app.config.ts` en changeant la valeur de `API_BASE_URL`.

## Lancer l'application

À la première ouverture, une page de connexion s'affiche. Pour la démo, entrez n'importe quel email et mot de passe ou utilisez le bouton **"Essai rapide"** pour accéder directement à l'interface.

### Charger les données d'exemple

Depuis le tableau de bord (premier onglet), appuyez sur **"🎯 Tester l'App"**. Quatre produits seront ajoutés automatiquement afin de découvrir les écrans sans importer de catalogue.

## Limitations de la démo

Cette version stocke toutes les données uniquement en local via `AsyncStorage`. Une API est toutefois disponible pour s'authentifier et synchroniser les informations, mais ces appels sont désactivés par défaut. Les données ne seront donc pas sauvegardées en ligne et seront perdues si vous réinstallez l'application.

Certaines fonctionnalités comme l'import/export complet ou la synchronisation cloud sont présentées dans l'interface, mais la connexion à l'API reste optionnelle dans cette démo.

Pour utiliser votre propre serveur, remplacez l'URL `https://example.com` dans `contexts/AppContext.tsx` par celle de votre API. Connectez-vous ensuite depuis l'écran de connexion pour récupérer un token via l'endpoint `/api/login`. Ce token sera enregistré automatiquement et utilisé pour charger vos données (`/api/data`) puis les synchroniser (`/api/sync`).

## Licence

Ce projet est distribué sous licence [MIT](LICENSE).

