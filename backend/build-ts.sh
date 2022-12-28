#!/bin/bash

# building project
echo "Installing node_modules"
npm install

echo "Building TS"
tsc

# removing layers directory
echo "Removing old node-modules-layer and common-layer directories"
rm -rf common-layer
rm -rf node-modules-layer

# copying node_modules and common to specified folders
echo "Copying layer data to common-layer/nodejs"
mkdir common-layer
mkdir common-layer/nodejs
cp -r ./dist/common/* ./common-layer/nodejs/

echo "Copying layer data to node-modules-layer/nodejs"
mkdir node-modules-layer
mkdir node-modules-layer/nodejs

cp -r ./node_modules ./node-modules-layer/nodejs/

echo "Build Successful"
echo "Run terraform apply in ./infrastructure folder"