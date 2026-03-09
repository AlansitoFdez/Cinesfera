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

  // Actualiza los datos del usuario en memoria con los datos nuevos que
  // devuelve el backend. Usamos el operador ... (spread) para combinar
  // los datos actuales con los nuevos — así si el backend devuelve solo
  // algunos campos, el resto se mantiene como estaba.
  const updateUser = (newData) => setUser((prev) => ({ ...prev, ...newData }))

  if (checking) return null;

  return (
    // Añadimos updateUser al value para que cualquier componente que use
    // useAuth() pueda llamarla cuando necesite actualizar el usuario
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}