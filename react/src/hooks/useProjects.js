import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        setLoading(true);
        const data = await getProjects();
        if (!mounted) {
          return;
        }
        setProjects(data);
        setError("");
      } catch (loadError) {
        if (!mounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Erreur de chargement.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();
    return () => {
      mounted = false;
    };
  }, [refreshToken]);

  return {
    projects,
    loading,
    error,
    reloadProjects: () => setRefreshToken((current) => current + 1),
  };
}
