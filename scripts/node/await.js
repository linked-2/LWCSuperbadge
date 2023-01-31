import printOrgV2 from "./printOrgV2.js";
function testAsync(){
    return new Promise((resolve,reject)=>{
        //here our function should be implemented
        //printOrgV2(); 
        setTimeout(()=>{
            console.log("Hello from inside the testAsync function");
            resolve();
        ;} , 5000
        );
    });
}

async function callerFun(){
    console.log("Caller");
    await testAsync();
    console.log("After waiting");
}

callerFun();