import { Link } from "react-router-dom";

const strengths = [
  {
    title: "Pentest et analyse de vulnerabilites",
    text: "Evaluation de la surface d'attaque, identification de faiblesses techniques et utilisation d'outils comme Nmap, Metasploit et Burp Suite.",
  },
  {
    title: "Administration systeme, reseau et SOC",
    text: "Gestion d'environnements reseau et systeme, supervision, analyse de logs, IDS/IPS, SIEM et reponse aux incidents avec une approche terrain.",
  },
  {
    title: "Cloud, conteneurs et infrastructure",
    text: "Montee en competence sur AWS, deploiements sous Docker et Kubernetes, virtualisation VMware ESXi et outils de monitoring pour des plateformes plus robustes.",
  },
];

function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Profil technique</p>
          <h2>Construire des environnements fiables, lisibles et plus simples a administrer</h2>
          <p className="lead">
            Pentester junior oriente administration systeme, reseau et securite, avec un interet
            marque pour les environnements SOC, l'infrastructure cloud et les plateformes defensives.
            Ce portfolio presente des realisations concretes, documentees et preparees pour un usage
            professionnel.
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
          <strong>4</strong>
          <span>domaines principaux: pentest, systeme, reseau, cloud & securite</span>
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
    </div>
  );
}

export default HomePage;
