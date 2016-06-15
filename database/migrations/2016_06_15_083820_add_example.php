<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddExample extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('examples', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->comment('名字');
            $table->string('category')->comment('目录');
            $table->integer('order')->comment('顺序');
            $table->softDeletes();
        });

        DB::statement("insert  into `examples`(`id`,`name`,`category`,`order`,`deleted_at`) values (1,'AnalogReadSerial','Basics',1,NULL),(2,'BareMinimum','Basics',2,NULL),(3,'Blink','Basics',3,NULL),(4,'DigitalReadSerial','Basics',4,NULL),(5,'Fade','Basics',5,NULL),(6,'ReadAnalogVoltage','Basics',6,NULL),(7,'BlinkWithoutDelay','Digital',1,NULL),(8,'Button','Digital',2,NULL),(9,'Debounce','Digital',3,NULL),(10,'DigitalInputPullup','Digital',4,NULL),(11,'StateChangeDetection','Digital',5,NULL),(12,'toneKeyboard','Digital',6,NULL),(13,'toneMelody','Digital',7,NULL),(14,'toneMultiple','Digital',8,NULL),(15,'tonePitchFollower','Digital',9,NULL),(16,'AnalogInOutSerial','Analog',1,NULL),(17,'AnalogInput','Analog',2,NULL),(18,'AnalogWriteMega','Analog',3,NULL),(19,'Calibration','Analog',4,NULL),(20,'Fading','Analog',5,NULL),(21,'Smoothing','Analog',6,NULL),(22,'ASCIITable','Communication',1,NULL),(23,'Dimmer','Communication',2,NULL),(24,'Graph','Communication',3,NULL),(25,'Midi','Communication',4,NULL),(26,'MultiSerial','Communication',5,NULL),(27,'PhysicalPixel','Communication',6,NULL),(28,'ReadASCIIString','Communication',7,NULL),(29,'SerialCallResponse','Communication',8,NULL),(30,'SerialCallResponseASCII','Communication',9,NULL),(31,'SerialEvent','Communication',10,NULL),(32,'VirtualColorMixer','Communication',11,NULL),(33,'Arrays','Control',1,NULL),(34,'ForLoopIteration','Control',2,NULL),(35,'IfStatementConditional','Control',3,NULL),(36,'WhileStatementConditional','Control',4,NULL),(37,'switchCase','Control',5,NULL),(38,'switchCase2','Control',6,NULL),(39,'ADXL3xx','Sensors',1,NULL),(40,'Knock','Sensors',2,NULL),(41,'Memsic2125','Sensors',3,NULL),(42,'Ping','Sensors',4,NULL),(43,'RowColumnScanning','Display',1,NULL),(44,'barGraph','Display',2,NULL),(45,'CharacterAnalysis','Strings',1,NULL),(46,'StringAdditionOperator','Strings',2,NULL),(47,'StringAppendOperator','Strings',3,NULL),(48,'StringCaseChanges','Strings',4,NULL),(49,'StringCharacters','Strings',5,NULL),(50,'StringComparisonOperators','Strings',6,NULL),(51,'StringConstructors','Strings',7,NULL),(52,'StringIndexOf','Strings',8,NULL),(53,'StringLength','Strings',9,NULL),(54,'StringLengthTrim','Strings',10,NULL),(55,'StringReplace','Strings',11,NULL),(56,'StringStartsWithEndsWith','Strings',12,NULL),(57,'StringSubstring','Strings',13,NULL),(58,'StringToInt','Strings',14,NULL),(59,'Keyboard','USB',1,NULL),(60,'KeyboardAndMouseControl','USB',2,NULL),(61,'Mouse','USB',3,NULL),(62,'p02_SpaceshipInterface','StarterKit_BasicKit',1,NULL),(63,'p03_LoveOMeter','StarterKit_BasicKit',2,NULL),(64,'p04_ColorMixingLamp','StarterKit_BasicKit',3,NULL),(65,'p05_ServoMoodIndicator','StarterKit_BasicKit',4,NULL),(66,'p06_LightTheremin','StarterKit_BasicKit',5,NULL),(67,'p07_Keyboard','StarterKit_BasicKit',6,NULL),(68,'p08_DigitalHourglass','StarterKit_BasicKit',7,NULL),(69,'p09_MotorizedPinwheel','StarterKit_BasicKit',8,NULL),(70,'p10_Zoetrope','StarterKit_BasicKit',9,NULL),(71,'p11_CrystalBall','StarterKit_BasicKit',10,NULL),(72,'p12_KnockLock','StarterKit_BasicKit',11,NULL),(73,'p13_TouchSensorLamp','StarterKit_BasicKit',12,NULL),(74,'p14_TweakTheArduinoLogo','StarterKit_BasicKit',13,NULL),(75,'p15_HackingButtons','StarterKit_BasicKit',14,NULL),(76,'ArduinoISP','ArduinoISP',1,NULL);");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('examples');
    }
}
