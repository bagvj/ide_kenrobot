<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FixLibraryBuild extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("update libraries set in_use = 1 where name = 'Esplora'");
        DB::statement("update libraries set in_use = 1 where name = 'Firmata'");
        DB::statement("update libraries set in_use = 1 where name = 'Robot Control'");
        DB::statement("update libraries set in_use = 1 where name = 'Robot IR Remote'");
        DB::statement("update libraries set in_use = 1 where name = 'Robot Motor'");
        DB::statement("update libraries set in_use = 0 where name = 'KenArduino'");

        DB::statement("update libraries set code = '#include <Dhcp.h>\n#include <Dns.h>\n#include <Ethernet.h>\n#include <EthernetClient.h>\n#include <EthernetServer.h>\n#include <EthernetUdp.h>\n#include <SPI.h>' where name = 'Ethernet'");
        DB::statement("update libraries set code = '#include <SD.h>\n#include <SPI.h>' where name = 'SD'");
        DB::statement("update libraries set code = '#include <SPI.h>\n#include <WiFi.h>\n#include <WiFiClient.h>\n#include <WiFiServer.h>\n#include <WiFiUdp.h>' where name = 'WiFi'");
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
