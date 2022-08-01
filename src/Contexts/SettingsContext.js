import { useState, createContext } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [network, setNetwork] = useState("rinkeby");
    return (
        <SettingsContext.Provider value={{ network, setNetwork }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContext;