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

function todoInsert (id, name, done) {
    let tdId = document.createElement("td");
    tdId.innerHTML = id;
    let tdName = document.createElement("td");
    tdName.innerHTML = name;
    let tdDone = document.createElement("td");
    tdDone.innerHTML = done;

    let tr = document.createElement("tr");
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdDone);

    document.querySelector(".todolist").appendChild(tr);
};

window.onload = () => {
    // document.querySelector(".hoge").innerHTML="kameyama";
    // let tdId = document.createElement("td");
    // tdId.innerHTML = "101";
    // let tdName = document.createElement("td");
    // tdName.innerHTML = "kame";
    // let tdDone = document.createElement("td");
    // tdDone.innerHTML = "1";

    // let tr = document.createElement("tr");
    // tr.appendChild(tdId);
    // tr.appendChild(tdName);
    // tr.appendChild(tdDone);

    // document.querySelector(".todolist").appendChild(tr);

    // todoInsert("10", "taka", "0" );
    // todoInsert("11", "ha", "0" );
    // todoInsert("12", "haha", "0" );

    selectTList()
    .then ((list) => {
        console.log(list);
        let listObjArray = JSON.parse(list);
        for (let i = 0; i < listObjArray.length; i++) {
            let todo = listObjArray[i];
            console.log(todo);
            todoInsert(todo.id, todo.name, todo.done);
        };
    });

    document.querySelector(".todosendbutton").addEventListener("click", (event) => {
        event.preventDefault();
        console.log("todo");
        let todoName = document.querySelector(".textname").value;
        let radiosDone = document.querySelectorAll(".radiodone");
        let todoDone;
        for (let i = 0; i < radiosDone.length; i++) {
            let r = radiosDone[i];
            if (r.checked) {
                todoDone = r.value;
            }
        }

        console.log(todoDone);
        console.log(todoName);

        postTList(todoName, todoDone)
        .then ((result) => {
            console.log(result);
        });

    });

    document.querySelector(".sendbutton").addEventListener("click", (event) => {
        event.preventDefault();
        // console.log("hahahaha");
        // selectTList()
        // .then ((text) => {
        //     console.log(text);
        // })

        // postTList("foo", 0)
        // .then ((text) => {
        //     console.log(text);
        // });

        // putTList("var", 1, 4)
        // .then ((text) => {
        //     console.log(text);
        // });

        // deleteTList(4)
        // .then ((text) => {
        //     console.log(text);
        // });

    });

};
