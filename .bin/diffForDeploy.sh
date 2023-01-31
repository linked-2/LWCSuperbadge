# How to use
# From the Project folder, run the script.
# Pass the git branch that you would like to deploy.
# The deploy branch will be compared to the master branch and 
#   the files that have been added, changed and renamed will be 
#   deployed to the target org
#!/bin/sh
# The Current time in UTC which will be used in the name of our saved branch
eDateTime=$(date -u +"%Y%m%d_%T")
# The name of the branch we are deploying
deployBranch=$1
# The org we are deploying
deployOrg=$2
# Change the branch to be origin/$deployBranch so that it always gets the right commit
echo Variable values
echo eDateTime $eDateTime
echo deployBranch $deployBranch
echo deployOrg $deployOrg
rm -f -- deployFile.txt
rm -f -R force-app
git diff --name-only --diff-filter=ACRM master..$deployBranch --output=.bin/deployFile.txt
while read p; do
  git checkout $deployBranch $p
done < .bin/deployFile.txt
cleanTime=${eDateTime// /-}
branchName="$deployBranch=>$deployOrg-$cleanTime"
cleanTime=${eDateTime// /-}
echo branchName $branchName

echo cleanTime $cleanTime