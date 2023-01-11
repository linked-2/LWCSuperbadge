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
            if(element.xmlName != 'Report' && element.xmlName != 'Dashboard' && element.xmlName != 'CustomObject'
            && element.xmlName != 'EventRelayConfig' && element.xmlName != 'DigitalExperienceBundle' && element.xmlName != 'ExternalCredential'
                ){
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
                let nodeElement = '';
                nodeElement = typeStart;
                for (let i = 0; i < typeMap.get(key).length; i++){
                    nodeElement = nodeElement + memberStart + typeMap.get(key)[i] + '/' + memberEnd;
                    sfdx.force.mdapi.listmetadata({
                        metadatatype: key,
                        folder: typeMap.get(key)[i], 
                        _quiet: false
                    }).then((data)=>{
                        if(data.length > 0){
                            data.forEach((f)=>{
                                nodeElement = nodeElement + memberStart + f.fullName + memberEnd;
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
                if(x == 'ExternalCredential'){
                    console.log('found credential');
                }
                if(x != 'ExternalCredential'){
                    nodeElement = nodeElement + memberStart + x + memberEnd;
                }
            })
            manifestOut = manifestOut + nodeElement + nameStart + 'CustomObject' + nameEnd + typeEnd + manifestEnd;
            fs.writeFile('manifests/orgPrint.xml', manifestOut, (err)=>{
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
