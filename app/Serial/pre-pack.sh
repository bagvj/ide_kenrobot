#!/bin/bash

DIR=`pwd`

cd `dirname $0`

rm -rf pack.pem pack.crx pack
mkdir pack

r.js -o build.js
rm -rf pack/js/build.txt

cp -R css images *.html manifest.json pack/
cp -R js/lib pack/js/lib

#回到之前的目录
cd ${DIR}

exit 0
