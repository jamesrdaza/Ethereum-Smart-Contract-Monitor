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

    const addContract = (address, name, abi, mintFunction, flipFunction, params) => {
        setContract((prev) => [...prev, { address, name, abi, mintFunction, flipFunction, params }])
    };

    const removeContract = (address) => {
        setContract(contracts.filter((contract) => {
            return contract.address !== address
        }))
    }

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