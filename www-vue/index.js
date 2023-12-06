function openTodoDb () {
    // window.indexedDB.deleteDatabase("todo");
    return kdbOpen("todo", 1, (event) => {
        console.log("onupgradeneeded: ");
        // console.log(event);

        const db = event.target.result;

        switch (event.oldVersion) {
            case 0: {
                console.log("v0 -> v1");
                const storeList = db.createObjectStore("storeList", {keyPath: "id", autoIncrement: true});
                storeList.add({name: "腕立て100回", done: 0,});
                storeList.add({name: "腹筋100回", done: 1,});
                storeList.add({name: "foo", done: 1,});
                storeList.add({name: "var", done: 1,});
            }
            // case 1: {
            //     console.log("v1 -> v2");
            //     const tran = event.target.transaction;
            //     const storeListTran = tran.objectStore("storeList");
            //     const r2 = storeListTran.add({name: "腹筋100回", done: 1,});
            //     r2.onsuccess = (event) => {
            //         console.log(r2.result);
            //     }
            // }
            // case 2: {
            //     console.log("v2 -> v3");
            //     const tran = event.target.transaction;
            //     const storeListTran = tran.objectStore("storeList");
            //     const r3 = storeListTran.add({name: "スクワット100回", done: 0,});
            //     r3.onsuccess = (event) => {
            //         console.log(r3.result);
            //     }
            // }
            // case 3: {
            //     console.log("v3 -> v4");
            //     const tran = event.target.transaction;
            //     const storeListTran = tran.objectStore("storeList");
            //     const r4 = storeListTran.add({name: "懸垂100回", done: 1,});
            //     r4.onsuccess = (event) => {
            //         console.log(r4.result);
            //     }
            //     const r5 = storeListTran.add({name: "ダッシュ10本", done: 0,});
            //     r5.onsuccess = (event) => {
            //         console.log(r5.result);
            //     }
            // }
        }
    });
}

const FooApp = {
    data () {
        return {
            db: null,
            arrayTodo: [],
            message : "",
        };
    },
    async mounted () {
        this.message = "hello";
        this.db = await openTodoDb();
        this.todoReload();
        // list.forEach((todo) => {
        //     switch (todo.done) {
        //         case 1:
        //             todo.done = "true";
        //             break;
        //         case 0:
        //             todo.done = "false";
        //             break;
        //         default:
        //             // そのままの値
        //     }
        //     drawTodoList(todo.id, todo.name, todo.done);
        // });

    },
    methods : {
        // todoDelete (event, id) {
        //     event.preventDefault();
        //     console.log("delete");
        //     console.log("id: " + id);
        // },
        async todoDelete (id) {
            let confirm = window.confirm("消してもいいですか？");
            if (confirm) {
                await kdbDelete(this.db, "storeList", id);
                this.todoReload();
            };
        },
        async todoReload () {
            this.arrayTodo = await kdbFind(this.db, "storeList", () => true);
        },

        // open (candidates) {
        //     let candidateKeys = [];
        //     candidates.forEach((cand) => {
        //         candidateKeys.push(cand.key);
        //     });
        //     this.candidatesText = candidateKeys.join("\n");
        //     this.showModal = true;
        // },
        // close (event) {
        //     event.preventDefault();
        //     this.showModal = false;
        // },
        // submit (event) {
        //     event.preventDefault();
        //     if (this.candidatesText.trim().length === 0) {
        //         return;
        //     }
        //     this.$root.setCandidates(this.candidatesText);
        //     this.showModal = false;
        // },
    },
};

window.onload = function () {
    const app = Vue.createApp(FooApp);
    app.mount('#app');
};
