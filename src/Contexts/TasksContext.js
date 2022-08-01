import { createContext, useState } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTask] = useState([]); // Task elements
    const [instances, setInstances] = useState({}); // Instances of taskClass object
    const [paramState, setParamState] = useState([]); // Parameters to get filled by contract parameters
    const [isHidden, setHidden] = useState(true);

    const addTask = (uuid, wallet, contract, maxBaseFee, maxPriorityFee, value, params, isTimed, time) => {
        setTask((prev) => [...prev, { uuid, wallet, contract, maxBaseFee, maxPriorityFee, value, params, isTimed, time }])
    };

    const deleteTask = (uuid) => {
        setTask(
            tasks.filter((task) => {
                task.uuid !== uuid;
            })
        )
    }
    const addInstance = (uuid, instance) => {
        setInstances((prev) => ({
            ...prev,
            [uuid]: instance
        }))
    };

    const deleteInstance = (uuid) => {
        let tempInst = instances;
        delete tempInst[uuid];
        setInstances(tempInst);
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, instances, addInstance, paramState, setParamState, isHidden, setHidden, deleteInstance, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export default TaskContext;