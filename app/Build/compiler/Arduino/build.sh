#!/bin/bash
#export PATH=/usr/local/avrtools/bin:$PATH
if [ $# -ne 3 ];then
	echo "参数个数必须为3"
    exit 1
fi

#参数：
#   1.项目名字
#	2.项目目录
#	3.主板类型

if [ ! -d "$1" ]; then
	echo "文件夹\"$1\"不存在"
	exit 2
fi

#MAKE路径
MAKE_PATH=/usr/bin/make

#项目目录
PROJECT_PATH=$1
#主板类型
BOARD_TYPE=$2
#项目名字
PROJECT_NAME=$3

#当前目录
DIR=`pwd`

#进入项目目录
cd ${PROJECT_PATH};

echo -n ${PROJECT_NAME}>.project

#如果src文件夹不存在，则创建
if [ ! -d "src" ]; then
  mkdir src
fi

#lib同理src
if [ ! -d "lib" ]; then
  mkdir lib
fi

#把.ino源代码文件复制(移动)到src下
# cp *.ino src/
mv *.ino src/

#开始编译
ino build -m ${BOARD_TYPE} --make ${MAKE_PATH}

#编译出错
if [ $? -ne 0 ]; then
	echo "编译出错"
	#回到之前的目录
	cd ${DIR}
	exit 3
fi

#编译成功
echo "编译成功"

#复制文件
cp .build/${BOARD_TYPE}/firmware.hex .build/${BOARD_TYPE}/${PROJECT_NAME}.hex
cp src/main.ino ./${PROJECT_NAME}.ino

#打包
zip -j build.zip ${PROJECT_NAME}.ino .build/${BOARD_TYPE}/${PROJECT_NAME}.hex
mv .build/${BOARD_TYPE}/${PROJECT_NAME}.hex ./build.hex

#如果eep存在
if [ -f ".build/${BOARD_TYPE}/firmware.eep" ]; then
	cp .build/${BOARD_TYPE}/firmware.eep .build/${BOARD_TYPE}/${PROJECT_NAME}.eep
	zip -j build.zip .build/${BOARD_TYPE}/${PROJECT_NAME}.eep
	mv .build/${BOARD_TYPE}/${PROJECT_NAME}.eep ./build.eep
fi

#回到之前的目录
cd ${DIR}

exit 0
