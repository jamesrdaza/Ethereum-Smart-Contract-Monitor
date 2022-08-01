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
import Alerts from './components/Alerts.js';
/*
  TODO:
  Valid Private Key and Task Inputs
  Clearing used input fields
  Add edit button functionality
  Clean up taskClass
  Task indicators 
  Search multiple blocks not just pending
  Catch errors from async functions 
  alerts

  MAJOR: encrypt private keys with a password 
*/

function App() {
  const { addWallet } = useContext(WalletContext);
  const { addContract } = useContext(ContractContext);
  const { addTask } = useContext(TaskContext)

  // Load data from indexedDB
  useEffect(() => {
    initDB({ addWallet, addContract, addTask });
  }, []);

  return (
    <div className="page">
      <div className="MintingBot" >
        <header className="minting-bot">
          <h2 style={{ overflow: "hidden" }}>
            Minting Bot
          </h2>
        </header>
        <Wallets />
        <Contracts />
        <Tasks />
      </div>
      {/* <Alerts /> */}
    </div>
  );
}

export default App;
