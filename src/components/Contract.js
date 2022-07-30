const Contract = ({contract}) => {
    return (
        <div className="itemContainer">
            <div style={{width: "90%"}}>
                <p style={{marginBottom: "1px"}}>Contract {contract.id}</p>
                <p style={{ marginTop: "1px"}}>{contract.address}</p>   
            </div>
            <button style={{width: "10%", margin: "5px"}}>Delete</button>
        </div>
    )
}

export default Contract