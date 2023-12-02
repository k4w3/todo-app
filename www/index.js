function drawTodoList (id, name, done) {
    let tdId = document.createElement("td");
    tdId.innerHTML = id;
    let tdName = document.createElement("td");
    tdName.innerHTML = name;
    let tdDone = document.createElement("td");
    tdDone.innerHTML = done;

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

function createEditForm (id) {
    getTList(id)
    .then((todoObj) => {
        console.log(todoObj);
        let todoArray = JSON.parse(todoObj);
        let todo = todoArray[0]
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
        console.log(todo);

        let spanName = document.createElement("span");
        let spanDone = document.createElement("span");

        let inputName = document.createElement("input");
        let inputDone = document.createElement("input");

        let okButton = document.createElement("button");

        spanName.textContent = "name: ";
        spanDone.textContent = "done: ";

        okButton.textContent = "OK";
        okButton.setAttribute("type", "button");
        okButton.setAttribute("class", "okbutton");

        okButton.addEventListener("click", (event) => {
            putTList(inputName.value, inputDone.value, id)
            .then ((text) => {
                console.log(text);
                reloadTbody();
            });
        });

        inputName.setAttribute("type", "text");
        inputName.setAttribute("value", todo.name);
        inputDone.setAttribute("type", "text");
        inputDone.setAttribute("value", todo.done);

        inputName.style.marginRight = "1em";
        inputDone.style.marginRight = "1em";

        let editForm = document.createElement("form");

        editForm.appendChild(spanName);
        editForm.appendChild(inputName);
        editForm.appendChild(spanDone);
        editForm.appendChild(inputDone);
        editForm.appendChild(okButton);

        document.querySelector(".edittodo").innerHTML = "";
        document.querySelector(".edittodo").appendChild(editForm);
    });
}

function reloadTbody () {
    document.querySelector(".todolist").innerHTML = "";
    selectTList()
    .then ((list) => {
        // console.log(list);
        let listObjArray = JSON.parse(list);
        for (let i = 0; i < listObjArray.length; i++) {
            let todo = listObjArray[i];
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
            console.log(todo);
            drawTodoList(todo.id, todo.name, todo.done);
        };
    })
    .then (() => {
        let todoEditButtonArray = document.querySelectorAll(".todoeditbutton");
        for (let i = 0; i < todoEditButtonArray.length; i++) {
            let todoEditButton = todoEditButtonArray[i];
            // let todoEditButton = document.querySelector(".todoeditbutton");
            todoEditButton.addEventListener("click", (event) => {
                // event.preventDefault();

                console.log(todoEditButton.name);
                let id = todoEditButton.name;
                createEditForm(id);
            });
        }
        let todoDeleteButtonArray = document.querySelectorAll(".tododeletebutton");
        for (let i = 0; i < todoDeleteButtonArray.length; i++) {
            let todoDeleteButton = todoDeleteButtonArray[i];
            todoDeleteButton.addEventListener("click", (event) => {
                // event.preventDefault();
                console.log(todoDeleteButton.name);
                let confirm = window.confirm("消してもいいですか？");

                if (confirm) {
                    let id = todoDeleteButton.name;
                    deleteTList(id)
                    .then ((text) => {
                        console.log(text);
                        reloadTbody();
                    });
                };
            });
        }
    });
}

window.onload = () => {

    reloadTbody();

    document.querySelector(".todosendbutton").addEventListener("click", (event) => {
        event.preventDefault();
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
            reloadTbody();
        });

    });

    // document.querySelector(".sendbutton").addEventListener("click", (event) => {
    //     event.preventDefault();
    //     // console.log("hahahaha");
    //     // selectTList()
    //     // .then ((text) => {
    //     //     console.log(text);
    //     // })

    //     // postTList("foo", 0)
    //     // .then ((text) => {
    //     //     console.log(text);
    //     // });

    //     // putTList("var", 1, 4)
    //     // .then ((text) => {
    //     //     console.log(text);
    //     // });

    //     // deleteTList(4)
    //     // .then ((text) => {
    //     //     console.log(text);
    //     // });

    // });

};
