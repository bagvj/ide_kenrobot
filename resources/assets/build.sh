#!/bin/bash

DIR=`pwd`

PACK="../../public/test"

cd `dirname $0`

rm -rf ${PACK}

r.js -o build.js

cd ${PACK}
rm -rf build.* *.rb *.sh css/*.scss .sass-cache

#回到之前的目录
cd ${DIR}

exit 0