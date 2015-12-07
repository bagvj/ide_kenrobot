<?php

namespace App\Robot;

use Illuminate\Database\Eloquent\Model;

class ConnectRule extends Model {
	//
	protected $table = 'ken_rule';

	protected $fillable = [
		'name_en',
		'name_cn',
		'cid',
		'category',
		'type',
		'series',
		'info',
		'init_func',
		'init_func_desc',
		'func',
		'func_desc',
		'set_title',
		'set_init_value',
		'set_value',
		'link',
		'bits',
		'has_pinhoard',
		'has_driveplate',
		'max_driveplate_num',
		'extra',
		'is_delete',
		'create_time',
		'update_time',
	];

}
