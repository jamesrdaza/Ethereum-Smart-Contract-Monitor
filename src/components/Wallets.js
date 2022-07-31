import WalletContext from '../Contexts/WalletContext.js';
import Wallet from './Wallet.js'
import { useContext } from 'react';
import { useRef } from 'react';
import { storeWallet } from '../indexedDB/BotDB.js';


const Wallets = () => {
    const { wallets, addWallet } = useContext(WalletContext);

    const pkInput = useRef();
    const walletInput = useRef();

    const submitWallet = () => {
        addWallet(pkInput.current.value, walletInput.current.value);
        storeWallet(pkInput.current.value, walletInput.current.value);
    }
    return (
        <div className='container'>
            Address<br></br>
            <input type='text' ref={walletInput}></input> <br></br>
            Private Key<br></br>
            <input type='password' ref={pkInput}></input> <br></br>
            <button onClick={submitWallet}>Save Wallet</button>
            <h3>Wallets</h3>
            {
                wallets.map((wallet) => (
                    <Wallet key={wallet.id} wallet={wallet} />
                ))
            }
        </div>
    )
}

export default Wallets