# myPortfolio

Portfolio de **Papa Alioune Mbaye** avec trois versions front (`HTML/CSS`, `Tailwind`, `React`) et un backend `Express.js + MongoDB Atlas` simple, separe du front.

## Structure

- `index.html`, `lister-projets.html`, `detailler-projet-*.html`, `ajouter-projet.html` : version HTML/CSS
- `tailwind/` : version Tailwind CSS
- `react/` : front React avec routage et formulaire CRUD
- `backend/` : API Express, Mongoose, seed Atlas et collection Postman

## Stack

- Front : React + Vite
- API : Express.js
- Base de donnees : MongoDB Atlas avec Mongoose
- Tests manuels : Postman

## Backend

Le backend a ete garde volontairement simple pour coller au cours :

- `backend/app.js` : point d'entree Express
- `backend/routes/projects.js` : routes CRUD
- `backend/models/Project.js` : schema et modele Mongoose
- `backend/middleware/logger.js` : middleware de log
- `backend/scripts/seedProjects.js` : import des projets depuis `react/db.json`
- `backend/postman/myportfolio-backend.postman_collection.json` : collection Postman importable

### Variables d'environnement

Creer `backend/.env` avec :

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Lancer le backend

```bash
cd backend
npm install
npm run dev
```

Le serveur demarre sur `http://localhost:5000`.

### Seeder MongoDB Atlas

```bash
cd backend
npm run seed
```

Pour vider puis reimporter :

```bash
cd backend
npm run seed:fresh
```

## Front React

Le front React utilise un proxy Vite vers le backend local.

### Lancer le front

```bash
cd react
npm install
npm run dev
```

Le front demarre sur `http://localhost:5173`.

## API disponible

- `GET /`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

## Postman

Importer :

- `backend/postman/myportfolio-backend.postman_collection.json`

La collection contient un enchainement complet :

- lecture
- creation
- recuperation par id
- modification
- suppression

## Auteur

Papa Alioune Mbaye - Groupe ISI, Licence 3 Reseau Informatique (2024-2025)
