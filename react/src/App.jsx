import { NavLink, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AddProjectPage from "./pages/AddProjectPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { getProfileImage } from "./utils/assets";

function App() {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <div className="app-shell">
      <div className="app-background" aria-hidden="true" />
      <header className="site-header">
        <div className="site-identity">
          <img className="site-avatar" src={getProfileImage()} alt="Portrait de Papa Alioune Mbaye" />
          <div>
            <p className="eyebrow">Portfolio</p>
            <h1>Papa Alioune Mbaye</h1>
            <p className="site-subtitle">
              Administration systeme, reseaux et securite. Un espace pour presenter des projets,
              des realisations techniques et une progression orientee terrain.
            </p>
          </div>
        </div>

        <nav className="site-nav" aria-label="Navigation principale">
          <NavItem to="/">Accueil</NavItem>
          <NavItem to="/projets">Projets</NavItem>
          <a className="nav-link" href="/#contact">
            Contact
          </a>
          {isAuthenticated ? <NavItem to="/admin">Admin</NavItem> : null}
          {isAuthenticated ? <NavItem to="/admin/projets/nouveau">Nouveau</NavItem> : null}
          {isAuthenticated ? (
            <button className="nav-button" type="button" onClick={signOut}>
              Deconnexion
            </button>
          ) : (
            <NavItem to="/admin/connexion">Connexion</NavItem>
          )}
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/projets/:slug" element={<ProjectDetailPage />} />
          <Route path="/admin/connexion" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projets/nouveau"
            element={
              <ProtectedRoute>
                <AddProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projets/:slug/modifier"
            element={
              <ProtectedRoute>
                <AddProjectPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>Papa Alioune Mbaye</p>
          <div className="site-footer-links">
            <a href="mailto:papalioune03@gmail.com">papalioune03@gmail.com</a>
            <a href="https://github.com/dvddy03" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="/documents/cv-papa-alioune-mbaye.pdf" target="_blank" rel="noreferrer">
              CV PDF
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
    >
      {children}
    </NavLink>
  );
}

export default App;
