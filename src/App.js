import Wallets from './components/Wallets'
import Contracts from './components/Contracts.js';
import Tasks from './components/Tasks.js'
import { WalletProvider } from './Contexts/WalletContext';
import { ContractProvider } from './Contexts/ContractContext.js';
import { TaskProvider } from './Contexts/TasksContext.js';
import './App.css';
import './fonts/Montserrat-VariableFont_wght.ttf'

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
  return (
    <div className="MintingBot" >
      <WalletProvider>
        <ContractProvider>
          <TaskProvider>
            <header className="minting-bot">
              <h2>
                Minting Bot
              </h2>
            </header>
            <Wallets />
            <Contracts />
            <Tasks />
          </TaskProvider>
        </ContractProvider>
      </WalletProvider>
    </div>
  );
}

export default App;
