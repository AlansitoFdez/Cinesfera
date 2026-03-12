import { createContext, useContext } from "react";

//Creamos el contexto vacío y lo exportamos para que desde el contexto sea accesible
export const DevModeContext = createContext();

//Esto es otro hook personalizado. Con el cualquier componente puede saber si el modo admin está activo
export function useDevMode() {
    return useContext(DevModeContext);
}