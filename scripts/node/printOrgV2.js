const sfdx = require('sfdx-node');
const fs = require('fs');
const { nextTick } = require('process');
const { Console, clear } = require('console');
const { type } = require('os');
const manifestPath = './manifests/firstManifest.xml';
const typeMap = new Map();
let reportList = [];
let dashboardList = [];
let metaDataObjects = new Array();

let queryResultRecords = [];
let manifestOut = '<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">';
let typeStart = '\n  <types>';
let typeEnd = '\n  </types>';
let nameStart = '\n    <name>'
let nameEnd = '</name>'
let memberStart = '\n    <Members>';
let memberEnd = '</Members>';
let everything = '\n    <members>*</members>'
let manifestEnd = '\n  <version>53.0</version>\n</Package>'
async function getFolderMembers(){}
function getDescribeMetadata(){
    sfdx.force.mdapi.describemetadata({
            targetusername: 'lwcsuperbadge'
    })
    .then((data)=>{
        data.metadataObjects.forEach(element => {
            let  elementNode = '';
            if(element.xmlName != 'Report' && element.xmlName != 'Dashboard' && element.xmlName != 'CustomObject'){
                elementNode = typeStart +
                    everything +
                    nameStart + element.xmlName + nameEnd +
                    typeEnd;
            }
            manifestOut = manifestOut + elementNode;
        });
    }).then(()=>{
        console.log('calling the query');
        sfdx.force.data.soqlQuery({

            query: 'SELECT Id, Name, DeveloperName, Type, AccessType, IsReadonly,  ParentId, NamespacePrefix FROM Folder WHERE (DeveloperName!= null) ORDER BY Type',
            _quiet: false
        })
    
    .then(
        (folderResult)=>{
            console.log('in query result');
            folderResult.records.forEach(
                (x)=>{
                    if(x.Type == 'Report'){
                        reportList.push(x.DeveloperName);
                    }
                    if(x.Type == 'Dashboard'){
                        dashboardList.push(x.DeveloperName);
                    }
                }
            )
            typeMap.set('Report', reportList);
            typeMap.set('Dashboard', dashboardList);

    }).then(()=>{
        for (const [key] of typeMap) {
            if(typeMap.get(key).length > 0){
            console.log('The key is ==> ' + key);
            console.log('typeMap.get(key).length ==> ' + typeMap.get(key).length);
            let nodeElement = '';
            nodeElement = typeStart;
            for (let i = 0; i < typeMap.get(key).length; i++){
                console.log(' typeMap.get(key)[i] ==> ' +  typeMap.get(key)[i]);
                nodeElement = nodeElement + memberStart + typeMap.get(key)[i] + '/' + memberEnd;
                sfdx.force.mdapi.listmetadata({
                    metadatatype: key,
                    folder: typeMap.get(key)[i], 
                    _quiet: false
                }).then((data)=>{
                    console.log('running then');
                    if(data.length > 0){
                        console.log(JSON.stringify(data));
                        data.forEach((f)=>{
                            console.log('f.fullName ==> ' + f.fullName);
                            let aString = memberStart + f.fullName + memberEnd;
                            console.log('aString ==> ' + aString);
                            nodeElement = nodeElement + aString;
                            console.log('inside nodeElement ==> ' + nodeElement);
                        })
                        nodeElement = nodeElement + nameStart + key + nameEnd + typeEnd;
                        manifestOut = manifestOut + nodeElement;
                    }
                })
            }
            }
        }
    }).then(()=>{
        nodeElement = typeStart + '<Members>\n'  + '*' + '</Members>\n';
        sfdx.force.schema.sobjectList({
            sobjecttypecategory: 'standard', 
            quiet: false
        }).then((data)=>{
            let nodeElement = '';
            nodeElement = typeStart + everything ;
            data.forEach((x)=>{
                nodeElement = nodeElement + memberStart + x + memberEnd;
            })
            manifestOut = manifestOut + nodeElement + nameStart + 'CustomObject' + nameEnd + typeEnd + manifestEnd;
            fs.writeFile('sampleManifest.xml', manifestOut, (err)=>{
                if(err!= null){
                    console.log(err);
                }
            })
            console.log('Finished!');
        })
    })
    })
} // end of function

getDescribeMetadata();

    // then(()=>{

    //     manifestOut = manifestOut + manifestEnd;
    //     fs.writeFile('sampleManifest.xml', manifestOut, (err)=>{
    //         if(err!= null){
    //             console.log(err);
    //         }
    //     })
    //     console.log('ending');
    // })




// start to build the map

// sfdx.force.mdapi.describemetadata({
//     targetusername: 'lwcsuperbadge'
// })
// .then(
//     (data)=>{
//         data.metadataObjects.forEach(
//             (x)=>{
//                 typeMap.set(x.xmlName, []);             
//             }
//         )
//         let keyNum = 0;
//         for (const key of typeMap.keys()) {
//             manifestOut = manifestOut + typeStart;
//             if(typeMap.get(key).length == 0){
//                 manifestOut = manifestOut +'\n        <members>*</members>';
//             }else{
//                 let tempArray = typeMap.get(key);
//                 tempArray.forEach((x)=>{
//                     if(x    != 'ManagedContentTypeBundle'){
//                         manifestOut = manifestOut + '    <members>' + typeMap.get(key)[x] + '</members>';
//                     }
//                 })
//             }   

//             manifestOut = manifestOut + nameEnd1 + key + nameEnd2 + typeEnd;
//             keyNum++;

//             if(keyNum == typeMap.size){
//                 manifestOut = manifestOut + manifestEnd;
//                 fs.writeFile('sampleManifest.xml', manifestOut, (err)=>{
//                     if(err!= null){
//                         console.log(err);
//                     }
//                 })
//             }
//         }
//     }
// )


        // console.log('calling the query');
        // sfdx.force.data.soqlQuery({

        //     query: 'SELECT Id, Name, DeveloperName, Type, AccessType, IsReadonly,  ParentId, NamespacePrefix FROM Folder WHERE (DeveloperName!= null) ORDER BY Type',
        //     _quiet: false
        // }).then(
        //     (queryResult)=>{
        //         queryResult.records.forEach(
        //             (x)=>{
        //                 console.log(' DeveloperName ==> ', x.DeveloperName, ' x.Type ==> ', x.Type);
        //             }
        //         )
        //     }
        // )
        // .then(
        //     console.log('This works')
        // )
        // (folderResult)=>{
        //     if(x.Type == 'Report' || x.Type == 'Dashboard'){ 
        //         sfdx.force.mdapi.listmetadata({
        //             metadatatype: x.Type,
        //             folder: x.DeveloperName, 
        //             _quiet: false
        // }
        // .then(
        //         console.log('one folder info ==> ', x )
        //         folderResult.forEach((y)=>{
        //             console.log('here is y ==> ' + y)
        //             // if(typeMap.has(y.type)){
        //             //     let temp = typeMap.get(y.type);
        //             //     typeMap.set(y.type, [...temp, y.fullName ]);
        //             // } else {
        //             //     typeMap.set(y.type, [y.fullName]);
        //             // }
        //     })
        // )