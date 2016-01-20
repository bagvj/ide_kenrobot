<?php

namespace App\Robot;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model {

	protected $table = 'feedbacks';

	public $timestamps = false;

	protected $fillable = ['id', 'nickname', 'contact', 'content', 'create_time'];
}