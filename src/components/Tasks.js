import Task from './Task.js'
import TaskContext from '../Contexts/TasksContext.js';
import WalletContext from '../Contexts/WalletContext.js';
import ContractContext from '../Contexts/ContractContext.js';
import { useContext, useRef, useState } from 'react';
import { storeTask } from '../indexedDB/BotDB.js';
import DateTimePicker from 'react-datetime-picker';
import { v4 as uuidv4 } from "uuid";

const Tasks = () => {
    const [valueTime, onChange] = useState(new Date());
    const [isTimed, setIsTimed] = useState(false);
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
        let contract = searchContracts(contractInput.current.value)
        setParamState(contract.params);
        setHidden(false);
    }

    const flipTime = () => {
        setIsTimed(!isTimed);
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
        console.log(contract);
        let uuid = uuidv4();
        if (isTimed) {
            addTask(uuid, wallet, contract, maxGasFee, maxPriorityFee, value, args, isTimed, valueTime.getTime());
            storeTask(uuid, wallet.pk, contract.address, contract.abi, contract.mintFunction, contract.flipFunction, value, maxGasFee, maxPriorityFee, args, isTimed, valueTime.getTime());
        }
        else {
            addTask(uuid, wallet, contract, maxGasFee, maxPriorityFee, value, args, isTimed, -1);
            storeTask(uuid, wallet.pk, contract.address, contract.abi, contract.mintFunction, contract.flipFunction, value, maxGasFee, maxPriorityFee, args, isTimed, -1);
        }

        setHidden(true);
    }

    // Move inline into CSS file later
    return (
        <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: "center" }} className='container'>
            <select style={{ width: "95%", marginBottom: "1%" }} ref={walletInput}>
                <option >Select Wallet</option>
                {
                    wallets.map((wallet) => (
                        <option key={wallet.address}>{wallet.address}</option>
                    ))
                }
            </select>
            <select style={{ width: "95%" }} ref={contractInput}>
                <option >Select Contract</option>
                {
                    contracts.map((contract) => (
                        <option key={contract.address}>{contract.name}</option>
                    ))
                }
            </select>
            <div style={{ width: "80%" }} /><button style={{ width: "15%" }} onClick={getParams}>Add Task</button>
            <div style={{ display: isHidden ? 'none' : 'flex', visibility: isHidden ? 'hidden' : 'visible', width: "90%", flexWrap: "wrap" }}>
                <input style={{ width: "100%" }} type="text" placeholder="Max Base Fee" ref={maxGasInput}></input>
                <input style={{ width: "100%" }} type="text" placeholder="Priority Fee" ref={maxPriorityInput}></input>
                <input style={{ width: "100%" }} type="text" placeholder="payable(ether)" ref={valueInput}></input>
                {
                    // Make reference of every parameter input field
                    paramState.map((param, i) => (
                        <input type="text" key={i} placeholder={param.name} ref={el => paramRef.current[i] = el} ></input>
                    ))
                }
                <div style={{ display: "flex", alignContent: "center" }} ><input type="checkbox" name="setTime" onClick={flipTime} /> <label style={{ lineHeight: "3em" }} >Set Time</label></div>
                <div style={{ visibility: isTimed ? "visible" : "hidden", marginLeft: "21%", marginRight: "auto" }}>
                    <DateTimePicker className="dateTime" disableClock={true} onChange={onChange} value={valueTime} />

                </div>

                <button onClick={createTask}>Save Task</button>
            </div>
            <hr style={{ width: "95%" }}></hr>
            <h3 style={{ width: "95%" }} >Tasks</h3>
            {
                tasks.map((task) => (
                    <Task key={task.uuid} task={task} />
                ))
            }
        </div>
    )
}

export default Tasks