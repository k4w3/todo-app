let db;

function mydbopen (dbName, dbVer) {
    // window.indexedDB.deleteDatabase("todo");
    return kdbOpen(dbName, dbVer, (event) => {
        console.log("onupgradeneeded: ");
        // console.log(event);

        const db = event.target.result;

        switch (event.oldVersion) {
            case 0: {
                console.log("v0 -> v1");
                const storeList = db.createObjectStore("storeList", {keyPath: "id", autoIncrement: true});
                const r1 = storeList.add({name: "腕立て100回", done: 0,});
                r1.onsuccess = (event) => {
                    console.log(r1.result);
                }
            }
            case 1: {
                console.log("v1 -> v2");
                const tran = event.target.transaction;
                const storeListTran = tran.objectStore("storeList");
                const r2 = storeListTran.add({name: "腹筋100回", done: 1,});
                r2.onsuccess = (event) => {
                    console.log(r2.result);
                }
            }
            case 2: {
                console.log("v2 -> v3");
                const tran = event.target.transaction;
                const storeListTran = tran.objectStore("storeList");
                const r3 = storeListTran.add({name: "スクワット100回", done: 0,});
                r3.onsuccess = (event) => {
                    console.log(r3.result);
                }
            }
            case 3: {
                console.log("v3 -> v4");
                const tran = event.target.transaction;
                const storeListTran = tran.objectStore("storeList");
                const r4 = storeListTran.add({name: "懸垂100回", done: 1,});
                r4.onsuccess = (event) => {
                    console.log(r4.result);
                }
                const r5 = storeListTran.add({name: "ダッシュ10本", done: 0,});
                r5.onsuccess = (event) => {
                    console.log(r5.result);
                }
            }
        }
    });
}

function drawTodoList (id, name, done) {
    let tdId = document.createElement("td");
    tdId.innerText = id;
    let tdName = document.createElement("td");
    tdName.innerText = name;
    let tdDone = document.createElement("td");
    tdDone.innerText = done;

    let tdEditButton = document.createElement("td");
    let editButton = document.createElement("button");
    editButton.textContent = "編集";
    editButton.setAttribute("class", "todoeditbutton");
    editButton.setAttribute("name", id);
    tdEditButton.appendChild(editButton);

    let tdDeleteButton = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.setAttribute("class", "tododeletebutton");
    deleteButton.setAttribute("name", id);
    tdDeleteButton.appendChild(deleteButton);

    let tr = document.createElement("tr");
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdDone);
    tr.appendChild(tdEditButton);
    tr.appendChild(tdDeleteButton);

    document.querySelector(".todolist").appendChild(tr);
};

async function createEditForm (db, id) {
    let todo = await kdbGet(db, "storeList", Number(id))
    switch (todo.done) {
        case 1:
            todo.done = "true";
            break;
        case 0:
            todo.done = "false";
            break;
        default:
            // そのままの値
    }

    let spanName = document.createElement("span");
    spanName.textContent = "名前: ";

    let inputName = document.createElement("input");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("value", todo.name);
    inputName.style.marginRight = "1em";

    let spanDone = document.createElement("span");
    spanDone.textContent = "対応済み: ";

    let labelDoneTrue = document.createElement("label");
    labelDoneTrue.innerHTML = '<input type="radio" id="editradiosdoneTrue" name="editradiosdone" value="1" style="marginRight: 1em">はい'

    let labelDoneFalse = document.createElement("label");
    labelDoneFalse.innerHTML = '<input type="radio" id="editradiosdoneFalse" name="editradiosdone" value="0" style="marginRight: 1em">いいえ'

    let okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.setAttribute("type", "button");
    okButton.setAttribute("class", "okbutton");

    okButton.addEventListener("click", async (event) => {
        let inputDoneTrue = document.querySelector("#editradiosdoneTrue");
        let inputDoneFalse = document.querySelector("#editradiosdoneFalse");
        let inputDone;
        if (inputDoneTrue.checked) {
            inputDone = inputDoneTrue.value;
        } else if (inputDoneFalse.checked) {
            inputDone = inputDoneFalse.value;
        }

        await kdbPut(db, "storeList", {name:inputName.value, done:Number(inputDone), id:Number(id)})
        reloadTbody();
        document.querySelector(".edittodo").innerHTML = "";
    });

    let editForm = document.createElement("form");

    editForm.appendChild(spanName);
    editForm.appendChild(inputName);
    editForm.appendChild(spanDone);
    editForm.appendChild(labelDoneTrue);
    editForm.appendChild(labelDoneFalse);
    editForm.appendChild(okButton);

    document.querySelector(".edittodo").innerHTML = "";
    document.querySelector(".edittodo").appendChild(editForm);

    if (todo.done === "true") {
        document.querySelector("#editradiosdoneTrue").checked = true;
    }
    if (todo.done === "false") {
        document.querySelector("#editradiosdoneFalse").checked = true;
    }
}

async function reloadTbody () {
    document.querySelector(".todolist").innerHTML = "";
    let list = await kdbFind(db, "storeList", () => 1 === 1);
    list.forEach((todo) => {
        switch (todo.done) {
            case 1:
                todo.done = "true";
                break;
            case 0:
                todo.done = "false";
                break;
            default:
                // そのままの値
        }
        drawTodoList(todo.id, todo.name, todo.done);
    });
    let todoEditButtonArray = document.querySelectorAll(".todoeditbutton");
    todoEditButtonArray.forEach((todoEditButton)=> {
            todoEditButton.addEventListener("click", (event) => {
                // event.preventDefault();
                let id = todoEditButton.name;
                createEditForm(db, id);
            });
    });
    let todoDeleteButtonArray = document.querySelectorAll(".tododeletebutton");
    todoDeleteButtonArray.forEach((todoDeleteButton) => {
        todoDeleteButton.addEventListener("click", async (event) => {
            // event.preventDefault();
            let confirm = window.confirm("消してもいいですか？");
            if (confirm) {
                let id = todoDeleteButton.name;
                await kdbDelete(db, "storeList", Number(id));
                reloadTbody();
            };
        });
    });
}

window.onload = async () => {
    const dbName = "todo";
    const dbVer = "4";

    db = await mydbopen(dbName, dbVer);
    reloadTbody();

    document.querySelector(".todosendbutton").addEventListener("click", async (event) => {
        event.preventDefault();
        let todoName = document.querySelector(".textname").value;
        let radiosDone = document.querySelectorAll(".inputradiosdone");
        let todoDone;
        radiosDone.forEach((radio) => {
            if (radio.checked) {
                todoDone = radio.value;
            }
        });
        let key = await kdbAdd(db, "storeList", {name:todoName, done:Number(todoDone)})
        console.log(key);
        reloadTbody();
    });
};
// window.onload = () => {
//     const dbName = "todo";
//     const dbVer = "4";

//     mydbopen(dbName, dbVer)
//     .then((ldb) => {
//         db = ldb;
//         reloadTbody();

//         document.querySelector(".todosendbutton").addEventListener("click", (event) => {
//             event.preventDefault();
//             let todoName = document.querySelector(".textname").value;
//             let radiosDone = document.querySelectorAll(".inputradiosdone");
//             let todoDone;
//             radiosDone.forEach((radio) => {
//                 if (radio.checked) {
//                     todoDone = radio.value;
//                 }
//             });

//             kdbAdd(db, "storeList", {name:todoName, done:todoDone})
//             .then((key) => {
//                 console.log(key);
//                 reloadTbody();
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//         });
//     });
// };
