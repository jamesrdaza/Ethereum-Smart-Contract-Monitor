import ContractContext from '../Contexts/ContractContext.js'
import Contract from './Contract.js'
import { useContext, useState, useRef } from 'react'

const Contracts = () => {

    // Functions fetched to display
    const { fetchFuncs, addFunc, clearFuncs } = useContext(ContractContext);
    const { isHidden, setHidden } = useContext(ContractContext);

    // Functions to pass onto TaskInstance
    const [funcs, setFuncs] = useState({});
    const { contracts, addContract } = useContext(ContractContext);

    // Arguments and ABI to pass onto the TaskInstance
    const { setParams } = useContext(ContractContext);
    const { setContractABI } = useContext(ContractContext);

    const addrInput = useRef();
    const mintInput = useRef();
    const flipInput = useRef();

    // Fetch contract params and ABI
    const getContract = () => {
        fetch(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${addrInput.current.value}&apikey=QNKM5HM4YFG87MS5PHZKB3NI43N83GX1MB`) //Remove API Key later
            .then((response) => {
                response.json().then((responseJson) => {

                    // Using temp variable because setState is async
                    let ABI = (JSON.parse(responseJson.result))
                    setContractABI(ABI); // Setting ABI st

                    let funcs = {};

                    // Loops through ABI objects and push the functions
                    for (let i = 0; i < ABI.length; i++) {
                        // name property that has inputs are function calls
                        if (ABI[i]['inputs'].length > 0 && ABI[i]['name'] !== undefined) {
                            funcs[ABI[i]['name']] = ABI[i];
                        }
                    }

                    // Set Dropdown Options
                    setFuncs(funcs);

                    // Get functions
                    Object.keys(funcs).forEach((key) => {
                        addFunc(funcs[key]);
                    });
                    setHidden(false); // Hide function fields
                })
            })
    }
    const saveContract = () => {
        // Adding params to pass to Task State (Change later to one state)
        setParams(funcs[mintInput.current.value].inputs);
        addContract(addrInput.current.value, mintInput.current.value, flipInput.current.value);

        clearFuncs(); // Clearing dropdown options after saving
        setHidden(true); // Make function fields appear

    }

    return (
        <div className='container'>
            Contract Address <br></br>
            <input type='text' ref={addrInput}></input> <br></br>
            <button onClick={getContract}>Add Contract</button> <br></br>

            <div style={{ visibility: isHidden ? 'hidden' : 'visible' }}>
                <select ref={mintInput}>
                    <option disabled selected>Select Mint Function</option>
                    {
                        fetchFuncs.map((func) => (
                            <option>{func.name}</option>
                        ))
                    }
                </select>
                <select ref={flipInput}>
                    <option disabled selected>Select Flip Function</option>
                    {
                        fetchFuncs.map((func) => (
                            <option>{func.name}</option>
                        ))
                    }
                </select>
                <button onClick={saveContract}>Save Contract</button>
            </div>
            <h3>Contracts</h3>
            {
                contracts.map((contract) => (
                    <Contract key={contract.id} contract={contract} />
                ))
            }
            <br></br>
        </div>
    )
}

export default Contracts