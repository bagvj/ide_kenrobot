<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAndRemoveSomeLibAndBoard extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("update `boards` set in_use = 0 where name='Arduino Robot Control';");
        DB::statement("update `boards` set in_use = 0 where name='Arduino Robot Motor';");

        DB::statement("update `libraries` set in_use = 0 where name='Robot Control';");
        DB::statement("update `libraries` set in_use = 0 where name='Robot IR Remote';");
        DB::statement("update `libraries` set in_use = 0 where name='Robot Motor';");

        DB::statement("insert into `libraries`(`name`,`code`,`in_use`) values ('DHT','#include <DHT.h>',1),('Encoder','#include <Encoder.h>',1),('Keypad','#include <Keypad.h>',1),('LiquidCrystal-I2C','#include <LiquidCrystal-I2C.h>',1),('SR04','#include <SR04.h>',1),('DS1307RTC','#include <Time.h>\n#include <DS1307RTC.h>',1),('Time','#include <Time>',1);");
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
