import TaskInstance from '../TaskClass.js'
import TaskContext from '../Contexts/TasksContext.js';
import { useContext, useEffect } from 'react';
import ContractContext from '../Contexts/ContractContext.js';
import { destroyTask } from '../indexedDB/BotDB.js';
import { useState, CSSProperties } from "react";
import RotateLoader from "react-spinners/RotateLoader";

const override = {
    display: "block",
    margin: "auto",
    borderColor: "red",
};

const Task = ({ task }) => {
    const { instances, addInstance, deleteInstance, deleteTask } = useContext(TaskContext);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");

    useEffect(() => {

        // Hardcoded RPC's will allow options later
        let httpRPC = "https://eth-mainnet.g.alchemy.com/v2/ufeyHWUdJJu9vurqgYKOli1zmLWgJoXs";
        let wsRPC = "wss://eth-mainnet.g.alchemy.com/v2/ufeyHWUdJJu9vurqgYKOli1zmLWgJoXs";
        setLoading(false);
        // TODO: Change constructor to object so my eyes don't hurt looking at this declaration
        const newInstance = new TaskInstance(task.wallet.pk, task.contract.address, task.contract.abi, httpRPC, wsRPC, task.contract.mintFunction, task.contract.flipFunction, task.value, task.maxBaseFee, task.maxPriorityFee, task.params);
        addInstance(task.uuid, newInstance);

        //Check dependency array
    }, [TaskInstance]);

    // Execute task
    const execute = () => {
        setLoading(true)

        /* const taskInstance = instances[task.uuid];
        console.log(taskInstance)
        taskInstance.monitor(); */
    }

    //
    const removeTask = () => {
        destroyTask(task.uuid);
        deleteInstance(task.uuid);
        deleteTask(task.uuid)
    }

    const StopTask = () => {
        setLoading(false);
    }


    // Put styles into classes
    return (
        <div style={{ display: "flex", width: "100%", justifyContent: "left" }}>
            <input style={{ borderRadius: "20px" }} type="checkbox" />
            <div style={{ width: "80%" }} className="itemContainer">
                <div style={{ width: "70%", overflow: "hidden" }}>
                    <p style={{ marginBottom: "1px" }}>Task {task.id} </p>
                    <p style={{ marginTop: "1px", marginBottom: "1px" }}>Wallet: {task.wallet.address}</p>
                    <p style={{ marginTop: "1px" }}>Contract: {task.contract.address}</p>
                </div>

                <button style={{ margin: "5px", width: "10%" }} onClick={execute}>Start</button>
                <button style={{ margin: "5px", width: "10%" }} onClick={StopTask}>Stop</button>
                <button style={{ margin: "5px", width: "10%" }} onClick={removeTask}>Delete</button>

            </div>
            <RotateLoader color={color} loading={loading} cssOverride={override} />
        </div>
    )
}

export default Task