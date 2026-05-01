import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAdmin, loginAdmin, logoutAdmin } from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const session = await getCurrentAdmin();
        if (mounted) {
          setAdmin(session);
        }
      } catch (_error) {
        if (mounted) {
          setAdmin(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  async function signIn(credentials) {
    const session = await loginAdmin(credentials);
    setAdmin(session);
    return session;
  }

  async function signOut() {
    await logoutAdmin();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        authLoading,
        isAuthenticated: Boolean(admin),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit etre utilise dans AuthProvider.");
  }

  return context;
}

export { AuthProvider, useAuth };
