import Task from './Task.js'
import TaskContext from '../Contexts/TasksContext.js';
import WalletContext from '../Contexts/WalletContext.js';
import ContractContext from '../Contexts/ContractContext.js';
import { useContext, useRef } from 'react';

const Tasks = () => {
    const { wallets, searchWallets } = useContext(WalletContext);
    const { contracts, searchContracts, params } = useContext(ContractContext);
    const { tasks, addTask, paramState, setParamState, isHidden, setHidden } = useContext(TaskContext);

    const walletInput = useRef();
    const contractInput = useRef();
    const maxGasInput = useRef();
    const maxPriorityInput = useRef();
    const valueInput = useRef();
    const paramRef = useRef([]);

    // Get function parameters from contract context to render
    const getParams = () => {
        setParamState(params);
        setHidden(false);
    }

    const createTask = () => {
        let contract = searchContracts(contractInput.current.value);
        let wallet = searchWallets(walletInput.current.value);
        let maxGasFee = maxGasInput.current.value;
        let maxPriorityFee = maxPriorityInput.current.value;
        let value = valueInput.current.value;
        let args = []

        // Get contract parameter fields and push into array for task object
        for (let i = 0; i < paramRef.current.length; i++) {
            args.push(paramRef.current[i].value);
        }

        // Hardcoded expecting Ints Fix Later
        args = args.map(parseInt);

        addTask(wallet, contract, maxGasFee, maxPriorityFee, value, args);
        setHidden(true);
    }
    return (
        <div className='container'>
            <select ref={walletInput}>
                <option >Select Wallet</option>
                {
                    wallets.map((wallet) => (
                        <option key={wallet.id}>{wallet.address}</option>
                    ))
                }
            </select>
            <select ref={contractInput}>
                <option >Select Contract</option>
                {
                    contracts.map((contract) => (
                        <option>{contract.address}</option>
                    ))
                }
            </select>
            <button onClick={getParams}>Add Task</button>
            <div style={{ visibility: isHidden ? 'hidden' : 'visible' }}>
                <input type="text" placeholder="Max Base Fee" ref={maxGasInput}></input>
                <input type="text" placeholder="Priority Fee" ref={maxPriorityInput}></input>
                <input type="text" placeholder="payable(ether)" ref={valueInput}></input>
                {
                    // Make reference of every parameter input field
                    paramState.map((param, i) => (
                        <input type="text" key={i} defaultValue={param.name} ref={el => paramRef.current[i] = el} ></input>
                    ))
                }
                <button onClick={createTask}>Save Task</button>
            </div>
            <h3>Tasks</h3>
            {
                tasks.map((task) => (
                    <Task key={task.id} task={task} />
                ))
            }
        </div>
    )
}

export default Tasks