#!/bin/sh
# How to use
# Run this script from the root dir of your project to create a new sratch org.
# Replace 'org_alias' with the name you want to give to your scratch org.
orgAlias=$1

echo "Creating a scratch org with alias $orgAlias"
sfdx force:org:create --wait 30 --durationdays 15 -f config/project-scratch-def.json -a $orgAlias

echo "Deploying ./force-app/main" 
sfdx force:source:deploy -p ./force-app/main -u $orgAlias 

echo "Deploying ./force-app/unnpackagedProfiles" 
sfdx force:source:deploy -p ./force-app/unpackagedProfiles -u $orgAlias 

echo "Deploying ./force-app/unnpackagedEmail" 
sfdx force:source:deploy -p ./force-app/unpackagedEmail -u $orgAlias 

echo assigning Permission Set
sfdx force:user:permset:assign -n MoOSysAdmin -u $orgAlias

echo Loading test data
sfdx sfdmu:run --sourceusername csvfile -p ./data/ -u $orgAlias

echo "********"
echo "Setting the default org"
sfdx force:config:set defaultusername=$orgAlias





