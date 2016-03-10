#!/bin/bash

DIR=`pwd`

cd `dirname $0`

rm -rf pack pack.pem
chmod 755 pack.crx
chown root:root pack.crx
mv pack.crx serial-debugger.crx
zip serial-debugger.zip serial-debugger.crx
rm -rf serial-debugger.crx
mv serial-debugger.zip ../../public/download/

#回到之前的目录
cd ${DIR}

exit 0
