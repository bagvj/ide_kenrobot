@extends('layouts.master')

@section('main')

   <div class="main">
    <div class="tabs">
      <ul>
        <li><span>硬件连接</span></li>
        <li><span>软件编程</span></li>
      </ul>
    </div>
     <div class="mod yjlj_mod">
       <div class="nav-second">
       <ul>
         <li class="kzmk active">控制模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="hardware_board" data-item="hardware_board_item"
                            class="hardware-item hardware-board"></div>主板</li>
             </div>
           </ul>
         </li>
         <li class="srmk">输入模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="hardware_switch" data-item="hardware_switch_item"
                            class="hardware-item hardware-switch"></div>开关</li>
             <li><div id="hardware_button" data-item="hardware_button_item"
                            class="hardware-item hardware-button"></div>按键</li>
             </div>
           </ul>
         </li>
         <li class="scmk">输出模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="hardware_light" data-item="hardware_light_item"
                            class="hardware-item hardware-light"></div>灯</li>
             <li><div id="hardware_soundSensor" data-item="hardware_soundSensor_item"
                            class="hardware-item hardware-soundSensor"></div>声音</li>
             <li><div id="hardware_infraredOut" data-item="hardware_infraredOut_item"
                            class="hardware-item hardware-infraredOut"></div>红外发射</li>
             </div>
           </ul>
         </li>
         <li class="xsmk">显示模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="hardware_digitalTube" data-item="hardware_digitalTube_item"
                            class="hardware-item hardware-digitalTube"></div>数码管</li>
             </div>
           </ul>
         </li>
         <li class="zxmk">执行模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="hardware_dcMotor" data-item="hardware_dcMotor_item"
                            class="hardware-item hardware-dcMotor"></div>电机</li>
             <li><div id="hardware_streeringEngine" data-item="hardware_streeringEngine_item"
                            class="hardware-item hardware-streeringEngine"></div>舵机</li>
             </div>
           </ul>
         </li>
         <li class="cgmk">传感模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="hardware_pm25" data-item="hardware_pm25_item"
                            class="hardware-item hardware-pm25"></div>PM2.5</li>
             <li><div id="hardware_illumination" data-item="hardware_illumination_item"
                            class="hardware-item hardware-illumination"></div>光感</li>
             <li><div id="hardware_temperatue" data-item="hardware_temperatue_item"
                            class="hardware-item hardware-temperatue"></div>温度</li>
             <li><div id="hardware_fireA" data-item="hardware_fireA_item"
                            class="hardware-item hardware-fireA"></div>火焰</li>
             </div>
           </ul>
         </li>
         <li class="txmk">通信模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="hardware_serialPortIn" data-item="hardware_serialPortIn_item"
                            class="hardware-item hardware-serialPortIn"></div>串口</li>
             </div>
           </ul>

         </li>
       </ul>
       </div>
       <div class="canvas hardware-container main-canvas" id="hardware-container"></div>
       <div class="side trolley">
         <div class="bar">已配置模块<div class="gwc"></div></div>
         <div class="list hardware_part_list">
           <ul></ul>
         </div>
         <div class="btn2 buy" onclick="window.open('http://www.kenrobot.com/index.php?app=shop');">元件选购</div>
       </div>
     </div>
     <div class="mod rjbc_mod">
       <div class="nav-second">
       <ul>
         <li class="ypzmk active">已配置模块<div class="triangle"></div>
            <div id="content-container" class="content-container flowchart_hardware_part_list">
           <ul>
             <li><div id="flowchart_board" data-item="flowchart_board_item" class="flowchart-item flowchart-board"></div>主板</li>
             <li><div id="flowchart_light" data-item="flowchart_light_item" class="flowchart-item flowchart-light"></div>灯</li>
             <li><div id="flowchart_button" data-item="flowchart_button_item" class="flowchart-item flowchart-button"></div>按键</li>
             <li><div id="flowchart_zjbkg" data-item="flowchart_zjbkg_item" class="flowchart-item flowchart-zjbkg"></div>转接板开关</li>
           </ul>
             </div>
         </li>
         <li class="lckzmk1">流程控制模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="flowchart_tjfz" data-item="flowchart_tjfz_item"
                            class="flowchart-item flowchart-tjfz"></div>条件分支</li>
             <li><div id="flowchart_tjxh" data-item="flowchart_tjxh_item"
                            class="flowchart-item flowchart-tjxh"></div>条件循环</li>
             <li><div id="flowchart_yyxh" data-item="flowchart_yyxh_item"
                            class="flowchart-item flowchart-yyxh"></div>永远循环</li>
             <li><div id="flowchart_jsxh" data-item="flowchart_jsxh_item"
                            class="flowchart-item flowchart-jsxh"></div>计数循环</li>
             <li><div id="flowchart_fh" data-item="flowchart_fh_item"
                            class="flowchart-item flowchart-fh"></div>返回</li>
             </div>
           </ul>
         </li>
         <li class="lckzmk2">流程控制模块<div class="triangle"></div>
           <ul><div id="content-container" class="content-container">
             <li><div id="flowchart_yshs" data-item="flowchart_yshs_item"
                            class="flowchart-item flowchart-yshs"></div>延时函数</li>
             <li><div id="flowchart_dshs" data-item="flowchart_dshs_item"
                            class="flowchart-item flowchart-dshs"></div>定时函数</li>
             <li><div id="flowchart_fzhs" data-item="flowchart_fzhs_item"
                            class="flowchart-item flowchart-fzhs"></div>赋值函数</li>
             <li><div id="flowchart_sjhs" data-item="flowchart_sjhs_item"
                            class="flowchart-item flowchart-sjhs"></div>随机函数</li>
             <li><div id="flowchart_zdyhs" data-item="flowchart_zdyhs_item"
                            class="flowchart-item flowchart-zdyhs"></div>自定义函数</li>
             </div>
           </ul>
         </li>
       </ul>
       </div>
       <div class="canvas flowchart-container main-canvas" id="flowchart-container"></div>
       <div class="side">
           <div class="yjlj-side">
             <div class="bar">硬件连接</div>
             <div class="content" id="yjlj-content">
             </div>
           </div>
           <div class="var-side">
             <div class="bar">变量</div>
             <div class="content">
               <table id="var-table">
                 <tr>
                 <th>name</th>
                 <th>type</th>
                 <th>kind</th>
                 <th>initial</th>
                 <th>scope</th>
                 <th>desc</th>
                 </tr>
               </table>
             </div>
             <div class="operator">
             <div class="btn add">增加</div>
             <div class="btn del">删除</div>
             <div class="btn">修改</div>
             </div>
           </div>
           <div class="code-side">
             <div class="bar">C语言</div>
             <div class="content">
                <textarea id="c_code_input" class="c_code_area"></textarea>
                <div class="code_view"></div>
             </div>
           </div>
       </div>
     </div>
     <div class="mod_btn">
      <div class="btn3 save">保存</div>
      <div class="btn4 download">下载</div>
     </div>
   </div>


@stop
