# myPortfolio

Portfolio de **Papa Alioune Mbaye** avec trois versions front (`HTML/CSS`, `Tailwind`, `React`) et une API `Express.js + MongoDB` securisee pour la version React.

## Pages

- `lister-projets.html` : liste des 4 projets avec grille Flexbox
- `detailler-projet-ids.html` : detail du projet IDS/IPS (Suricata & Snort)
- `detailler-projet-siem.html` : detail du projet SIEM (Wazuh, Kibana, Splunk)
- `detailler-projet-ad.html` : detail du projet Active Directory
- `detailler-projet-iot.html` : detail du projet IoT (Arduino, MQTT)
- `ajouter-projet.html` : formulaire d'ajout de projet
- `style.css` : feuille de styles unique (Flexbox, selecteurs, responsive)
- `tailwind/index.html` : seconde version du portfolio en Tailwind CSS
- `tailwind/projets.html` : liste des projets en Tailwind CSS
- `tailwind/detailler-projet-*.html` : fiches projets en Tailwind CSS
- `tailwind/ajouter-projet.html` : formulaire de projet en Tailwind CSS
- `react/` : version React avec routage, formulaire CRUD, API Express et MongoDB

## Concepts illustres

### HTML
Structure semantique, balises, attributs, liens, images, listes imbriquees, formulaires, accessibilite (aria-labelledby)

### CSS
Selecteurs (type, attribut, id, classe), combinateurs, modele de boite, Flexbox, media queries, hover effects

### React
Composants, props, `useState`, rendu de listes avec `map`, affichage conditionnel, formulaires controles, `fetch`, React Router

### Express.js / MongoDB
API REST, routage avec `express.Router`, middleware, variables d'environnement, persistance avec `mongoose`, authentification admin, seed de base de donnees

## Version React + API Express

Le dossier `react/` contient maintenant :

- le front Vite/React
- l'API Express dans `react/server/`
- l'entree Vercel serverless dans `react/api/`
- le modele MongoDB `Project`
- le fichier `react/db.json` utilise comme source de seed

### Configuration

1. Copier `react/.env.example` vers `react/.env`
2. Verifier `MONGODB_URI`
3. Generer un hash admin avec `npm run hash:admin -- "VotreMotDePasse"`
4. Renseigner `JWT_SECRET`, `ADMIN_EMAIL` et `ADMIN_PASSWORD_HASH`
5. Garder `CLIENT_URL=http://localhost:5173` pour le developpement local

### Demarrer MongoDB

Option 1 : MongoDB local

- installer MongoDB et exposer `mongodb://127.0.0.1:27017/myportfolio`

Option 2 : Docker

```bash
cd react
npm run db:up
```

### Injecter les projets de depart

```bash
cd react
npm install
npm run seed
```

Pour repartir de zero avec uniquement les donnees de `db.json` :

```bash
cd react
npm run seed:fresh
```

### Lancer l'API Express

```bash
cd react
npm run server:dev
```

L'API tourne alors sur `http://localhost:5000` avec :

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/slug/:slug`
- `POST /api/projects`
- `PUT /api/projects/slug/:slug`
- `DELETE /api/projects/slug/:slug`

Les routes `POST`, `PUT` et `DELETE` sur les projets sont reservees a l'admin authentifie.

### Lancer le front React

Dans un second terminal :

```bash
cd react
npm run dev
```

L'application React est disponible sur `http://localhost:5173`. En developpement, Vite redirige automatiquement `/api` vers `http://localhost:5000`.

### Acces public et administration

- visiteurs : `http://localhost:5173/` et `http://localhost:5173/projets`
- administration : `http://localhost:5173/admin/connexion`

Une fois connecte, l'admin peut gerer les projets via `/admin` et les formulaires `/admin/projets/*`.

## Deploiement Vercel

La configuration Vercel est preparee dans `react/vercel.json`.

### Variables a definir dans Vercel

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `CLIENT_URL`

Pour un domaine final, `CLIENT_URL` doit contenir l'URL publique exacte, par exemple `https://mon-portfolio.vercel.app`.

### Mise en ligne conseillee

1. pousser le depot sur GitHub
2. importer le dossier `react/` dans Vercel comme projet
3. ajouter les variables d'environnement dans Vercel
4. lancer un deploiement

Le front Vite sera servi publiquement et les appels `/api/*` seront rediriges vers la fonction Vercel qui reutilise l'application Express avec MongoDB Atlas.

### Arreter MongoDB Docker

```bash
cd react
npm run db:down
```

## Auteur
Papa Alioune Mbaye - Groupe ISI, Licence 3 Reseau Informatique (2024-2025)
