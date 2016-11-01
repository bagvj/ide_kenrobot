<?php

namespace App\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Project Model
 */
class Project extends Model
{
    use SoftDeletes;

    //
    protected $table = 'projects';

    protected $fillable = ['project_name', 'user_id', 'uid', 'author' ,'project_intro', 'project_data', 'public_type', 'hash'];

    protected $hidden = ['deleted_at'];
}
