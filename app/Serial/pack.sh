#!/bin/bash

DIR=`pwd`

cd `dirname $0`

if [ -d "pack" ]; then
	rm -rf pack
	mkdir pack
fi
cp -R css images js index.html manifest.json pack/

#回到之前的目录
cd ${DIR}

exit 0
