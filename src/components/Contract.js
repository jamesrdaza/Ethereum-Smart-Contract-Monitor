import { useContext } from "react"
import ContractContext from "../Contexts/ContractContext"
import { destroyContract } from "../indexedDB/BotDB";
const Contract = ({ contract }) => {
    const { removeContract } = useContext(ContractContext);
    const deleteContract = () => {
        destroyContract(contract.address);
        removeContract(contract.address)
    }
    return (
        <div className="itemContainer">
            <div style={{ width: "90%" }}>
                <p style={{ marginBottom: "1px" }}>Contract {contract.id}</p>
                <p style={{ marginTop: "1px" }}>{contract.address}</p>
            </div>
            <button style={{ width: "10%", margin: "5px" }}>Delete</button>
        </div>
    )
}

export default Contract