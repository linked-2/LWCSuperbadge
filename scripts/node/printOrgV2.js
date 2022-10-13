const sfdx = require('sfdx-node');
const fs = require('fs');
const { nextTick } = require('process');
const { Console, clear } = require('console');
const { type } = require('os');
const manifestPath = './manifests/firstManifest.xml';
const typeMap = new Map();

let queryResultRecords = [];
let manifestOut = '<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">';
let typeStart = '\n    <types>';
let typeEnd = '\n    </types>';
let nameEnd1 = '\n        <name>'
let nameEnd2 = '</name>'
let manifestEnd = '\n    <version>53.0</version>\n</Package>'
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
        let keyNum = 0;
        for (const key of typeMap.keys()) {
            manifestOut = manifestOut + typeStart;
            if(typeMap.get(key).length == 0){
                manifestOut = manifestOut +'\n        <members>*</members>';
            }else{
                let tempArray = typeMap.get(key);
                tempArray.forEach((x)=>{
                    console.log('doing this');
                })
            }   

            manifestOut = manifestOut + nameEnd1 + key + nameEnd2 + typeEnd;
            keyNum++;

            if(keyNum == typeMap.size){
                manifestOut = manifestOut + manifestEnd;
                fs.writeFile('sampleManifest.xml', manifestOut, (err)=>{
                    if(err!= null){
                        console.log(err);
                    }
                })
            }
        }
    }
)


             // manifestOut = manifestOut + typeEnd
            // manifestOut = manifestOut + typeEnd + '\n    <version>55.0</version> \n</Package>'
            // let tempArray = typeMap.get(key);
            // typeMap.get(key).forEach((x)=>{
            //     manifestOut = manifestOut + '    <members>' + typeMap.get(key)[x] + '</members>';
            // }   
            //manifestOut = manifestOut + nameEnd1 + key + nameEnd2;


            // ``          typeMap.get(key).forEach((x)=>{
            //     manifestOut = manifestOut + '    <members>' + typeMap.get(key)[x] + '</members>';