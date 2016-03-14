#!/bin/bash

DIR=`pwd`

cd `dirname $0`

rm -rf pack.pem pack.crx pack
mkdir pack

cp -R css images js *.html manifest.json pack/

#回到之前的目录
cd ${DIR}

exit 0
