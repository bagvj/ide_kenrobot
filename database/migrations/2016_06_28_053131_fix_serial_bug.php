<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FixSerialBug extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("update components set varCode = '', headCode = '', setupCode = 'Serial.begin(9600);\n' where name = 'serialPort'");
        DB::statement("update components set in_use = 0 where name = 'bluetooth'");
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
