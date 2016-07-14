<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMoreBoards extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("insert  into `boards`(`name`,`label`,`board_type`,`in_use`,`is_forward`,`width`,`height`,`category`) values ('ATmega2560','ATmega2560','megaatmega2560',1,0,392,273,'ArduinoUNO'),('SparkFun Mega Pro 3.3V/8MHz','SparkFun Mega Pro 3.3V/8MHz','sparkfun_megapro8MHz',1,0,392,273,'ArduinoUNO'),('SparkFun Mega Pro 5V/16MHz','SparkFun Mega Pro 5V/16MHz','sparkfun_megapro16MHz',1,0,392,273,'ArduinoUNO');");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("delete from `boards` where name='Arduino/Genuino 101';");
    }
}
