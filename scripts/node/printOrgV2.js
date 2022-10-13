const sfdx = require('sfdx-node');
const fs = require('fs');
const { nextTick } = require('process');
const { Console } = require('console');
const { type } = require('os');
const manifestPath = './manifests/firstManifest.xml';
const typeMap = new Map();

let queryResultRecords = [];
let manifestOut = '<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">';
let typeStart = '\n    <types>';
let typeEnd = '\n    </types>';
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
        for (const key of typeMap.keys()) {
            manifestOut = manifestOut + typeStart;
            if(typeMap.get(key).length == 0){
                manifestOut = manifestOut +'\n        <members>*</members>'
            }else{
                let tempArray = typeMap.get(key);
                typeMap.get(key).forEach((x)=>{
                manifestOut = manifestOut + '    <members>' + typeMap.get(key)[x] + '</members>'
            })
            manifestOut = manifestOut + typeEnd;
        }
      };
      manifestOut = manifestOut + '\n    <version>53.0</version> \n</Package>'
      fs.writeFile('sampleManifest.xml', manifestOut, (err)=>{
        if(err!= null){
            console.log(err);
        }
      })
});
