import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WalletProvider } from './Contexts/WalletContext.js';
import { ContractProvider } from './Contexts/ContractContext.js';
import { TaskProvider } from './Contexts/TasksContext.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <WalletProvider>
    <ContractProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </ContractProvider>
  </WalletProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

