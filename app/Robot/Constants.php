<?php

namespace App\Robot;



class Constants
{
    
    const CONTROLLER_TYPE_MAINBOARD=1;
    const CONTROLLER_TYPE_DRIVEPLATE=2;
    static $controllerType=array(
    self::CONTROLLER_TYPE_MAINBOARD => "board",// 主板
    self::CONTROLLER_TYPE_DRIVEPLATE => "driveplate",// 驱动板
    );

    const RULE_CATEGORY_CONTROLLER=0;
    const RULE_CATEGORY_INPUT=1;
    const RULE_CATEGORY_OUTPUT=2;
    const RULE_CATEGORY_EXEC=3;
    const RULE_CATEGORY_SENSE=4;
    const RULE_CATEGORY_MESSAGE=5;
    static $ruleCategory=array(
    self::RULE_CATEGORY_CONTROLLER => "控制模块",// 输入
    self::RULE_CATEGORY_INPUT => "输入模块",// 输入
    self::RULE_CATEGORY_OUTPUT => "输出模块",// 输出
    self::RULE_CATEGORY_EXEC => "执行模块",// 执行
    self::RULE_CATEGORY_SENSE => "传感模块",// 传感
    self::RULE_CATEGORY_MESSAGE => "通讯模块",// 通讯
    );

    const RULE_TYPE_BUTTON=1;// 按键
    const RULE_TYPE_SWITCH=2;// 开关
    const RULE_TYPE_TRAVEL_SWITCH=3;// 触碰开关
    const RULE_TYPE_LINE_PATROL=4;// 巡线
    const RULE_TYPE_FIRE_D=5;// 火焰D
    const RULE_TYPE_INFRARED_IN=6;// 红外接收
    const RULE_TYPE_SOUND_SENSOR=7;// 声音传感
    const RULE_TYPE_LEAN=8;// 倾斜
    const RULE_TYPE_METAL_CLOSE=9;// 金属接近
    const RULE_TYPE_ONE_BIT_IN=10;// 1位I/O输入
    const RULE_TYPE_LED=11;// LED
    const RULE_TYPE_RELAY=12;// 继电器
    const RULE_TYPE_BUZZER=13;// 蜂鸣器
    const RULE_TYPE_INFRARED_OUT=14;// 红外发射
    const RULE_TYPE_ONE_BIT_OUT=15;// 1为I/O输出
    const RULE_TYPE_LINE_PATROL_ROW=16;// 巡线阵列
    const RULE_TYPE_KEYBOARD=17;// 矩阵键盘
    const RULE_TYPE_DIGITAL_TUBE=18;// 数码管
    const RULE_TYPE_STREERING_ENGINE=19;// 舵机
    const RULE_TYPE_DC_MOTOR=20;// 直流电机
    const RULE_TYPE_ILLUMINATION=21;// 光照
    const RULE_TYPE_TEMPERATURE=22;// 温度
    const RULE_TYPE_HUMIDITY=23;// 湿度
    const RULE_TYPE_PM25=24;// PM2.5
    const RULE_TYPE_FIRE_A=25;// 火焰A
    const RULE_TYPE_AD=26;// AD
    const RULE_TYPE_SERIAL_PORT_IN=27;// 串口输入
    const RULE_TYPE_SERIAL_PORT_OUT=28;// 串口输出
    const RULE_TYPE_ULTRASOUND_LOCATION=29;// 超声测距
    const RULE_TYPE_ELECTRONIC_COMPASS=30;// 电子罗盘
    const RULE_TYPE_IIC_OUT=31;// IIC输出
    const RULE_TYPE_IIC_IN=32;// IIC输入
    const RULE_TYPE_DELAY=33;// 延时
    const RULE_TYPE_INT0=34;// INT0
    const RULE_TYPE_INT1=35;// INT1
    const RULE_TYPE_INT2=36;// INT2
    const RULE_TYPE_INT3=37;// INT3
    const RULE_TYPE_INT4=38;// INT4
    const RULE_TYPE_INT5=39;// INT5
    const RULE_TYPE_INT6=40;// INT6
    const RULE_TYPE_INT7=41;// INT7

    static $ruleType=array(
    self::RULE_TYPE_BUTTON => 'button',
    self::RULE_TYPE_SWITCH => 'switch',
    self::RULE_TYPE_TRAVEL_SWITCH => 'travelSwitch',
    self::RULE_TYPE_LINE_PATROL => 'linePatrol',
    self::RULE_TYPE_FIRE_D => 'fireD',
    self::RULE_TYPE_INFRARED_IN => 'infraredIn',
    self::RULE_TYPE_SOUND_SENSOR => 'soundSensor',
    self::RULE_TYPE_LEAN => 'lean',
    self::RULE_TYPE_METAL_CLOSE => 'metalClose',
    self::RULE_TYPE_ONE_BIT_IN => 'oneBitIn',
    self::RULE_TYPE_LED => 'led',
    self::RULE_TYPE_RELAY => 'relay',
    self::RULE_TYPE_BUZZER => 'buzzer',
    self::RULE_TYPE_INFRARED_OUT => 'infraredOut',
    self::RULE_TYPE_ONE_BIT_OUT => 'oneBitOut',
    self::RULE_TYPE_LINE_PATROL_ROW => 'linePatrolRow',
    self::RULE_TYPE_KEYBOARD => 'keyboard',
    self::RULE_TYPE_DIGITAL_TUBE => 'digitalTube',
    self::RULE_TYPE_STREERING_ENGINE => 'streeringEngine',
    self::RULE_TYPE_DC_MOTOR => 'dcMotor',
    self::RULE_TYPE_ILLUMINATION => 'illumination',
    self::RULE_TYPE_TEMPERATURE => 'temperatue',
    self::RULE_TYPE_HUMIDITY => 'humidity',
    self::RULE_TYPE_PM25 => 'pm25',
    self::RULE_TYPE_FIRE_A => 'fireA',
    self::RULE_TYPE_AD => 'ad',
    self::RULE_TYPE_SERIAL_PORT_IN => 'serialPortIn',
    self::RULE_TYPE_SERIAL_PORT_OUT => 'serialPortOut',
    self::RULE_TYPE_ULTRASOUND_LOCATION => 'ultrasoundLocation',
    self::RULE_TYPE_ELECTRONIC_COMPASS => 'electronicCompass',
    self::RULE_TYPE_IIC_OUT => 'iicOut',
    self::RULE_TYPE_IIC_IN => 'iicIn',
    self::RULE_TYPE_DELAY => 'delay',
    self::RULE_TYPE_INT0 => 'int0',
    self::RULE_TYPE_INT1 => 'int1',
    self::RULE_TYPE_INT2 => 'int2',
    self::RULE_TYPE_INT3 => 'int3',
    self::RULE_TYPE_INT4 => 'int4',
    self::RULE_TYPE_INT5 => 'int5',
    self::RULE_TYPE_INT6 => 'int6',
    self::RULE_TYPE_INT7 => 'int7',
    );
}