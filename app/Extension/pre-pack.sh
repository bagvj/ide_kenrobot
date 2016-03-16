#!/bin/bash

DIR=`pwd`

cd `dirname $0`

rm -rf pack.crx pack.pem pack

r.js -o build.js

cp ../kenrobot-ext.pem ./pack.pem

cd pack
rm -rf build.* *.rb *.sh update.xml css/*.scss .sass-cache .git*

#回到之前的目录
cd ${DIR}

exit 0
