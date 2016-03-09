#!/bin/bash

DIR=`pwd`

cd `dirname $0`

if [ -d "pack" ]; then
	rm -rf pack
fi
mkdir pack

rm -rf pack.pem
cp -R css images js index.html manifest.json pack/

#回到之前的目录
cd ${DIR}

exit 0
