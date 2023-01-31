 (queryResult)=>{
                console.log('push queryresults onto queryResultRecords');
                queryResult.records.forEach((x)=>{
                    queryResultRecords.push(x);
                }
            }

            queryResultRecords.forEach((x)=>{
                console.log(' DeveloperName ==> ', x.DeveloperName, ' x.Type ==> ', x.Type);
                if(x.Type == 'Report' || x.Type == 'Dashboard'){ 
                    sfdx.force.mdapi.listmetadata({
                        metadatatype: x.Type,
                        folder: x.DeveloperName, 
                        _quiet: false
                    })
                .then((folderResult)=>{
                        console.log('one folder info ==> ', x );
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
            }