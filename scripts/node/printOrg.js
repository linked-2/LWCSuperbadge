
const sfdx = require('sfdx-node');
const fs = require('fs');
const { nextTick } = require('process');
const { Console } = require('console');
const { type } = require('os');
const manifestPath = './manifests/firstManifest.xml';
const typeMap = new Map();

let queryResultRecords = [];
let manifestOut = '<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">';

// start to build the map
sfdx.force.mdapi.describemetadata({
    targetusername: 'lwcsuperbadge'
})
.then(
    (data)=>{
        data.metadataObjects.forEach(
            (x)=>{
                typeMap.set(x.xmlName, []);
            }
        )
        console.log('calling the query');
        sfdx.force.data.soqlQuery({
            query: 'SELECT Id, Name, DeveloperName, Type, AccessType, IsReadonly,  ParentId, NamespacePrefix FROM Folder WHERE DeveloperName!= null ORDER BY Type',
            _quiet: false
        })
        .then((queryResult)=>{
            console.log('push queryresults onto queryResultRecords');
            queryResult.records.forEach((x)=>{
                queryResultRecords.push(x);
            })
            queryResultRecords.forEach((x)=>{
                if(x.Type != 'Insights' && x.Type != 'Email'){ 
                    sfdx.force.mdapi.listmetadata({
                        metadatatype: x.Type,
                        folder: x.DeveloperName, 
                        _quiet: false
                    }).then((folderResult)=>{
                        console.log('doing something with one folder result');
                        folderResult.forEach((y)=>{
                            if(typeMap.has(y.type)){
                                let temp = typeMap.get(y.type);
                                typeMap.set(y.type, [...temp, y.fullName ]);
                            } else {
                                typeMap.set(y.type, [y.fullName]);
                            }
                        });
                    })
                }
            });
        }) 
})
