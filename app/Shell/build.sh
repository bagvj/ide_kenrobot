#!/bin/bash
#export PATH=/usr/bin:$PATH
export PLATFORMIO_LIB_DIR=/home/arduino/libraries

if [ $# -ne 3 ];then
	echo "参数个数必须为3"
    exit 1
fi

#参数：
#	1.项目目录
#	2.主板类型
#   3.项目名字
if [ ! -d "$1" ]; then
	echo "文件夹\"$1\"不存在"
	exit 2
fi

#项目目录
PROJECT_PATH=$1
#主板类型
BOARD_TYPE=$2
#项目名字
PROJECT_NAME=$3
#当前目录
DIR=`pwd`

#进入项目目录
cd ${PROJECT_PATH}

rm -rf build.*
echo "初始化"
echo y | platformio init --board ${BOARD_TYPE} 1>build.log

#把.ino源代码文件复制(移动)到src下
# cp *.ino src/
if [ -f main.ino ]; then
	mv main.ino src/
fi

#开始编译
echo "开始编译"
platformio run -v -e ${BOARD_TYPE}

#编译出错
if [ $? -ne 0 ]; then
	echo "编译失败"
	#回到之前的目录
	cd ${DIR}
	exit 3
fi

#编译成功
echo
echo "编译成功"

#复制文件
cp .pioenvs/${BOARD_TYPE}/firmware.hex build.hex

#开始打包
cp src/main.ino ./${PROJECT_NAME}.ino
cp .pioenvs/${BOARD_TYPE}/firmware.hex ${PROJECT_NAME}.hex

#如果eep存在
if [ -f ".pioenvs/${BOARD_TYPE}/firmware.eep" ]; then
	cp .pioenvs/${BOARD_TYPE}/firmware.eep ${PROJECT_NAME}.eep
fi
zip build.zip ${PROJECT_NAME}.*
rm -rf ${PROJECT_NAME}.*

#记录编译信息
echo ${PROJECT_NAME}>>build.info
echo `date`>>build.info

#回到之前的目录
cd ${DIR}

exit 0
