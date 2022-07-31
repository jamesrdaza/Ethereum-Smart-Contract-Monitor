import { createContext, useState } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTask] = useState([]); // Task elements
    const [instances, setInstances] = useState([]); // Instances of taskClass object
    const [paramState, setParamState] = useState([]); // Parameters to get filled by contract parameters
    const [isHidden, setHidden] = useState(true);
    const [id, setId] = useState(0);

    const addTask = (wallet, contract, maxBaseFee, maxPriorityFee, value, params) => {
        setTask((prev) => [...prev, { id, wallet, contract, maxBaseFee, maxPriorityFee, value, params }])
    };
    const addInstance = (instance) => {
        setInstances((prev) =>
            [...prev, { id, instance }]
        )
        setId(id + 1);
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, instances, addInstance, paramState, setParamState, isHidden, setHidden }}>
            {children}
        </TaskContext.Provider>
    );
}

export default TaskContext;