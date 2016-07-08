<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class OpenSomeBoards extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoYún'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoMegaADK'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoMicro'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoEsplora'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoEthernet'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoFio'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoLilyPadUSB'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoRobotControl'");
        DB::statement("update boards set is_forward = 0 where name = 'ArduinoRobotMotor'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
