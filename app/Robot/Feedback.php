<?php

namespace App\Robot;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model {

	protected $table = 'ken_feedback';

	public $timestamps = false;

	protected $fillable = ['id', 'nickname', 'contact', 'content', 'create_time'];
}