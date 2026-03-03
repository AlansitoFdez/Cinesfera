import { createContext, useContext, useState } from "react";

const DevModeContext = createContext();

export function DevModeProvider({ children }) {
    const [devMode, setDevMode] = useState(false);

    const toggleDevMode = () => {
        setDevMode((prev) => !prev);
    }

    return (
        <DevModeContext.Provider value={{ devMode, toggleDevMode }}>
            {children}
        </DevModeContext.Provider>
    )
}

export function useDevMode() {
    return useContext(DevModeContext);
}