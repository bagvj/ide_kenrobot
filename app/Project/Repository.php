<?php

namespace App\Project;

use DB;

class Repository {
	public static function getExamples($isDict = false, $group = false) {
		$examples = DB::table('examples')->get(['name', 'category', 'order', 'uuid']);
		$result = array();
		if($isDict) {
			foreach ($examples as $key => $value) {
				$result[$value->name] = $value;
			}
		} else {
			foreach ($examples as $example) {
				$result[$example->category][] = $example;
			}
		}

		return $result;
	}

	public static function getLibraries($isDict = false) {
		$libraries = DB::table('libraries')->where('in_use', 1)->get();
		if($isDict) {
			$result = array();
			foreach ($libraries as $key => $value) {
				$result[$value->name] = $value;
			}
		} else {
			$result = $libraries;
		}

		return $result;
	}

	public static function getBoards($isDict = false, $withPorts = false) {
		$boards = DB::table('boards')->where('in_use', 1)->orderBy('is_forward')->orderBy('is_hot', 'DESC')->orderBy('name')->get();
		foreach($boards as $key => $value) {
			$value->in_use = $value->in_use == 1;
			$value->type = "board";
			$value->deletable = false;
			$value->selectable = false;
			$value->source = "assets/image/board/" . $value->name . ".png";
		}

		if($withPorts) {
			$allPorts = DB::table('ports')->where('owner_type', 1)->get();
			foreach ($boards as $key => $board) {
				$board->ports = array();
				foreach ($allPorts as $k => $port) {
					if($port->owner_id == $board->id) {
						$board->ports[$port->name] = $port;
					}
				}
			}
		}

		if($isDict) {
			$result = array();
			foreach ($boards as $key => $value) {
				$result[$value->name] = $value;
			}
		} else {
			$result = $boards;
		}

		return $result;
	}

	public static function getComponents($isDict = false, $withPorts = false) {
		$components = DB::table('components')->where('in_use', 1)->get();
		foreach($components as $key => $value) {
			$value->in_use = $value->in_use == 1;
			$value->auto_connect = $value->auto_connect == 1;
			$value->type = "component";
			$value->deletable = true;
			$value->selectable = true;
			$value->source = "assets/image/component/" . $value->name . ".png";
		}

		if($withPorts) {
			$allPorts = DB::table('ports')->where('owner_type', 0)->get();
			foreach ($components as $key => $component) {
				$component->ports = array();
				foreach ($allPorts as $k => $port) {
					if($port->owner_id == $component->id) {
						$component->ports[$port->name] = $port;
					}
				}
			}
		}

		if($isDict) {
			$result = array();
			foreach ($components as $key => $value) {
				$result[$value->name] = $value;
			}
		} else {
			$result = $components;
		}

		return $result;
	}

	private static function import() {
		$allComponents = DB::table('components')->get();
		$allBoards = DB::table('boards')->get();

		$result = Excel::load('../config/RoSys.xlsx')->skip(2)->toArray();
		$result = json_decode(json_encode($result));
		foreach($result as $component) {
			$component->label = $component->name;
			$component->name = $component->id;

			$component->width = $component->width != null ? $component->width : 0;
			$component->height = $component->height != null ? $component->height : 0;

			$component->var_name = $component->var_name != null ? $component->var_name : "";
			$component->var_code = $component->var_code != null ? $component->var_code : "";
			$component->head_code = $component->head_code != null ? $component->head_code : "";
			$component->setup_code = $component->setup_code != null ? $component->setup_code : "";

			$component->category = $component->category != null ? $component->category : "default";
			$component->in_use = $component->in_use != null ? $component->in_use : 0;
			$component->is_forward = $component->is_forward != null ? $component->is_forward : 0;
			$component->auto_connect = $component->auto_connect != null ? $component->auto_connect : 0;
			$component->board_type = $component->board_type != null ? $component->board_type : "RoSys";
		}

		foreach($result as $component) {
			$exist = false;
			if($component->type == 1) {
				foreach($allBoards as $board) {
					if($board->name == $component->name) {
						$exist = true;
						break;
					}
				}
				if($exist) {
					DB::table('boards')->where('name', $component->name)->update(array(
						'label' => $component->label,
						'board_type' => $component->board_type,
						'in_use' => $component->in_use,
						'is_forward' => $component->is_forward,
						'width' => $component->width,
						'height' => $component->height,
						'category' => $component->category,
					));
				} else {
					DB::table('boards')->insert(array(
						'name' => $component->name,
						'label' => $component->label,
						'board_type' => $component->board_type,
						'in_use' => $component->in_use,
						'is_forward' => $component->is_forward,
						'width' => $component->width,
						'height' => $component->height,
						'category' => $component->category,
					));
				}
			} else if($component->type == 0) {
				foreach($allComponents as $com) {
					if($com->name == $component->name) {
						$exist = true;
						break;
					}
				}
				if($exist) {
					DB::table('components')->where('name', $component->name)->update(array(
						'label' => $component->label,
						'auto_connect' => $component->auto_connect,
						'in_use' => $component->in_use,
						'width' => $component->width,
						'height' => $component->height,
						'varName' => $component->var_name,
						'varCode' => $component->var_code,
						'headCode' => $component->head_code,
						'setupCode' => $component->setup_code,
						'category' => $component->category,
					));
				} else {
					DB::table('components')->insert(array(
						'name' => $component->name,
						'label' => $component->label,
						'auto_connect' => $component->auto_connect,
						'in_use' => $component->in_use,
						'width' => $component->width,
						'height' => $component->height,
						'varName' => $component->var_name,
						'varCode' => $component->var_code,
						'headCode' => $component->head_code,
						'setupCode' => $component->setup_code,
						'category' => $component->category,
					));
				}
			}
		}
	}
}