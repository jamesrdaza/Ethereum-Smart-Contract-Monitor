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

    return (
        <div className='container'>
            Address<br></br>
            <input type='text' ref={walletInput}></input> <br></br>
            Private Key<br></br>
            <input type='password' ref={pkInput}></input> <br></br>
            <button onClick={submitWallet}>Save Wallet</button>
            <hr style={{ width: "95%" }}></hr>
            <h3>Wallets</h3>
            {
                wallets.map((wallet) => (
                    <Wallet key={wallet.address} wallet={wallet} />
                ))
            }
        </div>
    )
}

export default Wallets