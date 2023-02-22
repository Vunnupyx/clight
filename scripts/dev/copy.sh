#!/bin/bash

# Script to setup dev environment on a remote IOT2050
#
# IOT2050 requirements:
# Current COS version is installed
# Deployment "medclight-dev" installed on IOT2050
# SSH public key places in ~/authorized_keys on IOT2050
#
# Local requirements:
#
# tar, ssh, scp is installed
# SSH config set inside ~/.ssh/config (locally) for IOT2050
# IOT2050_HOST set in .env file

# $1: Force reinstall node_modules

force_reinstallation=${1:-"false"}    

echo "Checking for node_modules"

remote_path="/mnt/docker/mdclightdev"
remote_path_app="$remote_path/app"
remote_path_runtime_files="$remote_path/runtime-files"
remote_path_node_modules="$remote_path_app/node_modules"


ssh $IOT2050_HOST "mkdir -p $remote_path"
ssh $IOT2050_HOST "mkdir -p $remote_path_app"
ssh $IOT2050_HOST "mkdir -p $remote_path_runtime_files"

nodeModulesExist="false"
if ssh $IOT2050_HOST "[ -d $remote_path_node_modules ]"; then 
    echo 'node_modules already installed. Use "yarn copy-dev-all to force reinstallation"'
    nodeModulesExist="true";
else 
    echo 'node_modules not installed. Installing...'
fi
 
if [ "$force_reinstallation" == "true" ] || [ "$nodeModulesExist" == "false" ]
then
    echo "Transfer node_modules"
    ssh $IOT2050_HOST "rm -rf $remote_path_node_modules"
    node_modules_archive="node_modules.tar.gz"
    tar -zcf $node_modules_archive node_modules 
    scp $node_modules_archive $IOT2050_HOST:$remote_path_app 
    ssh $IOT2050_HOST "tar -xf $remote_path_app/$node_modules_archive -C $remote_path_app"
    ssh $IOT2050_HOST "rm $remote_path_app/$node_modules_archive"
    rm $node_modules_archive
    echo "node_modules transfered!"
else 
    echo "Skipping transfer node_modules"
fi

echo "Transfering build files"
build_files_archive="build_files.tar.gz"
pushd build/main
tar -zcf $build_files_archive common modules index.js
popd
scp build/main/$build_files_archive $IOT2050_HOST:$remote_path_app 
ssh $IOT2050_HOST "tar -xf $remote_path_app/$build_files_archive -C $remote_path_app"
ssh $IOT2050_HOST "rm $remote_path_app/$build_files_archive"
rm build/main/$build_files_archive
echo "build_files transfered!"

echo "Transfering runtime files"
runtime_files_archive="runtime_files.tar.gz"
pushd _mdclight/runtime-files
tar -zcf $runtime_files_archive opcua-node-sets templates terms
popd
scp _mdclight/runtime-files/$runtime_files_archive $IOT2050_HOST:$remote_path_runtime_files 
ssh $IOT2050_HOST "tar -xf $remote_path_runtime_files/$runtime_files_archive -C $remote_path_runtime_files"
ssh $IOT2050_HOST "rm $remote_path_runtime_files/$runtime_files_archive"
rm _mdclight/runtime-files/$runtime_files_archive
echo "runtime files transfered!"

echo "Restarting mdclight-dev!"
ssh $IOT2050_HOST "docker restart mdclight-dev"
echo "Restarted mdclight-dev!"
echo "Restarting mdc-web-server!"
ssh $IOT2050_HOST "docker restart mdc-web-server"
echo "Restarted mdc-web-server!"

echo 'Use "yarn log-dev" to see logs!'

