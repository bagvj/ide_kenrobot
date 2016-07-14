<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddHotToBoard extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("insert  into `boards`(`name`,`label`,`board_type`,`in_use`,`is_forward`,`width`,`height`,`category`) values ('Arduino Leonardo','Arduino Leonardo','leonardo',1,0,392,273,'ArduinoUNO'),('Arduino Nano ATmega168','Arduino Nano ATmega168','nanoatmege168',1,0,392,273,'ArduinoUNO'),('Arduino Pro or Pro Mini ATmega168(5V, 16MHz)','Arduino Pro or Pro Mini ATmega168(5V, 16MHz)','pro16MHzatmege168',1,0,392,273,'ArduinoUNO'),('TinyCircuits TinyLily Mini Processor','TinyCircuits TinyLily Mini Processor','tinylily',1,0,392,273,'ArduinoUNO'),('Arduino Due(Programing Port)','Arduino Due(Programing Port)','due',1,0,392,273,'ArduinoUNO');");

        Schema::table('boards', function (Blueprint $table) {
            $table->boolean('is_hot')->comment('热门')->after('in_use')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('boards', function (Blueprint $table) {
            $table->dropColumn('is_hot');
        });
    }
}
