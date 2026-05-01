# myPortfolio

Portfolio de **Papa Alioune Mbaye** avec trois versions front (`HTML/CSS`, `Tailwind`, `React`) et une API `Express.js + MongoDB` pour la version React.

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
API REST, routage avec `express.Router`, middleware, variables d'environnement, persistance avec `mongoose`, seed de base de donnees

## Version React + API Express

Le dossier `react/` contient maintenant :

- le front Vite/React
- l'API Express dans `react/server/`
- le modele MongoDB `Project`
- le fichier `react/db.json` utilise comme source de seed

### Configuration

1. Copier `react/.env.example` vers `react/.env`
2. Verifier `MONGODB_URI`
3. Garder `CLIENT_URL=http://localhost:5173` pour le developpement local

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

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/slug/:slug`
- `POST /api/projects`
- `PUT /api/projects/slug/:slug`
- `DELETE /api/projects/slug/:slug`

### Lancer le front React

Dans un second terminal :

```bash
cd react
npm run dev
```

L'application React est disponible sur `http://localhost:5173`. En developpement, Vite redirige automatiquement `/api` vers `http://localhost:5000`.

### Arreter MongoDB Docker

```bash
cd react
npm run db:down
```

## Auteur
Papa Alioune Mbaye - Groupe ISI, Licence 3 Reseau Informatique (2024-2025)
