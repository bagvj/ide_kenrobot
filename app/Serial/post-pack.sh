#!/bin/bash

DIR=`pwd`

cd `dirname $0`

rm -rf pack pack.pem
chmod 755 pack.crx
chown root:root pack.crx
mv pack.crx ../../public/download/serial-debugger.crx

#回到之前的目录
cd ${DIR}

exit 0
