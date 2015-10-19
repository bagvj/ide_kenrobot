<?php

require "DB.php";
require "Constants.php";

$db=new DB("www_kenrobot_db");

$arrReturn=array();

// 通过元件名找到所有的元件连接规则
$arrFields=array(
	'cid',
	'link',
	'bits',
);
$arrConds=array(
	"name_en = "=>$_REQUEST['name'],
);

$ret=$db->select("ken_rule",$arrFields,$arrConds);

if($ret===false){
	exit(1);
}

//获取所有能够连接的控制器
$arrFields=array(
	"*"
);

foreach ($ret as $key => $value) {
	$tmpArrControllerRule=array();

	$link=$value['link'];
	$bits=$value['bits'];
	$needle='';
	for($i=0;$i<intval($bits);$i++){
		$needle.="1";
	}

	$arrConds=array(
		'id = '=>$value['cid'],
	);
	$conRet=$db->select("ken_controller",$arrFields,$arrConds);

	$tmpController=$conRet[0];
	$port_bit_1=$tmpController['port_bit_1'];
	$port_position_1=$tmpController['port_position_1'];
	$port_name_1=$tmpController['port_name_1'];
	$port_bit_2=$tmpController['port_bit_2'];
	$port_position_2=$tmpController['port_position_2'];
	$port_name_2=$tmpController['port_name_2'];
	$port_bit_3=$tmpController['port_bit_3'];
	$port_position_3=$tmpController['port_position_3'];
	$port_name_3=$tmpController['port_name_3'];
	$port_bit_4=$tmpController['port_bit_4'];
	$port_position_4=$tmpController['port_position_4'];
	$port_name_4=$tmpController['port_name_4'];
	$port_bit_5=$tmpController['port_bit_5'];
	$port_position_5=$tmpController['port_position_5'];
	$port_name_5=$tmpController['port_name_5'];
	$port_bit_6=$tmpController['port_bit_6'];
	$port_position_6=$tmpController['port_position_6'];
	$port_name_6=$tmpController['port_name_6'];
	$port_bit_7=$tmpController['port_bit_7'];
	$port_position_7=$tmpController['port_position_7'];
	$port_name_7=$tmpController['port_name_7'];
	$port_bit_8=$tmpController['port_bit_8'];
	$port_position_8=$tmpController['port_position_8'];
	$port_name_8=$tmpController['port_name_8'];

	// 端口信息确认
	if(strlen($link)!=strlen($port_bit_1.$port_bit_2.$port_bit_3.$port_bit_4.$port_bit_5.$port_bit_6.$port_bit_7.$port_bit_8)){
		continue;
	}

	// 将连线规则中位信息根据控制器连线规则进行匹配，link_bit_* 就是 port_bit_* 的规则
	$link_bit_1=substr($link, 0, strlen($port_bit_1));
	$link_bit_2=substr($link, strlen($port_bit_1), strlen($port_bit_2));
	$link_bit_3=substr($link, strlen($port_bit_1.$port_bit_2), strlen($port_bit_3));
	$link_bit_4=substr($link, strlen($port_bit_1.$port_bit_2.$port_bit_3), strlen($port_bit_4));
	$link_bit_5=substr($link, strlen($port_bit_1.$port_bit_2.$port_bit_3.$port_bit_4),strlen($port_bit_5));
	$link_bit_6=substr($link, strlen($port_bit_1.$port_bit_2.$port_bit_3.$port_bit_4.$port_bit_5),strlen($port_bit_6));
	$link_bit_7=substr($link, strlen($port_bit_1.$port_bit_3.$port_bit_3.$port_bit_4.$port_bit_5.$port_bit_6),strlen($port_bit_7));
	$link_bit_8=substr($link, strlen($port_bit_1.$port_bit_2.$port_bit_3.$port_bit_4.$port_bit_5.$port_bit_6.$port_bit_7),strlen($port_bit_8));

	for($i=1;$i<9;$i++){
		$tmpLinkBit="link_bit_$i";
		if(strpos($$tmpLinkBit, $needle)!==false){
			$portName="port_name_$i";
			$tmpArrControllerRule[]=array(
				'name'=>$$portName,
				'bits'=>$$tmpLinkBit,
			);
		}
	}
	$arrReturn[$value['cid']]=$tmpArrControllerRule;
}

echo json_encode($arrReturn,true);
