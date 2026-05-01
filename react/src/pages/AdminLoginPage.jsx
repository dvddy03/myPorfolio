import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await signIn({ email, password });
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="section-panel auth-panel">
        <p className="eyebrow">Espace admin</p>
        <h2>Connexion securisee a l'administration</h2>
        <p className="lead">
          Cet espace permet de gerer les projets du portfolio. Les visiteurs peuvent consulter les
          contenus publics, mais seules les sessions authentifiees ont acces aux actions CRUD.
        </p>
      </section>

      <form className="project-form-react auth-form" onSubmit={handleSubmit}>
        <label className="field-shell field-span-2">
          <span>Email admin</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@domaine.com"
            autoComplete="username"
          />
        </label>

        <label className="field-shell field-span-2">
          <span>Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="status-card status-error field-span-2">{error}</p> : null}

        <div className="field-span-2 action-row">
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLoginPage;
