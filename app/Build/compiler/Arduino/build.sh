#!/bin/bash
#export PATH=/usr/local/avrtools/bin:$PATH
if [ $# -ne 2 ];then
    exit 1
fi

AVRBINPATH=/usr/local/avrtools/bin/
PROJECTNAME=$1
STAMP=$2
SOURCEPATH=/tmp/"build"${STAMP}${PROJECTNAME}".tmp"/
SOURCECPP=${SOURCEPATH}/${PROJECTNAME}".cpp"
HEADERPATH=`dirname $(pwd)/${0}` #`pwd`

${AVRBINPATH}/avr-g++ -c -g -Wall -Os -mmcu=atmega128 -I${HEADERPATH} -o ${SOURCEPATH}/${PROJECTNAME}.o ${SOURCEPATH}/${PROJECTNAME}.cpp 

if [ $? -ne 0 ];then
	exit 2
fi

${AVRBINPATH}/avr-g++ -g -Wall -Os -mmcu=atmega128 -I${HEADERPATH} -o ${SOURCEPATH}/${PROJECTNAME}.elf ${HEADERPATH}/Rosys.cpp ${SOURCEPATH}/${PROJECTNAME}.o ${HEADERPATH}/main.o

if [ $? -ne 0 ];then
	exit 3
fi

${AVRBINPATH}/avr-objdump -h -S ${SOURCEPATH}/${PROJECTNAME}.elf  > ${SOURCEPATH}/${PROJECTNAME}.lst

if [ $? -ne 0 ];then
	exit 4
fi

${AVRBINPATH}/avr-objcopy -j .text -j .data -O ihex ${SOURCEPATH}/${PROJECTNAME}.elf ${SOURCEPATH}/${PROJECTNAME}.hex

if [ $? -ne 0 ];then
	exit 5
fi

exit 0
