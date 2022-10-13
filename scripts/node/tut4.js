let xhttp = new XMLHttpRequest();
const sfdx = require('sfdx-node');
let  XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function get(){
    return new Promise((resolve, reject)=>{
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.onload = ()=>{
            if(xhttp.status == 200){
                resolve(JSON.parse(xhttp.response));
            }else{
                reject(xhttp.statusText);
            }
        };
        xhttp.onerror = ()=>{
            reject(xhttp.statusText);
        };
        xhttp.send();
    });
};
let promise = get("data/tweets.json");
promise.then((tweets)=>{
    console.log(tweets);
});
