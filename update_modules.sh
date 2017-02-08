#!/bin/sh

cd node_modules
for i in $(ls -d * | grep "^node-red-contrib-")
do
    echo ${i%%/}
    npm install $i
done
cd ..