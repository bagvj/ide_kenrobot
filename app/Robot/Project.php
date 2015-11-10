<?php

namespace App\Robot;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'ken_project';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id', 'name', 'scope','user_id','user_name','status','info','create_time','update_time'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
}
