import ContractContext from "../Contexts/ContractContext"
import { destroyContract } from "../indexedDB/BotDB";
import { useContext } from "react"
const Contract = ({ contract }) => {

    const { removeContract } = useContext(ContractContext);
    const deleteContract = () => {
        destroyContract(contract.address);
        removeContract(contract.address);
    }
    const edit = () => {

    }
    return (
        <div className="itemContainer">
            <div style={{ width: "90%" }}>
                <p style={{ marginBottom: "1px" }}>{contract.name}</p>
                <p style={{ marginTop: "1px" }}>{contract.address}</p>
            </div>
            <button onClick={edit} style={{ width: "10%", margin: "5px" }}>Edit</button>
            <button onClick={deleteContract} style={{ width: "10%", margin: "5px" }}>Delete</button>
        </div>
    )
}

export default Contract