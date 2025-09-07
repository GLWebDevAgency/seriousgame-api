# Serious Game API

API NestJS pour authentification, progression des joueurs, leaderboard et (WIP) matchs. Base de données MongoDB via Mongoose. Documentation Swagger intégrée.

## Stack
- Node.js (NestJS 11, TypeScript)
- MongoDB (Docker Compose)
- Mongoose, Passport-JWT, Argon2
- Swagger (OpenAPI)

## Prérequis
- Node.js: `>=24.5.0 <25` (voir `api/package.json`)
- pnpm
- Docker + Docker Compose (pour MongoDB)

## Démarrage rapide
1) Démarrer MongoDB (Docker)
- À la racine du repo: `docker compose up -d`
- Compose expose Mongo sur `localhost:27017` (voir `docker-compose.yml`).

2) Configuration d’environnement
- Fichier: `api/.env` (voir validation Zod dans `api/src/config/env.schema.ts`).
- Exigences minimales:
```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/seriousgame
# Secrets >= 16 caractères obligatoires
JWT_SECRET=change_me_with_a_long_random_secret_32_chars
JWT_TTL=3600
MAX_DELTA_SCORE=500
```

3) Installer les dépendances
- Dans `api/`: `pnpm i`

4) Lancer l’API
- Dans `api/`: `npm run start:dev`
- Swagger: `http://localhost:3000/api`

## Flux d’authentification (test rapide)
1) Signup: `POST /auth/signup`
- Payload exemple:
```
{ "email":"alice@example.com", "password":"Password#1", "nickname":"alice" }
```

2) Login: `POST /auth/login`
- Récupérer `accessToken`.

3) Autoriser dans Swagger
- Bouton "Authorize" (en haut à droite) → `Bearer <accessToken>`.

4) Routes protégées
- `GET /users/me` → infos du profil courant.
- `GET /progress` → progression actuelle.
- `POST /progress/update` → body: `{ "deltaScore": 50, "newLevel": 2 }`.

Equivalents curl:
```
# Signup
curl -X POST http://localhost:3000/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"Password#1","nickname":"alice"}'

# Login (récupérer accessToken)
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"Password#1"}'

# Me (protégé)
curl -H "Authorization: Bearer <token>" http://localhost:3000/users/me

# Progress (protégé)
curl -H "Authorization: Bearer <token>" http://localhost:3000/progress
curl -X POST http://localhost:3000/progress/update \
  -H "Authorization: Bearer <token>" \
  -H 'Content-Type: application/json' \
  -d '{"deltaScore":50,"newLevel":2}'
```

## Dépannage
- Erreur Zod au démarrage (env invalide): vérifiez que `JWT_SECRET` fait ≥ 16 caractères.
- Impossible de se connecter à Mongo: assurez-vous que Docker tourne (`docker compose up -d`) et que `MONGO_URI` pointe vers `mongodb://localhost:27017/seriousgame`.
- 401 sur routes protégées: ajoutez l’en-tête `Authorization: Bearer <token>`.

## Scripts utiles (dans `api/`)
- `npm run start:dev`: démarre Nest en mode watch.
- `npm run build` / `npm run start:prod`: build et exécution du bundle.
- `npm run seed`: insère des données de démo.
- `npm test` / `npm run test:e2e`: tests unitaires / e2e.

---

