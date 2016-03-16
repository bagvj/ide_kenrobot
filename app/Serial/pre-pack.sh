#!/bin/bash

DIR=`pwd`

cd `dirname $0`

rm -rf pack.crx pack

r.js -o build.js

cd pack
rm -rf build.* *.rb *.sh update.xml css/*.scss .sass-cache .git* pack.pem

#回到之前的目录
cd ${DIR}

exit 0
