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