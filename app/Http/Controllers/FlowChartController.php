<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Robot\FlowChart;
use App\Robot\Constants;
use App\Robot\Components;
use App\Robot\ConnectRule;
use DB;

class FlowChartController extends Controller
{
   
    public function info()
    {
        $flowchartList = FlowChart::all(['id', 'pid', 'type', 'info']);
        $map = [
            1 => 'hardware',
            2 => 'flowchart',
            3 => 'canvas',
            4 => 'code',
        ];
        foreach ($flowchartList as $k => $flowchart) {
            $flowchartList[$k][$map[$flowchart->type]] = json_decode($flowchart->info,true);
        }

        return $flowchartList->toJson();
    }

    /**
     * GetFlowChartItem
     */
    public function item()
    {
        $arrReturn = array();

        $arrController = Components::where('is_delete',0)->get();

        //获取controler
        foreach ($arrController as $key => $value) {
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
        $arrReturn['controller'] = $arrController;


        //获取规则信息

        $ruleData = DB::table('ken_rule')
                            ->orderBy('category')
                            ->groupBy('name_en')
                            ->get();
        //dd($ruleData);
        foreach ($ruleData as $key => $value) {
            $value = collect($value);
            $arrHardware=array();
            $arrHardware['cid']=$value['cid'];
            $arrHardware['name']=$value['name_en'];
            $arrHardware['name_cn']=$value['name_cn'];
            $arrHardware['type']=Constants::$ruleType[$value['type']];
            //$arrHardware['desc']=$value['desc'];
            $arrHardware['kind']="hardware";
            $arrHardware['isController']="0";

            $arrHardware['port']=$value['link'];
            $arrHardware['bits']=$value['bits'];
            $arrHardware['needsPinboard']=$value['has_pinboard'];
            $arrHardware['needsDriveplate']=$value['has_driveplate'];
            //$arrHardware['maxDriveplate']=$value['max_driveplate'];
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


        //Flowchart
        // 流程图
        $arrFlowchart=array();
        foreach ($ruleData as $key => $value) {
            $value = collect($value);

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





        return collect($arrReturn)->toJson();


    }

    /**
     *AddFlowChartinfo.php 
     *
     */
    public function create(Request $request)
    {

        $pid = $request->input('pid');
        $infos = $request->input('info');
        $create_time = $update_time = time();

        //转义
        $hardware = addslashes(json_encode($infos['hardware'],true));
        $flowchart = addslashes(json_encode($infos['flowchart'],true));
        $code = addslashes(json_encode($infos['code'], true));

        $type=1;
        $info=$hardware;
        $ret=DB::insert(sprintf("insert into ken_flowchart(pid,type,info,create_time,update_time) 
                                 values(%d,%d,'%s',%d,%d) on duplicate key update info='%s',update_time=%d;",
                                 $pid,$type,$info,$create_time,$update_time,$info,$update_time));


        $type=2;
        $info=$flowchart;
        $ret=DB::insert(sprintf("insert into ken_flowchart(pid,type,info,create_time,update_time) 
                                 values(%d,%d,'%s',%d,%d) on duplicate key update info='%s',update_time=%d;",
                                 $pid,$type,$info,$create_time,$update_time,$info,$update_time));

        $type=4;
        $info=$code;
        $ret=DB::insert(sprintf("insert into ken_flowchart(pid,type,info,create_time,update_time) 
                                 values(%d,%d,'%s',%d,%d) on duplicate key update info='%s',update_time=%d;",
                                 $pid,$type,$info,$create_time,$update_time,$info,$update_time));



        return intval($ret);


    }

}
