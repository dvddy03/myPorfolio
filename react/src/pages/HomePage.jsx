const strengths = [
  {
    title: "Pentest et analyse de vulnerabilites",
    text: "Evaluation de la surface d'attaque, tests techniques et identification de faiblesses avec une approche orientee remediations.",
  },
  {
    title: "Administration systeme, reseau et SOC",
    text: "Mise en place de services critiques, supervision, analyse de logs, IDS/IPS, SIEM et reponse aux incidents dans des environnements techniques varies.",
  },
  {
    title: "Cloud, conteneurs et infrastructure",
    text: "Montee en competence sur AWS, deploiements sous Docker et Kubernetes, virtualisation VMware ESXi et outils de monitoring pour des plateformes plus robustes.",
  },
];

const profileHighlights = [
  "Pentester junior avec une base solide en administration systeme, reseau et securite.",
  "Experience terrain en securite reseaux chez Sonatel avec Fortigate et F5.",
  "Interet fort pour les environnements defensifs, le cloud AWS et les plateformes open source.",
];

const contacts = [
  {
    label: "Email",
    value: "papalioune03@gmail.com",
    href: "mailto:papalioune03@gmail.com",
  },
  {
    label: "Telephone",
    value: "+221 772 499 682",
    href: "tel:+221772499682",
  },
  {
    label: "GitHub",
    value: "github.com/dvddy03",
    href: "https://github.com/dvddy03",
  },
  {
    label: "Localisation",
    value: "Guediawaye, Dakar, Senegal",
    href: "",
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
          <strong>AWS</strong>
          <span>progression en cours sur le parcours Cloud Practitioner</span>
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

      <section className="section-panel section-split">
        <article>
          <p className="eyebrow">A propos</p>
          <h3>Un profil en construction continue, centre sur la securite et l'exploitation technique</h3>
          <p>
            Mon parcours combine administration reseau et systeme, cybersecurite, supervision et
            automatisation. Je cherche a concevoir des plateformes plus lisibles, plus securisees et
            plus simples a maintenir.
          </p>
        </article>

        <article>
          <p className="eyebrow">Points cles</p>
          <ul className="detail-list">
            {profileHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section id="contact" className="section-panel">
        <p className="eyebrow">Contact</p>
        <h3>Disponible pour echanger autour de stages, projets, missions ou collaborations</h3>

        <div className="contact-grid">
          {contacts.map((item) => (
            <article key={item.label} className="contact-card">
              <span className="contact-label">{item.label}</span>
              {item.href ? (
                <a className="contact-link" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
                  {item.value}
                </a>
              ) : (
                <span className="contact-value">{item.value}</span>
              )}
            </article>
          ))}
        </div>

        <div className="hero-actions top-spacing">
          <a className="button-primary" href="mailto:papalioune03@gmail.com">
            Envoyer un email
          </a>
          <a className="button-secondary" href="https://github.com/dvddy03" target="_blank" rel="noreferrer">
            Ouvrir GitHub
          </a>
          <a className="button-secondary" href="/documents/cv-papa-alioune-mbaye.pdf" target="_blank" rel="noreferrer">
            Telecharger le CV
          </a>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
