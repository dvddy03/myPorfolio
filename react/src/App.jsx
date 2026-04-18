import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AddProjectPage from "./pages/AddProjectPage";
import NotFoundPage from "./pages/NotFoundPage";
import { getProfileImage } from "./utils/assets";

function App() {
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
          <NavItem to="/ajouter">Ajouter</NavItem>
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/projets/:slug" element={<ProjectDetailPage />} />
          <Route path="/ajouter" element={<AddProjectPage />} />
          <Route path="/projets/:slug/modifier" element={<AddProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
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
