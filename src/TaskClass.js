import { ethers } from "ethers";

export default class TaskInstance {
    constructor(privateKey, contractAddress, ABI, httpRPC, wsRPC, mintFunction, flipFunction, value, maxGasFee, maxPriorityFee, args, isTimed, time, loadCallback) {
        // HTTP RPC and WS that retreive and send data through alchemy api
        this.provider = new ethers.providers.JsonRpcProvider(httpRPC);
        this.ws;
        this.wsUrl = wsRPC;
        this.go = true;

        // Init contract then connect wallet to get new Contract object
        this.setUpContract = new ethers.Contract(contractAddress, ABI, this.provider);
        this.signContract = this.setUpContract.connect(this.wallet);

        this.wallet = new ethers.Wallet(privateKey, this.provider);

        // Init contract then connect wallet to get new Contract object
        this.setUpContract = new ethers.Contract(contractAddress, ABI, this.provider);
        this.signContract = this.setUpContract.connect(this.wallet);

        // Interface to interact with ABI
        this.iface = new ethers.utils.Interface(ABI);

        // Contract Functions
        this.mintFunction = mintFunction;
        this.flipFunction = flipFunction;
        this.flipSignature = this.iface.getSighash(flipFunction);

        // Temp Conversions from Gwei to Wei
        let weiMaxGas = maxGasFee * (10 ** 9);
        let weiMaxPriority = maxPriorityFee * (10 ** 9);

        //Input fields
        this.value = value;
        this.maxFeePerGas = ethers.BigNumber.from(weiMaxGas);
        this.maxPriorityFeePerGas = ethers.BigNumber.from(weiMaxPriority);
        this.args = args;

        this.isTimed = isTimed;
        this.time = time;
        this.currentTime = new Date();

        this.setLoading = loadCallback;

    }

    async monitor() {
        this.go = true;
        this.ws = new WebSocket(this.wsUrl);
        this.setLoading(true);
        this.ws.onopen = (event) => {
            console.log("CONNECTING...")

            // Send request for pending txn to contract from alchemy
            this.ws.send(JSON.stringify({
                "jsonrpc": "2.0", "id": 2,
                "method": "eth_subscribe",
                "params": ["alchemy_pendingTransactions",
                    {
                        "toAddress": this.signContract.address,
                        "hashesOnly": false
                    }]
            }));
        }
        this.ws.onmessage = (msg) => {
            let msgData = JSON.parse(msg.data);

            if ("params" in msgData) {
                console.log("Sending Transaction...")
                let msgInput = msgData.params.result.input;
                let funcSignature = msgInput.substring(0, 10);

                //If msg funcSignature of pending txn == flipFunction signature execute mintFunction
                if (this.flipSignature === funcSignature) {
                    this.signContract[this.mintFunction](...this.args, {
                        // Overrides
                        value: this.value,
                        maxFeePerGas: this.maxFeePerGas,
                        maxPriorityFeePerGas: this.maxPriorityFeePerGas
                    })
                        // Debugs for now
                        .then(txnReceipt => { console.log("Completed Printing Receipt..."); console.log(txnReceipt); this.setLoading(false) })
                        .catch(async () => {
                            await this.wait(500);
                            await this.retry();

                        });
                }
            }
            else {
                console.log("CONNECTED")
            }
        }
    }

    // Retry if failed
    async retry() {
        if (this.go) {
            console.log("Retrying...")
            this.signContract[this.mintFunction](...this.args, {
                maxFeePerGas: this.maxFeePerGas,
                maxPriorityFeePerGas: this.maxPriorityFeePerGas
            })
                .then((txnReceipt) => { console.log("Completed Printing Receipt..."); console.log(txnReceipt); this.setLoading(false) })
                .catch(async () => {
                    await this.wait(500);
                    await this.retry();
                });
        }
    }

    wait(ms) {
        return (new Promise(resolve => setTimeout(resolve, ms)))
    }

    stop() {
        this.go = false;
    }

    async waiting() {
        this.go = true;
        this.setLoading(false);
        while (this.isTimed && (Date.now() < this.time) && this.go) {
            await this.wait(500);
            console.log(Date.now() < this.time);
        }
        this.monitor();
    }

};