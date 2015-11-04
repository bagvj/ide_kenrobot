#!/bin/bash
if [ $# -ne 2 ];then
    exit 1
fi
PROJECTNAME=$1
STAMP=$2
SOURCE=/tmp/build$STAMP$PROJECTNAME.tmp/$PROJECTNAME.hex
scp $SOURCE pi@192.168.3.200:/home/pi/Documents/Rosys/
ssh root@192.168.3.200 "/usr/bin/avrdude -p m128 -c usbasp -e -U flash:w:/home/pi/Documents/Rosys/$PROJECTNAME.hex"
if [ $? -ne 0 ];then
        exit 2
fi
exit 0
