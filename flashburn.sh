#!/bin/bash
export PATH=/usr/local/avrtools/bin:$PATH
if [ $# -ne 1 ];then
    exit 1
fi
STAMP=$1
SOURCE=/tmp/$STAMP/CSource.hex
scp $SOURCE pi@192.168.3.200:/home/pi/Documents/Rosys/
ssh root@192.168.3.200 "/usr/bin/avrdude -p m128 -c usbasp -e -U flash:w:/home/pi/Documents/Rosys/CSource.hex"
if [ $? -ne 0 ];then
        exit 2
fi
exit 0
