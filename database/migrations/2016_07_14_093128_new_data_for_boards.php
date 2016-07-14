<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NewDataForBoards extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("delete from boards where 1=1;");
        DB::statement("insert  into `boards`(`id`,`name`,`label`,`board_type`,`in_use`,`is_hot`,`is_forward`,`width`,`height`,`category`) values (1,'ArduinoUNO','Arduino UNO R3','uno',1,1,0,392,273,'ArduinoUNO'),(2,'ArduinoYún','Arduino Yún','yun',1,0,0,392,273,'ArduinoUNO'),(3,'ArduinoMegaADK','Arduino Mega ADK','megaADK',1,0,0,392,273,'ArduinoUNO'),(4,'ArduinoMicro','Arduino Micro','micro',1,1,0,392,273,'ArduinoUNO'),(5,'ArduinoEsplora','Arduino Esplora','esplora',1,0,0,392,273,'ArduinoUNO'),(6,'ArduinoEthernet','Arduino Ethernet','ethernet',1,0,0,392,273,'ArduinoUNO'),(7,'ArduinoFio','Arduino Fio','fio',1,0,0,392,273,'ArduinoUNO'),(8,'ArduinoLilyPadUSB','Arduino LilyPadUSB','LilyPadUSB',1,0,0,392,273,'ArduinoUNO'),(9,'ArduinoRobotControl','Arduino Robot Control','robotControl',1,0,0,392,273,'ArduinoUNO'),(10,'ArduinoRobotMotor','Arduino Robot Motor','robotMotor',1,0,0,392,273,'ArduinoUNO'),(11,'NEO328','RoSys开发板','RoSys',0,0,0,1000,586,'RoSys'),(12,'NEO103','STM32F103主控板','RoSys',0,0,0,1000,586,'RoSys'),(14,'Arduino Mega2560','Arduino Mega2560','megaatmega2560',1,1,0,392,273,'ArduinoUNO'),(15,'SparkFun Mega Pro 3.3V/8MHz','SparkFun Mega Pro 3.3V/8MHz','sparkfun_megapro8MHz',1,0,0,392,273,'ArduinoUNO'),(16,'SparkFun Mega Pro 5V/16MHz','SparkFun Mega Pro 5V/16MHz','sparkfun_megapro16MHz',1,0,0,392,273,'ArduinoUNO'),(17,'Arduino Leonardo','Arduino Leonardo','leonardo',1,1,0,392,273,'ArduinoUNO'),(18,'Arduino Nano ATmega168','Arduino Nano ATmega168','nanoatmege168',1,1,0,392,273,'ArduinoUNO'),(19,'Arduino Pro Mini 168(5V, 16MHz)','Arduino Pro Mini 168(5V, 16MHz)','pro16MHzatmege168',1,1,0,392,273,'ArduinoUNO'),(20,'TinyCircuits TinyLily Mini','TinyCircuits TinyLily Mini','tinylily',1,0,0,392,273,'ArduinoUNO'),(21,'Arduino Due(Programing Port)','Arduino Due(Programing Port)','due',1,0,0,392,273,'ArduinoUNO');");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
    }
}
