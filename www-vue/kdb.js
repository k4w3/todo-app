function kdbOpen (name, ver, onupgradeneeded) {
    return new Promise((resolve, reject) => {
        let openRequest = window.indexedDB.open(name, ver);

        openRequest.onerror = (event) => {
            reject(event.target.error);
        };

        openRequest.onsuccess = (event) => {
            resolve(event.target.result);
        };

        openRequest.onupgradeneeded = onupgradeneeded;
    });
}

function kdbGet (db, store, key) {
    return new Promise((resolve, reject) => {
        const tran = db.transaction([store]);
        const request = tran.objectStore(store).get(key);
        request.onerror = (event) => {
        //    console.log(event.target.error);
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            // console.log(event.target.result);
            resolve(event.target.result);
        };
    });
}

function kdbDelete (db, store, key) {
    return new Promise((resolve, reject) => {
        const tran = db.transaction([store],"readwrite");
        const request = tran.objectStore(store).delete(key);
        request.onerror = (event) => {
        //    console.log(event.target.error);
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            // console.log(event.target.result);
            resolve();
        };
    });
}

function kdbAdd (db, store, value, key) {
    return new Promise((resolve, reject) => {
        const tran = db.transaction([store],"readwrite");
        const request = tran.objectStore(store).add(value, key);
        request.onerror = (event) => {
        //    console.log(event.target.error);
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            // console.log(event.target.result);
            resolve(event.target.result);
        };
    });
}

function kdbPut (db, store, value, key) {
    return new Promise((resolve, reject) => {
        const tran = db.transaction([store],"readwrite");
        const request = tran.objectStore(store).put(value, key);
        request.onerror = (event) => {
        //    console.log(event.target.error);
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            // console.log(event.target.result);
            resolve(event.target.result);
        };
    });
}

function kdbFind (db, store, condition) {
    return new Promise ((resolve, reject) => {
        let results = [];
        const request = db.transaction([store]).objectStore(store).openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (condition(cursor.value)) {
                results.push(cursor.value);
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function kdbTransaction(db, stores, withTransaction) {
    return new Promise((resolve, reject) => {
        let tran = db.transaction(stores,"readwrite");
        tran.onerror = (event) => {
            reject("transaction error...");
        };
        tran.onabort = (event) => {
            reject("transaction aborted...");
        };
        tran.oncomplete = (event) => {
            resolve();
        };

        withTransaction(tran)
        .catch ((error) => {
            console.error(error);
            tran.abort();
        });
    });
}

function kdbExecute (request) {
    return new Promise ((resolve, reject) => {
        request.onerror = (event) => {
        //    console.log(event.target.error);
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            // console.log(event.target.result);
            resolve(event.target.result);
        };
    });
}