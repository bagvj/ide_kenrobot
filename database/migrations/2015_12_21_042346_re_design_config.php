<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class ReDesignConfig extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::dropIfExists('ken_controller');
		Schema::dropIfExists('ken_flowchart');
		Schema::dropIfExists('ken_rule');
		Schema::dropIfExists('ken_project');

		Schema::create('modules', function (Blueprint $table) {
			$table->increments('id')->comment("模块id");
			$table->string('name')->comment("模块名字");
		});

		Schema::create('hardwares', function (Blueprint $table) {
			$table->increments('id')->comment("硬件id");
			$table->integer('module_id')->comment("模块id");

			$table->string('name')->comment("名字")->unique();
			$table->string('alias')->comment("别名");
			$table->integer('width')->comment("高度");
			$table->integer('height')->comment("宽度");
			$table->string('category')->comment("模版");
			$table->boolean('in_use')->comment("是否正在使用");
			$table->boolean('deletable')->comment("是否可删除");
			$table->boolean('is_controller')->comment("是否是控制器");
			$table->boolean('need_pin_board')->comment("是否需要转接板");
			$table->boolean('need_drive_plate')->comment("是否需要驱动板");
			$table->string('port')->comment("端口");
			$table->integer('need_bit')->comment("需要的位数");
			$table->integer('max')->comment("最大数量");
		});

		Schema::create('softwares', function (Blueprint $table) {
			$table->increments('id')->comment("软件id");
			$table->string('name')->comment("名字")->unique();
			$table->string('alias')->comment("别名");
			$table->integer('width')->comment("高度");
			$table->integer('height')->comment("宽度");
			$table->string('category')->comment("模版");
			$table->boolean('in_use')->comment("是否正在使用");
			$table->boolean('deletable')->comment("是否可删除");
			$table->integer('tag')->comment("标记，用于遍历");
			$table->integer('subTag')->comment("子标记，用于遍历");

			$table->string('format')->comment("调用函数格式");
			$table->string('init_format')->comment("初始化函数格式");
		});

		Schema::create('params', function (Blueprint $table) {
			$table->increments('id')->comment("参数id");
			$table->integer('software_id')->comment("软件id");
			$table->boolean('is_init')->comment("是否为初始化参数");
			$table->string('name')->comment("名字");
			$table->string('type')->comment("类型");
			$table->string('input_type')->comment("输入类型");
			$table->string('default')->comment("默认值");
			$table->string('options')->comment("选项");
			$table->string('label')->comment("文本");
			$table->string('placeholder')->comment("提示");
		});

		Schema::create('projects', function (Blueprint $table) {
			$table->increments('id')->comment("项目id");
			$table->string('hardwares')->comment("硬件数据");
			$table->string('softwares')->comment("软件数据");
		});

		DB::statement("insert  into `hardwares`(`id`,`module_id`,`name`,`alias`,`width`,`height`,`category`,`in_use`,`deletable`,`is_controller`,`need_pin_board`,`need_drive_plate`,`port`,`need_bit`,`max`) values (1,1,'board','主板',300,184,'board',1,0,1,0,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(2,1,'adapter','转接器',36,36,'adapter',1,0,0,0,0,'',1,0),(3,2,'button','按键',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(4,2,'switch','开关',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(5,2,'travelSwitch','行程开关',43,78,'',0,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(6,2,'linePatrol','巡线',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(7,2,'fireD','火焰D',43,78,'',0,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(8,2,'infraredIn','红外接收',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(9,2,'soundSensor','声音传感',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(10,2,'lean','倾斜',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(11,2,'metalClose','金属接近',43,78,'',0,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(12,2,'oneBitIn','1位I/O输入',43,78,'',0,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(13,2,'linePatrolRow','巡线阵列',100,80,'',1,1,0,0,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',8,0),(14,2,'keyboard','矩阵键盘',100,80,'',1,1,0,0,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',8,0),(15,3,'light','灯',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(16,3,'relay','继电器',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(17,3,'buzzer','蜂鸣器',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(18,3,'infraredOut','红外发射',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(19,3,'oneBitOut','1位I/O输出',43,78,'',1,1,0,1,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',1,0),(20,3,'digitalTube','数码管',100,80,'',1,1,0,0,0,'11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000',8,0),(21,4,'streeringEngine','舵机',90,150,'',1,1,0,0,1,'00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000',8,2),(22,4,'dcMotor','直流电机',87,90,'',1,1,0,0,1,'00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000',8,2),(23,5,'illumination','光照',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000',1,0),(24,5,'temperatue','温度',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000',1,0),(25,5,'humidity','湿度',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000',1,0),(26,5,'pm25','PM2.5',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000',1,0),(27,5,'fireA','火焰A',43,78,'',0,1,0,1,0,'00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000',1,0),(28,5,'ad','AD输入',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000',1,0),(29,5,'ultrasoundLocation','超声测距',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000',2,0),(30,5,'electronicCompass','电子罗盘',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000',2,0),(31,6,'serialPortIn','串口输入',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 00000000 11000000 00000000 00000000 00000000',2,0),(32,6,'serialPortOut','串口输出',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 00000000 11000000 00000000 00000000 00000000',2,0),(33,6,'iicIn','IIC输入',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000',2,0),(34,6,'iicOut','IIC输出',43,78,'',1,1,0,1,0,'00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000',2,0);");
		DB::statement("insert  into `modules`(`id`,`name`) values (1,'默认'),(2,'输入模块'),(3,'输出模块'),(4,'执行模块'),(5,'传感模块'),(6,'通讯模块');");
		DB::statement("insert  into `params`(`id`,`software_id`,`is_init`,`name`,`type`,`input_type`,`default`,`options`,`label`,`placeholder`) values (1,5,0,'condition','','text','Condition','','分支条件',''),(2,6,0,'condition','','text','Condition','','循环条件',''),(3,8,0,'index','','text','i','','循环变量',''),(4,8,0,'count','','text','5','','循环次数','数字或者变量'),(5,9,0,'time','','text','1000','','延时','毫秒'),(6,10,0,'var','','text','Var','','变量',''),(7,10,0,'exp','','text','Exp','','表达式',''),(8,12,0,'port','','text','Port','','端口',''),(9,12,0,'bit','','text','Bit','','位',''),(10,12,0,'value','','text','Key','','读取到变量',''),(11,13,0,'port','','text','Port','','端口',''),(12,13,0,'bit','','text','Bit','','位',''),(13,13,0,'value','','text','Switch','','读取到变量',''),(14,14,0,'port','','text','Port','','端口',''),(15,14,0,'bit','','text','Bit','','位',''),(16,14,0,'value','','text','TravelSwitch','','读取到变量',''),(17,15,0,'port','','text','Port','','端口',''),(18,15,0,'bit','','text','Bit','','位',''),(19,15,0,'value','','text','Line','','读取到变量',''),(20,16,0,'port','','text','Port','','端口',''),(21,16,0,'bit','','text','Bit','','位',''),(22,16,0,'value','','text','FlameDigital','','读取到变量',''),(23,17,0,'port','','text','Port','','端口',''),(24,17,0,'bit','','text','Bit','','位',''),(25,17,0,'value','','text','InfraredReception','','读取到变量',''),(26,18,0,'port','','text','Port','','端口',''),(27,18,0,'bit','','text','Bit','','位',''),(28,18,0,'value','','text','Voice','','读取到变量',''),(29,19,0,'port','','text','Port','','端口',''),(30,19,0,'bit','','text','Bit','','位',''),(31,19,0,'value','','text','Lean','','读取到变量',''),(32,20,0,'port','','text','Port','','端口',''),(33,20,0,'bit','','text','Bit','','位',''),(34,20,0,'value','','text','Metal','','读取到变量',''),(35,21,0,'port','','text','Port','','端口',''),(36,21,0,'bit','','text','Bit','','位',''),(37,21,0,'value','','text','Value','','读取到变量',''),(38,22,1,'port','','text','Port','','端口',''),(39,23,0,'port','','text','Port','','端口',''),(40,23,0,'bit','','text','Bit','','位',''),(41,23,0,'value','','text','1','','输出值','1亮/0灭'),(42,24,0,'port','','text','Port','','端口',''),(43,24,0,'bit','','text','Bit','','位',''),(44,24,0,'value','','text','1','','输出值','0或1'),(45,25,0,'port','','text','Port','','端口',''),(46,25,0,'bit','','text','Bit','','位',''),(47,25,0,'value','','text','1','','输出值(0/1)','0或1'),(48,26,0,'port','','text','Port','','端口',''),(49,26,0,'bit','','text','Bit','','位',''),(50,26,0,'value','','text','1','','输出值','0或1'),(51,27,0,'port','','text','Port','','端口',''),(52,27,0,'bit','','text','Bit','','位',''),(53,27,0,'value','','text','1','','输出值','0或1'),(54,28,1,'port','','text','Port','','端口',''),(55,28,0,'num','','text','Num','','显示数值',''),(56,29,0,'index','','text','Index','','编号','0或1'),(57,29,0,'degree','','text','Degree','','转动角度','-90~90'),(58,30,0,'index','','text','Index','','编号','0或1'),(59,30,0,'rotation','','text','Rotation','','转动量','-255~255'),(60,31,0,'bit','','text','Bit','','位号',''),(61,31,0,'value','','text','Light','','读取到变量',''),(62,32,0,'bit','','text','Bit','','位号',''),(63,32,0,'value','','text','Tem','','读取到变量',''),(64,33,0,'bit','','text','Bit','','位号',''),(65,33,0,'value','','text','Tem','','读取到变量',''),(66,34,0,'bit','','text','Bit','','位号',''),(67,34,0,'value','','text','PM','','读取到变量',''),(68,35,0,'bit','','text','Bit','','位号',''),(69,35,0,'value','','text','FlameAnalog','','读取到变量',''),(70,36,0,'bit','','text','Bit','','位号',''),(71,36,0,'value','','text','ADDefault','','读取到变量',''),(72,37,1,'index','','text','Index','','串口号','0或1'),(73,37,1,'baudRate','','text','1','','波特率','0-5,分别表示4800,9600,19200,38400,57600,115200'),(74,37,1,'check','','text','2','','校验位','0奇校验;1偶校验;2无校验'),(75,37,0,'index','','text','Index','','串口号','0或1'),(76,37,0,'value','','text','UARTInput','','读取到变量',''),(77,38,1,'index','','text','Index','','串口号','0或1'),(78,38,1,'baudRate','','text','1','','波特率','0-5,分别表示4800,9600,19200,38400,57600,115200'),(79,38,1,'check','','text','2','','校验位','0奇校验;1偶校验;2无校验'),(80,38,0,'index','','text','1','','串口号','0或1'),(81,38,0,'value','','text','UARTOutput','','输出值',''),(82,39,1,'register','','text','Register','','波特率寄存器','0-1023'),(83,39,1,'preFeequency','','text','PreFeequency','','预分频','0-3,分别表示1,4,16,64'),(84,39,0,'arg','','text','240','','参数',''),(85,39,0,'value','','text','Ultrasound','','读取到变量',''),(86,40,1,'register','','text','Register','','波特率寄存器','0-1023'),(87,40,1,'preFeequency','','text','PreFeequency','','预分频','0-3,分别表示1,4,16,64'),(88,40,0,'arg','','text','254','','参数',''),(89,40,0,'value','','text','EleCompass','','读取到变量',''),(90,41,1,'register','','text','Register','','波特率寄存器','0-1023'),(91,41,1,'preFeequency','','text','PreFeequency','','预分频','0-3,分别表示1,4,16,64'),(92,41,0,'arg','','text','Add','','参数',''),(93,41,0,'value','','text','I2CInput','','读取到变量',''),(94,42,1,'register','','text','Register','','波特率寄存器','0-1023'),(95,42,1,'preFeequency','','text','PreFeequency','','预分频','0-3,分别表示1,4,16,64'),(96,42,0,'arg','','text','Add','','参数',''),(97,42,0,'value','','text','Value','','输出值','');");
		DB::statement("insert  into `softwares`(`id`,`name`,`alias`,`width`,`height`,`category`,`in_use`,`deletable`,`tag`,`subTag`,`format`,`init_format`) values (1,'start','开始',75,26,'start',1,0,1,1,'',''),(2,'loopStart','loop开始',75,26,'loopStart',1,0,1,2,'',''),(3,'loopEnd','loop结束',75,26,'loopEnd',1,0,1,3,'',''),(4,'end','结束',75,26,'end',1,0,1,4,'',''),(5,'ifElse','条件分支',75,26,'ifElse',1,1,2,1,'if(condition)',''),(6,'conditionLoop','条件循环',75,26,'while',1,1,2,2,'while(condition)',''),(7,'foreverLoop','永远循环',75,26,'while',1,1,2,2,'for(;;)',''),(8,'countLoop','计数循环',75,26,'while',1,1,2,2,'for(int index = 0; index < count; index++)',''),(9,'delay','延时函数',75,26,'',1,1,3,0,'delay_ms(time);',''),(10,'assignment','赋值函数',75,26,'',1,1,3,0,'var = exp;',''),(11,'board','主板',36,36,'',1,1,4,0,'',''),(12,'button','按键',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(13,'switch','开关',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(14,'travelSwitch','行程开关',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(15,'linePatrol','巡线',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(16,'fireD','火焰D',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(17,'infraredIn','红外接收',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(18,'soundSensor','声音传感',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(19,'lean','倾斜',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(20,'metalClose','金属接近',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(21,'oneBitIn','1位I/O输入',36,36,'',1,1,4,0,'value = IoInB(port, bit);',''),(22,'keyboard','矩阵键盘',36,36,'',1,1,4,0,'KeyScan();','initKdm(port);'),(23,'light','LED灯',36,36,'',1,1,4,0,'IoOutB(port, bit, value);',''),(24,'relay','继电器',36,36,'',1,1,4,0,'IoOutB(port, bit, value);',''),(25,'buzzer','蜂鸣器',36,36,'',1,1,4,0,'IoOutB(port, bit, value);',''),(26,'infraredOut','红外发射',36,36,'',1,1,4,0,'IoOutB(port, bit, value);',''),(27,'oneBitOut','1位I/O输出',36,36,'',1,1,4,0,'IoOutB(port, bit, value);',''),(28,'digitalTube','数码管',36,36,'',1,1,4,0,'ToLed(num);','InitNumLed(port);'),(29,'streeringEngine','舵机',36,36,'',1,1,4,0,'Servo(index, degree);','InitServo();'),(30,'dcMotor','直流电机',36,36,'',1,1,4,0,'DCMotor(index, rotation);','InitMotor();'),(31,'illumination','光照',36,36,'',1,1,4,0,'value = read_adc(bit);',''),(32,'temperatue','温度',36,36,'',1,1,4,0,'value = read_adc(bit);',''),(33,'humidity','湿度',36,36,'',1,1,4,0,'value = read_adc(bit);',''),(34,'pm25','PM2.5',36,36,'',1,1,4,0,'value = read_adc(bit);',''),(35,'fireA','火焰A',36,36,'',0,1,4,0,'value = read_adc(bit);',''),(36,'ad','AD输入',36,36,'',1,1,4,0,'value = read_adc(bit);',''),(37,'serialPortIn','串口输入',36,36,'',1,1,4,0,'value = uGetChar(index);','uart_init(index, baudRate, check);'),(38,'serialPortOut','串口输出',36,36,'',1,1,4,0,'uPutChar(index, value);','uart_init(index, baudRate, check);'),(39,'ultrasoundLocation','超声测距',36,36,'',1,1,4,0,'value = i2c_Ultr_Rag(arg);','twi_master_init(register, preFeequency);'),(40,'electronicCompass','电子罗盘',36,36,'',1,1,4,0,'value = i2c_Compass(arg);','twi_master_init(register, preFeequency);'),(41,'iicIn','IIC输入',36,36,'',1,1,4,0,'value = i2c_maste_read(arg);','twi_master_init(register, preFeequency);'),(42,'iicOut','IIC输出',36,36,'',1,1,4,0,'i2c_maste_transt(arg, value);','twi_master_init(register, preFeequency);');");
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('modules');
		Schema::dropIfExists('hardwares');
		Schema::dropIfExists('softwares');
		Schema::dropIfExists('params');
		Schema::dropIfExists('projects');
	}
}