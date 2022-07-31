import { useContext } from "react";
import WalletContext from "../Contexts/WalletContext";
import { destroyWallet } from "../indexedDB/BotDB";

const Wallet = ({ wallet }) => {
    const { deleteWallet } = useContext(WalletContext);
    const removeWallet = () => {

        //Remove from database first so no render then remove from state
        destroyWallet(wallet.address);
        deleteWallet(wallet.address);
    }

    return (
        <div className="itemContainer">
            <div style={{ width: "80%" }}>
                <p style={{ marginBottom: "1px" }}>Wallet </p>
                <p style={{ marginTop: "1px" }}>Address: {wallet.address} </p>
            </div>
            <button onClick={removeWallet} style={{ width: "20%", margin: "5px" }}>Delete</button>
        </div>
    )
}

export default Wallet