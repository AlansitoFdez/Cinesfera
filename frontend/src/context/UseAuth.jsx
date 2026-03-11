import { useContext, createContext } from "react";

//Exportamos el contexto llamandolo AuthContext y lo inicializamos con null
export const AuthContext = createContext(null);

//Creamos un hook personalizado para usar el contexto desde cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}