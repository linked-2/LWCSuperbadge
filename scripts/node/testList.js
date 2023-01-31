
const sfdx = require('sfdx-node');
sfdx.force.schema.sobjectList({
    sobjecttypecategory: 'standard', 
    quiet: false
}).then((data)=>{
    data.forEach((x)=>{
        console.log(x);
    })
})

        //reportList loop here
        for (const [key] of typeMap) {
            let nodeElement = '';
            nodeElement = typeStart + nameStart + key + nameEnd;
            for(const v of typeMap.get(key)){
                if(typeMap.get(key).length > 0){
                    sfdx.force.mdapi.listmetadata({
                        metadatatype: key,
                        folder: v, 
                        _quiet: false
                    }).then((data)=>{
                        console.log(JSON.stringify(data));
                            data.forEach((f)=>{
                                nodeElement = nodeElement + nameStart + f + nameEnd;
                            })
                    }   
                    nodeElement = nodeElement + typeEnd;
                    manifestOut = manifestOut + nodeElement;
                }
                //This code should be restuctured

            }