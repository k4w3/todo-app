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

window.onload = () => {
    // document.querySelector(".hoge").innerHTML="kameyama";

    document.querySelector(".sendbutton").addEventListener("click", (event) => {
        event.preventDefault();
        // console.log("hahahaha");
        selectTList()
        .then ((text) => {
            console.log(text);
        })
    });

};