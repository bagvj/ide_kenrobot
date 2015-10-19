CREATE DATABASE `www_kenrobot_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

use www_kenrobot_db;

CREATE TABLE IF NOT EXISTS `ken_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(100) DEFAULT NULL COMMENT '项目名',
  `scope` tinyint(4) DEFAULT NULL COMMENT '范围',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `user_name` varchar(200) DEFAULT NULL COMMENT '用户名',
  `status` tinyint(4) DEFAULT NULL COMMENT '项目当前状态',
  `info` varchar(2000) DEFAULT NULL COMMENT '项目说明',
  `create_time` int(11) DEFAULT NULL COMMENT '项目创建时间',
  `update_time` int(11) DEFAULT NULL COMMENT '项目更新时间',
  PRIMARY KEY (`id`),
  KEY `index1` (`name`),
  KEY `index2` (`user_id`),
  KEY `index3` (`create_time`),
  KEY `index4` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目表';

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ken_flowchart` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pid` int(11) DEFAULT NULL COMMENT '项目表关联ID',
  `type` tinyint(4) DEFAULT NULL COMMENT '记录类型',
  `info` varchar(20000) DEFAULT NULL COMMENT '流程图信息',
  `create_time` int(11) DEFAULT NULL COMMENT '项目创建时间',
  `update_time` int(11) DEFAULT NULL COMMENT '项目更新时间',
  PRIMARY KEY (`id`),
  KEY `index1` (`pid`,`type`),
  KEY `index2` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='流程信息表';

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ken_controller` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name_en` varchar(100) DEFAULT NULL COMMENT '控制器英文名',
  `name_cn` varchar(100) DEFAULT NULL COMMENT '控制器中文名',
  `series` varchar(100) DEFAULT NULL COMMENT '系列、型号',
  `company` varchar(100) DEFAULT NULL COMMENT '产家',
  `info` varchar(256) DEFAULT NULL COMMENT '说明',
  `type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '类型',
  `port_name_1` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_1` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_1` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `port_name_2` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_2` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_2` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `port_name_3` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_3` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_3` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `port_name_4` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_4` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_4` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `port_name_5` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_5` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_5` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `port_name_6` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_6` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_6` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `port_name_7` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_7` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_7` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `port_name_8` varchar(100) DEFAULT NULL COMMENT '端口名显示名称',
  `port_bit_8` varchar(128) DEFAULT NULL COMMENT '端口拥有位信息',
  `port_position_8` varchar(1000) DEFAULT NULL COMMENT '端口在图上的位置等信息',
  `is_delete` tinyint(4) DEFAULT 0 COMMENT '0为正常，1为软删',
  `create_time` int(11) DEFAULT NULL COMMENT '创建时间',
  `update_time` int(11) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `index1` (`name_en`,`series`),
  KEY `index2` (`name_cn`,`series`),
  KEY `index3` (`create_time`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='硬件控制器表';

INSERT INTO `ken_controller` (`id`, `name_en`, `name_cn`, `series`, `company`, `info`, `type`, `port_name_1`, `port_bit_1`, `port_position_1`, `port_name_2`, `port_bit_2`, `port_position_2`, `port_name_3`, `port_bit_3`, `port_position_3`, `port_name_4`, `port_bit_4`, `port_position_4`, `port_name_5`, `port_bit_5`, `port_position_5`, `port_name_6`, `port_bit_6`, `port_position_6`, `port_name_7`, `port_bit_7`, `port_position_7`, `port_name_8`, `port_bit_8`, `port_position_8`, `is_delete`, `create_time`, `update_time`) VALUES
(1, 'board', '主板', 'tttt', 'kenrobot', 'kenrobot', 1, 'A', '11111111', '0.2,0.03,0,0', 'B', '11111111', '0.355,0.03,0,0', 'C', '11111111', '0.645,0.03,0,0', 'D', '11111111', '0.8,0.03,0,0', 'E', '11111111', '0.2,0.97,0,0', 'F', '11111111', '0.355,0.97,0,0', 'G', '11111111', '0.645,0.97,0,0', 'H', '11111111', '0.8,0.97,0,0', 0, 1434190147, 1434190147);

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ken_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name_en` varchar(100) DEFAULT NULL COMMENT '控制器英文名',
  `name_cn` varchar(100) DEFAULT NULL COMMENT '控制器中文名',
  `cid` int(11) DEFAULT NULL COMMENT '对应控制器记录ID',
  `category` tinyint(4) DEFAULT NULL COMMENT '原件类型',
  `type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '元件属性',
  `series` varchar(100) DEFAULT NULL COMMENT '型号',
  `info` varchar(256) DEFAULT NULL COMMENT '说明',
  `init_func` varchar(256) NOT NULL COMMENT '初始函数',
  `init_func_desc` varchar(256) NOT NULL COMMENT '初始函数说明',
  `func` varchar(100) DEFAULT NULL COMMENT '对应元件上绑定的函数',
  `func_desc` varchar(256) DEFAULT NULL COMMENT '函数说明',
  `set_title` varchar(100) DEFAULT NULL COMMENT '参数设置变量',
  `set_init_value` varchar(256) DEFAULT NULL COMMENT '参数初始化变量',
  `set_value` varchar(100) DEFAULT NULL COMMENT '参数实际设定值',
  `link` varchar(256) NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000' COMMENT '初始化话对应控制器的位信息',
  `bits` int(11) NOT NULL DEFAULT '1' COMMENT '需要位数',
  `has_pinboard` tinyint(4) DEFAULT NULL COMMENT '转接板',
  `has_driveplate` tinyint(4) DEFAULT NULL COMMENT '驱动板',
  `max_driveplate_num` int(11) DEFAULT '0' COMMENT '驱动板模式下的最大连接数',
  `extra` varchar(10000) DEFAULT NULL COMMENT '用于定制化数据存储',
  `is_delete` tinyint(4) DEFAULT 0 COMMENT '0为正常，1为软删',
  `create_time` int(11) DEFAULT NULL COMMENT '项目创建时间',
  `update_time` int(11) DEFAULT NULL COMMENT '项目更新时间',
  PRIMARY KEY (`id`),
  KEY `index1` (`cid`),
  KEY `index4` (`update_time`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='连接规则表' ;


INSERT INTO `ken_rule` (`name_en`, `name_cn`, `cid`, `category`, `type`, `series`, `info`, `init_func`, `init_func_desc`, `func`, `func_desc`, `set_title`, `set_init_value`, `set_value`, `link`, `bits`, `has_pinboard`, `has_driveplate`, `max_driveplate_num`, `extra`, `is_delete`, `create_time`, `update_time`) VALUES
('light', '灯', 1, 2, 11, '123', 'LED灯', '', '', 'IoOutB(X, n, DigitalValue);', 'X为端口号；n为位号；DigitalValue为输出变量（变量或者数字0、1）；', '输出值', '0', '0', '1111111111111111111111111111111111111111111111111111111111111111', 1, 1, 0, 0, '1', 0, NULL, NULL),
('button', '按键', 1, 1, 1, '123', '按键', '', '', 'Key = IoInB(X, n);', 'Key为输入的变量；X为端口号；n为位号；', '按键状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('switch', '开关', 1, 1, 2, '123', '开关', '', '', 'Switch = IoInB(X, n);', 'Switch为输入的变量；X为端口号；n为位号；', '开关状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('travelSwitch', '行程开关', 1, 1, 3, '123', '行程开关', '', '', 'TravelSwitch = IoInB(X, n);', 'TravelSwitch为输入的变量；X为端口号；n为位号', '触碰状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('linePatrol', '巡线', 1, 1, 4, '123', '巡线', '', '', 'Line = IoInB(X, n);', 'Line为输入的变量；X为端口号；n为位号；', '巡线状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('fireD', '火焰D', 1, 1, 5, '123', '火焰D', '', '', 'FlameDigital = IoInB(X, n);', 'FlameDigital为输入的变量；X为端口号；n为位号；', '火焰状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('infraredIn', '红外接收', 1, 1, 6, '123', '红外接收', '', '', 'InfraredReception = IoInB(X, n);', 'InfraredReception为输入的变量；X为端口号；n为位号；', '红外状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('soundSensor', '声音传感', 1, 1, 7, '123', '声音传感', '', '', 'Voice = IoInB(X, n);', 'Voice为输入的变量；X为端口号；n为位号；', '声音状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('lean', '倾斜', 1, 1, 8, '123', '倾斜', '', '', 'Lean = IoInB(X, n);', 'Lean为输入的变量；X为端口号；n为位号', '是否倾斜存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('metalClose', '金属接近', 1, 1, 9, '123', '金属接近', '', '', 'Metal = IoInB(X, n);', 'Metal为输入的变量；X为端口号；n为位号；', '是否有金属存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('oneBitIn', '1位I/O输入', 1, 1, 10, '123', '1位I/O输入', '', '', 'IODefault = IoInB(X, n);', 'IODefault为输入的变量；X为端口号；n为位号；', 'IO输入状态存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('relay', '继电器', 1, 2, 12, '123', '继电器', '', '', 'IoOutB(X, n, DigitalValue);', 'X为端口号；n为位号；DigitalValue为输出变量（变量或者数字0、1）；', '继电器状态', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('buzzer', '蜂鸣器', 1, 2, 13, '123', '蜂鸣器', '', '', 'IoOutB(X, n, DigitalValue);', 'X为端口号；n为位号；DigitalValue为输出变量（变量或者数字0、1）；', '蜂鸣器状态', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('infraredOut', '红外发射', 1, 2, 14, '123', '红外发射', '', '', 'IoOutB(X, n, DigitalValue);', 'X为端口号；n为位号；DigitalValue为输出变量（变量或者数字0、1）；', '红外发射状态', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('oneBitOut', '1位I/O输出', 1, 2, 15, '123', '1位I/O输出', '', '', 'IoOutB(X, n, DigitalValue);', 'X为端口号；n为位号；DigitalValue为输出变量（变量或者数字0、1）；', 'IO输出状态', '0', '0', '1111111111111111111111111111111111111111111111111111111111110000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('linePatrolRow', '巡线阵列', 1, 1, 16, '123', '巡线阵列', '', '', '', '', '', '0', '0', '1111111111111111111111111111111111111111111111111111111100000000', 8, 1, 0, 0, '', 1, 1437210305, 1437210305),
('keyboard', '矩阵键盘', 1, 1, 17, '123', '矩阵键盘', 'initKdm(X);', 'X为端口号；', 'MatrixKeyboard = KeyScan();', 'MatrixKeyboard为输入变量;', '键盘输入值存储到', '0', '0', '1111111111111111111111111111111111111111111111111111111100000000', 8, 1, 0, 0, '', 1, 1437210305, 1437210305),
('digitalTube', '数码管', 1, 2, 18, '123', '数码管', 'InitNumLed(X);', 'X为端口号；', 'ToLed(Num);', 'Num为显示的变量；', '数码管显示内容', '0', '0', '1111111111111111111111111111111111111111111111111111111100000000', 8, 0, 0, 0, '', 0, 1437210305, 1437210305),
('streeringEngine', '舵机', 1, 3, 19, '123', '舵机', 'InitServo();', '', 'Servo(m, Degree);', 'm为舵机编号，0或1；Degree为变量，-90到90', '舵机转动角度', '0', '0', '0000000011111111000000000000000000000000000000000000000000000000', 8, 0, 1, 2, '', 0, 1437210305, 1437210305),
('dcMotor', '直流电机', 1, 3, 20, '123', '直流电机', 'InitMotor();', '', 'DCMotor(m,RotationRate);', 'm为直流电机编号，0或1；RotationRate为变量，-255到255，设置正传为正数，反转为负数；', '电机转速', '0', '0', '0000000011111111000000000000000000000000000000000000000000000000', 8, 0, 1, 2, '', 0, 1437210305, 1437210305),
('illumination', '光照', 1, 4, 21, '123', '光照', '', '', 'Light = read_adc(n);', 'Light为输入的变量；n为位号；', '光照强度存储到', '0', '0', '0000000000000000000000000000000000000000111111110000000000000000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('temperatue', '温度', 1, 4, 22, '123', '温度', '', '', 'Tem = read_adc(n);', 'Tem为输入的变量；n为位号；', '温度存储到', '0', '0', '0000000000000000000000000000000000000000111111110000000000000000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('humidity', '湿度', 1, 4, 23, '123', '湿度', '', '', 'Humidity = read_adc(n);', 'Humidity为输入的变量；n为位号；', '湿度存储到', '0', '0', '0000000000000000000000000000000000000000111111110000000000000000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('pm25', 'PM2.5', 1, 4, 24, '123', 'PM2.5', '', '', 'PM25 = read_adc(n);', 'PM25为输入的变量；n为位号；', 'PM2.5值存储到', '0', '0', '0000000000000000000000000000000000000000111111110000000000000000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('fireA', '火焰A', 1, 4, 25, '123', '火焰A', '', '', 'FlameAnalog = read_adc(n);', 'FlameAnalog为输入的变量；n为位号；', '温湿度值存储到', '0', '0', '0000000000000000000000000000000000000000111111110000000000000000', 1, 1, 0, 0, '', 0, 1437210305, 1437210305),
('ad', 'AD输入', 1, 4, 26, '123', 'AD输入', '', '', 'ADDefault = read_adc(n);', 'ADDefault为输入的变量；n为位号；', 'AD值存储到', '0', '0', '0000000000000000000000000000000000000000111111110000000000000000', 1, 1, 0, 0, '', 1, 1437210305, 1437210305),
('serialPortIn', '串口输入', 1, 5, 27, '123', '串口输入', 'uart_init(n,B,J);', 'n为串口号：0为串口0,1为串口1；B为波特率；0--5分别表示4800，960019200,38400,57600,115200；J为校验位；0代表奇校验；1代表偶校验；2代表无校验', 'UARTInput = uGetChar(n);', 'n为串口号;UARTInput为输入变量；', '串口输入值存储到', '0', '0', '0000000000000000000000000011000011000000000000000000000000000000', 2, 1, 0, 0, '', 1, 1437210305, 1437210305),
('serialPortOut', '串口输出', 1, 5, 28, '123', '串口输出', 'uart_init(n,B,J);', 'B为波特率；0--5分别表示4800，960019200,38400,57600,115200；J为校验位；0代表奇校验；1代表偶校验；2代表无校验；', 'uPutChar(1,UARTOutput);', 'UARTOutput为输入变量；', '串口输出值', '0', '0', '0000000000000000000000000011000011000000000000000000000000000000', 2, 1, 0, 0, '', 1, 1437210305, 1437210305),
('ultrasoundLocation', '超声测距', 1, 5, 29, '123', '超声测距', 'twi_master_init(R,F);', 'R为波特率寄存器；0-1023；F为预分频；0-3代表1、4、16、64；', 'Ultrasound = i2c_Ultr_Rag(240);', 'Ultrasound为输入变量', '超声测距值存储到', '0', '0', '0000000000000000000000001100000000000000000000000000000000000000', 2, 1, 0, 0, '', 1, 1437210305, 1437210305),
('electronicCompass', '电子罗盘', 1, 5, 30, '123', '电子罗盘', 'twi_master_init(R,F);', 'R为波特率寄存器；0-1023；F为预分频；0-代表1、4、16、64；', 'EleCompass = i2c_Compass(254);', 'EleCompass为输入变量', '方向角存储到', '0', '0', '0000000000000000000000001100000000000000000000000000000000000000', 2, 1, 0, 0, '', 1, 1437210305, 1437210305),
('iicOut', 'IIC口输出', 1, 5, 31, '123', 'IIC口输出', 'twi_master_init(R,F);', 'R为波特率寄存器；0-1023；F为预分频；0-代表1、4、16、64；', 'i2c_maste_transt(Add, I2COutput);', 'Add为地址：0-254；I2COutPut为数据', 'IIC输出数据', '0', '0', '0000000000000000000000001100000000000000000000000000000000000000', 2, 1, 0, 0, '', 1, 1437210305, 1437210305),
('iicIn', 'IIC口输入', 1, 5, 32, '123', 'IIC口输入', 'twi_master_init(R,F);', 'R为波特率寄存器；0-1023；F为预分频；0-代表1、4、16、64；', 'I2CInput = i2c_maste_read(Add);', 'I2CInput为输入变量；Add为地址：0-254；', 'IIC输入数据存储到', '0', '0', '0000000000000000000000001100000000000000000000000000000000000000', 2, 1, 0, 0, '', 1, 1437210305, 1437210305);







