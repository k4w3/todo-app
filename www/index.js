function get1() {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", "/get1");
        req.onload = (event) => {
            resolve(req.responseText);
        };
        req.send();
    });
};

window.onload = () => {
    // document.querySelector(".hoge").innerHTML="kameyama";

    document.querySelector(".sendbutton").addEventListener("click", (e) => {
        e.preventDefault();
        // console.log("hahahaha");
        get1()
        .then ((text) => {
            console.log(text);
        })
    });

};