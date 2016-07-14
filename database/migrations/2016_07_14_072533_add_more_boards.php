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
        DB::statement("insert  into `boards`(`name`,`label`,`board_type`,`in_use`,`is_forward`,`width`,`height`,`category`) values ('Arduino/Genuino 101','Arduino/Genuino 101','genuino101',1,0,392,273,'ArduinoUNO');");
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
