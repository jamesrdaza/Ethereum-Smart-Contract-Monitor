import { useContext, useEffect, useState } from "react";
import WalletContext from "../Contexts/WalletContext";
import { destroyWallet } from "../indexedDB/BotDB";
import { ethers } from "ethers";
import SettingsContext from "../Contexts/SettingsContext";

const Wallet = ({ wallet }) => {
    const { network, setNetwork } = useContext(SettingsContext);
    const [balance, setBalance] = useState("0");

    // Gets the balance of the wallet
    const getBalance = () => {
        let provider;
        if (network === "rinkeby") {
            provider = ethers.getDefaultProvider("rinkeby");
        }
        else if (network === "mainnet") {
            provider = ethers.getDefaultProvider("mainnet");
        }

        provider.getBalance(wallet.address).then((balance) => {
            const eth = ethers.utils.formatEther(balance);
            setBalance(parseFloat(eth).toFixed(3));
        })
    }

    useEffect(() => {
        getBalance();
    }, [])

    const { deleteWallet } = useContext(WalletContext);

    const removeWallet = () => {
        //Remove from database first so no render then remove from state
        destroyWallet(wallet.address);
        deleteWallet(wallet.address);
    }

    return (
        <div className="itemContainer">
            <div style={{ width: "80%" }}>
                <p style={{ marginBottom: "1px" }}>Wallet  {balance}<span style={{ fontFamily: "sans-serif", display: "inline" }}> Ξ</span></p>
                <p style={{ marginTop: "1px" }}>{wallet.address} </p>
            </div>

            <button onClick={removeWallet} style={{ width: "20%", margin: "5px" }}>Delete</button>
        </div>
    )
}

export default Wallet