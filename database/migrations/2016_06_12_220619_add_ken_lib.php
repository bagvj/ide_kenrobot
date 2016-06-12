<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddKenLib extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
		DB::statement("insert  into `libraries`(`id`,`name`,`code`) values (21,'RoSys','#include <RoSys.h>\n'),(22,'KenArduino','#include <KenArduino.h>\n');");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        DB::statement("delete from `libraries` where name='RoSys';");
        DB::statement("delete from `libraries` where name='KenArduino';");
    }
}
