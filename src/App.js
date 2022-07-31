import Wallets from './components/Wallets.js'
import Contracts from './components/Contracts.js';
import Tasks from './components/Tasks.js'
import './App.css';
import './fonts/Montserrat-VariableFont_wght.ttf'
import { initDB } from "./indexedDB/BotDB.js";
import WalletContext from './Contexts/WalletContext';
import { useContext, useEffect } from 'react';
import ContractContext from './Contexts/ContractContext.js';
import TaskContext from './Contexts/TasksContext.js';
/*
  TODO:
  Valid input checks
  Clearing used input fields
  Fix item id's
  Add delete and edit button functionality
  Clean up taskClass
  Fix random errors
  Task indicators 
  Task retries
  Search multiple blocks not just pending
  Catch errors from async functions 

  MAJOR: Implement indexedDB for local storage while keeping private keys safe  
*/



function App() {
  const { addWallet } = useContext(WalletContext);
  const { addContract } = useContext(ContractContext);
  const { addTask, setParamState } = useContext(TaskContext)

  useEffect(() => {
    initDB({ addWallet, addContract, addTask });

  }, []);
  return (
    <div className="MintingBot" >

      <header className="minting-bot">
        <h2>
          Minting Bot
        </h2>
      </header>
      <Wallets />
      <Contracts />
      <Tasks />

    </div>
  );
}

export default App;
