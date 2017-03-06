<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Statistics extends Model
{
    protected $table = 'statistics';

    protected $fillable = ['key', 'value'];

    public $timestamps = false;
}
