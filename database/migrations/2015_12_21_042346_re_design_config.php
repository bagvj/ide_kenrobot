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
		Schema::dropIfExists('ken_feedback');
		Schema::dropIfExists('feedback');

		Schema::dropIfExists('modules');
		Schema::dropIfExists('hardwares');
		Schema::dropIfExists('softwares');
		Schema::dropIfExists('params');

		Schema::dropIfExists('projects');
		Schema::dropIfExists('libraries');
		Schema::dropIfExists('boards');
		Schema::dropIfExists('components');
		Schema::dropIfExists('ports');

		//库
		Schema::create('libraries', function (Blueprint $table) {
			$table->increments('id')->comment("library id");
			$table->string('name')->comment("library名字");
			$table->binary('code')->comment("引用代码");
		});

		//主板
		Schema::create('boards', function (Blueprint $table) {
			$table->increments('id')->comment("主板id");
			$table->string('name')->comment("主板名字");
			$table->string('label')->comment("主板名字(用于显示)");
			$table->string('board_type')->comment("主板类型");
			$table->boolean('in_use')->comment("是否正在使用");
			$table->integer('width')->comment('宽度');
			$table->integer('height')->comment('高度');
			$table->string('category')->comment("类别");
		});

		//器件
		Schema::create('components', function (Blueprint $table) {
			$table->increments('id')->comment("器件id");
			$table->string('name')->comment("器件名字");
			$table->string('label')->comment("器件名字(用于显示)");
			$table->boolean('in_use')->comment("是否正在使用");
			$table->boolean('auto_connect')->comment('是否自动连接');
			$table->integer('width')->comment('宽度');
			$table->integer('height')->comment('高度');
			$table->string('varName')->comment('默认变量名');
			$table->string('varCode')->comment('变量声明代码');
			$table->string('headCode')->comment('引用头文件代码');
			$table->string('setupCode')->comment('初始化代码');
			$table->string('category')->comment("类别");
		});

		//端口
		Schema::create('ports', function (Blueprint $table) {
			$table->increments('id')->comment("端口id");
			$table->string('name')->comment("端口名字");
			$table->string('label')->comment("端口标签");
			$table->integer('type')->comment('端口类型，0=>digital、1=>data、2=>digital/data、3=>serialPort');
			$table->string('special')->comment('特殊端口');
			$table->integer('owner_id')->comment('拥有者id');
			$table->integer('owner_type')->comment('拥有者类型，0=>component、1=>board');
		});

		DB::statement("insert  into `libraries`(`id`,`name`,`code`) values (1,'Bridge','#include <Bridge.h>\n#include <Console.h>\n#include <FileIO.h>\n#include <HttpClient.h>\n#include <Mailbox.h>\n#include <Process.h>\n#include <YunClient.h>\n#include <YunServer.h>\n'),(2,'EEPROM','#include <EEPROM.h>\n'),(3,'Esplora','#include <Esplora.h>\n'),(4,'Ethernet','#include <Dhcp.h>\n#include <Dns.h>\n#include <Ethernet.h>\n#include <EthernetClient.h>\n#include <EthernetServer.h>\n#include <EthernetUdp.h>\n'),(5,'Firmata','#include <Boards.h>\n#include <Firmata.h>\n'),(6,'GSM','#include <GSM.h>\n#include <GSM3CircularBuffer.h>\n#include <GSM3IO.h>\n#include <GSM3MobileAccessProvider.h>\n#include <GSM3MobileCellManagement.h>\n#include <GSM3MobileClientProvider.h>\n#include <GSM3MobileClientService.h>\n#include <GSM3MobileDataNetworkProvider.h>\n#include <GSM3MobileMockupProvider.h>\n#include <GSM3MobileNetworkProvider.h>\n#include <GSM3MobileNetworkRegistry.h>\n#include <GSM3MobileServerProvider.h>\n#include <GSM3MobileServerService.h>\n#include <GSM3MobileSMSProvider.h>\n#include <GSM3MobileVoiceProvider.h>\n#include <GSM3ShieldV1.h>\n#include <GSM3ShieldV1AccessProvider.h>\n#include <GSM3ShieldV1BandManagement.h>\n#include <GSM3ShieldV1BaseProvider.h>\n#include <GSM3ShieldV1CellManagement.h>\n#include <GSM3ShieldV1ClientProvider.h>\n#include <GSM3ShieldV1DataNetworkProvider.h>\n#include <GSM3ShieldV1DirectModemProvider.h>\n#include <GSM3ShieldV1ModemCore.h>\n#include <GSM3ShieldV1ModemVerification.h>\n#include <GSM3ShieldV1MultiClientProvider.h>\n#include <GSM3ShieldV1MultiServerProvider.h>\n#include <GSM3ShieldV1PinManagement.h>\n#include <GSM3ShieldV1ScanNetworks.h>\n#include <GSM3ShieldV1ServerProvider.h>\n#include <GSM3ShieldV1SMSProvider.h>\n#include <GSM3ShieldV1VoiceProvider.h>\n#include <GSM3SMSService.h>\n#include <GSM3SoftSerial.h>\n#include <GSM3VoiceCallService.h>\n'),(7,'LiquidCrystal','#include <LiquidCrystal.h>\n'),(8,'Robot Control','#include <ArduinoRobot.h>\n#include <Arduino_LCD.h>\n#include <Compass.h>\n#include <EasyTransfer2.h>\n#include <EEPROM_I2C.h>\n#include <Fat16.h>\n#include <Fat16Config.h>\n#include <Fat16mainpage.h>\n#include <Fat16util.h>\n#include <FatStructs.h>\n#include <Multiplexer.h>\n#include <SdCard.h>\n#include <SdInfo.h>\n#include <Squawk.h>\n#include <SquawkSD.h>\n'),(9,'Robot IR Remote','#include <IRremote.h>\n#include <IRremoteInt.h>\n#include <IRremoteTools.h>\n'),(10,'Robot Motor','#include <ArduinoRobotMotorBoard.h>\n#include <EasyTransfer2.h>\n#include <LineFollow.h>\n#include <Multiplexer.h>\n'),(11,'SD','#include <SD.h>\n'),(12,'SPI','#include <SPI.h>\n'),(13,'Servo','#include <Servo.h>\n'),(14,'SoftwareSerial','#include <SoftwareSerial.h>\n'),(15,'SpacebrewYun','#include <SpacebrewYun.h>\n'),(16,'Stepper','#include <Stepper.h>\n'),(17,'TFT','#include <TFT.h>\n'),(18,'Temboo','#include <Temboo.h>\n'),(19,'WiFi','#include <WiFi.h>\n#include <WiFiClient.h>\n#include <WiFiServer.h>\n#include <WiFiUdp.h>\n'),(20,'Wire','#include <Wire.h>\n');");
		DB::statement("insert  into `boards`(`id`,`name`,`label`,`board_type`,`in_use`,`width`,`height`,`category`) values (1,'ArduinoUNO','Arduino UNO R3','uno',1,392,273,'ArduinoUNO'),(2,'ArduinoYún','Arduino Yún','yun',1,392,273,'ArduinoUNO'),(3,'ArduinoMegaADK','Arduino Mega ADK','megaADK',1,392,273,'ArduinoUNO'),(4,'ArduinoMicro','Arduino Micro','micro',1,392,273,'ArduinoUNO'),(5,'ArduinoEsplora','Arduino Esplora','esplora',1,392,273,'ArduinoUNO'),(6,'ArduinoEthernet','Arduino Ethernet','ethernet',1,392,273,'ArduinoUNO'),(7,'ArduinoFio','Arduino Fio','fio',1,392,273,'ArduinoUNO'),(8,'ArduinoLilyPadUSB','Arduino LilyPadUSB','LilyPadUSB',1,392,273,'ArduinoUNO'),(9,'ArduinoRobotControl','Arduino Robot Control','robotControl',1,392,273,'ArduinoUNO'),(10,'ArduinoRobotMotor','Arduino Robot Motor','robotMotor',1,392,273,'ArduinoUNO');");
		DB::statement("insert  into `components`(`id`,`name`,`label`,`in_use`,`auto_connect`,`width`,`height`,`varName`,`varCode`,`headCode`,`setupCode`,`category`) values (1,'buzzer','蜂鸣器',1,0,72,72,'buzzer_','int \$NAME = \$P0;\n','','','one-port-bottom'),(2,'servo','舵机',1,0,96,96,'servo_','Servo \$NAME;\n','#include <Servo.h>\n','\$NAME.attach(\$P0);\n','one-port-bottom'),(3,'lcd','1602',1,1,120,120,'lcd_','LiquidCrystal \$NAME(0);\n','#include <Wire.h>\n#include <BitbloqLiquidCrystal.h>\n','\$NAME.begin(16, 2);\n\$NAME.clear();\n','two-port-top'),(4,'led','LED',1,0,72,72,'led_','int \$NAME = \$P0;\n','','pinMode(\$NAME, OUTPUT);\n','one-port-bottom'),(5,'ultrasoundSensor','超声波',1,0,96,96,'ultrasound_sensor_','US \$NAME(\$P0, \$P1);\n','#include <US.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n','','two-port-bottom'),(6,'button','按钮',1,0,72,72,'button_','int \$NAME = \$P0;\n','','pinMode(\$NAME, INPUT);\n','one-port-bottom'),(7,'buttonPanel','按键矩阵',1,0,120,120,'button_panel_','ButtonPad \$NAME(\$P0);\n','#include <ButtonPad.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n','','one-port-top'),(8,'infraredSensor','光电对管',1,0,72,72,'infrared_sensor_','int \$NAME = \$P0;\n','','pinMode(\$NAME, INPUT);\n','one-port-bottom'),(9,'lineFollower','循迹矩阵',1,0,72,72,'line_follower_','LineFollower \$NAME(\$P0, \$P1);\n','#include <LineFollower.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n','','two-port-bottom'),(10,'joystick','摇杆',1,0,120,120,'joystick_','Joystick \$NAME(\$P1, \$P2, \$P0);\n','#include <Joystick.h>\n#include <Wire.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n','','joystick'),(11,'lightSensor','光敏电阻',1,0,72,72,'light_sensor_','int \$NAME = \$P0;\n','','pinMode(\$NAME, INPUT);\n','one-port-top'),(12,'potentiometer','电位器',1,0,72,72,'potentiometer_','int \$NAME = \$P0;\n','','pinMode(\$NAME, INPUT);\n','one-port-top'),(13,'bluetooth','蓝牙模块',1,0,120,120,'bluetooth_','bqSoftwareSerial \$NAME(\$P0, \$P1, 9600);\n','#include <SoftwareSerial.h>\n#include <bqSoftwareSerial.h>\n#include <Servo.h>\n#include <Wire.h>\n','','two-port-bottom'),(14,'serialPort','串口模块',1,1,120,120,'serial_port_','bqSoftwareSerial \$NAME(0, 1, 9600);\n','#include <SoftwareSerial.h>\n#include <bqSoftwareSerial.h>\n#include <Servo.h>\n#include <Wire.h>\n','','one-port-right');");
		DB::statement("insert  into `ports`(`id`,`name`,`label`,`type`,`special`,`owner_id`,`owner_type`) values (1,'0','0',0,'',1,1),(2,'1','1',0,'',1,1),(3,'2','2',0,'',1,1),(4,'3','3',0,'',1,1),(5,'4','4',0,'',1,1),(6,'5','5',0,'',1,1),(7,'6','6',0,'',1,1),(8,'7','7',0,'',1,1),(9,'8','8',0,'',1,1),(10,'9','9',0,'',1,1),(11,'10','10',0,'',1,1),(12,'11','11',0,'',1,1),(13,'12','12',0,'',1,1),(14,'13','13',0,'',1,1),(15,'A0','A0',1,'',1,1),(16,'A1','A1',1,'',1,1),(17,'A2','A2',1,'',1,1),(18,'A3','A3',1,'',1,1),(19,'A4','A4',1,'',1,1),(20,'A5','A5',1,'',1,1),(21,'SerialPort','SerialPort',3,'',1,1),(22,'P0','P0',0,'',1,0),(23,'P0','P0',0,'',2,0),(24,'P0','SDA',1,'A4',3,0),(25,'P1','SCL',1,'A5',3,0),(26,'P0','P0',0,'',4,0),(27,'P0','TRI',0,'',5,0),(28,'P1','ECH',0,'',5,0),(29,'P0','P0',0,'',6,0),(30,'P0','P0',1,'',7,0),(31,'P0','P0',0,'',8,0),(32,'P0','P0',0,'',9,0),(33,'P1','P1',0,'',9,0),(34,'P0','KVG',0,'',10,0),(35,'P1','XVG',1,'',10,0),(36,'P2','YVG',1,'',10,0),(37,'P0','P0',1,'',11,0),(38,'P0','P0',1,'',12,0),(39,'P0','RXD',1,'',13,0),(40,'P1','TXD',1,'',13,0),(41,'P0','P0',3,'',14,0);");
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('projects');
		Schema::dropIfExists('libraries');
		Schema::dropIfExists('boards');
		Schema::dropIfExists('components');
		Schema::dropIfExists('ports');
	}
}