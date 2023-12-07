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

const EditForm = {
    data () {
        return {
            showModal: false,
            id: null,
            name: "",
            done: "0",
        };
    },
    methods : {
        open (item) {
            if (item) {
                this.id = item.id;
                this.name = item.name;
                this.done = String(item.done);
            } else {
                this.id = 0;
                this.name = "";
                this.done = "0";
            }
            this.showModal = true;
        },
        close (event) {
            event.preventDefault();
            this.showModal = false;
        },
        async submit (event) {
            event.preventDefault();
            if (this.id === 0) {
                console.log("追加");
                await kdbAdd(this.$parent.db, "storeList", {name:this.name, done:Number(this.done)});
            } else {
                console.log("更新");
                await kdbPut(this.$parent.db, "storeList", {name:this.name, done:Number(this.done), id:this.id});
            }
            this.showModal = false;
            this.$parent.todoReload();
        },
    },
    template: `
<div class="modal-overlay" v-show="showModal">
  <div class="modal-content">
    <form>
        <div>
            名前:
            <input type="text" v-model="name">
        </div>
        <div>
            対応済み:
            <label><input type="radio" v-model="done" value="1">はい</label>
            <label><input type="radio" v-model="done" value="0" checked>いいえ</label>
        </div>
        <div>
            <button type="button" v-on:click="submit">送信</button>
            <button type="button" v-on:click="close">キャンセル</button>
        </div>
    </form>
  </div>
</div>
`
};

const TodoApp = {
    data () {
        return {
            db: null,
            arrayTodo: [],
            // message : "",
        };
    },
    async mounted () {
        // this.message = "hello";
        this.db = await openTodoDb();
        this.todoReload();
    },
    methods : {
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
    },
    components: {
        EditForm,
    }
};

window.onload = function () {
    const app = Vue.createApp(TodoApp);
    app.mount('#app');
};
