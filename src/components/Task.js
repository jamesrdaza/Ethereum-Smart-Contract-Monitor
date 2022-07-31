import TaskInstance from '../TaskClass.js'
import TaskContext from '../Contexts/TasksContext.js';
import { useContext, useEffect } from 'react';
import ContractContext from '../Contexts/ContractContext.js';
import { storeTask, destroyTask } from '../indexedDB/BotDB.js';

const Task = ({ task }) => {
    const { instances, addInstance, deleteInstance, deleteTask } = useContext(TaskContext);
    const { contractABI } = useContext(ContractContext);

    useEffect(() => {

        // Hardcoded RPC's will allow options later
        let httpRPC = "https://eth-rinkeby.alchemyapi.io/v2/5DPlF1-TT85CmLvjEuDXaIR8YFyLNg8G";
        let wsRPC = "wss://eth-rinkeby.alchemyapi.io/v2/5DPlF1-TT85CmLvjEuDXaIR8YFyLNg8G";

        // TODO: Change constructor to object so my eyes don't hurt looking at this declaration
        const newInstance = new TaskInstance(task.wallet.pk, task.contract.address, task.contract.abi, httpRPC, wsRPC, task.contract.mintFunction, task.contract.flipFunction, task.value, task.maxBaseFee, task.maxPriorityFee, task.params);
        addInstance(task.uuid, newInstance);

        //Check dependency array
    }, [TaskInstance]);

    // Execute task
    const execute = () => {
        const taskInstance = instances[task.uuid];
        console.log(taskInstance)

        taskInstance.monitor();
    }

    const removeTask = () => {
        task.destroyTask(task.uuid);
        deleteInstance(task.uuid);
        deleteTask(task.uuid)
    }

    return (
        <div className="itemContainer">
            <div style={{ width: "70%" }}>
                <p style={{ marginBottom: "1px" }}>Task {task.id} </p>
                <p style={{ marginTop: "1px", marginBottom: "1px" }}>Wallet: {task.wallet.address}</p>
                <p style={{ marginTop: "1px" }}>Contract: {task.contract.address}</p>
            </div>
            <button style={{ margin: "5px", width: "10%" }} onClick={execute}>Start</button>
            <button style={{ margin: "5px", width: "10%" }} onClick={execute}>Stop</button>
            <button style={{ margin: "5px", width: "10%" }} onClick={removeTask}>Delete</button>
        </div>
    )
}

export default Task