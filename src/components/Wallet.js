const Wallet = ({wallet}) => {
    return (
        <div className="itemContainer">
            <div style={{width: "80%"}}>
                <p style={{marginBottom: "1px"}}>Wallet {wallet.id} </p>
                <p style={{marginTop: "1px"}}>Address: {wallet.address} </p>
            </div>
            <button style={{width: "20%", margin: "5px"}}>Delete</button>
        </div>
    )
}

export default Wallet