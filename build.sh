#!/bin/bash
export PATH=/usr/local/avrtools/bin:$PATH
echo $#
if [ $# -ne 1 ];then
    exit 1
fi
STAMP=$1
SOURCE=/tmp/$STAMP/CSource.c
SOURCEPATH=/tmp/$STAMP/
DATAHEADER=/alidata/server/avr/

cp $DATAHEADER/* $SOURCEPATH
cd $SOURCEPATH
make
if [ $? -ne 0 ];then
	exit 2
fi
exit 0
