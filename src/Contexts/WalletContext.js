import { createContext, useState } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const [wallets, setWallet] = useState([]);
    const [id, setId] = useState(0);
    const addWallet = (pk, address) => {
        setWallet((prev) => [...prev, { id, pk, address }])
        setId(id + 1);
    };

    const searchWallets = (wallet) => {
        for (let i = 0; i < wallets.length; i++) {
            if (wallet === wallets[i]['address']) {
                return wallets[i];
            }
        }
    }

    return (
        <WalletContext.Provider value={{ wallets, addWallet, searchWallets }}>
            {children}
        </WalletContext.Provider>
    );
}

export default WalletContext;