const sfdx = require('sfdx-node');
const fs = require('fs');
const { nextTick } = require('process');
const { Console } = require('console');
const { type } = require('os');
const manifestPath = './manifests/firstManifest.xml';
const typeMap = new Map();

let queryResultRecords = [];

let topLine = '<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\"> \n';
let bottomLine = '    <version>53.0</version>\n</Package>';
let typeBegin = '  <types>';
let typeEnd = '    </types>';
let wildCardType = '*';
let emptyArray = [];
let sampleType = 'CustomObject';

let sampleFile = topLine + bottomLine;

function createNode(type, members){
    new Promise((resolve, reject)=>{
    console.log('running createTypeNode');
    let returnee = '    <types>';
    if(members.length < 1){
        returnee = returnee +'\n        <members>*</members>'
    }else{
        members.forEach((x)=>{
            returnee = returnee + '    <members>' + members[x] + '</members>'
        })
    }
    returnee = returnee + '\n        <name>' + type + '</name>\n'+ '     </types>';
    resolve(returnee); 
  });
}




// The call that runs everything
createNode.then((theNode)=>{
    console.log('Inside returned promise ==>', theNode);
})





// function printOrg(){
//     console.log('entering printOrg');
//     createTypeNode(sampleType, emptyArray).then(function(result,reject){
//         console.log('Inside returned promise ==>', result);
//         // fs.writeFile('sampleFile.xml', result, function (err) {
//         //     if (err) {
//         //         // there was an error
//         //         console.log(err);
//         //     } else {
//         //         // data written successfully
//         //         console.log("file written successfully");
//         //     }
//         // });
//     })
// }