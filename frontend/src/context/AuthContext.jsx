import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });

        if (data.ok) {
          setUser(data.datos);
        }
      } catch (err) {
        // La cookie no existe o expiró, el usuario se queda como null
        // y ProtectedRoute lo mandará al login automáticamente
        if (err.response?.status !== 401) {
          console.error("Sesión no válida:", err);
        }
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
    }
  };

  // Mientras verificamos la cookie no renderizamos nada para evitar
  // que ProtectedRoute redirija al login antes de saber la verdad
  if (checking) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
