#!/bin/bash

DIR=`pwd`

cd `dirname $0`

rm -rf pack
chmod 777 pack.crx pack.pem
chown root:root pack.crx pack.pem

#回到之前的目录
cd ${DIR}

exit 0
