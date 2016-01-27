#!/bin/bash
#export PATH=/usr/local/avrtools/bin:$PATH
if [ $# -ne 2 ];then
	echo "参数个数必须为2"
    exit 1
fi

#参数：
#	1.项目目录
#	2.主板类型

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

#当前目录
DIR=`pwd`

#进入项目目录
cd ${PROJECT_PATH};

#如果src文件夹不存在，则创建
if [ ! -d "src" ]; then
  mkdir src
fi

#lib同理src
if [ ! -d "lib" ]; then
  mkdir lib
fi

#把.ino源代码文件复制(移动)到src下
cp *.ino src/
# mv *.ino src/

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
#回到之前的目录
cd ${DIR}

exit 0
