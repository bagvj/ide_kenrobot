<?php

namespace App\Robot;

use Illuminate\Database\Eloquent\Model;

class Project extends Model {

	protected $table = 'projects';

	public $timestamps = false;

	protected $fillable = ['id', 'data'];
}