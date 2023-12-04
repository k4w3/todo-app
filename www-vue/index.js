const FooApp = {
    data () {
        return {
            message : "",
        };
//         return {
// //            candidates : [],
//             candidates : [{key:"Candidate1",nominate:true},
//                           {key:"Candidate2",nominate:true},
//                           {key:"Candidate3",nominate:true}],
//             selection : "",
//             running : false,
//         };
    },
    mounted () {
        this.message = "hello";
        console.log("mounted");
    },
};

window.onload = function () {
    console.log("kameyama");

    const app = Vue.createApp(FooApp);
    app.mount('#app');
};
