import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="empty-state">
      <p className="eyebrow">404</p>
      <h2>Page introuvable</h2>
      <p>La page demandee n'existe pas dans ce portfolio.</p>
      <Link className="button-primary" to="/">
        Retour a l'accueil
      </Link>
    </div>
  );
}

export default NotFoundPage;
