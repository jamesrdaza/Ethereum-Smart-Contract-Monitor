const dbName = "botDB";

export function initDB(setFuncs) {
    const request = window.indexedDB.open(dbName, 1);

    request.onupgradeneeded = () => {
        const db = request.result;

        const walletStore = db.createObjectStore("wallets", { autoIncrement: true });
        walletStore.createIndex("privateKey", "privateKey");
        walletStore.createIndex("address", "address");

        const contractStore = db.createObjectStore("contracts", { autoIncrement: true });
        /* contractStore.createIndex("contractName", "name", { unique: false }); */
        contractStore.createIndex("address", "address");
        contractStore.createIndex("ABI", "ABI");
        contractStore.createIndex("flipFunction", "flipFunction");
        contractStore.createIndex("mintFunction", "mintFunction");
        contractStore.createIndex("arguments", "args");

        const taskStore = db.createObjectStore("tasks", { autoIncrement: true });
        taskStore.createIndex("privateKey", "privateKey", { unique: false });
        taskStore.createIndex("contractAddress", "address", { unique: false });
        taskStore.createIndex("ABI", "ABI", { unique: false });
        taskStore.createIndex("mintFunction", "mintFunction", { unique: false });
        taskStore.createIndex("flipFunction", "flipFunction", { unique: false });
        taskStore.createIndex("value", "value", { unique: false });
        taskStore.createIndex("maxGasFee", "maxGasFee", { unique: false });
        taskStore.createIndex("maxPriorityFee", "maxPriorityFee", { unique: false });
        taskStore.createIndex("arguments", "args");


    }

    request.onsuccess = () => {
        let db = request.result;

        let wTxn = db.transaction(["wallets"], "readonly");
        let wallets = wTxn.objectStore("wallets");
        let walletWalk = wallets.openCursor(null, "next");
        walletWalk.onsuccess = (event) => {
            let walletCursor = event.target.result;
            if (walletCursor) {
                setFuncs.addWallet(walletCursor.value.privateKey, walletCursor.value.address);
            }


        }

        let cTxn = db.transaction(["contracts"], "readonly");
        let contracts = cTxn.objectStore("contracts");
        let contractWalk = contracts.openCursor(null, "next");
        contractWalk.onsuccess = (event) => {
            let contractCursor = event.target.result;
            if (contractCursor != null) {
                setFuncs.addContract(
                    contractCursor.value.address,
                    contractCursor.value.ABI,
                    contractCursor.value.mintFunction,
                    contractCursor.value.flipFunction,
                    contractCursor.value.arguments
                );
            }
        }

        let tTxn = db.transaction(["tasks"], "readonly");
        let tasks = tTxn.objectStore("tasks");
        let taskWalk = tasks.openCursor(null, "next");
        taskWalk.onsuccess = (event) => {
            let taskCursor = event.target.result;
            if (taskCursor != null) {
                setFuncs.addTask({ pk: taskCursor.value.privateKey, address: "0x" },
                    { address: taskCursor.value.contractAddress, abi: taskCursor.value.ABI, mintFunction: taskCursor.value.mintFunction, flipFunction: taskCursor.value.flipFunction, params: taskCursor.value.arguments },
                    taskCursor.value.maxGasFee, taskCursor.value.maxPriorityFee, taskCursor.value.value, taskCursor.value.arguments);
            }
        }
    }

    request.onerror = () => {
        console.error("Error: Something happened");
    }
}

export function storeWallet(pk, addr) {
    let request = window.indexedDB.open("botDB");

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["wallets"], "readwrite");
        let store = transaction.objectStore("wallets");

        let storeRequest = store.add({ privateKey: pk, address: addr });

        storeRequest.onsuccess = function () {
            console.log("Succesfully Added Wallet");
        };

        //unable to add bullet, returns -1
        storeRequest.onerror = function () {
            console.error("Error: Could not add wallet")
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };

    //unable to open database
    request.onerror = function () {
        console.error("Error: Could not Access Database");
    };
}

export function deleteWallet(key) {
    let request = window.indexedDB.open(DATABASENAME);

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["wallets"], "readwrite");
        let objStore = transaction.objectStore("wallets");
        let deleteRequest = objStore.delete(id);

        //Bullet object successfully deleted
        deleteRequest.onsuccess = function () {
            console.log(deleteRequest.result);
        };

        //Unable to delete bullet object
        deleteRequest.onerror = function () {
            console.error("Error Could not delete wallet");
        };

        transaction.oncomplete = function () {
            db.close();
        };
        //unable to open database
        request.onerror = function () {
            console.error("Error: Could not Access Database");
            return false;
        };
    }
}


export function storeContract(addr, abi, mint, flip, args) {
    let request = window.indexedDB.open("botDB");

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["contracts"], "readwrite");
        let store = transaction.objectStore("contracts");

        let storeRequest = store.add({ address: addr, ABI: abi, mintFunction: mint, flipFunction: flip, arguments: args });

        storeRequest.onsuccess = function () {
            console.log("Succesfully Added Contract");
        };

        storeRequest.onerror = function () {
            console.error("Error: Could not add contract")
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onerror = function () {
        console.error("Error: Could not Access Database");
    };
}

export function storeTask(pk, cAddr, abi, mint, flip, val, maxGas, maxPrio, args) {
    let request = window.indexedDB.open("botDB");

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["tasks"], "readwrite");
        let store = transaction.objectStore("tasks");

        let storeRequest = store.add({ privateKey: pk, contractAddress: cAddr, ABI: abi, mintFunction: mint, flipFunction: flip, value: val, maxGasFee: maxGas, maxPriorityFee: maxPrio, arguments: args });

        storeRequest.onsuccess = function () {
            console.log("Succesfully Added Task");
        };

        storeRequest.onerror = function () {
            console.error("Error: Could not add task")
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onerror = function () {
        console.error("Error: Could not Access Database");
    };
}