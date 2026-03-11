import { useState, useEffect } from "react";
import { AuthContext } from "./UseAuth";
import api from "../api.js";

//Creamos la función AuthProvider que será un envoltorio de componentes
//Con el envolveremos el componente App para que cualquier componente pueda acceder al contexto
export function AuthProvider({ children }) {
  //Constante user para almacenar los datos del usuario registrado. Se inicia en null ya que no hay usuario registrado de normal
  //Constante checking para indicar si se está verificando la identidad. Se inicia en true y se pone en false cuando se verifica
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  //Comprobación que se lanza una única vez y que comprueba si existe una cookie de sesión activa
  //Si existe, guardamos los datos del usuario en la constante user
  //En el caso de fallar, el catch no va a hacer nada, user se mantiene en null y el componente ProtectedRoute redirigirá al usuario al login
  //El finally se encarga de poner checking en false sin importar la respuesta para que el componente pueda continuar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.datos);
      } catch (err) {
        // La cookie no existe o expiró, el usuario se queda como null
        // y ProtectedRoute lo mandará al login automáticamente
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  //En el caso de que el usuario se loguee correctamente, guardamos los datos del usuario en la constante user
  const login = (userData) => setUser(userData);

  //En el caso de que el usuario se desloguee correctamente, eliminamos los datos del usuario de la constante user y aparte la peticion al backend hace que se elimine la cookie de sesion
  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
    }
  };

  //Esta funcion es para actualizar los datos del usuario en la constante user
  //Hacemos uso de ...prev para recoger los datos anteriores y ...newData para recoger los nuevos valores y con ello hacemos que los nuevos datos reemplacen los anteriores
  //Con esta funcion podemos actualizar únicamente los datos que se han modificado sin tener que volver a cargar todos los datos del usuario
  const updateUser = (newData) => setUser((prev) => ({ ...prev, ...newData }));

  //Con esta comprobación hacemos que no se renderice nada hasta que no se verifique la identidad
  if (checking) return null;

  //Una vez que checking pasa a ser false, se renderiza el componente AuthContext.Provider que envuelve a todos los componentes hijos
  //Con ello, todos los componentes hijos pueden acceder al contexto y usar las funciones login, logout y updateUser
  //El valor del contexto se define en el objeto que se pasa como segundo argumento de AuthContext.Provider
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}