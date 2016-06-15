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
            $table->string('uuid')->comment('唯一id')->default("");
            $table->softDeletes();
        });

        DB::statement("insert  into `examples`(`id`,`name`,`category`,`order`,`uuid`,`deleted_at`) values (1,'AnalogReadSerial','Basics',1,'e4db7c08-a72b-432d-8da6-80cc59e3696a',NULL),(2,'BareMinimum','Basics',2,'c78520a5-eb05-4ea1-b6e4-8bf2b0c86a9b',NULL),(3,'Blink','Basics',3,'50733a35-17e8-4c34-8e5d-3ae99f5d43d5',NULL),(4,'DigitalReadSerial','Basics',4,'7c9a196c-ca44-491a-828d-f61b0b321d12',NULL),(5,'Fade','Basics',5,'ba3ecb79-bb29-4317-be9c-73d99588ba4d',NULL),(6,'ReadAnalogVoltage','Basics',6,'ec8d87a1-b0d3-4621-82a1-ec138f39b74b',NULL),(7,'BlinkWithoutDelay','Digital',1,'18ac9e33-cd26-407e-8c4f-adb60e233657',NULL),(8,'Button','Digital',2,'010791c1-edb9-4fa6-820e-eb6038ff1b25',NULL),(9,'Debounce','Digital',3,'364861f7-00db-4109-a43e-483e903799d7',NULL),(10,'DigitalInputPullup','Digital',4,'7eb3933a-213e-4bcb-a644-5429efb133d4',NULL),(11,'StateChangeDetection','Digital',5,'6bda5d06-dceb-4525-8147-12de626c34aa',NULL),(12,'toneKeyboard','Digital',6,'8ae17761-5139-4e73-81ca-740c7d7e6698',NULL),(13,'toneMelody','Digital',7,'fda6dc4b-d32d-45a8-b52b-fa66d0ae6cd8',NULL),(14,'toneMultiple','Digital',8,'b994bf81-95e3-454d-8cfe-a006ef72bc30',NULL),(15,'tonePitchFollower','Digital',9,'bec3f415-430e-4651-a2d0-350059c4d92e',NULL),(16,'AnalogInOutSerial','Analog',1,'b8cba543-418f-45f3-bbbe-208ed5646dc1',NULL),(17,'AnalogInput','Analog',2,'0518d94f-4378-4ef6-89de-1626720edd01',NULL),(18,'AnalogWriteMega','Analog',3,'0cb698fe-31f1-4dc2-90c9-cd4cfb3ab499',NULL),(19,'Calibration','Analog',4,'55f7b8c8-292b-41cd-a214-30a36c239c2d',NULL),(20,'Fading','Analog',5,'0eaf1817-9cee-4dc1-8e97-530f461e1404',NULL),(21,'Smoothing','Analog',6,'1a5fee0d-76bf-438a-821e-62ba24e6189f',NULL),(22,'ASCIITable','Communication',1,'073ab3ce-a9df-4fbb-b58e-401506a060ad',NULL),(23,'Dimmer','Communication',2,'965bb49a-0412-4fcd-94c2-afdf83066429',NULL),(24,'Graph','Communication',3,'94de37c9-24bf-4e3d-962f-ed15372838ed',NULL),(25,'Midi','Communication',4,'694a0652-0cce-4ac7-961f-8aae81843178',NULL),(26,'MultiSerial','Communication',5,'59d077a0-25c0-4bc6-ba51-2a8a3ca82ea7',NULL),(27,'PhysicalPixel','Communication',6,'8eebb660-0bcf-460d-aa03-ef94c23fb061',NULL),(28,'ReadASCIIString','Communication',7,'60624cd0-ec63-4311-9744-4048a41cffcc',NULL),(29,'SerialCallResponse','Communication',8,'c8804eca-5a97-46a1-9a35-645c90d0709b',NULL),(30,'SerialCallResponseASCII','Communication',9,'fdd89c66-fee1-44e2-afe9-7e13eb522162',NULL),(31,'SerialEvent','Communication',10,'66361347-bef4-444a-932a-0e47c94d5e97',NULL),(32,'VirtualColorMixer','Communication',11,'a1ffa049-b6e8-463e-82d0-2356a8214448',NULL),(33,'Arrays','Control',1,'c7007076-873e-4d38-a6af-60460d6c513e',NULL),(34,'ForLoopIteration','Control',2,'32f1bb0e-bc63-4ba8-a08d-a0575483e31f',NULL),(35,'IfStatementConditional','Control',3,'aa496002-ac77-4be7-8f72-fef2a19295ff',NULL),(36,'WhileStatementConditional','Control',4,'7b31d613-fe7f-4b15-ba25-7e3245fe07a4',NULL),(37,'switchCase','Control',5,'cb2e7b3d-519e-4001-a6d1-82c55c662f80',NULL),(38,'switchCase2','Control',6,'87d6739b-7b02-424f-aaaf-1af61e061c1f',NULL),(39,'ADXL3xx','Sensors',1,'1a4f192f-8e45-4f94-89af-0a37938522f9',NULL),(40,'Knock','Sensors',2,'5ab29f50-22d3-42f0-83b8-36409d959dcf',NULL),(41,'Memsic2125','Sensors',3,'b818420d-dad0-4a42-9f18-77cc8c91f247',NULL),(42,'Ping','Sensors',4,'6fb066fc-a7bc-4ec2-86d3-584450e74257',NULL),(43,'RowColumnScanning','Display',1,'9918c1ee-2673-4009-a513-96fde90cd8d9',NULL),(44,'barGraph','Display',2,'90508218-9c17-4ee3-8b16-a17b4a9c1e07',NULL),(45,'CharacterAnalysis','Strings',1,'086182bc-e7ad-4d79-9f74-575582a669bb',NULL),(46,'StringAdditionOperator','Strings',2,'91a07eea-5244-4cb2-a45c-93ee680cb7a4',NULL),(47,'StringAppendOperator','Strings',3,'2f76c25c-e067-4aa1-a6ee-8a1424650548',NULL),(48,'StringCaseChanges','Strings',4,'da7bfcff-d70f-4225-ab58-41a7c519c526',NULL),(49,'StringCharacters','Strings',5,'e126cb91-8e0f-4f13-8c89-8951ba4e91ec',NULL),(50,'StringComparisonOperators','Strings',6,'bc6fd573-bf9b-4abe-ab6a-94ffd173779f',NULL),(51,'StringConstructors','Strings',7,'ff5e7114-fcec-4a4f-b940-cd905eed85a6',NULL),(52,'StringIndexOf','Strings',8,'b17dd6ef-4568-4804-896d-69f4251f4ef5',NULL),(53,'StringLength','Strings',9,'fe0733f0-8d7f-4ad5-ad65-eadab1e0e74c',NULL),(54,'StringLengthTrim','Strings',10,'c13a8f86-2ea8-43d6-bd60-c116a2741f47',NULL),(55,'StringReplace','Strings',11,'9aea0010-8969-4bd4-9c6c-6f70051a2a87',NULL),(56,'StringStartsWithEndsWith','Strings',12,'0c9fffb3-f1e1-4d37-992d-be1e339a9664',NULL),(57,'StringSubstring','Strings',13,'40325dcb-4e65-4a67-b6d9-82def50b7792',NULL),(58,'StringToInt','Strings',14,'db078309-f348-4e95-968a-b23b38a5ad94',NULL),(59,'Keyboard','USB',1,'be698c3b-2665-41cc-b942-cfb05aa737d7',NULL),(60,'KeyboardAndMouseControl','USB',2,'cd676564-7c14-4828-a5c1-39d3f1db42d8',NULL),(61,'Mouse','USB',3,'4c3ee03b-7ab3-4d7c-94d3-33fd3ac736e2',NULL),(62,'p02_SpaceshipInterface','StarterKit_BasicKit',1,'4f5ed61f-ceaa-47fb-bc51-c11cae15158e',NULL),(63,'p03_LoveOMeter','StarterKit_BasicKit',2,'b02f1347-0b7a-40aa-a8b8-a4896aa598d2',NULL),(64,'p04_ColorMixingLamp','StarterKit_BasicKit',3,'89bdf450-44c4-44f3-97a0-b12aea6ce629',NULL),(65,'p05_ServoMoodIndicator','StarterKit_BasicKit',4,'51f94f0f-00e9-4852-a03a-abc002088dc2',NULL),(66,'p06_LightTheremin','StarterKit_BasicKit',5,'84fee773-a287-4235-a94e-2e18ecde35fb',NULL),(67,'p07_Keyboard','StarterKit_BasicKit',6,'bcf1560d-fd03-44ea-903e-cc05afd1355d',NULL),(68,'p08_DigitalHourglass','StarterKit_BasicKit',7,'6ae41184-a7ac-4021-a487-47c6b10f42c0',NULL),(69,'p09_MotorizedPinwheel','StarterKit_BasicKit',8,'aac9e2cf-e537-45e6-8af9-8ffb1b5f17d5',NULL),(70,'p10_Zoetrope','StarterKit_BasicKit',9,'cbf5274e-d793-4992-a70f-eed6c2cff24e',NULL),(71,'p11_CrystalBall','StarterKit_BasicKit',10,'c9dda2c5-1cda-4b1d-9d8e-fcad6d36ccec',NULL),(72,'p12_KnockLock','StarterKit_BasicKit',11,'b9716b20-532c-4009-9588-27df7217ea10',NULL),(73,'p13_TouchSensorLamp','StarterKit_BasicKit',12,'379b4ef0-c3e0-40f8-a4af-d662e1b52518',NULL),(74,'p14_TweakTheArduinoLogo','StarterKit_BasicKit',13,'83cb21ba-845f-410f-a989-8a0a550e7835',NULL),(75,'p15_HackingButtons','StarterKit_BasicKit',14,'aa7448a3-b2b5-40ba-ab2f-5871973d2e75',NULL),(76,'ArduinoISP','ArduinoISP',1,'32286dc2-ba7a-4d10-a852-308e21d26c4c',NULL);");
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
