<?php

namespace App\Robot;

use Illuminate\Database\Eloquent\Model;

class Components extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'ken_controller';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id',
                            'name_en',
                            'name_cn',
                            'series',
                            'company',
                            'info',
                            'type',
                            'port_name_1',
                            'port_bit_1',
                            'port_position_1',
                            'port_name_2',
                            'port_bit_2',
                            'port_position_2',
                            'port_name_3',
                            'port_bit_3',
                            'port_position_3',
                            'port_name_4',
                            'port_bit_4',
                            'port_position_4',
                            'port_name_5',
                            'port_bit_5',
                            'port_position_5',
                            'port_name_6',
                            'port_bit_6',
                            'port_position_6',
                            'port_name_7',
                            'port_bit_7',
                            'port_position_7',
                            'port_name_8',
                            'port_bit_8',
                            'port_position_8',
                            'is_delete',
                            'create_time',
                            'update_time',];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
}
