import WalletContext from '../Contexts/WalletContext.js';
import Wallet from './Wallet.js'
import { useContext } from 'react';
import { useRef } from 'react';
import { storeWallet } from '../indexedDB/BotDB.js';
import { ethers } from 'ethers';

const Wallets = () => {
    const { wallets, addWallet } = useContext(WalletContext);

    const pkInput = useRef();
    const walletInput = useRef();

    const submitWallet = () => {
        // Check if address is valid
        if (ethers.utils.isAddress(walletInput.current.value)) {
            addWallet(pkInput.current.value, walletInput.current.value);
            storeWallet(pkInput.current.value, walletInput.current.value);
        }
        else {
            alert("Not a valid wallet address");
        }
    }


    // Possibly use mnemonic phrase
    const createWallet = () => {
        // Will encrypt via password later
        let newWallet = ethers.Wallet.createRandom();
        addWallet(newWallet.privateKey, newWallet.address);
        storeWallet(newWallet.privateKey, newWallet.address);
    }

    // Will implement disperse either custom contract or embed disperse.app
    const disperse = () => {

    }

    return (
        <div className='container'>
            Address<br></br>
            <input type='text' ref={walletInput}></input> <br></br>
            Private Key<br></br>
            <input type='password' ref={pkInput}></input> <br></br>
            <button onClick={submitWallet}>Save Wallet</button>
            <hr style={{ width: "95%" }}></hr>
            <div style={{ display: "flex" }}><h3 style={{ width: "83%" }}>Wallets</h3> <button onClick={createWallet} style={{ width: "17%" }}>Create Wallet</button></div>
            {
                wallets.map((wallet) => (
                    <Wallet key={wallet.address} wallet={wallet} />
                ))
            }
        </div>
    )
}

export default Wallets