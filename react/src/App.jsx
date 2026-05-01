import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

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
              Pentest, administration systeme, reseaux et securite defensive. Ce portfolio
              rassemble des projets concrets, des environnements techniques mis en oeuvre et une
              progression continue orientee pratique, analyse et employabilite.
            </p>
          </div>
        </div>

        <div className="site-nav-shell">
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-navigation"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="menu-toggle-box" aria-hidden="true">
              <span className={isMenuOpen ? "menu-toggle-line menu-toggle-line-top menu-toggle-line-open" : "menu-toggle-line menu-toggle-line-top"} />
              <span className={isMenuOpen ? "menu-toggle-line menu-toggle-line-middle menu-toggle-line-open" : "menu-toggle-line menu-toggle-line-middle"} />
              <span className={isMenuOpen ? "menu-toggle-line menu-toggle-line-bottom menu-toggle-line-open" : "menu-toggle-line menu-toggle-line-bottom"} />
            </span>
            <span className="menu-toggle-text">{isMenuOpen ? "Fermer" : "Menu"}</span>
          </button>

          <nav
            id="site-navigation"
            className={isMenuOpen ? "site-nav site-nav-open" : "site-nav"}
            aria-label="Navigation principale"
          >
            <NavItem to="/" onNavigate={() => setIsMenuOpen(false)}>
              Accueil
            </NavItem>
            <NavItem to="/projets" onNavigate={() => setIsMenuOpen(false)}>
              Projets
            </NavItem>
            <a className="nav-link" href="/#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
            {isAuthenticated ? (
              <NavItem to="/admin" onNavigate={() => setIsMenuOpen(false)}>
                Admin
              </NavItem>
            ) : null}
            {isAuthenticated ? (
              <NavItem to="/admin/projets/nouveau" onNavigate={() => setIsMenuOpen(false)}>
                Nouveau
              </NavItem>
            ) : null}
            {isAuthenticated ? (
              <button
                className="nav-button"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
              >
                Deconnexion
              </button>
            ) : (
              <NavItem to="/admin/connexion" onNavigate={() => setIsMenuOpen(false)}>
                Connexion
              </NavItem>
            )}
          </nav>
        </div>
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

function NavItem({ to, children, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
    >
      {children}
    </NavLink>
  );
}

export default App;
