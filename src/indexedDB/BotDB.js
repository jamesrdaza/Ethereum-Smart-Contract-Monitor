/**
 * TODO: 
 *      Pack Things neater (too many loose parameters)
 *      Get delete functionality in sync with UI (can't sync keys)
 */

const dbName = "botDB";

export function initDB(setFuncs) {
    const request = window.indexedDB.open(dbName, 1);

    // Create database if one does not exist
    request.onupgradeneeded = () => {
        const db = request.result;

        const walletStore = db.createObjectStore("wallets", { keyPath: "address" });
        walletStore.createIndex("privateKey", "privateKey");
        //walletStore.createIndex("address", "address");

        const contractStore = db.createObjectStore("contracts", { keyPath: "address" });
        contractStore.createIndex("contractName", "name", { unique: false });
        contractStore.createIndex("address", "address");
        contractStore.createIndex("ABI", "ABI");
        contractStore.createIndex("flipFunction", "flipFunction");
        contractStore.createIndex("mintFunction", "mintFunction");
        contractStore.createIndex("arguments", "args");

        const taskStore = db.createObjectStore("tasks");
        taskStore.createIndex("privateKey", "privateKey", { unique: false });
        taskStore.createIndex("contractAddress", "address", { unique: false });
        taskStore.createIndex("ABI", "ABI", { unique: false });
        taskStore.createIndex("mintFunction", "mintFunction", { unique: false });
        taskStore.createIndex("flipFunction", "flipFunction", { unique: false });
        taskStore.createIndex("value", "value", { unique: false });
        taskStore.createIndex("maxGasFee", "maxGasFee", { unique: false });
        taskStore.createIndex("maxPriorityFee", "maxPriorityFee", { unique: false });
        taskStore.createIndex("arguments", "args");
        taskStore.createIndex("isTimed", "isTimed");
        taskStore.createIndex("execTime", "execTime");
    }

    // If database exists load all Wallets, Contracts, Tasks
    request.onsuccess = () => {

        // Load database object
        let db = request.result;

        // Create cursor to iterate over each element and add them to UI state through callbacks
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
                    contractCursor.value.name,
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

                setFuncs.addTask(taskCursor.key, { pk: taskCursor.value.privateKey, address: "0x" },
                    { address: taskCursor.value.contractAddress, abi: taskCursor.value.ABI, mintFunction: taskCursor.value.mintFunction, flipFunction: taskCursor.value.flipFunction, params: taskCursor.value.arguments },
                    taskCursor.value.maxGasFee, taskCursor.value.maxPriorityFee, taskCursor.value.value, taskCursor.value.arguments, taskCursor.value.isTimed, taskCursor.value.execTime);
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

        // Add given private key and address
        let storeRequest = store.add({ address: addr, privateKey: pk });

        storeRequest.onsuccess = function () {
            console.log("Succesfully Added Wallet");
        };

        storeRequest.onerror = function () {
            console.error("Error: Could not add wallet")
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onerror = function () {
        console.error("Error: Could not Access Database");
    };
}

export function destroyWallet(addr) {
    let request = window.indexedDB.open(dbName);

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["wallets"], "readwrite");
        let objStore = transaction.objectStore("wallets");
        console.log(addr);
        let deleteRequest = objStore.delete(addr);

        deleteRequest.onsuccess = function () {
            console.log(deleteRequest.result);
        };

        deleteRequest.onerror = function () {
            console.error("Error Could not delete wallet");
        };

        transaction.oncomplete = function () {
            db.close();
        };

        request.onerror = function () {
            console.error("Error: Could not Access Database");
            return false;
        };
    }
}

export function storeContract(addr, name, abi, mint, flip, args) {
    let request = window.indexedDB.open("botDB");

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["contracts"], "readwrite");
        let store = transaction.objectStore("contracts");

        let storeRequest = store.add({ address: addr, contractName: name, ABI: abi, mintFunction: mint, flipFunction: flip, arguments: args });

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

export function destroyContract(addr) {
    let request = window.indexedDB.open(dbName);

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["contracts"], "readwrite");
        let objStore = transaction.objectStore("contracts");
        console.log(addr);
        let deleteRequest = objStore.delete(addr);

        deleteRequest.onsuccess = function () {
            console.log(deleteRequest.result);
        };

        deleteRequest.onerror = function () {
            console.error("Error Could not delete contract");
        };

        transaction.oncomplete = function () {
            db.close();
        };

        request.onerror = function () {
            console.error("Error: Could not Access Database");
            return false;
        };
    }
}

export function storeTask(uuid, pk, cAddr, abi, mint, flip, val, maxGas, maxPrio, args, timed, time) {
    let request = window.indexedDB.open("botDB");

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["tasks"], "readwrite");
        let store = transaction.objectStore("tasks");

        let storeRequest = store.add({ privateKey: pk, contractAddress: cAddr, ABI: abi, mintFunction: mint, flipFunction: flip, value: val, maxGasFee: maxGas, maxPriorityFee: maxPrio, arguments: args, isTimed: timed, execTime: time }, uuid);

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

export function destroyTask(addr) {
    let request = window.indexedDB.open(dbName);

    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction(["tasks"], "readwrite");
        let objStore = transaction.objectStore("tasks");
        console.log(addr);
        let deleteRequest = objStore.delete(addr);

        deleteRequest.onsuccess = function () {
            console.log(deleteRequest.result);
        };

        deleteRequest.onerror = function () {
            console.error("Error Could not delete task");
        };

        transaction.oncomplete = function () {
            db.close();
        };

        request.onerror = function () {
            console.error("Error: Could not Access Database");
            return false;
        };
    }
}