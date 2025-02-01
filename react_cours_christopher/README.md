# Application Tinder-Like

## Groupe 7
### Membres
- **Moussa BAKAYOKO**
- **Stevie Carole TCHINDA DOUANLA**
- **Carolle TIGNOKPA**
- **Eddy TEROSIER**
- **Samuel TOMEN NANA**

Cette application est une plateforme de rencontres inspirée de Tinder, développée avec un stack moderne comprenant :

- **Frontend** : React, Redux, Vite
- **Backend** : Node.js, Express, MongoDB, Socket.io
- **Authentification** : JWT avec gestion des cookies
- **Communication en temps réel** : Socket.io pour la messagerie instantanée

## Fonctionnalités principales

### 1. Authentification

**Inscription et Connexion :**
- Les utilisateurs peuvent créer un compte via le formulaire d'inscription.
- Une fois inscrits, ils se connectent via le formulaire de login.
- La gestion de l'authentification se fait via JWT, stocké dans un cookie pour maintenir la session.
- Les endpoints `/register`, `/login` et `/me` permettent respectivement l'inscription, la connexion et la récupération des informations de l'utilisateur connecté.

### 2. Système de Swipe

**Parcours de profils :**
- Sur la page d'accueil, les utilisateurs voient une liste de profils à swiper (similaire à Tinder).
- Le profil affiché est filtré pour ne pas inclure l'utilisateur connecté ni les utilisateurs déjà likés.
  (Fonctionnalité toujours en cours de développement)

**Like/Dislike :**
- Les utilisateurs peuvent "liker" ou "disliker" les profils.
- Lorsqu'un utilisateur clique sur Like, un appel API est effectué pour enregistrer le like.
- La logique backend vérifie si l'utilisateur ciblé a déjà liké le swipper. En cas de réciprocité, un match est créé.

**Match :**
- Lorsqu’un like est réciproque, un match est enregistré dans la collection Match.
- Le modèle User conserve dans le tableau `likedUsers` les identifiants des utilisateurs déjà likés, et le modèle Match enregistre un match (un tableau de 2 identifiants) avec un index unique pour éviter les doublons. (Pour l'instant cela crée un problème, car on ne peut pas avoir un match avec un utilisateur qui en a déjà un avec un autre utilisateur. Nous cherchons à régler le problème pour la prochaine version)

### 3. Messagerie Instantanée

**Chat en temps réel :**
- La messagerie est basée sur Socket.io.
- Seuls les utilisateurs ayant matché (c’est-à-dire dont le like a été réciproque) peuvent échanger des messages.

**Interface de Chat :**
- La page ChatBox affiche dans une sidebar la liste des utilisateurs avec qui l'utilisateur a matché.
- En cliquant sur un match, l'utilisateur accède à la conversation et peut envoyer des messages instantanés.
- L’historique des messages est récupéré via un appel API, tandis que l’envoi et la réception des nouveaux messages se font en temps réel grâce à Socket.io.

### 4. Configuration et Environnement

**Variables d'environnement :**
- L’application utilise des variables d’environnement pour configurer l’URL de base de l’API.
- Avec Vite, ces variables doivent être préfixées par `VITE_`. Par exemple, dans le fichier `.env` à la racine du projet :

```ini
VITE_API_URL=http://localhost:4000
```
**Intercepteur Axios :**
- Tous les appels API sont centralisés via une instance Axios configurée dans `src/utils/interceptor.js` qui gère automatiquement l’ajout du token d’authentification (récupéré depuis les cookies).

## Installation et Exécution

### Prérequis

- Node.js (version 14 ou supérieure recommandée)
- MongoDB (une instance locale ou distante)

### Backend

Rendez-vous dans le dossier du backend.
Installez les dépendances :

```bash
npm install
```

Créez un fichier `.env` avec les variables nécessaires (`MONGO_URI`, `JWT_SECRET`, `PORT`, `JWT_EXPIRES_IN`.).
Lancez le serveur :

```bash
npm start
```

Le serveur sera accessible par défaut sur `http://localhost:4000`.

### Frontend

Rendez-vous dans le dossier du frontend (créé avec Vite).
Installez les dépendances :

```bash
npm install
```

Créez un fichier `.env` à la racine du projet et définissez :

```env
VITE_API_URL=http://localhost:4000
```

Lancez le serveur de développement :

```bash
npm run dev
```

L’application sera accessible par défaut sur `http://localhost:5173` (ou le port indiqué par Vite).

## Structure du Projet

```bash
/backend
  ├── controllers
  │     ├── swipeController.js
  │     ├── userController.js
  │     ├── messageController.js
  │     └── matchesController.js
  ├── models
  │     ├── UserModel.js
  │     └── MatchModel.js
  ├── routes.js
  └── app.js

/frontend
  ├── src
  │     ├── components
  │     │       └── ProtectedRoute.jsx
  │     ├── pages
  │     │       ├── Home.jsx
  │     │       ├── ChatBox.jsx
  │     │       ├── Login.jsx
  │     │       └── Register.jsx
  │     ├── redux
  │     │       ├── slices
  │     │       │       ├── authSlice.js
  │     │       │       └── matchesSlice.js
  │     │       └── store.js
  │     └── utils
  │             └── interceptor.js
  └── .env
```

## Conclusion

Cette application offre une expérience de rencontres similaire à Tinder avec :

- Une gestion d’authentification sécurisée.
- Un système de swipe et de création de match basé sur la réciprocité.
- Une messagerie instantanée accessible uniquement aux utilisateurs matchés.
- Une configuration centralisée des appels API via Axios et une gestion propre des variables d’environnement grâce à Vite.