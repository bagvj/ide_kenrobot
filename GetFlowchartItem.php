<?php

// echo phpinfo();
require "DB.php";
require "Constants.php";

$db=new DB("www_kenrobot_db");

$arrReturn=array();
$arrFields=array("*");
$arrConds=array(
	'is_delete = ' => 0,
);
// 控制器信息
$arrController=array();
$ret=$db->select("ken_controller", $arrFields, $arrConds);
foreach ($ret as $key => $value) {
	$arrHardware=array();
	$arrHardware['id']=$value['id'];
	$arrHardware['name']=$value['name_en'];
	$arrHardware['name_cn']=$value['name_cn'];
	$arrHardware['type']=Constants::$controllerType[$value['type']];
	$arrHardware['desc']=$value['info'];
	$arrHardware['kind']="hardware";
	$arrHardware['isController']="1";
	$arrHardware['category']=Constants::$ruleCategory[0];

	$arrPoints=array();
	for($i=0;$i<8;$i++){
		$position=$value["port_position_".($i+1)];
		$arrPosition=explode(",",$position);
		foreach ($arrPosition as $k => &$v) {
			$v=floatval($v);
		}
		$portName=$value["port_name_".($i+1)];
		$portBit=$value["port_bit_".($i+1)];
		$arrPoints[]=array(
			"position"=>$arrPosition,
			"source"=>true,
			"target"=>false,
			"port"=>$portName,
			"bit"=>$portBit,
			"color"=>"#333",
			"shape"=>"Dot",
		);
	}
	$arrHardware['points']=$arrPoints;

	$arrController[]=$arrHardware;
}
$arrReturn['controller']=$arrController;

// 规则信息
$arrAppends=array(
	'group by name_en',
	'order by category',
);
$arrRule=array();
$ret=$db->select("ken_rule", $arrFields, $arrConds, $arrAppends);
foreach ($ret as $key => $value) {
	$arrHardware=array();
	$arrHardware['cid']=$value['cid'];
	$arrHardware['name']=$value['name_en'];
	$arrHardware['name_cn']=$value['name_cn'];
	$arrHardware['type']=Constants::$ruleType[$value['type']];
	$arrHardware['desc']=$value['desc'];
	$arrHardware['kind']="hardware";
	$arrHardware['isController']="0";

	$arrHardware['port']=$value['link'];
	$arrHardware['bits']=$value['bits'];
	$arrHardware['needsPinboard']=$value['has_pinboard'];
	$arrHardware['needsDriveplate']=$value['has_driveplate'];
	$arrHardware['maxDriveplate']=$value['max_driveplate'];
	$arrHardware['func']=$value['func'];
	$arrHardware['func_desc']=$value['func_desc'];
	$arrHardware['set_title']=$value['set_title'];
	$arrHardware['set_init_value']=$value['set_init_value'];
	$arrHardware['set_value']=$value['set_value'];
	$arrHardware['category']=Constants::$ruleCategory[$value['category']];

	$arrPoints=array(
		array(
			"position"=>array(
				0.5,
				0.05,
				0,
				0,	
			),
			"source"=>false,
			"target"=>true,
			"color"=>"#FF8891",
			"shape"=>"Dot",
		)
	);
	$arrHardware['points']=$arrPoints;

	$arrRule[]=$arrHardware;
}
$arrReturn['rule']=$arrRule;

// 流程图
$arrFlowchart=array();
foreach ($ret as $key => $value) {
	$arrChartItem=array();
	$arrChartItem['name']=$value['name_en'];
	$arrChartItem['type']=Constants::$ruleType[$value['type']];
	$arrChartItem['kind']="flowchart";
	$arrChartItem['init_func']=$value['init_func'];
	$arrChartItem['init_func_desc']=$value['init_func_desc'];
	$arrChartItem['func']=$value['func'];
	$arrChartItem['func_desc']=$value['func_desc'];
	$arrChartItem['textHide']=true;

	$arrPoints=array(
		array(
			"position"=>"TopCenter",
			"source"=>false,
			"target"=>true,
			"color"=>"#FF8891",
			"shape"=>"Dot",
		),
		array(
			"position"=>"BottomCenter",
			"source"=>true,
			"target"=>false,
			"color"=>"#FF0",
			"shape"=>"Dot",
		),
	);
	$arrChartItem['points']=$arrPoints;

	$arrFlowchart[]=$arrChartItem;
}
$arrReturn['flowchart']=$arrFlowchart;

echo json_encode($arrReturn,true);