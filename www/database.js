function selectTList() {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", "/api/TList");
        req.onload = (event) => {
            resolve(req.responseText);
        };
        req.send();
    });
};

function getTList(id) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", "/api/TList/" + id);
        req.onload = (event) => {
            resolve(req.responseText);
        };
        req.send();
    });
};

function postTList(name, done) {
    return new Promise((resolve, reject) => {

        let postData = "name=" + encodeURIComponent(name);
        postData += "&done=" + encodeURIComponent(done);

        let req = new XMLHttpRequest();
        req.open("POST", "/api/TList");
        req.onload = (event) => {
            if (req.readyState === req.DONE) {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(req.responseText);
                }
            }
        };

        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send(postData);
    });
};

function putTList(name, done, id) {
    return new Promise((resolve, reject) => {

        let putData = "name=" + encodeURIComponent(name);
        putData += "&done=" + encodeURIComponent(done);

        let req = new XMLHttpRequest();
        req.open("PUT", "/api/TList/" + id);
        req.onload = (event) => {
            if (req.readyState === req.DONE) {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(req.responseText);
                }
            }
        };

        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send(putData);
    });
};

function deleteTList(id) {
    return new Promise((resolve, reject) => {

        let req = new XMLHttpRequest();
        req.open("DELETE", "/api/TList/" + id);
        req.onload = (event) => {
            if (req.readyState === req.DONE) {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(req.responseText);
                }
            }
        };

        req.send();
    });
};
