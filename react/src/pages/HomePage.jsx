import { Link } from "react-router-dom";

const strengths = [
  {
    title: "Securite defensive",
    text: "Detection d'intrusion, analyse d'evenements, supervision et investigation autour des environnements reseau et systeme.",
  },
  {
    title: "Administration systeme",
    text: "Mise en place de services critiques, gestion de postes, organisation de domaines et automatisation des taches courantes.",
  },
  {
    title: "Culture projet",
    text: "Documentation claire, restitution visuelle, progression mesurable et attention portee a la maintenabilite des realisations.",
  },
];

const highlights = [
  "Portfolio avec base JSON et gestion locale des contenus",
  "Fiches projet modifiables avec edition et suppression rapides",
  "Presentation visuelle plus nette pour une future mise en ligne",
];

function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Profil technique</p>
          <h2>Construire des environnements fiables, lisibles et plus simples a administrer</h2>
          <p className="lead">
            Ce portfolio rassemble des projets en administration systeme, securite, reseau et IoT.
            L'objectif est de presenter un travail concret, documente et pret a etre partage dans un
            cadre academique, professionnel ou de candidature.
          </p>
        </div>

        <div className="hero-actions">
          <Link className="button-primary" to="/projets">
            Voir les projets
          </Link>
          <Link className="button-secondary" to="/ajouter">
            Ajouter une realisation
          </Link>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <strong>4+</strong>
          <span>projets techniques deja structures</span>
        </article>
        <article className="metric-card">
          <strong>3</strong>
          <span>domaines principaux: systeme, reseau, securite</span>
        </article>
        <article className="metric-card">
          <strong>100%</strong>
          <span>contenu modifiable avant publication</span>
        </article>
      </section>

      <section className="info-grid">
        {strengths.map((item) => (
          <article key={item.title} className="info-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="callout-panel">
        <p className="eyebrow">Ce portfolio evolue</p>
        <h3>Une base professionnelle pour publier plus tard avec des contenus propres et a jour</h3>
        <ul className="detail-list">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
