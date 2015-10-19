<?php

echo "tset";

$con = mysql_connect("localhost","root","root");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

if (mysql_query("CREATE DATABASE www_kenrobot_db",$con))
  {
  echo "Database created";
  }
else
  {
  echo "Error creating database: " . mysql_error();
  }

mysql_close($con);

update ken_rule set is_delete = 1 where name_en = 'fireA';
update ken_rule set is_delete = 1 where name_en = 'pm25';
update ken_rule set is_delete = 1 where name_en = 'temperatue';
update ken_rule set is_delete = 1 where name_en = 'illumination';
update ken_rule set is_delete = 1 where name_en = 'dcMotor';
update ken_rule set is_delete = 1 where name_en = 'streeringEngine';
update ken_rule set is_delete = 1 where name_en = 'infraredOut';
update ken_rule set is_delete = 1 where name_en = 'soundSensor';
update ken_rule set is_delete = 1 where name_en = 'button';

