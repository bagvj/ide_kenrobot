<?php

namespace App\Robot;

use Illuminate\Database\Eloquent\Model;

class FlowChart extends Model
{
    //
    protected $table = 'ken_flowchart';

    protected $fillable = ['pid','type','info','create_time','update_time'];


}
