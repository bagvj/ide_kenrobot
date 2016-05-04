<?php

namespace App\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Commnet Model
 */
class Comment extends Model
{
    use SoftDeletes;

    protected $table = 'comments';

    protected $fillable = ['project_id', 'user_id', 'content', 'reply_comment', 'reply_user'];

    protected $hidden = ['deleted_at','updated_at'];


}
