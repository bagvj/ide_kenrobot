<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameBoardName extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        DB::statement("update boards set label = 'RoSys开发板' where name = 'NEO328'");
        DB::statement("update boards set in_use = 0 where name = 'NEO103'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        DB::statement("update boards set label = 'ATmega328主控板' where name = 'NEO328'");
        DB::statement("update boards set in_use = 1 where name = 'NEO103'");
    }
}
