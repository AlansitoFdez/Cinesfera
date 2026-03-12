import { useState } from "react";
import { DevModeContext } from "../hooks/UseDevMode"

//Esto es el componente que envolverá la App para que el resto de componentes puedan comprobar si el modo dev está activado
export function DevModeProvider({ children }) {
    //Este es el estado del modo dev, inicialmente está desactivado hasta que el usuario lo active con un switch
    const [devMode, setDevMode] = useState(false);

    //Con esto lo que hacemos es que seteamos el valor contrario al valor que había (al empezar en false, si hacemos !prev, cambiamos a true y viceversa)
    const toggleDevMode = () => {
        setDevMode((prev) => !prev);
    }

    //Con esto devolvemos el contexto con el valor actual del modo dev y la función para cambiarlo
    return (
        <DevModeContext.Provider value={{ devMode, toggleDevMode }}>
            {children}
        </DevModeContext.Provider>
    )
}

