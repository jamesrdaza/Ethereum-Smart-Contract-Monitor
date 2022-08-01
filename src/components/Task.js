import TaskInstance from '../TaskClass.js'
import TaskContext from '../Contexts/TasksContext.js';
import { useContext, useEffect } from 'react';
import ContractContext from '../Contexts/ContractContext.js';
import { destroyTask } from '../indexedDB/BotDB.js';
import { useState, CSSProperties, useRef } from "react";
import RotateLoader from "react-spinners/RotateLoader";
import Countdown from 'react-countdown';
import SettingsContext from '../Contexts/SettingsContext.js';

const override = {
    display: "block",
    margin: "auto",
    /* borderColor: "red", */
};

const Task = ({ task }) => {
    const { instances, addInstance, deleteInstance, deleteTask } = useContext(TaskContext);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [error, setError] = useState(false);
    let [color, setColor] = useState("#ffffff");
    const [time, setTime] = useState(0);
    let countdownRef = useRef();

    useEffect(() => {

        // Hardcoded RPC's will allow options later
        let httpRPC = "";
        let wsRPC = ""
        if (network == "mainnet") {
            httpRPC = "https://eth-mainnet.g.alchemy.com/v2/ufeyHWUdJJu9vurqgYKOli1zmLWgJoXs";
            wsRPC = "wss://eth-mainnet.g.alchemy.com/v2/ufeyHWUdJJu9vurqgYKOli1zmLWgJoXs";
        }
        else if (network == "mainnet") {
            httpRPC = "https://eth-rinkeby.alchemyapi.io/v2/5DPlF1-TT85CmLvjEuDXaIR8YFyLNg8G";
            wsRPC = "wss://eth-rinkeby.alchemyapi.io/v2/5DPlF1-TT85CmLvjEuDXaIR8YFyLNg8G";
        }



        setLoading(false);
        // TODO: Change constructor to object so my eyes don't hurt looking at this declaration
        const newInstance = new TaskInstance(task.wallet.pk, task.contract.address, task.contract.abi, httpRPC, wsRPC, task.contract.mintFunction, task.contract.flipFunction, task.value, task.maxBaseFee, task.maxPriorityFee, task.params, task.isTimed, task.time, { setLoading, setFinished, setError });
        addInstance(task.uuid, newInstance);

        //Check dependency array
    }, [TaskInstance]);

    // Execute task
    const execute = () => {
        const taskInstance = instances[task.uuid];
        console.log(taskInstance);

        if (task.isTimed) {
            taskInstance.waiting();
        }
        else {
            taskInstance.monitor();
            setLoading(true)
        }
    }

    const removeTask = () => {
        const taskInstance = instances[task.uuid];
        taskInstance.stop();
        destroyTask(task.uuid);
        deleteInstance(task.uuid);
        deleteTask(task.uuid);
    }

    const StopTask = () => {
        const taskInstance = instances[task.uuid];
        taskInstance.stop();
        setLoading(false);
    }


    // Put styles into classes
    return (
        <div style={{ display: "flex", width: "100%", justifyContent: "left" }}>
            <input style={{ borderRadius: "20px" }} type="checkbox" />
            <div style={{ width: "80%" }} className="itemContainer">
                <div style={{ width: "70%", overflow: "hidden" }}>
                    <p style={{ marginBottom: "1px" }}>Task</p>
                    <p style={{ marginTop: "1px", marginBottom: "1px" }}>Wallet: {task.wallet.address}</p>
                    <p style={{ marginTop: "1px" }}>Contract: {task.contract.address}</p>
                </div>

                <button style={{ margin: "5px", width: "10%" }} onClick={execute}>Start</button>
                <button style={{ margin: "5px", width: "10%" }} onClick={StopTask}>Stop</button>
                <button style={{ margin: "5px", width: "10%" }} onClick={removeTask}>Delete</button>

            </div>
            <div style={{ height: "15%", margin: "auto", display: !loading ? "block" : "none", visibility: !loading ? "visible" : "hidden" }} ref={countdownRef}>
                <Countdown date={task.time} control={true} onComplete={() => setLoading(!loading)} />
            </div>
            <RotateLoader color={color} loading={loading} cssOverride={override} />
        </div>
    )
}

export default Task