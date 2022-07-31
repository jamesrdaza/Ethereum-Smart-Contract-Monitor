import { createContext, useState } from "react";

// TODO: Try packing all states/functions into an object

const ContractContext = createContext();

export function ContractProvider({ children }) {

    //TODO: Clean up states
    const [contracts, setContract] = useState([]);
    const [contractABI, setContractABI] = useState([]);
    const [fetchFuncs, setFetchFuncs] = useState([]); // State to render function fields
    const [isHidden, setHidden] = useState(true);
    const [params, setParams] = useState([]); // Function parameters
    const [id, setId] = useState(0); // Temp Incremental ID's will change later

    const addContract = (address, abi, mintFunction, flipFunction, params) => {
        setContract((prev) => [...prev, { id, address, abi, mintFunction, flipFunction, params }])
        setId(id + 1);
    };

    const searchContracts = (address) => {
        for (let i = 0; i < contracts.length; i++) {
            if (address === contracts[i]['address']) {
                return contracts[i];
            }
        }
    }

    const addFunc = (func) => {
        setFetchFuncs((prev) => [...prev, func]);
    }

    const clearFuncs = () => {
        setFetchFuncs([]);
    }

    const clearParams = () => {
        setParams([])
    }

    const removeContract = (id) => {
        for (let i = 0; i < contracts.length; i++) {
            if (id === contracts.id) {
                setContract(contracts.splice(i, i + 1));
            }
        }
    }

    return (
        <ContractContext.Provider value={{
            contracts, addContract, removeContract,
            searchContracts, fetchFuncs, addFunc, clearFuncs,
            isHidden, setHidden,
            params, setParams, clearParams,
            contractABI, setContractABI
        }}>
            {children}
        </ContractContext.Provider>
    );
}

export default ContractContext;